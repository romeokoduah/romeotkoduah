'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createSession,
  destroySession,
  findAdminByEmail,
  hashPassword,
  requireAdmin,
  setAdminPassword,
  verifyPassword,
} from '@/lib/auth'
import { clientIpHash, rateLimit } from '@/lib/visitor'
import {
  createPost,
  deleteComment,
  deletePost,
  getPostById,
  setCommentStatus,
  updatePost,
} from '@/lib/blog'
import {
  createAlbum,
  deleteAlbum,
  deletePhoto,
  getAlbumById,
  listPhotos,
  updateAlbum,
  updatePhoto,
} from '@/lib/gallery'
import { LIMITS, slugify } from '@/lib/blog-types'
import type { CommentStatus, PostStatus } from '@/lib/blog-types'
import { getAdminById } from './queries'
import { removeMediaFile } from './media'
import type { ActionResult, LoginState, MessageState } from './result'

/* ========================================================================== */
/* Guards                                                                     */
/* ========================================================================== */

/**
 * Every mutation below starts here. The UI hiding a button proves nothing —
 * a server action is a public endpoint, so authorisation is re-established on
 * each call rather than inherited from whatever rendered the form.
 */
async function admin(): Promise<string | null> {
  try {
    return await requireAdmin()
  } catch {
    return null
  }
}

const DENIED = { ok: false, error: 'Your session has expired. Sign in again.' } as const

function failed(action: string): { ok: false; error: string } {
  return { ok: false, error: `Could not ${action}. Please try again.` }
}

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

/* ========================================================================== */
/* Authentication                                                             */
/* ========================================================================== */

/** Generic on purpose: which half was wrong is not the visitor's business. */
const BAD_CREDENTIALS = 'Incorrect email or password.'

/**
 * A throwaway hash, verified against when no such account exists, so a missing
 * email and a wrong password cost roughly the same amount of time.
 */
let decoyHash: string | null = null
async function decoy(): Promise<string> {
  decoyHash ??= await hashPassword(`decoy-${Date.now()}-${Math.random()}`)
  return decoyHash
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = text(formData.get('email'))
  const password = typeof formData.get('password') === 'string'
    ? (formData.get('password') as string)
    : ''

  if (!email || !password) return { error: 'Enter your email and password.' }

  let userId: string | null = null

  try {
    const limit = await rateLimit(`login:${await clientIpHash()}`, 10, 900)
    if (!limit.ok) {
      return { error: 'Too many attempts. Wait fifteen minutes and try again.' }
    }

    const user = await findAdminByEmail(email)
    if (!user) {
      await verifyPassword(await decoy(), password)
      return { error: BAD_CREDENTIALS }
    }

    if (!(await verifyPassword(user.password_hash, password))) {
      return { error: BAD_CREDENTIALS }
    }

    await createSession(user.id)
    userId = user.id
  } catch {
    return { error: 'Sign-in is unavailable right now. Try again shortly.' }
  }

  // Outside the try: redirect works by throwing, and must not be swallowed.
  if (userId) redirect('/admin')
  return { error: BAD_CREDENTIALS }
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}

export async function changePasswordAction(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const id = await admin()
  if (!id) return { error: DENIED.error }

  const current = String(formData.get('current') ?? '')
  const next = String(formData.get('next') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (!current || !next) return { error: 'Fill in every field.' }
  if (next.length < 12) return { error: 'The new password must be at least 12 characters.' }
  if (next !== confirm) return { error: 'The two new passwords do not match.' }
  if (next === current) return { error: 'The new password must differ from the old one.' }

  try {
    const user = await getAdminById(id)
    if (!user) return { error: DENIED.error }
    if (!(await verifyPassword(user.password_hash, current))) {
      return { error: 'That is not your current password.' }
    }
    await setAdminPassword(id, next)
    return { message: 'Password changed.' }
  } catch {
    return { error: 'Could not change the password. Please try again.' }
  }
}

/* ========================================================================== */
/* Posts                                                                      */
/* ========================================================================== */

function refreshBlog(slug?: string | null): void {
  revalidatePath('/blog')
  if (slug) revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin', 'layout')
}

export async function createPostAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  if (!(await admin())) return DENIED

  const title = text(formData.get('title'))
  if (!title) return { ok: false, error: 'Give the post a title to start.' }
  if (title.length > LIMITS.postTitle) {
    return { ok: false, error: `Titles are limited to ${LIMITS.postTitle} characters.` }
  }

  try {
    const post = await createPost({ title, status: 'draft' })
    refreshBlog(post.slug)
    return { ok: true, id: post.id }
  } catch {
    return failed('create the post')
  }
}

export interface PostDraft {
  id: string
  title: string
  slug: string
  excerpt: string
  bodyMd: string
  coverUrl: string
  tags: string
  /** Omitted keeps the post where it is. */
  status?: PostStatus
}

export async function savePostAction(input: PostDraft): Promise<ActionResult> {
  if (!(await admin())) return DENIED

  const title = input.title.trim()
  if (!title) return { ok: false, error: 'A post needs a title.' }
  if (title.length > LIMITS.postTitle) {
    return { ok: false, error: `Titles are limited to ${LIMITS.postTitle} characters.` }
  }
  if (input.excerpt.length > LIMITS.postExcerpt) {
    return { ok: false, error: `Excerpts are limited to ${LIMITS.postExcerpt} characters.` }
  }

  const slug = slugify(input.slug || title)
  if (!slug) return { ok: false, error: 'That slug reduces to nothing — try another.' }

  const tags = input.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12)

  try {
    const before = await getPostById(input.id)
    const updated = await updatePost(input.id, {
      title,
      slug,
      excerpt: input.excerpt.trim(),
      bodyMd: input.bodyMd,
      coverUrl: input.coverUrl.trim() || null,
      tags,
      status: input.status,
    })
    if (!updated) return { ok: false, error: 'That post no longer exists.' }

    refreshBlog(updated.slug)
    if (before && before.slug !== updated.slug) refreshBlog(before.slug)
    return { ok: true }
  } catch {
    return failed('save the post')
  }
}

