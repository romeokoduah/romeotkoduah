import 'server-only'
import { sql } from '@/lib/db'
import type { CommentStatus, PendingComment } from '@/lib/blog-types'

/**
 * Reads used only by the dashboard. Everything the public site also needs
 * lives in `lib/blog.ts` and `lib/gallery.ts`; these are the extra shapes the
 * admin wants — counts for the overview, and the moderation queue filtered by
 * something other than "pending".
 */

export interface AdminCounts {
  published: number
  drafts: number
  pending: number
  approved: number
  rejected: number
  spam: number
  albums: number
  photos: number
  likes: number
}

const ZERO: AdminCounts = {
  published: 0,
  drafts: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  spam: 0,
  albums: 0,
  photos: 0,
  likes: 0,
}

/** One round trip for the whole overview. Falls back to zeroes if the
 *  database is unreachable, so the dashboard degrades rather than 500s. */
export async function adminCounts(): Promise<AdminCounts> {
  try {
    const rows = await sql<AdminCounts[]>`
      SELECT
        (SELECT count(*) FROM posts    WHERE status = 'published')::int AS published,
        (SELECT count(*) FROM posts    WHERE status = 'draft')::int     AS drafts,
        (SELECT count(*) FROM comments WHERE status = 'pending')::int   AS pending,
        (SELECT count(*) FROM comments WHERE status = 'approved')::int  AS approved,
        (SELECT count(*) FROM comments WHERE status = 'rejected')::int  AS rejected,
        (SELECT count(*) FROM comments WHERE status = 'spam')::int      AS spam,
        (SELECT count(*) FROM albums)::int                              AS albums,
        (SELECT count(*) FROM photos)::int                              AS photos,
        (SELECT count(*) FROM likes)::int                               AS likes
    `
    return rows[0] ?? ZERO
  } catch {
    return ZERO
  }
}

/**
 * The moderation queue for any status. `listPendingComments` in `lib/blog.ts`
 * covers the pending case for the badge; this one carries the filter so
 * mistakes can be found and undone.
 */
export async function listCommentsByStatus(
  status: CommentStatus,
  limit = 200,
): Promise<PendingComment[]> {
  const rows = await sql<
    {
      id: string
      post_id: string
      post_slug: string
      post_title: string
      parent_id: string | null
      parent_excerpt: string | null
      author_name: string | null
      body: string
      created_at: Date
    }[]
  >`
    SELECT c.id, c.post_id, p.slug AS post_slug, p.title AS post_title,
           c.parent_id, left(parent.body, 160) AS parent_excerpt,
           c.author_name, c.body, c.created_at
    FROM comments c
    JOIN posts p ON p.id = c.post_id
    LEFT JOIN comments parent ON parent.id = c.parent_id
    WHERE c.status = ${status}
    ORDER BY c.created_at ${status === 'pending' ? sql`ASC` : sql`DESC`}
    LIMIT ${limit}
  `
  return rows.map((r) => ({
    id: r.id,
    postId: r.post_id,
    postSlug: r.post_slug,
    postTitle: r.post_title,
    parentId: r.parent_id,
    parentExcerpt: r.parent_excerpt,
    authorName: r.author_name,
    body: r.body,
    createdAt: r.created_at.toISOString(),
  }))
}

export interface ActivityItem {
  kind: 'post' | 'comment' | 'photo'
  id: string
  label: string
  detail: string
  href: string
  at: string
}

/** A merged, newest-first trail of what has changed lately. */
export async function recentActivity(limit = 12): Promise<ActivityItem[]> {
  try {
    const [posts, comments, photos] = await Promise.all([
      sql<{ id: string; title: string; status: string; updated_at: Date }[]>`
        SELECT id, title, status, updated_at FROM posts
        ORDER BY updated_at DESC LIMIT ${limit}
      `,
      sql<
        { id: string; author_name: string | null; status: string; created_at: Date }[]
      >`
        SELECT id, author_name, status, created_at FROM comments
        ORDER BY created_at DESC LIMIT ${limit}
      `,
      sql<{ id: string; album_id: string | null; created_at: Date }[]>`
        SELECT id, album_id, created_at FROM photos
        ORDER BY created_at DESC LIMIT ${limit}
      `,
    ])

    const items: ActivityItem[] = [
      ...posts.map((p) => ({
        kind: 'post' as const,
        id: p.id,
        label: p.title,
        detail: p.status === 'published' ? 'Post updated' : 'Draft saved',
        href: `/admin/posts/${p.id}`,
        at: p.updated_at.toISOString(),
      })),
      ...comments.map((c) => ({
        kind: 'comment' as const,
        id: c.id,
        label: c.author_name?.trim() || 'Anonymous',
        detail: `Comment ${c.status}`,
        href: '/admin/comments',
        at: c.created_at.toISOString(),
      })),
      ...photos.map((p) => ({
        kind: 'photo' as const,
        id: p.id,
        label: 'Photo uploaded',
        detail: p.album_id ? 'Added to an album' : 'Unfiled',
        href: p.album_id ? `/admin/gallery/${p.album_id}` : '/admin/gallery',
        at: p.created_at.toISOString(),
      })),
    ]

    return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
  } catch {
    return []
  }
}

export async function getAdminById(
  id: string,
): Promise<{ id: string; email: string; password_hash: string } | null> {
  const rows = await sql<{ id: string; email: string; password_hash: string }[]>`
    SELECT id, email, password_hash FROM admin_user WHERE id = ${id} LIMIT 1
  `
  return rows[0] ?? null
}
