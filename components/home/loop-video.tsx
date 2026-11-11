'use client'

import { useEffect, useRef } from 'react'

/**
 * A muted loop that only downloads and plays while it is on screen. Shows its
 * poster frame otherwise, and never plays for reduced-motion visitors.
 */
export function LoopVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string
  poster: string
  label: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // The film is heavy: on small screens and data-saver connections the
    // poster frame stands in for it.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (window.innerWidth < 768 || conn?.saveData) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  )
}
