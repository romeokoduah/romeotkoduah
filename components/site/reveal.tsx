'use client'

import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { BlurFade } from '@/components/ui/blur-fade'
import { cn } from '@/lib/utils'

/**
 * House scroll reveal. One tuning, used everywhere, so the whole site moves
 * with a single rhythm rather than a different easing per section.
 *
 * The `reveal` class is load-bearing: the markup ships with inline
 * `opacity: 0`, and the fallback rules in globals.css use that class to force
 * content visible when scripting is unavailable. Do not drop it.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  /** Animate on mount rather than on scroll — for above-the-fold content. */
  immediate = false,
}: {
  children: ReactNode
  delay?: number
  className?: string
  immediate?: boolean
}) {
  const reduce = useReducedMotion()

  // Respect the user's motion preference: render plainly, no transform, no blur.
  if (reduce) return <div className={className}>{children}</div>

  return (
    <BlurFade
      inView={!immediate}
      direction="up"
      offset={12}
      blur="4px"
      duration={0.5}
      delay={delay}
      className={cn('reveal', className)}
    >
      {children}
    </BlurFade>
  )
}

/** Staggers a list of children by index. */
export function RevealStagger({
  children,
  step = 0.06,
  className,
}: {
  children: ReactNode[]
  step?: number
  className?: string
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  )
}
