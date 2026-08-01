import Link from 'next/link'
import type { PostSummary } from '@/lib/blog-types'
import { PostMeta } from './post-meta'

/**
 * One row of the index list. Thumbnail left, everything else right, a hairline
 * across the top — the same editorial row used elsewhere on the site, sized
 * for a two-column grid.
 */
export function PostRow({ post }: { post: PostSummary }) {
  return (
    <article className="h-full border-t-2 border-ink/12 pt-6">
      <Link href={`/blog/${post.slug}`} className="group flex gap-5">
        {post.coverUrl ? (
          <div className="relative hidden h-[104px] w-[140px] shrink-0 overflow-hidden border-2 border-ink/10 bg-soft sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          {post.tags.length > 0 ? (
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
              {post.tags.slice(0, 2).join(' · ')}
            </p>
          ) : null}

          <h3 className="mt-2 text-balance font-head text-(length:--text-h4) leading-[1.15] text-ink transition-colors duration-150 group-hover:text-indigo">
            {post.title}
          </h3>

          {post.excerpt ? (
            <p className="mt-2.5 line-clamp-2 font-body text-[14px] leading-[1.65] text-ink/70">
              {post.excerpt}
            </p>
          ) : null}

          <PostMeta
            publishedAt={post.publishedAt}
            readingMinutes={post.readingMinutes}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            className="mt-3.5"
          />
        </div>
      </Link>
    </article>
  )
}
