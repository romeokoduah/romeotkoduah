import Link from 'next/link'
import type { PostSummary } from '@/lib/blog-types'
import { formatDate } from '@/lib/blog-types'

/**
 * The newest piece, given the full width: photograph and text side by side,
 * the text on a mist field so the lead stands apart by tone rather than a
 * frame.
 *
 * The page's h1 is in the masthead, so this is an h2, set at h3 scale so a
 * long report title still fits half the width. `index` is accepted for
 * call-site compatibility; the lead is no longer numbered.
 */
export function LeadStory({ post }: { post: PostSummary; index?: number }) {
  const date = formatDate(post.publishedAt)

  return (
    <article data-rise>
      <Link
        href={`/blog/${post.slug}`}
        className="group grid bg-mist lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-sky lg:aspect-auto lg:min-h-[460px]">
          {post.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverUrl}
              alt=""
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-transform duration-700 ease-(--ease-quad) group-hover:scale-[1.04]"
            />
          ) : null}
          <p className="absolute left-0 top-0 bg-ink px-4 py-2.5 font-body text-[0.9375rem] font-medium text-paper">
            Latest
          </p>
        </div>

        <div className="flex flex-col p-s20 sm:p-s30">
          <p className="flex flex-wrap items-baseline gap-x-2.5 font-body text-[0.9375rem] font-medium text-muted">
            {date ? <span>{date}</span> : null}
            {date ? <span aria-hidden>·</span> : null}
            <span>{post.readingMinutes} min read</span>
          </p>

          <h2 className="mt-5 text-balance font-head text-(length:--text-h3) leading-[1.05] text-ink transition-colors duration-150 group-hover:text-muted">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="mt-5 font-body leading-[1.65] text-ink">{post.excerpt}</p>
          ) : null}

          <div className="mt-auto pt-8">
            {post.tags.length > 0 ? (
              <p className="font-body text-[0.9375rem] text-muted">
                {post.tags.slice(0, 4).join(', ')}
              </p>
            ) : null}

            <p className="mt-6">
              <span className="arrow-link text-ink">
                Read the piece <span aria-hidden>→</span>
              </span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