export async function setPostStatusAction(
  id: string,
  status: PostStatus,
): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    const updated = await updatePost(id, { status })
    if (!updated) return { ok: false, error: 'That post no longer exists.' }
    refreshBlog(updated.slug)
    return { ok: true }
  } catch {
    return failed('change the status')
  }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    const post = await getPostById(id)
    await deletePost(id)
    refreshBlog(post?.slug ?? null)
    return { ok: true }
  } catch {
    return failed('delete the post')
  }
}

/* ========================================================================== */
/* Comments                                                                   */
/* ========================================================================== */

const COMMENT_STATUSES: readonly CommentStatus[] = [
  'pending',
  'approved',
  'rejected',
  'spam',
]

export async function moderateCommentAction(
  id: string,
  status: CommentStatus,
): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  if (!COMMENT_STATUSES.includes(status)) {
    return { ok: false, error: 'Unknown moderation status.' }
  }
  try {
    await setCommentStatus(id, status)
    revalidatePath('/blog')
    revalidatePath('/admin', 'layout')
    return { ok: true }
  } catch {
    return failed('update that comment')
  }
}

export async function deleteCommentAction(id: string): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    await deleteComment(id)
    revalidatePath('/blog')
    revalidatePath('/admin', 'layout')
    return { ok: true }
  } catch {
    return failed('delete that comment')
  }
}

/* ========================================================================== */
/* Gallery                                                                    */
/* ========================================================================== */

function refreshGallery(slug?: string | null): void {
  revalidatePath('/gallery')
  if (slug) revalidatePath(`/gallery/${slug}`)
  revalidatePath('/admin', 'layout')
}

export async function createAlbumAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  if (!(await admin())) return DENIED

  const title = text(formData.get('title'))
  if (!title) return { ok: false, error: 'Give the album a title.' }
  if (title.length > 120) return { ok: false, error: 'Album titles are limited to 120 characters.' }

  try {
    const album = await createAlbum({
      title,
      description: text(formData.get('description')).slice(0, 600),
    })
    refreshGallery(album.slug)
    return { ok: true, id: album.id }
  } catch {
    return failed('create the album')
  }
}

export async function updateAlbumAction(
  id: string,
  input: { title: string; description: string },
): Promise<ActionResult> {
  if (!(await admin())) return DENIED

  const title = input.title.trim()
  if (!title) return { ok: false, error: 'An album needs a title.' }

  try {
    const updated = await updateAlbum(id, {
      title,
      description: input.description.trim(),
    })
    if (!updated) return { ok: false, error: 'That album no longer exists.' }
    refreshGallery(updated.slug)
    return { ok: true }
  } catch {
    return failed('save the album')
  }
}

export async function deleteAlbumAction(id: string): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    const album = await getAlbumById(id)
    // Rows go with the cascade; the files on disk do not, so clear them first.
    const photos = await listPhotos(id)
    await deleteAlbum(id)
    for (const photo of photos) {
      await removeMediaFile(photo.url)
      await removeMediaFile(photo.thumbUrl)
    }
    refreshGallery(album?.slug ?? null)
    return { ok: true }
  } catch {
    return failed('delete the album')
  }
}

export async function setAlbumCoverAction(
  albumId: string,
  photoId: string | null,
): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    const updated = await updateAlbum(albumId, { coverPhotoId: photoId })
    if (!updated) return { ok: false, error: 'That album no longer exists.' }
    refreshGallery(updated.slug)
    return { ok: true }
  } catch {
    return failed('set the cover')
  }
}

export async function updatePhotoAction(input: {
  id: string
  caption: string
  alt: string
}): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    await updatePhoto(input.id, {
      caption: input.caption.slice(0, 500),
      alt: input.alt.slice(0, 300),
    })
    refreshGallery()
    return { ok: true }
  } catch {
    return failed('save that photo')
  }
}

/** Swaps a photo with its neighbour and renumbers the album so `sort` stays
 *  dense — reordering by hand should not leave gaps behind. */
export async function movePhotoAction(
  albumId: string,
  photoId: string,
  direction: 'up' | 'down',
): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    const photos = await listPhotos(albumId)
    const from = photos.findIndex((p) => p.id === photoId)
    if (from === -1) return { ok: false, error: 'That photo is no longer in this album.' }

    const to = direction === 'up' ? from - 1 : from + 1
    if (to < 0 || to >= photos.length) return { ok: true }

    const reordered = [...photos]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)

    for (let i = 0; i < reordered.length; i++) {
      if (reordered[i].sort !== i) await updatePhoto(reordered[i].id, { sort: i })
    }

    const album = await getAlbumById(albumId)
    refreshGallery(album?.slug ?? null)
    return { ok: true }
  } catch {
    return failed('reorder the photos')
  }
}

export async function deletePhotoAction(
  albumId: string,
  photoId: string,
): Promise<ActionResult> {
  if (!(await admin())) return DENIED
  try {
    const removed = await deletePhoto(photoId)
    if (removed) {
      await removeMediaFile(removed.url)
      await removeMediaFile(removed.thumbUrl)
    }
    const album = await getAlbumById(albumId)
    refreshGallery(album?.slug ?? null)
    return { ok: true }
  } catch {
    return failed('delete the photo')
  }
}
