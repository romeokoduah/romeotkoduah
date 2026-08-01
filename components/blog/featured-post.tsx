import Link from 'next/link'
import type { PostSummary } from '@/lib/blog-types'
import { PostMeta } from './post-meta'

/**
 * The lead. It gets the whole measure of the page: a wide cover, the title at
 * h1 scale, and the excerpt set beside it rather than under it, so the
 * headline has somewhere to breathe. Everything below it is a list.
 *
 * The page's own h1 lives in the hero, so this is an h2 carrying h1 size —
 * scale is a design decision, heading level is a structural one.
 */
export function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        {post.coverUrl ? (
          <div className="relative aspect-21/9 w-full overflow-hidden border-2 border-indigo/20 bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
            />
          </div>
        ) : null}

        <div className="mt-8 grid gap-x-s30 gap-y-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
          <div>
            {post.tags.length > 0 ? (
              <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-indigo">
                {post.tags[0]}
              </p>
            ) : null}
            <h2 className="mt-4 text-balance font-head text-(length:--text-h1) leading-[1] text-indigo transition-colors duration-150 group-hover:text-ember">
              {post.title}
            </h2>
          </div>

          <div className="lg:pb-1">
            {post.excerpt ? (
              <p className="font-body text-(length:--text-fluid-sm) leading-[1.7] text-ink/75">
                {post.excerpt}
              </p>
            ) : null}
            <PostMeta
              publishedAt={post.publishedAt}
              readingMinutes={post.readingMinutes}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              className="mt-5"
            />
          </div>
        </div>
      </Link>
    </article>
  )
}
