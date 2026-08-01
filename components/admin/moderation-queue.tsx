'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import type { CommentStatus, PendingComment } from '@/lib/blog-types'
import { deleteCommentAction, moderateCommentAction } from '@/app/admin/actions'
import { ConfirmAction } from './confirm-action'
import { ACCENT, EmptyState, ErrorNote, StatusChip, stampTime } from './ui'

const MOVES: Record<CommentStatus, { to: CommentStatus; label: string }[]> = {
  pending: [
    { to: 'approved', label: 'Approve' },
    { to: 'rejected', label: 'Reject' },
    { to: 'spam', label: 'Mark spam' },
  ],
  approved: [
    { to: 'pending', label: 'Send back to queue' },
    { to: 'rejected', label: 'Reject' },
    { to: 'spam', label: 'Mark spam' },
  ],
  rejected: [
    { to: 'approved', label: 'Approve after all' },
    { to: 'pending', label: 'Send back to queue' },
  ],
  spam: [
    { to: 'pending', label: 'Not spam' },
    { to: 'approved', label: 'Approve' },
  ],
}

export function ModerationQueue({
  status,
  items,
}: {
  status: CommentStatus
  items: PendingComment[]
}) {
  const router = useRouter()
  const [list, setList] = useState(items)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // The server is the source of truth; the optimistic list only runs ahead of
  // it between the click and the refresh.
  useEffect(() => setList(items), [items])

  const removeThen = (id: string, run: () => Promise<{ ok: true } | { ok: false; error: string }>) => {
    const snapshot = list
    setError(null)
    setList((current) => current.filter((c) => c.id !== id))

    startTransition(async () => {
      const result = await run()
      if (result.ok) {
        router.refresh()
      } else {
        setList(snapshot)
        setError(result.error)
      }
    })
  }

  if (list.length === 0) {
    return (
      <EmptyState
        title={status === 'pending' ? 'The queue is clear' : `Nothing ${status}`}
      >
        {status === 'pending'
          ? 'Nothing is waiting on you. New comments appear here before anyone else can read them.'
          : 'Comments you move here will be listed, so a decision can always be undone.'}
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <ErrorNote>{error}</ErrorNote>}

      {list.map((comment) => (
        <article
          key={comment.id}
          className="border-2 border-ink/12 bg-paper"
          style={{ borderLeft: `4px solid ${ACCENT[status] ?? ACCENT.pending}` }}
        >
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/10 px-4 py-2.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-head text-base font-medium leading-none">
                {comment.authorName?.trim() || 'Anonymous'}
              </span>
              <StatusChip status={status} />
              {comment.parentId && (
                <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-ink/45">
                  Reply
                </span>
              )}
            </div>
            <time
              dateTime={comment.createdAt}
              className="font-body text-[11px] tabular-nums text-ink/45"
            >
              {stampTime(comment.createdAt)}
            </time>
          </header>

          <div className="px-4 py-3">
            <p className="font-body text-[11px] text-ink/50">
              On{' '}
              <Link
                href={`/blog/${comment.postSlug}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline underline-offset-2 hover:text-ember"
              >
                {comment.postTitle}
              </Link>
            </p>

            {comment.parentExcerpt && (
              <blockquote className="mt-2 border-l-2 border-ink/15 pl-3 font-body text-xs italic text-ink/50">
                {comment.parentExcerpt}
                {comment.parentExcerpt.length >= 160 && '…'}
              </blockquote>
            )}

            {/* Plain text, always. Comment bodies are never rendered as markup. */}
            <p className="mt-2 whitespace-pre-wrap break-words font-body text-sm leading-relaxed">
              {comment.body}
            </p>
          </div>

          <footer className="flex flex-wrap items-center gap-2 border-t border-ink/10 px-4 py-2.5">
            {MOVES[status].map((move) => (
              <button
                key={move.to}
                type="button"
                className="cursor-pointer border-2 bg-transparent px-3 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] leading-none transition-colors"
                style={{ borderColor: ACCENT[move.to], color: ACCENT[move.to] }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = ACCENT[move.to]
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = ACCENT[move.to]
                }}
                onClick={() =>
                  removeThen(comment.id, () => moderateCommentAction(comment.id, move.to))
                }
              >
                {move.label}
              </button>
            ))}

            <ConfirmAction
              className="ml-auto"
              label="Delete"
              confirmLabel="Delete comment"
              question="Delete permanently?"
              run={async () => {
                const result = await deleteCommentAction(comment.id)
                if (result.ok) {
                  setList((current) => current.filter((c) => c.id !== comment.id))
                  router.refresh()
                }
                return result
              }}
            />
          </footer>
        </article>
      ))}
    </div>
  )
}
