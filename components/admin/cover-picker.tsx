'use client'

import { useRef, useState, useTransition } from 'react'
import type { Photo } from '@/lib/blog-types'
import { ACCEPTED_TYPES, rejectionReason, uploadPhoto } from './upload'
import { BTN_GHOST, ErrorNote, INPUT, PANEL } from './ui'

/**
 * The cover image, chosen three ways: paste a URL, pick something already in
 * the gallery, or upload a new file. Uploads land unfiled so they do not
 * quietly appear in an album nobody meant to change.
 */
export function CoverPicker({
  value,
  photos,
  onChange,
}: {
  value: string
  photos: Photo[]
  onChange: (url: string) => void
}) {
  const [browsing, setBrowsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [, startTransition] = useTransition()
  const fileInput = useRef<HTMLInputElement>(null)

  const upload = (file: File) => {
    const bad = rejectionReason(file)
    if (bad) {
      setError(bad)
      return
    }
    setError(null)
    setProgress(0)
    startTransition(async () => {
      try {
        const photo = await uploadPhoto(file, { onProgress: setProgress })
        onChange(photo.url)
        setBrowsing(false)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed.')
      } finally {
        setProgress(null)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={value}
          placeholder="/media/… or https://…"
          aria-label="Cover image URL"
          className={`${INPUT} flex-1 min-w-[220px]`}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className={BTN_GHOST} onClick={() => setBrowsing((b) => !b)}>
          {browsing ? 'Close' : 'Choose from gallery'}
        </button>
        <button
          type="button"
          className={BTN_GHOST}
          disabled={progress !== null}
          onClick={() => fileInput.current?.click()}
        >
          {progress === null ? 'Upload' : `${progress}%`}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) upload(file)
          }}
        />
        {value && (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-body text-xs font-semibold text-ink/50 underline underline-offset-4 hover:text-rust"
            onClick={() => onChange('')}
          >
            Remove
          </button>
        )}
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      {value && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={value}
          alt=""
          className="h-32 w-full border-2 border-ink/12 object-cover"
        />
      )}

      {browsing && (
        <div className={`${PANEL} max-h-[280px] overflow-y-auto p-2`}>
          {photos.length === 0 ? (
            <p className="p-3 font-body text-xs text-ink/50">
              Nothing in the gallery yet. Upload a file instead, or add photos under Gallery.
            </p>
          ) : (
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {photos.map((photo) => (
                <li key={photo.id}>
                  <button
                    type="button"
                    className="block w-full cursor-pointer border-2 border-transparent p-0 transition-colors hover:border-rust focus-visible:border-rust"
                    onClick={() => {
                      onChange(photo.url)
                      setBrowsing(false)
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.thumbUrl}
                      alt={photo.alt || photo.caption || 'Gallery photo'}
                      className="aspect-square w-full object-cover"
                      style={{ backgroundColor: photo.tone }}
                      loading="lazy"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
