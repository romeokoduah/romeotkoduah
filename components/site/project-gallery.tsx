'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * Detail-page photo gallery. Thumbnails open a dependency-free lightbox:
 * Escape closes, arrow keys move, Tab is trapped on the close button, the
 * backdrop is clickable, and body scroll is locked while it is up.
 */
export function ProjectGallery({
  images,
  title,
  accent,
}: {
  images: readonly string[]
  title: string
  accent: string
}) {
  const [index, setIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()

  const isOpen = index !== null

  const close = useCallback(() => setIndex(null), [])

  const step = useCallback(
    (delta: number) =>
      setIndex((i) =>
        i === null ? i : (i + delta + images.length) % images.length,
      ),
    [images.length],
  )

  useEffect(() => {
    if (!isOpen) return

    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          close()
          break
        case 'ArrowRight':
          event.preventDefault()
          step(1)
          break
        case 'ArrowLeft':
          event.preventDefault()
          step(-1)
          break
        case 'Tab':
          // focus stays inside the overlay, on its only control
          event.preventDefault()
          closeRef.current?.focus()
          break
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close, step])

  useEffect(() => {
    if (!isOpen) return

    returnRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      returnRef.current?.focus()
    }
  }, [isOpen])

  if (images.length === 0) return null

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-4/3 w-full overflow-hidden border-2 bg-soft"
              style={{ borderColor: accent }}
              aria-label={`Open image ${i + 1} of ${images.length}`}
            >
              <Image
                src={src}
                alt={`${title} — image ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — image ${index + 1} of ${images.length}`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={close}
            className="fixed inset-0 z-[80] flex flex-col bg-ink/95 px-s20 py-s20"
          >
            <div className="flex items-center justify-between gap-6">
              <p className="font-body text-sm font-bold text-soft/70 tabular-nums">
                {index + 1} / {images.length}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  close()
                }}
                className="border-2 border-soft px-4 py-2 font-body text-sm font-bold text-soft"
              >
                Close
              </button>
            </div>

            <div
              className="relative mt-4 flex-1"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[index]}
                alt={`${title} — image ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {images.length > 1 ? (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    step(-1)
                  }}
                  className="border-2 border-soft/60 px-4 py-2 font-body text-sm font-bold text-soft"
                  aria-label="Previous image"
                >
                  <span aria-hidden>←</span> Previous
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    step(1)
                  }}
                  className="border-2 border-soft/60 px-4 py-2 font-body text-sm font-bold text-soft"
                  aria-label="Next image"
                >
                  Next <span aria-hidden>→</span>
                </button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
