'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { sql } from '@/lib/db'
import { getPostById, insertComment, toggleLike } from '@/lib/blog'
import { LIMITS, countLinks } from '@/lib/blog-types'
import { clientIpHash, rateLimit, visitorId } from '@/lib/visitor'

/* ------------------------------------------------------------- results ---- */

export type CommentResult = { ok: true } | { ok: false; error: string }

export type LikeResult =
  | { ok: true; count: number; liked: boolean }
  | { ok: false; error: string }

/* ------------------------------------------------------------- schemas ---- */

/** An empty string is how a form sends "no value"; treat it as absent. */
const optionalUuid = z.union([z.uuid(), z.literal('')]).optional()

const commentSchema = z.object({
  postId: z.uuid(),
  parentId: optionalUuid,
  authorName: z.string().trim().max(LIMITS.authorName),
  body: z.string().trim().min(LIMITS.commentMin).max(LIMITS.commentBody),
  /** Honeypot. A human never sees this, so a human never fills it. */
  website: z.string().optional(),
  /** Client clock at the moment the form mounted, in milliseconds. */
  startedAt: z.string().optional(),
})

const likeSchema = z.object({
  targetType: z.enum(['post', 'comment']),
  targetId: z.uuid(),
})

/* ----------------------------------------------------------- existence ---- */

/**
 * Two checks the data layer does not expose. `lib/blog.ts` has no
 * single-comment accessor because nothing renders one on its own, but both of
 * these are integrity checks rather than reads for display: without them a
 * forged `targetId` writes an orphan like, and a forged `parentId` grafts a
 * reply onto another post's thread. Narrow, parameterised, and deliberately
 * kept next to the actions that need them.
 */
async function commentExists(id: string): Promise<boolean> {
  const rows = await sql<{ id: string }[]>`
    SELECT id FROM comments WHERE id = ${id} LIMIT 1
  `
  return rows.length > 0
}

async function commentBelongsToPost(id: string, postId: string): Promise<boolean> {
  const rows = await sql<{ id: string }[]>`
    SELECT id FROM comments WHERE id = ${id} AND post_id = ${postId} LIMIT 1
  `
  return rows.length > 0
}

/* ------------------------------------------------------------ comments ---- */

const TOO_FAST =
  'You have posted a lot in the last hour. Give it a little while and try again.'
const GENERIC = 'Something went wrong posting that. Please try again in a moment.'

/**
 * Accepts a reader's comment into the moderation queue. Nothing written here
 * is ever public — status is `pending` at best, and Romeo approves it from the
 * dashboard. The bot defences below all fail *silently*: a crawler that learns
 * which of its tricks was caught simply drops that trick.
 */
export async function submitComment(formData: FormData): Promise<CommentResult> {
  try {
    const parsed = commentSchema.safeParse({
      postId: formData.get('postId'),
      parentId: formData.get('parentId') ?? '',
      authorName: formData.get('authorName') ?? '',
      body: formData.get('body') ?? '',
      website: formData.get('website') ?? '',
      startedAt: formData.get('startedAt') ?? '',
    })

    if (!parsed.success) {
      const body = String(formData.get('body') ?? '').trim()
      if (body.length < LIMITS.commentMin) {
        return { ok: false, error: 'Please write a comment before posting.' }
      }
      if (body.length > LIMITS.commentBody) {
        return {
          ok: false,
          error: `That is longer than the ${LIMITS.commentBody} character limit.`,
        }
      }
      return { ok: false, error: 'That comment could not be accepted as written.' }
    }

    const { postId, website, startedAt } = parsed.data
    const parentId = parsed.data.parentId ? parsed.data.parentId : null
    const authorName = parsed.data.authorName.length > 0 ? parsed.data.authorName : null
    const body = parsed.data.body

    // 1. Honeypot. Filled means a script walked the form.
    if (website && website.trim().length > 0) return { ok: true }

    // 2. Time on form. A missing or unreadable stamp means the field was never
    //    mounted in a browser; anything under the floor means nobody read the
    //    post before replying to it. A clock ahead of the server's yields a
    //    negative elapsed time, which is skew rather than speed — let it pass.
    const started = Number(startedAt)
    if (!Number.isFinite(started) || started <= 0) return { ok: true }
    const elapsed = Date.now() - started
    if (elapsed >= 0 && elapsed < LIMITS.minFormMs) return { ok: true }

    // 3. Rate limit, per address, per hour.
    const limit = await rateLimit(`comment:${await clientIpHash()}`, 5, 3600)
    if (!limit.ok) return { ok: false, error: TOO_FAST }

    // 4. The post has to exist and be published.
    const post = await getPostById(postId)
    if (!post || post.status !== 'published') {
      return { ok: false, error: 'That post is no longer accepting comments.' }
    }

    // 5. A reply has to belong to the thread it claims to.
    if (parentId && !(await commentBelongsToPost(parentId, postId))) {
      return { ok: false, error: 'That comment is no longer available to reply to.' }
    }

    // 6. Link-heavy comments go straight to the spam bucket rather than the
    //    queue, so the queue stays short enough to actually be read.
    const status = countLinks(body) > LIMITS.maxLinks ? 'spam' : 'pending'

    await insertComment({
      postId,
      parentId,
      authorName,
      body,
      status,
      ipHash: await clientIpHash(),
      userAgent: (await headers()).get('user-agent'),
    })

    revalidatePath(`/blog/${post.slug}`)
    return { ok: true }
  } catch (error) {
    console.error('submitComment failed', error)
    return { ok: false, error: GENERIC }
  }
}

/* --------------------------------------------------------------- likes ---- */

/**
 * Toggles this visitor's like on a post or a comment and returns the new
 * state, so the client can reconcile whatever it showed optimistically.
 */
export async function toggleLikeAction(
  targetType: 'post' | 'comment',
  targetId: string,
): Promise<LikeResult> {
  try {
    const parsed = likeSchema.safeParse({ targetType, targetId })
    if (!parsed.success) return { ok: false, error: 'Unknown thing to like.' }

    const limit = await rateLimit(`like:${await clientIpHash()}`, 30, 3600)
    if (!limit.ok) {
      return {
        ok: false,
        error: 'That is a lot of likes in one hour. Try again a little later.',
      }
    }

    const exists =
      parsed.data.targetType === 'post'
        ? Boolean(await getPostById(parsed.data.targetId))
        : await commentExists(parsed.data.targetId)

    if (!exists) return { ok: false, error: 'That is no longer here to like.' }

    const state = await toggleLike(
      parsed.data.targetType,
      parsed.data.targetId,
      await visitorId(),
    )
    return { ok: true, count: state.count, liked: state.liked }
  } catch (error) {
    console.error('toggleLikeAction failed', error)
    return { ok: false, error: GENERIC }
  }
}
