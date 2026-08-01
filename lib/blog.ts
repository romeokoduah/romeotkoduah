import 'server-only'
import { sql } from './db'
import { peekVisitorId } from './visitor'
import type {
  Comment,
  PendingComment,
  Post,
  PostSummary,
  PostStatus,
} from './blog-types'
import { readingMinutes, slugify } from './blog-types'

/* ============================== reading ================================== */

/** Built per call: evaluating `sql` at module scope would connect on import. */
const summarySelect = () => sql`
  p.id, p.slug, p.title, p.excerpt, p.cover_url, p.tags,
  p.published_at, p.reading_minutes,
  (SELECT count(*) FROM likes l
     WHERE l.target_type = 'post' AND l.target_id = p.id)::int AS like_count,
  (SELECT count(*) FROM comments c
     WHERE c.post_id = p.id AND c.status = 'approved')::int AS comment_count
`

interface SummaryRow {
  id: string
  slug: string
  title: string
  excerpt: string
  cover_url: string | null
  tags: string[]
  published_at: Date | null
  reading_minutes: number
  like_count: number
  comment_count: number
}

function toSummary(r: SummaryRow): PostSummary {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    coverUrl: r.cover_url,
    tags: r.tags ?? [],
    publishedAt: r.published_at ? r.published_at.toISOString() : null,
    readingMinutes: r.reading_minutes,
    likeCount: r.like_count,
    commentCount: r.comment_count,
  }
}

/** Published posts, newest first. `tag` filters when given. */
export async function listPublishedPosts(tag?: string): Promise<PostSummary[]> {
  const rows = tag
    ? await sql<SummaryRow[]>`
        SELECT ${summarySelect()} FROM posts p
        WHERE p.status = 'published' AND ${tag} = ANY (p.tags)
        ORDER BY p.published_at DESC NULLS LAST`
    : await sql<SummaryRow[]>`
        SELECT ${summarySelect()} FROM posts p
        WHERE p.status = 'published'
        ORDER BY p.published_at DESC NULLS LAST`
  return rows.map(toSummary)
}

/** Every distinct tag on a published post, with counts, most used first. */
export async function listTags(): Promise<{ tag: string; count: number }[]> {
  const rows = await sql<{ tag: string; count: number }[]>`
    SELECT unnest(tags) AS tag, count(*)::int AS count
    FROM posts WHERE status = 'published'
    GROUP BY tag ORDER BY count DESC, tag ASC
  `
  return rows
}

interface PostRow extends SummaryRow {
  body_md: string
  status: PostStatus
  created_at: Date
  updated_at: Date
}

function toPost(r: PostRow): Post {
  return {
    ...toSummary(r),
    bodyMd: r.body_md,
    status: r.status,
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
  } as Post
}

/** A single post. Drafts are only returned when `includeDrafts` is set. */
export async function getPostBySlug(
  slug: string,
  includeDrafts = false,
): Promise<Post | null> {
  const rows = await sql<PostRow[]>`
    SELECT ${summarySelect()}, p.body_md, p.status, p.created_at, p.updated_at
    FROM posts p
    WHERE p.slug = ${slug}
      AND (${includeDrafts} OR p.status = 'published')
    LIMIT 1
  `
  return rows[0] ? toPost(rows[0]) : null
}

export async function getPostById(id: string): Promise<Post | null> {
  const rows = await sql<PostRow[]>`
    SELECT ${summarySelect()}, p.body_md, p.status, p.created_at, p.updated_at
    FROM posts p WHERE p.id = ${id} LIMIT 1
  `
  return rows[0] ? toPost(rows[0]) : null
}

/** Everything, drafts included — admin list. */
export async function listAllPosts(): Promise<(PostSummary & { status: PostStatus })[]> {
  const rows = await sql<(SummaryRow & { status: PostStatus })[]>`
    SELECT ${summarySelect()}, p.status FROM posts p
    ORDER BY coalesce(p.published_at, p.updated_at) DESC
  `
  return rows.map((r) => ({ ...toSummary(r), status: r.status }))
}

