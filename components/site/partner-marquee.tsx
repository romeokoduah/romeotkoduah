'use client'

import { Marquee } from '@/components/ui/marquee'

/**
 * Slow, edge-masked ribbon of commissioning institutions. Set well below the
 * default speed — at 40s+ it reads as texture rather than motion.
 */
export function PartnerMarquee({ items }: { items: readonly string[] }) {
  return (
    <Marquee
      pauseOnHover
      className="mask-edges [--duration:48s] [--gap:3.5rem] py-2"
    >
      {items.map((name) => (
        <span
          key={name}
          className="whitespace-nowrap font-head text-lg leading-none text-ink/45 transition-colors duration-150 hover:text-forest sm:text-xl"
        >
          {name}
        </span>
      ))}
    </Marquee>
  )
}
