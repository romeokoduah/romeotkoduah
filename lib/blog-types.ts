/**
 * Shared shapes for the blog and gallery. Safe to import from client
 * components — no server-only imports here.
 */

export type PostStatus = 'draft' | 'published'
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  bodyMd: string
  coverUrl: string | null
  tags: string[]
  status: PostStatus
  publishedAt: string | null
  readingMinutes: number
  createdAt: string
  updatedAt: string
}

/** A post as it appears in a list — no body, plus counts. */
export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  coverUrl: string | null
  tags: string[]
  publishedAt: string | null
  readingMinutes: number
  likeCount: number
  commentCount: number
}

export interface Comment {
  id: string
  postId: string
  parentId: string | null
  /** null means the commenter chose to stay anonymous. */
  authorName: string | null
  body: string
  status: CommentStatus
  createdAt: string
  likeCount: number
  /** Whether the current visitor has already liked this comment. */
  likedByMe: boolean
  replies: Comment[]
}

/** A pending comment as shown in the moderation queue. */
export interface PendingComment {
  id: string
  postId: string
  postSlug: string
  postTitle: string
  parentId: string | null
  parentExcerpt: string | null
  authorName: string | null
  body: string
  createdAt: string
}

export interface Album {
  id: string
  slug: string
  title: string
  description: string
  sort: number
  coverPhotoId: string | null
  coverUrl: string | null
  coverThumbUrl: string | null
  photoCount: number
  createdAt: string
}

export interface Photo {
  id: string
  albumId: string | null
  url: string
  thumbUrl: string
  width: number
  height: number
  /** Average colour, painted behind the image while it loads. */
  tone: string
  caption: string
  alt: string
  takenAt: string | null
  sort: number
}

/* ------------------------------------------------------------- limits ---- */

export const LIMITS = {
  authorName: 60,
  commentBody: 4000,
  commentMin: 2,
  /** More than this many URLs in a comment body is treated as spam. */
  maxLinks: 2,
  /** A form submitted faster than this is a bot. Milliseconds. */
  minFormMs: 2500,
  postTitle: 200,
  postExcerpt: 400,
} as const

/* -------------------------------------------------------------- shared --- */

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Rough but stable: 200 words a minute, floor of one. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function countLinks(text: string): number {
  return (text.match(/https?:\/\/|www\./gi) ?? []).length
}

export function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** "Anonymous" is the display name; the stored value stays null. */
export function displayName(name: string | null): string {
  return name && name.trim().length > 0 ? name.trim() : 'Anonymous'
}
