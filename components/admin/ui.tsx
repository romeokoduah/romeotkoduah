import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { CommentStatus, PostStatus } from '@/lib/blog-types'

/**
 * The dashboard's furniture. Same typographic system as the public site —
 * Oswald for headings and numbers, Open Sans for everything else, square
 * corners, 2px borders, no shadows — but tighter, because this is a tool.
 *
 * No hooks in this file: it is imported from both server and client trees.
 */

/* ------------------------------------------------------------- tokens ----- */

const MUTED = 'color-mix(in srgb, var(--color-ink) 45%, transparent)'

export const ACCENT: Record<string, string> = {
  published: 'var(--color-indigo)',
  draft: MUTED,
  pending: 'var(--color-rust)',
  approved: 'var(--color-emerald)',
  rejected: MUTED,
  spam: 'var(--color-ember)',
}

export const PANEL = 'border-2 border-ink/12 bg-paper'

export const INPUT =
  'w-full border-2 border-ink/15 bg-paper px-3 py-2 font-body text-sm leading-normal ' +
  'text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-forest ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export const TEXTAREA = `${INPUT} resize-y leading-relaxed`

export const BTN =
  'inline-flex cursor-pointer items-center justify-center gap-2 border-0 bg-rust px-4 py-2.5 ' +
  'font-body text-xs font-bold uppercase tracking-[0.08em] leading-none text-white ' +
  'transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40'

export const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 border-2 border-ink/20 ' +
  'bg-transparent px-3.5 py-2 font-body text-xs font-bold uppercase tracking-[0.08em] ' +
  'leading-none text-ink transition-colors hover:border-ink hover:bg-ink hover:text-soft ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export const BTN_QUIET =
  'inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-body ' +
  'text-xs font-semibold text-ink/60 underline underline-offset-4 transition-colors ' +
  'hover:text-ink disabled:cursor-not-allowed disabled:opacity-40'

/* -------------------------------------------------------------- panel ----- */

export function Panel({
  title,
  note,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode
  note?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn(PANEL, className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink/12 px-4 py-3">
          <div className="min-w-0">
            {title && (
              <h2 className="font-head text-base font-medium uppercase leading-none tracking-[0.06em]">
                {title}
              </h2>
            )}
            {note && <p className="mt-1 font-body text-xs text-ink/50">{note}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </section>
  )
}

/* -------------------------------------------------------------- chips ----- */

export function StatusChip({
  status,
  children,
}: {
  status: PostStatus | CommentStatus | string
  children?: ReactNode
}) {
  const accent = ACCENT[status] ?? MUTED
  return (
    <span
      className="inline-flex shrink-0 items-center border-2 px-2 py-[3px] font-body text-[10px] font-bold uppercase leading-none tracking-[0.12em]"
      style={{ borderColor: accent, color: accent }}
    >
      {children ?? status}
    </span>
  )
}

/* ------------------------------------------------------------ metrics ----- */

export function Metric({
  label,
  value,
  href,
  accent,
  urgent = false,
}: {
  label: string
  value: number | string
  href?: string
  accent?: string
  urgent?: boolean
}) {
  const body = (
    <>
      <span
        className="font-head text-[42px] font-medium leading-none tabular-nums"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </span>
      <span className="mt-2 block font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
        {label}
      </span>
    </>
  )

  const classes = cn(
    'block border-2 p-4 transition-colors',
    urgent ? 'border-rust bg-rust/5' : 'border-ink/12 bg-paper',
    href && 'hover:border-ink',
  )

  return href ? (
    <Link href={href} className={classes}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  )
}

/* ------------------------------------------------------------- states ----- */

export function EmptyState({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="border-2 border-dashed border-ink/15 px-6 py-10 text-center">
      <p className="font-head text-lg font-medium uppercase leading-none tracking-[0.06em] text-ink/70">
        {title}
      </p>
      {children && (
        <p className="mx-auto mt-2 max-w-[46ch] font-body text-sm text-ink/50">{children}</p>
      )}
    </div>
  )
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="border-2 border-rust bg-rust/5 px-3 py-2 font-body text-xs font-semibold text-rust"
    >
      {children}
    </p>
  )
}

export function OkNote({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="border-2 border-emerald bg-emerald/5 px-3 py-2 font-body text-xs font-semibold text-emerald"
    >
      {children}
    </p>
  )
}

/* --------------------------------------------------------------- form ----- */

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string
  hint?: ReactNode
  htmlFor?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55"
      >
        {label}
      </label>
      {children}
      {hint && <p className="font-body text-[11px] text-ink/45">{hint}</p>}
    </div>
  )
}

/* --------------------------------------------------------------- misc ----- */

export function PageHead({
  title,
  lede,
  actions,
}: {
  title: string
  lede?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-head text-[34px] font-medium uppercase leading-none tracking-[0.02em]">
          {title}
        </h1>
        {lede && <p className="mt-2 max-w-[62ch] font-body text-sm text-ink/55">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Short, unambiguous, and stable regardless of the reader's locale. */
export function stamp(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function stampTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${stamp(iso)} · ${d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}
