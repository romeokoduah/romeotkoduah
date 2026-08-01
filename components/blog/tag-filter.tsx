import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Tag filtering, done with links rather than state: `?tag=…` is shareable,
 * survives a reload, and works with no JavaScript at all. The active tag is
 * filled; "All" clears back to the bare `/blog`.
 */
export function TagFilter({
  tags,
  active,
}: {
  tags: { tag: string; count: number }[]
  active?: string
}) {
  if (tags.length === 0) return null

  const base =
    'inline-flex items-baseline gap-2 border-2 border-indigo px-3.5 py-2 font-body text-[13px] font-bold leading-none transition-colors duration-150'

  return (
    <nav aria-label="Filter writing by tag">
      <ul className="flex flex-wrap gap-2.5">
        <li>
          <Link
            href="/blog"
            aria-current={active ? undefined : 'true'}
            className={cn(
              base,
              active ? 'text-indigo hover:bg-indigo hover:text-paper' : 'bg-indigo text-paper',
            )}
          >
            All
          </Link>
        </li>
        {tags.map(({ tag, count }) => {
          const isActive = active === tag
          return (
            <li key={tag}>
              <Link
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  base,
                  isActive
                    ? 'bg-indigo text-paper'
                    : 'text-indigo hover:bg-indigo hover:text-paper',
                )}
              >
                {tag}
                <span className="text-[11px] font-semibold tabular-nums opacity-70">
                  {count}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
