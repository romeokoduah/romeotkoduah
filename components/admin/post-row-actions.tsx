'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deletePostAction, setPostStatusAction } from '@/app/admin/actions'
import type { PostStatus } from '@/lib/blog-types'
import { ConfirmAction } from './confirm-action'
import { BTN_QUIET } from './ui'

export function PostRowActions({
  id,
  slug,
  status,
}: {
  id: string
  slug: string
  status: PostStatus
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  const toggle = () =>
    startTransition(async () => {
      setError(null)
      const next: PostStatus = status === 'published' ? 'draft' : 'published'
      const result = await setPostStatusAction(id, next)
      if (result.ok) router.refresh()
      else setError(result.error)
    })

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
      {status === 'published' && (
        <a
          href={`/blog/${slug}`}
          target="_blank"
          rel="noreferrer"
          className={BTN_QUIET}
        >
          View
        </a>
      )}
      <button type="button" className={BTN_QUIET} disabled={busy} onClick={toggle}>
        {busy ? 'Working…' : status === 'published' ? 'Unpublish' : 'Publish'}
      </button>
      <ConfirmAction
        label="Delete"
        confirmLabel="Delete post"
        question="Delete permanently?"
        run={() => deletePostAction(id)}
        onDone={() => router.refresh()}
      />
      {error && (
        <span role="alert" className="font-body text-[11px] font-semibold text-rust">
          {error}
        </span>
      )}
    </div>
  )
}