/** Previous and next published post, by publication date. */
export async function adjacentPosts(slug: string): Promise<{
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}> {
  const rows = await sql<{ slug: string; title: string; rel: string }[]>`
    WITH current AS (
      SELECT published_at FROM posts WHERE slug = ${slug} AND status = 'published'
    )
    (SELECT slug, title, 'prev' AS rel FROM posts, current
      WHERE status = 'published' AND published_at < current.published_at
      ORDER BY published_at DESC LIMIT 1)
    UNION ALL
    (SELECT slug, title, 'next' AS rel FROM posts, current
      WHERE status = 'published' AND published_at > current.published_at
      ORDER BY published_at ASC LIMIT 1)
  `
  return {
    prev: rows.find((r) => r.rel === 'prev') ?? null,
    next: rows.find((r) => r.rel === 'next') ?? null,
  }
}

/* ============================== comments ================================= */

interface CommentRow {
  id: string
  post_id: string
  parent_id: string | null
  author_name: string | null
  body: string
  status: Comment['status']
  created_at: Date
  like_count: number
  liked_by_me: boolean
}

/**
 * Approved comments for a post, as a two-level tree. Replies deeper than one
 * level are flattened onto their top-level ancestor rather than dropped.
 */
export async function listComments(postId: string): Promise<Comment[]> {
  const visitor = await peekVisitorId()
  const rows = await sql<CommentRow[]>`
    SELECT c.id, c.post_id, c.parent_id, c.author_name, c.body, c.status, c.created_at,
      (SELECT count(*) FROM likes l
         WHERE l.target_type = 'comment' AND l.target_id = c.id)::int AS like_count,
      ${
        visitor
          ? sql`EXISTS (SELECT 1 FROM likes l WHERE l.target_type = 'comment'
                        AND l.target_id = c.id AND l.visitor_id = ${visitor})`
          : sql`false`
      } AS liked_by_me
    FROM comments c
    WHERE c.post_id = ${postId} AND c.status = 'approved'
    ORDER BY c.created_at ASC
  `

  const byId = new Map<string, Comment>()
  for (const r of rows) {
    byId.set(r.id, {
      id: r.id,
      postId: r.post_id,
      parentId: r.parent_id,
      authorName: r.author_name,
      body: r.body,
      status: r.status,
      createdAt: r.created_at.toISOString(),
      likeCount: r.like_count,
      likedByMe: r.liked_by_me,
      replies: [],
    })
  }

  const roots: Comment[] = []
  for (const c of byId.values()) {
    if (!c.parentId) {
      roots.push(c)
      continue
    }
    // Walk up to the top-level ancestor so a deep reply still surfaces.
    let anchor = byId.get(c.parentId)
    while (anchor?.parentId) anchor = byId.get(anchor.parentId)
    if (anchor) anchor.replies.push(c)
    else roots.push(c)
  }

  roots.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  for (const r of roots) r.replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return roots
}

export async function countApprovedComments(postId: string): Promise<number> {
  const rows = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM comments
    WHERE post_id = ${postId} AND status = 'approved'
  `
  return rows[0]?.n ?? 0
}

export async function listPendingComments(): Promise<PendingComment[]> {
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
           c.parent_id, left(parent.body, 120) AS parent_excerpt,
           c.author_name, c.body, c.created_at
    FROM comments c
    JOIN posts p ON p.id = c.post_id
    LEFT JOIN comments parent ON parent.id = c.parent_id
    WHERE c.status = 'pending'
    ORDER BY c.created_at ASC
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

export async function countPendingComments(): Promise<number> {
  const rows = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM comments WHERE status = 'pending'
  `
  return rows[0]?.n ?? 0
}

/* ================================ likes ================================== */

export async function postLikeState(
  postId: string,
): Promise<{ count: number; likedByMe: boolean }> {
  const visitor = await peekVisitorId()
  const rows = await sql<{ count: number; liked: boolean }[]>`
    SELECT
      (SELECT count(*) FROM likes WHERE target_type = 'post' AND target_id = ${postId})::int AS count,
      ${
        visitor
          ? sql`EXISTS (SELECT 1 FROM likes WHERE target_type = 'post'
                        AND target_id = ${postId} AND visitor_id = ${visitor})`
          : sql`false`
      } AS liked
  `
  return { count: rows[0]?.count ?? 0, likedByMe: rows[0]?.liked ?? false }
}

