'use client'

import { Marquee } from '@/components/ui/marquee'

/**
 * Slow ribbon of commissioning institutions. Set well below the
 * default speed — at 40s+ it reads as texture rather than motion.
 */
export function PartnerMarquee({ items }: { items: readonly string[] }) {
  return (
    <Marquee
      pauseOnHover
      className="[--duration:48s] [--gap:3.5rem] py-2"
    >
      {items.map((name) => (
        <span
          key={name}
          className="whitespace-nowrap font-head text-[1.375rem] leading-none text-muted transition-colors duration-150 hover:text-ink sm:text-[1.625rem]"
        >
          {name}
        </span>
      ))}
    </Marquee>
  )
}
