import { formatDate } from '@/lib/blog-types'
import { cn } from '@/lib/utils'
import { plural } from './shared'

/**
 * The byline strip: date · reading time · likes, optionally · comments.
 * One component so the index, the featured lead and the article page all
 * separate their metadata with the same accent dot at the same weight.
 */
export function PostMeta({
  publishedAt,
  readingMinutes,
  likeCount,
  commentCount,
  size = 'sm',
  className,
}: {
  publishedAt: string | null
  readingMinutes: number
  likeCount: number
  commentCount?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const parts = [
    formatDate(publishedAt) || 'Unpublished',
    `${readingMinutes} min read`,
    plural(likeCount, 'like'),
    ...(commentCount === undefined ? [] : [plural(commentCount, 'comment')]),
  ]

  return (
    <p
      className={cn(
        'flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-body font-semibold text-ink/60',
        size === 'md' ? 'text-sm' : 'text-[13px]',
        className,
      )}
    >
      {parts.map((part, i) => (
        <span key={part} className="flex items-baseline gap-2.5">
          {i > 0 ? (
            <span aria-hidden className="text-indigo">
              ·
            </span>
          ) : null}
          <span>{part}</span>
        </span>
      ))}
    </p>
  )
}
