'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence } from 'motion/react'
import type { Photo } from '@/lib/blog-types'
import { PhotoViewer, describePhoto } from './photo-viewer'

/**
 * Sum of aspect ratios a row aims for before it is closed. At the 1200px
 * measure this lands rows around 350px tall — three landscape frames, or five
 * portraits — which is a comfortable reading rhythm for photographs.
 */
const TARGET_ROW_AR = 3.4

/** Panoramas and extreme portraits are clamped so one frame cannot own a row. */
const MIN_AR = 0.5
const MAX_AR = 3

type Tile = { photo: Photo; index: number; ar: number }
type Row = { tiles: Tile[]; ar: number }

/**
 * Greedy row packing. Rows are rendered as flex containers whose children take
 * `flex-grow` proportional to their aspect ratio over a zero basis — which
 * makes every frame in a row resolve to the same height at any container
 * width, so the layout justifies itself in CSS with no measurement and no
 * reflow. Nothing is cropped: each tile carries the photograph's true ratio.
 */
function packRows(photos: Photo[]): Row[] {
  const rows: Row[] = []
  let tiles: Tile[] = []
  let ar = 0

  photos.forEach((photo, index) => {
    const raw = photo.width > 0 && photo.height > 0 ? photo.width / photo.height : 1.5
    const clamped = Math.min(Math.max(raw, MIN_AR), MAX_AR)
    tiles.push({ photo, index, ar: clamped })
    ar += clamped

    if (ar >= TARGET_ROW_AR) {
      rows.push({ tiles, ar })
      tiles = []
      ar = 0
    }
  })

  if (tiles.length > 0) rows.push({ tiles, ar })
  return rows
}

export function PhotoGrid({
  photos,
  albumTitle,
  accent,
}: {
  photos: Photo[]
  albumTitle: string
  accent: string
}) {
  const [index, setIndex] = useState<number | null>(null)

  const tileRefs = useRef<(HTMLButtonElement | null)[]>([])
  /** The tile the viewer was opened from, so focus can go back to it. */
  const openerRef = useRef<number | null>(null)
  const urlSynced = useRef(false)
  const restorePending = useRef(false)

  const open = useCallback((i: number) => {
    openerRef.current = i
    setIndex(i)
  }, [])

  const close = useCallback(() => {
    restorePending.current = true
    setIndex(null)
  }, [])

  /* ---------------------------------------------------------- deep link ---- */

  // A shared `?photo=<id>` link lands on that photograph rather than the grid.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('photo')
    if (!id) return
    const found = photos.findIndex((p) => p.id === id)
    if (found < 0) return
    openerRef.current = found
    setIndex(found)
  }, [photos])

  // Reflected with replaceState, never router.push: pushing would re-run the
  // server component on every arrow press.
  useEffect(() => {
    if (!urlSynced.current) {
      urlSynced.current = true
      return
    }
    const url = new URL(window.location.href)
    if (index === null) url.searchParams.delete('photo')
    else url.searchParams.set('photo', photos[index].id)
    window.history.replaceState(window.history.state, '', url)
  }, [index, photos])

  /* ------------------------------------------------------ focus restore ---- */

  useEffect(() => {
    if (index !== null || !restorePending.current) return
    restorePending.current = false
    const tile = tileRefs.current[openerRef.current ?? 0]
    if (!tile) return
    tile.focus({ preventScroll: true })
    tile.scrollIntoView({ block: 'nearest', behavior: 'auto' })
  }, [index])

  if (photos.length === 0) return null

  const rows = packRows(photos)
  const total = photos.length

  return (
    <>
      <div className="flex flex-col gap-2 sm:gap-3">
        {rows.map((row, r) => {
          const isLast = r === rows.length - 1
          const slack = isLast ? TARGET_ROW_AR - row.ar : 0

          return (
            /* Below `sm` the row is a plain block: the flex values below are
               inert and every frame stacks full width at its own ratio. */
            <div key={r} className="block sm:flex sm:gap-3">
              {row.tiles.map(({ photo, index: i, ar }) => (
                <button
                  key={photo.id}
                  ref={(el) => {
                    tileRefs.current[i] = el
                  }}
                  type="button"
                  onClick={() => open(i)}
                  style={
                    {
                      flexGrow: ar,
                      flexBasis: 0,
                      aspectRatio: `${photo.width || 3} / ${photo.height || 2}`,
                      // The stored average colour, so each frame resolves from a
                      // matching tone rather than flashing white.
                      backgroundColor: photo.tone || 'var(--color-soft)',
                    } as CSSProperties
                  }
                  className="group relative mb-2 block w-full min-w-0 cursor-pointer overflow-hidden last:mb-0 sm:mb-0 sm:w-auto"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumbUrl}
                    alt={describePhoto(photo)}
                    width={photo.width || undefined}
                    height={photo.height || undefined}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                  />
                  <span className="sr-only">
                    Open photograph {i + 1} of {total}
                  </span>
                </button>
              ))}

              {/* Keeps the final row the same height as the rest instead of
                  blowing two frames up to fill the width. */}
              {slack > 0.05 ? (
                <div
                  aria-hidden
                  className="hidden sm:block"
                  style={{ flexGrow: slack, flexBasis: 0 }}
                />
              ) : null}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {index !== null ? (
          <PhotoViewer
            photos={photos}
            index={index}
            albumTitle={albumTitle}
            accent={accent}
            onNavigate={setIndex}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
