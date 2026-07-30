import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

export function Section({
  className,
  tone = 'paper',
  tall = false,
  children,
  ...rest
}: ComponentProps<'section'> & {
  tone?: 'paper' | 'soft' | 'ink' | 'forest'
  tall?: boolean
}) {
  return (
    <section
      className={cn(
        tall ? 'py-s70' : 'py-s60',
        tone === 'soft' && 'bg-soft',
        tone === 'ink' && 'bg-ink text-soft',
        tone === 'forest' && 'bg-forest text-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  )
}

export function Wide({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('mx-auto w-full max-w-(--container-wide) px-s30', className)}>
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Headings                                                                    */
/* -------------------------------------------------------------------------- */

export function Eyebrow({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <p
      className={cn(
        'font-body text-xs font-bold uppercase tracking-[0.18em] opacity-70',
        className,
      )}
      style={style}
    >
      {children}
    </p>
  )
}

export function SectionHeading({
  as: As = 'h2',
  accent,
  children,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3'
  accent?: string
  children: ReactNode
  className?: string
}) {
  return (
    <As className={cn('text-balance', className)} style={accent ? { color: accent } : undefined}>
      {children}
    </As>
  )
}

/* -------------------------------------------------------------------------- */
/* Buttons — square corners, flat fills, outline shares the bounding box       */
/* -------------------------------------------------------------------------- */

type BtnProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline'
  accent?: string
  className?: string
  external?: boolean
}

export function Btn({
  href,
  children,
  variant = 'solid',
  accent,
  className,
  external,
}: BtnProps) {
  const isExternal = external ?? (/^https?:|^mailto:/.test(href))

  const style =
    variant === 'solid'
      ? accent
        ? { backgroundColor: accent }
        : undefined
      : accent
        ? { color: accent }
        : undefined

  const cls = cn('btn', variant === 'outline' && 'btn-outline', className)

  if (isExternal) {
    return (
      <a
        href={href}
        style={style}
        className={cls}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
      >
        <span>{children}</span>
      </a>
    )
  }

  return (
    <Link href={href} style={style} className={cls}>
      <span>{children}</span>
    </Link>
  )
}

/** Buttons always ship in rows of two or three in this design system. */
export function BtnRow({
  children,
  align = 'start',
  className,
}: {
  children: ReactNode
  align?: 'start' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-4',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Chips                                                                       */
/* -------------------------------------------------------------------------- */

export function Chip({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <span
      className="border-2 px-3 py-1 font-body text-xs font-semibold leading-none"
      style={{ borderColor: accent ?? 'currentColor', color: accent ?? 'currentColor' }}
    >
      {children}
    </span>
  )
}
