'use client'

import { useState, useTransition } from 'react'
import { toggleLikeAction } from '@/app/(site)/blog/actions'
import { cn } from '@/lib/utils'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className="h-[18px] w-[18px] shrink-0"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    >
      <path d="M12 20.5 3.9 12.6a4.8 4.8 0 0 1 0-6.9 5 5 0 0 1 7 0l1.1 1.1 1.1-1.1a5 5 0 0 1 7 0 4.8 4.8 0 0 1 0 6.9Z" />
    </svg>
  )
}

/**
 * A like on a post or a comment. Optimistic by design: the count moves the
 * instant it is pressed and reconciles with whatever the server says, so a
 * slow round trip never reads as a dead button. A rejection puts the previous
 * state back and says why.
 *
 * `aria-pressed` carries the state; the visible count is not the whole story
 * for a screen reader, so the accessible name spells the action out.
 */
export function LikeButton({
  targetType,
  targetId,
  initialCount,
  initialLiked,
  subject = targetType === 'post' ? 'this post' : 'this comment',
  layout = 'row',
  className,
}: {
  targetType: 'post' | 'comment'
  targetId: string
  initialCount: number
  initialLiked: boolean
  /** Completes "Like …" in the accessible name. */
  subject?: string
  layout?: 'row' | 'stack'
  className?: string
}) {
  const [state, setState] = useState({ count: initialCount, liked: initialLiked })
  const [error, setError] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  function onClick() {
    if (busy) return
    const previous = state
    setError(null)
    setState({
      count: Math.max(0, previous.count + (previous.liked ? -1 : 1)),
      liked: !previous.liked,
    })

    startTransition(async () => {
      const result = await toggleLikeAction(targetType, targetId)
      if (result.ok) {
        setState({ count: result.count, liked: result.liked })
      } else {
        setState(previous)
        setError(result.error)
      }
    })
  }

  return (
    <div className={cn(layout === 'stack' ? 'flex flex-col items-center' : '', className)}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={state.liked}
        className={cn(
          'inline-flex items-center justify-center gap-2 border-2 border-indigo font-body text-sm font-bold leading-none transition-colors duration-150',
          layout === 'stack' ? 'flex-col gap-1.5 px-3 py-3' : 'px-4 py-2.5',
          state.liked
            ? 'bg-indigo text-paper'
            : 'bg-transparent text-indigo hover:bg-indigo hover:text-paper',
          busy && 'opacity-70',
        )}
      >
        <HeartIcon filled={state.liked} />
        <span className="tabular-nums">{state.count}</span>
        <span className="sr-only">
          {state.liked ? `Unlike ${subject}` : `Like ${subject}`}
        </span>
      </button>

      {error ? (
        <p
          role="status"
          className={cn(
            'font-body text-[13px] leading-snug text-ember',
            layout === 'stack' ? 'mt-2 max-w-[8rem] text-center' : 'mt-2',
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
