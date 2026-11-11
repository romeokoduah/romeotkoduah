import Link from 'next/link'
import type { PostSummary } from '@/lib/blog-types'
import { formatDate } from '@/lib/blog-types'
import { Reveal } from '@/components/site/reveal'

/**
 * Everything after the lead, as an index: grouped by year, the year set large
 * and pinned in the left column while its entries scroll past. Rows and years
 * are separated by space, not rules. Thumbnails sit in greyscale and take
 * their colour on hover, so the list stays typographic until you point at
 * something.
 *
 * `startIndex` is accepted for call-site compatibility; entries are no longer
 * numbered.
 */
export function ArchiveList({ posts }: { posts: PostSummary[]; startIndex?: number }) {
  if (posts.length === 0) return null

  const years = new Map<string, PostSummary[]>()
  for (const post of posts) {
    const year = post.publishedAt ? String(new Date(post.publishedAt).getFullYear()) : 'Undated'
    years.set(year, [...(years.get(year) ?? []), post])
  }

  return (
    <section aria-labelledby="archive-heading" className="mt-s60">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="archive-heading" data-rise className="text-ink">
          Archive
        </h2>
        <p
          data-rise
          style={{ '--i': 1 } as React.CSSProperties}
          className="font-body text-muted tabular-nums"
        >
          {posts.length} more {posts.length === 1 ? 'piece' : 'pieces'}
        </p>
      </div>

      <div className="mt-s40 space-y-s40">
        {[...years].map(([year, group]) => (
          <div key={year} className="grid gap-x-s30 md:grid-cols-[140px_minmax(0,1fr)]">
            <p className="font-head text-[2.75rem] leading-none text-ink md:sticky md:top-24 md:self-start md:pt-1">
              {year}
            </p>

            <ol className="mt-4 space-y-10 md:mt-0">
              {group.map((post) => (
                <li key={post.id}>
                  <Reveal>
                    <ArchiveRow post={post} />
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}

function ArchiveRow({ post }: { post: PostSummary }) {
  const date = formatDate(post.publishedAt)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-[minmax(0,1fr)_180px]"
    >
      <div className="min-w-0">
        <h3 className="text-balance font-head text-(length:--text-h4) leading-[1.1] text-ink transition-colors duration-150 group-hover:text-muted">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="mt-3 line-clamp-2 max-w-[62ch] font-body leading-[1.6] text-ink">
            {post.excerpt}
          </p>
        ) : null}

        <p className="mt-3 font-body text-[0.9375rem] text-muted">
          {date}
          {date ? <span aria-hidden className="px-2">·</span> : null}
          {post.readingMinutes} min read
          {post.tags.length > 0 ? (
            <>
              <span aria-hidden className="px-2">·</span>
              {post.tags.slice(0, 2).join(', ')}
            </>
          ) : null}
        </p>
      </div>

      {post.coverUrl ? (
        <div className="relative hidden aspect-[4/3] self-start overflow-hidden bg-mist sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover grayscale transition-[filter,transform] duration-500 ease-(--ease-quad) group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        </div>
      ) : (
        <span className="hidden sm:block" />
      )}
    </Link>
  )
}
