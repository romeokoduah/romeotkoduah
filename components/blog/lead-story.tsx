import Link from 'next/link'
import type { PostSummary } from '@/lib/blog-types'
import { formatDate } from '@/lib/blog-types'
import { BorderBeam } from '@/components/ui/border-beam'

/**
 * The newest piece, given the full width: photograph and text side by side
 * inside one 2px frame, with a single beam of indigo-to-ember light travelling
 * round that frame. It is the only moving border on the site, which is what
 * marks this as the lead without any extra chrome.
 *
 * The page's h1 is in the masthead, so this is an h2, set at h3 scale so a
 * long report title still fits half the width.
 */
export function LeadStory({ post, index }: { post: PostSummary; index: number }) {
  const date = formatDate(post.publishedAt)

  return (
    <article className="relative bg-paper">
      <Link
        href={`/blog/${post.slug}`}
        className="group grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-soft lg:aspect-auto lg:min-h-[460px]">
          {post.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverUrl}
              alt=""
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-transform duration-700 ease-(--ease-quad) group-hover:scale-[1.04]"
            />
          ) : (
            <div aria-hidden className="absolute inset-0 bg-indigo/10" />
          )}
          <p className="absolute left-0 top-0 bg-indigo px-3.5 py-2 font-body text-[11px] font-bold uppercase tracking-[0.18em] text-paper">
            Latest
          </p>
        </div>

        <div className="flex flex-col p-s20 sm:p-s30">
          <p className="flex items-baseline gap-3 font-body text-[13px] font-semibold text-ink/60">
            <span className="font-head text-[15px] tracking-[0.04em] text-indigo">
              {String(index).padStart(2, '0')}
            </span>
            {date ? <span>{date}</span> : null}
            <span aria-hidden className="text-indigo">
              ·
            </span>
            <span>{post.readingMinutes} min read</span>
          </p>

          <h2 className="mt-5 text-balance font-head text-(length:--text-h3) leading-[1.08] text-indigo transition-colors duration-150 group-hover:text-ember">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="mt-5 font-body text-(length:--text-fluid-sm) leading-[1.7] text-ink/75">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-auto pt-8">
            {post.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                {post.tags.slice(0, 4).map((tag) => (
                  <li
                    key={tag}
                    className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-6 inline-flex items-center gap-3 border-t-2 border-indigo pt-4 font-body text-sm font-bold uppercase tracking-[0.12em] text-indigo">
              Read the piece
              <span
                aria-hidden
                className="transition-transform duration-200 ease-(--ease-quad) group-hover:translate-x-1.5"
              >
                →
              </span>
            </p>
          </div>
        </div>
      </Link>

      {/* Frame and beam are drawn last so they sit over the photograph. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 border-2 border-indigo/25" />
      <BorderBeam
        size={260}
        duration={12}
        borderWidth={2}
        colorFrom="var(--color-indigo)"
        colorTo="var(--color-ember)"
      />
    </article>
  )
}
