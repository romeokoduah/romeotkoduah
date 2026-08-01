'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createPostAction } from '@/app/admin/actions'
import { BTN, BTN_GHOST, ErrorNote, INPUT } from './ui'

/**
 * Creating a post is one field: a title. Everything else is edited afterwards,
 * so there is no form to abandon halfway.
 */
export function NewPost() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  if (!open) {
    return (
      <button type="button" className={BTN} onClick={() => setOpen(true)}>
        New post
      </button>
    )
  }

  const submit = () => {
    if (!title.trim() || busy) return
    setError(null)
    startTransition(async () => {
      const data = new FormData()
      data.set('title', title)
      const result = await createPostAction(data)
      if (result.ok) {
        router.push(`/admin/posts/${result.id}`)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={title}
          placeholder="Working title"
          aria-label="Working title for the new post"
          className={`${INPUT} w-[280px]`}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
            if (e.key === 'Escape') setOpen(false)
          }}
        />
        <button type="button" className={BTN} disabled={busy || !title.trim()} onClick={submit}>
          {busy ? 'Creating…' : 'Create draft'}
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
      {error && <ErrorNote>{error}</ErrorNote>}
    </div>
  )
}
