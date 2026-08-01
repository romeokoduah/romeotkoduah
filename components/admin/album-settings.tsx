'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateAlbumAction } from '@/app/admin/actions'
import { BTN_GHOST, ErrorNote, Field, INPUT, OkNote, Panel, TEXTAREA } from './ui'

export function AlbumSettings({
  id,
  title: initialTitle,
  description: initialDescription,
}: {
  id: string
  title: string
  description: string
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  const dirty = title !== initialTitle || description !== initialDescription

  return (
    <Panel title="Album details">
      <div className="flex flex-col gap-3">
        <Field label="Title" htmlFor="album-title">
          <input
            id="album-title"
            value={title}
            className={INPUT}
            onChange={(e) => {
              setTitle(e.target.value)
              setNote(null)
            }}
          />
        </Field>
        <Field
          label="Description"
          htmlFor="album-description"
          hint="Shown under the album title on the public page."
        >
          <textarea
            id="album-description"
            rows={3}
            value={description}
            className={TEXTAREA}
            onChange={(e) => {
              setDescription(e.target.value)
              setNote(null)
            }}
          />
        </Field>

        {error && <ErrorNote>{error}</ErrorNote>}
        {note && <OkNote>{note}</OkNote>}

        <div>
          <button
            type="button"
            className={BTN_GHOST}
            disabled={busy || !dirty}
            onClick={() =>
              startTransition(async () => {
                setError(null)
                setNote(null)
                const result = await updateAlbumAction(id, { title, description })
                if (result.ok) {
                  setNote('Saved.')
                  router.refresh()
                } else {
                  setError(result.error)
                }
              })
            }
          >
            {busy ? 'Saving…' : dirty ? 'Save details' : 'Saved'}
          </button>
        </div>
      </div>
    </Panel>
  )
}
