import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { adjacentPosts, getPostBySlug, listComments, postLikeState } from '@/lib/blog'
import { Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { Comments } from '@/components/blog/comments'
import { LikeButton } from '@/components/blog/like-button'
import { Markdown } from '@/components/blog/markdown'
import { PostMeta } from '@/components/blog/post-meta'
import { countComments, plural } from '@/components/blog/shared'

/** Per request: bodies, comments and like counts all come from Postgres. */
export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: 'Post not found', robots: { index: false, follow: false } }

  const images = post.coverUrl ? [post.coverUrl] : undefined

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: `${post.title} — Romeo Tweneboah Koduah`,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: ['Romeo Tweneboah Koduah'],
      tags: post.tags,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt,
      images,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  // `getPostBySlug` without `includeDrafts` returns published posts only, so a
  // draft is indistinguishable from a typo to anyone outside the dashboard.
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const [likes, comments, adjacent] = await Promise.all([
    postLikeState(post.id),
    listComments(post.id),
    adjacentPosts(post.slug),
  ])

  const commentCount = countComments(comments)

  return (
    <article>
      {/* ============================= HEADER ============================= */}
      <div className="bg-sky py-s50">
        <Wide>
          <div className="mx-auto max-w-(--container-measure)">
            <Reveal immediate>
              <Link
                href="/blog"
                className="arrow-link text-ink"
              >
                <span aria-hidden>←</span> Writing
              </Link>
            </Reveal>

            {post.tags.length > 0 ? (
              <Reveal immediate delay={0.04}>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="inline-block bg-paper px-3 py-1.5 font-body text-[0.9375rem] font-medium leading-none text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <Reveal immediate delay={0.08}>
              <h1 className="mt-6 text-indigo">{post.title}</h1>
            </Reveal>

            {post.excerpt ? (
              <Reveal immediate delay={0.12}>
                <p className="mt-7 font-body text-(length:--text-step-lead) leading-[1.4] text-ink">
                  {post.excerpt}
                </p>
              </Reveal>
            ) : null}

            <Reveal immediate delay={0.16}>
              <div className="mt-7">
                <PostMeta
                  publishedAt={post.publishedAt}
                  readingMinutes={post.readingMinutes}
                  likeCount={likes.count}
                  commentCount={commentCount}
                  size="md"
                />
              </div>
            </Reveal>
          </div>
        </Wide>
      </div>

      {/* Full-bleed cover, or nothing at all — a placeholder box would only
          announce that a picture is missing. */}
      {post.coverUrl ? (
        <div className="relative aspect-21/9 w-full overflow-hidden bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt=""
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>
      ) : null}

      {/* ============================== BODY ============================== */}
      <Section>
        <Wide>
          <div className="relative mx-auto max-w-(--container-measure)">
            {/* Sticky rail, wide screens only. Deliberately outside <Reveal>:
                a transformed ancestor breaks `position: sticky`. */}
            <aside
              aria-label="Post actions"
              className="absolute -left-28 top-0 hidden h-full xl:block"
            >
              <div className="sticky top-28 flex flex-col items-center gap-4">
                <LikeButton
                  targetType="post"
                  targetId={post.id}
                  initialCount={likes.count}
                  initialLiked={likes.likedByMe}
                  subject={post.title}
                  layout="stack"
                />
                <a
                  href="#comments"
                  className="flex flex-col items-center gap-1 bg-mist px-3 py-3 font-body text-[0.9375rem] font-medium leading-none text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
                >
                  <span aria-hidden className="text-[17px] leading-none">
                    ❝
                  </span>
                  <span className="tabular-nums">{commentCount}</span>
                  <span className="sr-only">
                    Jump to {plural(commentCount, 'comment')}
                  </span>
                </a>
              </div>
            </aside>

            <Reveal>
              <Markdown source={post.bodyMd} />
            </Reveal>

            {/* ========================= END MATTER ======================== */}
            <div className="mt-s40 pt-s30">
              <div className="flex flex-wrap items-center gap-4">
                <LikeButton
                  targetType="post"
                  targetId={post.id}
                  initialCount={likes.count}
                  initialLiked={likes.likedByMe}
                  subject={post.title}
                />
                <a
                  href="#comments"
                  className="arrow-link text-ink"
                >
                  {plural(commentCount, 'comment')}
                </a>
              </div>

              {post.tags.length > 0 ? (
                <div className="mt-8">
                  <p className="font-body text-[1rem] font-medium text-muted">
                    Filed under
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="inline-block bg-paper px-3 py-1.5 font-body text-[0.9375rem] font-medium leading-none text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* ========================= PREV / NEXT ======================= */}
            {adjacent.prev || adjacent.next ? (
              <nav
                aria-label="More writing"
                className="mt-s30 grid gap-4 sm:grid-cols-2"
              >
                {adjacent.prev ? (
                  <Link
                    href={`/blog/${adjacent.prev.slug}`}
                    className="group bg-mist p-6 transition-colors duration-150 hover:bg-sky"
                  >
                    <span className="font-body text-[0.9375rem] font-medium text-muted">
                      <span aria-hidden>←</span> Previous
                    </span>
                    <span className="mt-3 block text-balance font-head text-(length:--text-h4) leading-[1.15] text-ink transition-colors duration-150 group-hover:text-indigo">
                      {adjacent.prev.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden bg-paper sm:block" />
                )}

                {adjacent.next ? (
                  <Link
                    href={`/blog/${adjacent.next.slug}`}
                    className="group bg-mist p-6 text-right transition-colors duration-150 hover:bg-sky"
                  >
                    <span className="font-body text-[0.9375rem] font-medium text-muted">
                      Next <span aria-hidden>→</span>
                    </span>
                    <span className="mt-3 block text-balance font-head text-(length:--text-h4) leading-[1.15] text-ink transition-colors duration-150 group-hover:text-indigo">
                      {adjacent.next.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden bg-paper sm:block" />
                )}
              </nav>
            ) : null}
          </div>
        </Wide>
      </Section>

      {/* ============================ COMMENTS ============================ */}
      <Section tone="soft">
        <Wide>
          <div className="mx-auto max-w-(--container-measure)">
            <Comments postId={post.id} comments={comments} />
          </div>
        </Wide>
      </Section>
    </article>
  )
}
