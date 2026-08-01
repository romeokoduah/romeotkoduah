'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Photo } from '@/lib/blog-types'
import {
  deletePhotoAction,
  movePhotoAction,
  setAlbumCoverAction,
  updatePhotoAction,
} from '@/app/admin/actions'
import { ConfirmAction } from './confirm-action'
import { ACCEPTED_TYPES, rejectionReason, uploadPhoto } from './upload'
import { BTN, EmptyState, ErrorNote, INPUT, PANEL, StatusChip } from './ui'

/* ========================================================================== */
/* Upload zone                                                                */
/* ========================================================================== */

interface Job {
  key: string
  name: string
  percent: number
  error?: string
}

function UploadZone({
  albumId,
  onUploaded,
}: {
  albumId: string
  onUploaded: (photo: Photo) => void
}) {
  const [over, setOver] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [running, setRunning] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const depth = useRef(0)

  const enqueue = async (files: File[]) => {
    if (files.length === 0) return

    const queued: Job[] = files.map((file, i) => ({
      key: `${Date.now()}-${i}-${file.name}`,
      name: file.name,
      percent: 0,
    }))
    setJobs((current) => [...current, ...queued])
    setRunning(true)

    // One at a time: resizing is CPU-bound on the server, and a serial queue
    // gives an honest progress bar instead of six that all stall together.
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const key = queued[i].key

      const reason = rejectionReason(file)
      if (reason) {
        setJobs((c) => c.map((j) => (j.key === key ? { ...j, error: reason } : j)))
        continue
      }

      try {
        const photo = await uploadPhoto(file, {
          albumId,
          onProgress: (percent) =>
            setJobs((c) => c.map((j) => (j.key === key ? { ...j, percent } : j))),
        })
        onUploaded(photo)
        setJobs((c) => c.filter((j) => j.key !== key))
      } catch (e) {
        setJobs((c) =>
          c.map((j) =>
            j.key === key
              ? { ...j, error: e instanceof Error ? e.message : 'Upload failed.' }
              : j,
          ),
        )
      }
    }

    setRunning(false)
  }

  const failures = jobs.filter((j) => j.error)
  const active = jobs.filter((j) => !j.error)

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragEnter={(e) => {
          e.preventDefault()
          depth.current += 1
          setOver(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault()
          depth.current -= 1
          if (depth.current <= 0) {
            depth.current = 0
            setOver(false)
          }
        }}
        onDrop={(e) => {
          e.preventDefault()
          depth.current = 0
          setOver(false)
          void enqueue(Array.from(e.dataTransfer.files))
        }}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          over ? 'border-rust bg-rust/5' : 'border-ink/20 bg-paper'
        }`}
      >
        <p className="font-head text-lg font-medium uppercase leading-none tracking-[0.06em] text-ink/70">
          {over ? 'Drop to upload' : 'Drag photos here'}
        </p>
        <p className="font-body text-xs text-ink/45">
          JPEG, PNG, WebP or AVIF · up to 15 MB each · resized to a 2000px display copy and a
          600px thumbnail
        </p>
        <button type="button" className={BTN} onClick={() => input.current?.click()}>
          Choose files
        </button>
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? [])
            e.target.value = ''
            void enqueue(files)
          }}
        />
      </div>

      {active.length > 0 && (
        <ul className={`${PANEL} divide-y divide-ink/10`}>
          {active.map((job) => (
            <li key={job.key} className="flex items-center gap-3 px-4 py-2.5">
              <span className="min-w-0 flex-1 truncate font-body text-xs">{job.name}</span>
              <span className="h-1.5 w-40 shrink-0 bg-ink/10">
                <span
                  className="block h-full bg-forest transition-[width] duration-150"
                  style={{ width: `${job.percent}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-head text-xs tabular-nums text-ink/60">
                {job.percent}%
              </span>
            </li>
          ))}
        </ul>
      )}

      {running && active.length === 0 && (
        <p className="font-body text-xs text-ink/50">Processing…</p>
      )}

      {failures.map((job) => (
        <div key={job.key} className="flex items-center gap-3">
          <ErrorNote>{job.error}</ErrorNote>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-body text-xs font-semibold text-ink/50 underline underline-offset-4 hover:text-ink"
            onClick={() => setJobs((c) => c.filter((j) => j.key !== job.key))}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}

/* ========================================================================== */
/* One photo                                                                  */
/* ========================================================================== */

function PhotoCard({
  albumId,
  photo,
  isCover,
  first,
  last,
  onChanged,
  onRemoved,
  onCover,
}: {
  albumId: string
  photo: Photo
  isCover: boolean
  first: boolean
  last: boolean
  onChanged: (photo: Photo) => void
  onRemoved: () => void
  onCover: () => void
}) {
  const router = useRouter()
  const [caption, setCaption] = useState(photo.caption)
  const [alt, setAlt] = useState(photo.alt)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  useEffect(() => {
    setCaption(photo.caption)
    setAlt(photo.alt)
  }, [photo.caption, photo.alt])

  const commit = () => {
    if (caption === photo.caption && alt === photo.alt) return
    startTransition(async () => {
      setError(null)
      const result = await updatePhotoAction({ id: photo.id, caption, alt })
      if (result.ok) {
        onChanged({ ...photo, caption, alt })
        setSaved(true)
        window.setTimeout(() => setSaved(false), 1600)
      } else {
        setError(result.error)
      }
    })
  }

  const move = (direction: 'up' | 'down') =>
    startTransition(async () => {
      setError(null)
      const result = await movePhotoAction(albumId, photo.id, direction)
      if (result.ok) router.refresh()
      else setError(result.error)
    })

  return (
    <li className="flex flex-col border-2 border-ink/12 bg-paper">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-ink/12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.thumbUrl}
          alt={photo.alt || photo.caption || 'Uploaded photo'}
          className="h-full w-full object-cover"
          style={{ backgroundColor: photo.tone }}
          loading="lazy"
        />
        {isCover && (
          <span className="absolute left-2 top-2">
            <StatusChip status="approved">Cover</StatusChip>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <input
          value={caption}
          placeholder="Caption"
          aria-label="Caption"
          className={`${INPUT} text-xs`}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={commit}
        />
        <input
          value={alt}
          placeholder="Alt text — what the photo shows"
          aria-label="Alt text"
          className={`${INPUT} text-xs`}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={commit}
        />

        <p className="font-body text-[10px] uppercase tracking-[0.12em] text-ink/40">
          {photo.width}×{photo.height}
          {busy && ' · saving'}
          {saved && ' · saved'}
          {!alt.trim() && ' · needs alt text'}
        </p>

        {error && <ErrorNote>{error}</ErrorNote>}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2">
          <button
            type="button"
            disabled={busy || isCover}
            className="cursor-pointer border-0 bg-transparent p-0 font-body text-[11px] font-semibold text-ink/60 underline underline-offset-4 hover:text-ink disabled:cursor-default disabled:no-underline disabled:opacity-40"
            onClick={() =>
              startTransition(async () => {
                setError(null)
                const result = await setAlbumCoverAction(albumId, photo.id)
                if (result.ok) {
                  onCover()
                  router.refresh()
                } else {
                  setError(result.error)
                }
              })
            }
          >
            {isCover ? 'Album cover' : 'Set as cover'}
          </button>

          <span className="ml-auto flex items-center gap-1">
            <button
              type="button"
              aria-label="Move earlier"
              disabled={busy || first}
              className="cursor-pointer border-2 border-ink/15 bg-transparent px-2 py-1 font-head text-xs leading-none transition-colors hover:border-ink disabled:opacity-30"
              onClick={() => move('up')}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Move later"
              disabled={busy || last}
              className="cursor-pointer border-2 border-ink/15 bg-transparent px-2 py-1 font-head text-xs leading-none transition-colors hover:border-ink disabled:opacity-30"
              onClick={() => move('down')}
            >
              ↓
            </button>
          </span>
        </div>

        <ConfirmAction
          label="Delete"
          confirmLabel="Delete photo"
          question="Delete this photo?"
          run={async () => {
            const result = await deletePhotoAction(albumId, photo.id)
            if (result.ok) {
              onRemoved()
              router.refresh()
            }
            return result
          }}
        />
      </div>
    </li>
  )
}

/* ========================================================================== */
/* The album workspace                                                        */
/* ========================================================================== */

export function AlbumPhotos({
  albumId,
  photos: incoming,
  coverPhotoId,
}: {
  albumId: string
  photos: Photo[]
  coverPhotoId: string | null
}) {
  const [photos, setPhotos] = useState(incoming)
  const [cover, setCover] = useState(coverPhotoId)

  useEffect(() => setPhotos(incoming), [incoming])
  useEffect(() => setCover(coverPhotoId), [coverPhotoId])

  return (
    <div className="flex flex-col gap-5">
      <UploadZone
        albumId={albumId}
        onUploaded={(photo) => setPhotos((current) => [...current, photo])}
      />

      {photos.length === 0 ? (
        <EmptyState title="No photos in this album">
          Drop files above, or use the picker. Each upload becomes a 2000px display copy and a
          600px thumbnail, both WebP.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              albumId={albumId}
              photo={photo}
              isCover={cover === photo.id}
              first={index === 0}
              last={index === photos.length - 1}
              onChanged={(next) =>
                setPhotos((current) => current.map((p) => (p.id === next.id ? next : p)))
              }
              onRemoved={() =>
                setPhotos((current) => current.filter((p) => p.id !== photo.id))
              }
              onCover={() => setCover(photo.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
