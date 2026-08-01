'use client'

import { useEffect, useId, useRef, useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { submitComment } from '@/app/blog/actions'
import { LIMITS } from '@/lib/blog-types'
import { cn } from '@/lib/utils'

export interface CommentDraft {
  authorName: string | null
  body: string
  parentId: string | null
}

/**
 * The comment form, used both at the foot of a post and inline under a
 * comment as a reply.
 *
 * Two quiet defences live here. The `website` field is a honeypot: off-screen
 * rather than `display: none`, because a headless browser evaluating styles
 * will skip a hidden field but happily fill an off-screen one, and screen
 * readers are kept out with `aria-hidden` and `tabIndex={-1}`. The `startedAt`
 * field is stamped on mount, so the server can tell a reader who typed from a
 * script that posted the instant the page parsed. Both are checked on the
 * server and both fail silently there.
 */
export function CommentForm({
  postId,
  parentId = null,
  onSubmitted,
  onCancel,
  autoFocus = false,
  compact = false,
}: {
  postId: string
  parentId?: string | null
  onSubmitted: (draft: CommentDraft) => void
  onCancel?: () => void
  autoFocus?: boolean
  compact?: boolean
}) {
  const uid = useId()
  const nameId = `${uid}-name`
  const bodyId = `${uid}-body`
  const countId = `${uid}-count`

  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [startedAt, setStartedAt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  // Stamped after hydration so the value is never baked into a cached HTML
  // response, which would hand every later reader the same "instant".
  useEffect(() => {
    setStartedAt(String(Date.now()))
  }, [])

  useEffect(() => {
    if (autoFocus) bodyRef.current?.focus()
  }, [autoFocus])

  const trimmed = body.trim()
  const tooLong = body.length > LIMITS.commentBody
  const tooShort = trimmed.length < LIMITS.commentMin
  const remaining = LIMITS.commentBody - body.length

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || tooShort || tooLong) return

    // Captured now: `currentTarget` is null by the time the action resolves.
    const formData = new FormData(event.currentTarget)
    setError(null)

    startTransition(async () => {
      const result = await submitComment(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      onSubmitted({
        authorName: name.trim().length > 0 ? name.trim() : null,
        body: trimmed,
        parentId,
      })
      setName('')
      setBody('')
      setStartedAt(String(Date.now()))
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative border-2 border-ink/12 bg-paper',
        compact ? 'p-5' : 'p-6 sm:p-8',
      )}
    >
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="parentId" value={parentId ?? ''} />
      <input type="hidden" name="startedAt" value={startedAt} />

      {/* Honeypot — off-screen, never announced, never focusable. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden opacity-0"
      >
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-5">
        <div>
          <label
            htmlFor={nameId}
            className="block font-body text-xs font-bold uppercase tracking-[0.16em] text-ink/60"
          >
            Name <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id={nameId}
            name="authorName"
            type="text"
            value={name}
            maxLength={LIMITS.authorName}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Leave blank to post as Anonymous"
            className="mt-2 w-full border-2 border-ink/15 bg-paper px-4 py-3 font-body text-[15px] leading-normal text-ink outline-none transition-colors duration-150 placeholder:text-ink/40 focus:border-indigo"
          />
        </div>

        <div>
          <label
            htmlFor={bodyId}
            className="block font-body text-xs font-bold uppercase tracking-[0.16em] text-ink/60"
          >
            {parentId ? 'Your reply' : 'Your comment'}
          </label>
          <textarea
            id={bodyId}
            name="body"
            ref={bodyRef}
            value={body}
            rows={compact ? 4 : 6}
            aria-describedby={countId}
            aria-invalid={tooLong || undefined}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Plain text — links are counted, markdown is not rendered."
            className="mt-2 w-full resize-y border-2 border-ink/15 bg-paper px-4 py-3 font-body text-[15px] leading-[1.7] text-ink outline-none transition-colors duration-150 placeholder:text-ink/40 focus:border-indigo"
          />
          <p
            id={countId}
            className={cn(
              'mt-2 text-right font-body text-[13px] tabular-nums',
              tooLong ? 'font-bold text-ember' : 'text-ink/50',
            )}
          >
            {tooLong
              ? `${Math.abs(remaining)} characters over the limit`
              : `${body.length} / ${LIMITS.commentBody}`}
          </p>
        </div>
      </div>

      {error ? (
        <p
          role="status"
          className="mt-1 border-l-4 border-ember bg-soft px-4 py-3 font-body text-[14px] leading-snug text-ember"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy || tooShort || tooLong}
          className="btn disabled:cursor-not-allowed disabled:opacity-45"
          style={{ backgroundColor: 'var(--color-indigo)' }}
        >
          <span>{busy ? 'Posting…' : parentId ? 'Post reply' : 'Post comment'}</span>
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="font-body text-sm font-bold text-ink/60 underline underline-offset-4 transition-colors duration-150 hover:text-ink"
          >
            Cancel
          </button>
        ) : null}

        <p className="font-body text-[13px] leading-snug text-ink/55">
          Comments are read before they appear.
        </p>
      </div>
    </form>
  )
}
