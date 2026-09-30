import Link from 'next/link'
import type { PostSummary } from '@/lib/blog-types'
import { formatDate } from '@/lib/blog-types'
import { Reveal } from '@/components/site/reveal'

/**
 * Everything after the lead, as an index: grouped by year, the year set large
 * and pinned in the left column while its entries scroll past, each entry
 * numbered in sequence with the lead so the page reads as one catalogue.
 * Thumbnails sit in greyscale and take their colour on hover, so the list
 * stays typographic until you point at something.
 */
export function ArchiveList({ posts, startIndex }: { posts: PostSummary[]; startIndex: number }) {
  if (posts.length === 0) return null

  const years = new Map<string, PostSummary[]>()
  for (const post of posts) {
    const year = post.publishedAt ? String(new Date(post.publishedAt).getFullYear()) : 'Undated'
    years.set(year, [...(years.get(year) ?? []), post])
  }

  let n = startIndex

  return (
    <section aria-labelledby="archive-heading" className="mt-s50">
      <div className="flex items-end justify-between gap-6 border-b-2 border-ink pb-4">
        <h2 id="archive-heading" className="font-head text-(length:--text-h3) leading-none text-ink">
          Archive
        </h2>
        <p className="font-body text-[13px] font-semibold text-ink/55">
          {posts.length} more {posts.length === 1 ? 'piece' : 'pieces'}
        </p>
      </div>

      {[...years].map(([year, group]) => (
        <div
          key={year}
          className="grid gap-x-s30 border-b-2 border-ink/10 md:grid-cols-[140px_minmax(0,1fr)]"
        >
          <p className="pt-7 font-head text-[44px] leading-none text-indigo/25 md:sticky md:top-24 md:self-start md:pb-7">
            {year}
          </p>

          <ol>
            {group.map((post) => {
              const index = n++
              return (
                <li key={post.id} className="border-t-2 border-ink/8 first:border-t-0">
                  <Reveal>
                    <ArchiveRow post={post} index={index} />
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </section>
  )
}

function ArchiveRow({ post, index }: { post: PostSummary; index: number }) {
  const date = formatDate(post.publishedAt)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-[44px_minmax(0,1fr)] gap-x-5 py-7 sm:grid-cols-[52px_minmax(0,1fr)_160px]"
    >
      <span className="font-head text-[22px] leading-[1.2] text-ink/25 tabular-nums transition-colors duration-150 group-hover:text-indigo">
        {String(index).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        {post.tags.length > 0 ? (
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
            {post.tags.slice(0, 2).join(' · ')}
          </p>
        ) : null}

        <h3 className="mt-2 text-balance font-head text-(length:--text-h4) leading-[1.2] text-ink transition-colors duration-150 group-hover:text-indigo">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="mt-2.5 line-clamp-2 max-w-[62ch] font-body text-[14px] leading-[1.65] text-ink/65">
            {post.excerpt}
          </p>
        ) : null}

        <p className="mt-3 font-body text-[13px] font-semibold text-ink/50">
          {date}
          {date ? <span aria-hidden className="px-2 text-indigo">·</span> : null}
          {post.readingMinutes} min read
        </p>
      </div>

      {post.coverUrl ? (
        <div className="relative hidden aspect-[4/3] self-start overflow-hidden border-2 border-ink/10 bg-soft sm:block">
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
