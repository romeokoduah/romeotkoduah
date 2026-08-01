'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import type { ActionResult } from '@/app/admin/result'
import { BTN_GHOST } from './ui'

/**
 * A destructive control that asks first, inline. Never `window.confirm` —
 * a modal the browser owns cannot be styled, cannot be read by the page, and
 * traps the tab until it is answered.
 */
export function ConfirmAction({
  label,
  confirmLabel = 'Confirm',
  question = 'Are you sure?',
  run,
  onDone,
  className,
  danger = true,
}: {
  label: string
  confirmLabel?: string
  question?: string
  run: () => Promise<ActionResult>
  onDone?: () => void
  className?: string
  danger?: boolean
}) {
  const [armed, setArmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  if (!armed) {
    return (
      <div className={cn('inline-flex flex-col items-start gap-1', className)}>
        <button
          type="button"
          className={cn(BTN_GHOST, danger && 'border-rust/40 text-rust hover:bg-rust hover:border-rust')}
          onClick={() => {
            setError(null)
            setArmed(true)
          }}
        >
          {label}
        </button>
        {error && (
          <span role="alert" className="font-body text-[11px] font-semibold text-rust">
            {error}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex flex-wrap items-center gap-2 border-2 border-rust bg-rust/5 px-2.5 py-1.5',
        className,
      )}
    >
      <span className="font-body text-[11px] font-bold uppercase tracking-[0.1em] text-rust">
        {question}
      </span>
      <button
        type="button"
        disabled={busy}
        className="cursor-pointer border-0 bg-rust px-2.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.08em] leading-none text-white transition-opacity hover:opacity-85 disabled:opacity-40"
        onClick={() =>
          startTransition(async () => {
            const result = await run()
            if (result.ok) {
              setArmed(false)
              onDone?.()
            } else {
              setArmed(false)
              setError(result.error)
            }
          })
        }
      >
        {busy ? 'Working…' : confirmLabel}
      </button>
      <button
        type="button"
        disabled={busy}
        className="cursor-pointer border-0 bg-transparent p-0 font-body text-[11px] font-semibold text-ink/60 underline underline-offset-4 hover:text-ink disabled:opacity-40"
        onClick={() => setArmed(false)}
      >
        Cancel
      </button>
    </div>
  )
}
