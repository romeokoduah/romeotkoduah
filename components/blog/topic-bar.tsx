'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Topic filter as a ruled tab row. Still plain links on `?tag=…`, so a filter
 * is shareable and works without JavaScript; the component is client-side
 * only so the indigo underline can slide from the old topic to the new one
 * (a shared `layoutId`) instead of jumping.
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
    <nav aria-label="Filter writing by topic" className="flex items-end gap-s30 border-b-2 border-ink/10">
      <p className="hidden shrink-0 pb-3.5 font-body text-xs font-bold uppercase tracking-[0.18em] text-ink/45 md:block">
        Topics
      </p>

      <ul className="-mb-[2px] flex min-w-0 gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = item.tag === active
          return (
            <li key={item.label} className="shrink-0">
              <Link
                href={item.tag ? `/blog?tag=${encodeURIComponent(item.tag)}` : '/blog'}
                scroll={false}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group relative inline-flex items-baseline gap-1.5 whitespace-nowrap pb-3.5 pt-1 font-head text-[17px] uppercase leading-none tracking-[0.04em] transition-colors duration-150',
                  isActive ? 'text-indigo' : 'text-ink/55 hover:text-ink',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'font-body text-[11px] font-bold tabular-nums tracking-normal',
                    isActive ? 'text-indigo/70' : 'text-ink/35',
                  )}
                >
                  {item.count}
                </span>

                {isActive ? (
                  <motion.span
                    layoutId={reduce ? undefined : 'topic-underline'}
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-indigo"
                  />
                ) : (
                  <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-ink/20 transition-transform duration-200 ease-(--ease-quad) group-hover:scale-x-100" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
