'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Topic filter as a row of square tabs on a mist field. Still plain links on
 * `?tag=…`, so a filter is shareable and works without JavaScript; the
 * component is client-side only so the ink block behind the active topic can
 * slide from the old topic to the new one (a shared `layoutId`) instead of
 * jumping.
 *
 * Scrolls sideways on narrow screens rather than wrapping into a wall of tags.
 */
export function TopicBar({
  tags,
  total,
  active,
}: {
  tags: { tag: string; count: number }[]
  total: number
  active?: string
}) {
  const reduce = useReducedMotion()
  if (tags.length === 0) return null

  const items = [{ tag: undefined as string | undefined, label: 'All', count: total }].concat(
    tags.map((t) => ({ tag: t.tag, label: t.tag, count: t.count })),
  )

  return (
    <nav aria-label="Filter writing by topic">
      <ul className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = item.tag === active
          return (
            <li key={item.label} className="shrink-0">
              <Link
                href={item.tag ? `/blog?tag=${encodeURIComponent(item.tag)}` : '/blog'}
                scroll={false}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative inline-flex min-h-[48px] items-center gap-2 whitespace-nowrap px-4 font-body text-[1.0625rem] font-medium leading-none transition-colors duration-150',
                  isActive ? 'text-paper' : 'bg-mist text-ink hover:bg-sky',
                )}
              >
                {isActive ? (
                  <motion.span
                    aria-hidden
                    layoutId={reduce ? undefined : 'topic-active'}
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    className="absolute inset-0 bg-ink"
                  />
                ) : null}
                <span className="relative">{item.label}</span>
                <span className={cn('relative tabular-nums', isActive ? 'text-mist' : 'text-muted')}>
                  {item.count}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
