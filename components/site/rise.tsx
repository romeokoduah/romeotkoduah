'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * The entrance for the parts of every section. Any element carrying
 * `data-rise` (optionally with `style={{ '--i': n }}` for its place in the
 * stagger) rises into place once, the first time it enters the viewport.
 *
 * Content is never hostage to this: without script the CSS fallback in
 * globals.css shows everything, and reduced-motion users get no travel.
 */
export function Rise() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-rise]:not(.is-in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
