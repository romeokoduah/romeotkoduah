'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, TouchEvent as ReactTouchEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Photo } from '@/lib/blog-types'
import { formatDate } from '@/lib/blog-types'

/** Near-black rather than pure black — warm photography sits better on it. */
const BACKDROP = 'rgba(11, 13, 12, 0.97)'
const EASE = [0.25, 0.46, 0.45, 0.94] as const

/** Pixels of travel before a touch gesture counts. */
const SWIPE_X = 48
const SWIPE_DOWN = 96
/** Travel before the gesture commits to an axis, so a drift does not flip it. */
const AXIS_LOCK = 8

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Alt text from the record, then the caption, then decorative. Never a filename. */
export function describePhoto(photo: Photo): string {
  const alt = photo.alt?.trim()
  if (alt) return alt
  const caption = photo.caption?.trim()
  if (caption) return caption
  return ''
}

export function PhotoViewer({
  photos,
  index,
  albumTitle,
  accent,
  onNavigate,
  onClose,
}: {
  photos: Photo[]
  index: number
  albumTitle: string
  accent: string
  onNavigate: (next: number) => void
  onClose: () => void
}) {
  const total = photos.length
  const photo = photos[index]
  const reduce = useReducedMotion()

  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const [drag, setDrag] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const touchRef = useRef<{ x: number; y: number; axis: 'x' | 'y' | null } | null>(null)

  const go = useCallback(
    (delta: number) => onNavigate((index + delta + total) % total),
    [index, total, onNavigate],
  )

  /* ------------------------------------------------------------- keyboard -- */

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onClose()
          break
        case 'ArrowRight':
          event.preventDefault()
          go(1)
          break
        case 'ArrowLeft':
          event.preventDefault()
          go(-1)
          break
        case 'Home':
          event.preventDefault()
          onNavigate(0)
          break
        case 'End':
          event.preventDefault()
          onNavigate(total - 1)
          break
        case 'Tab': {
          // Trap: cycle within the overlay rather than escaping to the page
          // behind it, which is inert but still in the tab order.
          const panel = panelRef.current
          if (!panel) return
          const nodes = Array.from(
            panel.querySelectorAll<HTMLElement>(FOCUSABLE),
          ).filter((el) => el.offsetParent !== null || el === document.activeElement)
          if (nodes.length === 0) return

          const first = nodes[0]
          const last = nodes[nodes.length - 1]
          const active = document.activeElement

          if (event.shiftKey && (active === first || !panel.contains(active))) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
            event.preventDefault()
            first.focus()
          }
          break
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, onNavigate, onClose, total])

  /* --------------------------------------------------------- body scroll --- */

  // The viewer only exists while it is open, so this also covers an unmount
  // that happens without a close — the page can never be left unscrollable.
  useEffect(() => {
    const body = document.body
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const gutter = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (gutter > 0) body.style.paddingRight = `${gutter}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [])

  /* ------------------------------------------------------- initial focus --- */

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  /* ------------------------------------------------------------ preload ---- */

  // Both neighbours, so an arrow press in either direction is instant.
  useEffect(() => {
    if (total < 2) return
    const neighbours = [photos[(index + 1) % total], photos[(index - 1 + total) % total]]
    for (const neighbour of neighbours) {
      if (!neighbour) continue
      const image = new window.Image()
      image.decoding = 'async'
      image.src = neighbour.url
    }
  }, [index, photos, total])

  /* -------------------------------------------------------------- touch ---- */

  const onTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return
    const t = event.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY, axis: null }
    setDragging(true)
  }

  const onTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchRef.current
    if (!start || event.touches.length !== 1) return

    const t = event.touches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y

    if (!start.axis && (Math.abs(dx) > AXIS_LOCK || Math.abs(dy) > AXIS_LOCK)) {
      start.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }
    if (!start.axis || reduce) return

    // Downward only: an upward swipe should not lift the photograph away.
    setDrag(start.axis === 'x' ? { x: dx, y: 0 } : { x: 0, y: Math.max(0, dy) })
  }

  const settleTouch = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchRef.current
    touchRef.current = null
    setDragging(false)
    setDrag({ x: 0, y: 0 })
    if (!start) return

    const t = event.changedTouches[0]
    if (!t) return

    const dx = t.clientX - start.x
    const dy = t.clientY - start.y

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > SWIPE_X && total > 1) go(dx < 0 ? 1 : -1)
    } else if (dy > SWIPE_DOWN) {
      onClose()
    }
  }

  if (!photo) return null

  const alt = describePhoto(photo)
  const caption = photo.caption?.trim() ?? ''
  const taken = formatDate(photo.takenAt)

  const dragStyle: CSSProperties = {
    transform:
      dragging && (drag.x !== 0 || drag.y !== 0)
        ? `translate3d(${drag.x * 0.5}px, ${drag.y}px, 0)`
        : undefined,
    opacity: drag.y > 0 ? Math.max(0.35, 1 - drag.y / 500) : undefined,
    transition: dragging
      ? 'none'
      : 'transform 0.25s var(--ease-quad), opacity 0.25s var(--ease-quad)',
  }

  const arrowClass =
    'pointer-events-auto flex h-12 w-12 items-center justify-center border-2 border-soft/45 bg-transparent font-body text-lg leading-none text-soft opacity-0 transition-[opacity,background-color,color] duration-150 hover:bg-soft hover:text-ink focus-visible:opacity-100 group-hover/viewer:opacity-100 [@media(hover:none)]:opacity-100'

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${albumTitle} — photograph viewer`}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={settleTouch}
      onTouchCancel={settleTouch}
      style={{ backgroundColor: BACKDROP, touchAction: 'none' }}
      className="group/viewer fixed inset-x-0 top-0 z-[90] flex h-[100svh] flex-col"
    >
      {/* ------------------------------- top bar ------------------------------ */}
      <div
        className="flex shrink-0 items-center justify-between gap-4 px-s20 py-4"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="min-w-0 truncate font-body text-[11px] font-bold uppercase tracking-[0.18em] text-soft/50">
          {albumTitle}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
          className="shrink-0 border-2 border-soft/50 px-4 py-2 font-body text-sm font-bold text-soft transition-colors duration-150 hover:bg-soft hover:text-ink"
        >
          Close
        </button>
      </div>

      {/* ------------------------------- picture ------------------------------ */}
      <div className="relative min-h-0 flex-1">
        {/* Absolutely filled rather than a flex child, so `max-h-full` on the
            image has a definite height to resolve against and the photograph
            can never spill past the viewport. */}
        <div
          style={dragStyle}
          className={`absolute inset-0 flex items-center justify-center ${
            total > 1 ? 'px-14 sm:px-20' : 'px-s20'
          }`}
        >
          <motion.img
            key={photo.id}
            src={photo.url}
            alt={alt}
            width={photo.width || undefined}
            height={photo.height || undefined}
            decoding="async"
            initial={reduce ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
            style={{ backgroundColor: photo.tone || undefined }}
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />
        </div>

        {total > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-2 sm:px-4">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                go(-1)
              }}
              aria-label="Previous photograph"
              className={arrowClass}
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                go(1)
              }}
              aria-label="Next photograph"
              className={arrowClass}
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* ------------------------------ caption bar --------------------------- */}
      <div
        className="shrink-0 px-s20 pb-5 pt-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="mx-auto flex max-w-(--container-wide) items-baseline justify-between gap-6 border-t pt-3"
          style={{ borderColor: 'rgba(248, 246, 246, 0.16)' }}
        >
          <p className="min-h-[1.25rem] min-w-0 font-body text-sm leading-snug text-soft/80">
            {caption}
            {caption && taken ? <span className="text-soft/40"> · </span> : null}
            {taken ? <span className="text-soft/45">{taken}</span> : null}
          </p>
          <p
            aria-live="polite"
            className="shrink-0 font-head text-sm tabular-nums"
            style={{ color: accent }}
          >
            {index + 1} / {total}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