/** Toggles a like. Returns the new state. */
export async function toggleLike(
  targetType: 'post' | 'comment',
  targetId: string,
  visitorId: string,
): Promise<{ count: number; liked: boolean }> {
  const removed = await sql`
    DELETE FROM likes
    WHERE target_type = ${targetType} AND target_id = ${targetId}
      AND visitor_id = ${visitorId}
    RETURNING id
  `
  if (removed.length === 0) {
    await sql`
      INSERT INTO likes (target_type, target_id, visitor_id)
      VALUES (${targetType}, ${targetId}, ${visitorId})
      ON CONFLICT DO NOTHING
    `
  }
  const rows = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM likes
    WHERE target_type = ${targetType} AND target_id = ${targetId}
  `
  return { count: rows[0]?.n ?? 0, liked: removed.length === 0 }
}

/* ============================== mutations ================================ */

/** Ensures the slug is unique by appending -2, -3 … when needed. */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'post'
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`
    const rows = await sql<{ id: string }[]>`
      SELECT id FROM posts WHERE slug = ${candidate} LIMIT 1
    `
    if (rows.length === 0 || rows[0].id === excludeId) return candidate
  }
  return `${root}-${Date.now()}`
}

export async function createPost(input: {
  title: string
  excerpt?: string
  bodyMd?: string
  coverUrl?: string | null
  tags?: string[]
  status?: PostStatus
}): Promise<Post> {
  const slug = await uniqueSlug(input.title)
  const body = input.bodyMd ?? ''
  const publishedAt = input.status === 'published' ? new Date() : null

  const rows = await sql<{ id: string }[]>`
    INSERT INTO posts (slug, title, excerpt, body_md, cover_url, tags, status,
                       published_at, reading_minutes)
    VALUES (${slug}, ${input.title}, ${input.excerpt ?? ''}, ${body},
            ${input.coverUrl ?? null}, ${input.tags ?? []},
            ${input.status ?? 'draft'}, ${publishedAt}, ${readingMinutes(body)})
    RETURNING id
  `
  const post = await getPostById(rows[0].id)
  if (!post) throw new Error('Post vanished immediately after insert')
  return post
}

export async function updatePost(
  id: string,
  input: {
    title?: string
    slug?: string
    excerpt?: string
    bodyMd?: string
    coverUrl?: string | null
    tags?: string[]
    status?: PostStatus
  },
): Promise<Post | null> {
  const current = await getPostById(id)
  if (!current) return null

  const title = input.title ?? current.title
  const body = input.bodyMd ?? current.bodyMd
  const status = input.status ?? current.status
  const slug = input.slug ? await uniqueSlug(input.slug, id) : current.slug

  // Stamp published_at the first time a post goes live, and clear it if it is
  // pulled back to draft, so the ordering stays honest.
  const publishedAt =
    status === 'published'
      ? (current.publishedAt ? new Date(current.publishedAt) : new Date())
      : null

  await sql`
    UPDATE posts SET
      title = ${title},
      slug = ${slug},
      excerpt = ${input.excerpt ?? current.excerpt},
      body_md = ${body},
      cover_url = ${input.coverUrl === undefined ? current.coverUrl : input.coverUrl},
      tags = ${input.tags ?? current.tags},
      status = ${status},
      published_at = ${publishedAt},
      reading_minutes = ${readingMinutes(body)},
      updated_at = now()
    WHERE id = ${id}
  `
  return getPostById(id)
}

export async function deletePost(id: string): Promise<void> {
  await sql`DELETE FROM posts WHERE id = ${id}`
}

export async function insertComment(input: {
  postId: string
  parentId: string | null
  authorName: string | null
  body: string
  status: Comment['status']
  ipHash: string
  userAgent: string | null
}): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    INSERT INTO comments (post_id, parent_id, author_name, body, status, ip_hash, user_agent)
    VALUES (${input.postId}, ${input.parentId}, ${input.authorName}, ${input.body},
            ${input.status}, ${input.ipHash}, ${input.userAgent})
    RETURNING id
  `
  return rows[0].id
}

export async function setCommentStatus(
  id: string,
  status: Comment['status'],
): Promise<void> {
  await sql`UPDATE comments SET status = ${status} WHERE id = ${id}`
}

export async function deleteComment(id: string): Promise<void> {
  await sql`DELETE FROM comments WHERE id = ${id}`
}
