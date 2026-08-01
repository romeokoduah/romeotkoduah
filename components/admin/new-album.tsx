'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createAlbumAction } from '@/app/admin/actions'
import { BTN, BTN_GHOST, ErrorNote, Field, INPUT, PANEL, TEXTAREA } from './ui'

export function NewAlbum() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  if (!open) {
    return (
      <button type="button" className={BTN} onClick={() => setOpen(true)}>
        New album
      </button>
    )
  }

  return (
    <form
      className={`${PANEL} flex w-full flex-col gap-3 p-4 sm:w-[420px]`}
      action={(formData) => {
        setError(null)
        startTransition(async () => {
          const result = await createAlbumAction(formData)
          if (result.ok) {
            setOpen(false)
            router.push(`/admin/gallery/${result.id}`)
          } else {
            setError(result.error)
          }
        })
      }}
    >
      <Field label="Title" htmlFor="album-title">
        <input id="album-title" name="title" required autoFocus className={INPUT} />
      </Field>
      <Field label="Description" htmlFor="album-description">
        <textarea id="album-description" name="description" rows={2} className={TEXTAREA} />
      </Field>
      {error && <ErrorNote>{error}</ErrorNote>}
      <div className="flex items-center gap-2">
        <button type="submit" className={BTN} disabled={busy}>
          {busy ? 'Creating…' : 'Create album'}
        </button>
        <button
          type="button"
          className={BTN_GHOST}
          disabled={busy}
          onClick={() => {
            setOpen(false)
            setError(null)
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
