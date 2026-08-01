import type { Comment } from '@/lib/blog-types'

/**
 * Small pieces shared across the blog components. The accent is the indigo
 * from the design tokens — the blog sits in the "AI & Digital Systems" colour
 * so that Writing reads as one practice rather than a bolted-on section.
 *
 * The literal is kept alongside the custom property because a handful of
 * props (PageHero's `accent`, Chip's `accent`) take a colour string rather
 * than a class, and `var(--color-indigo)` is not valid everywhere a string is.
 */
export const ACCENT = 'var(--color-indigo)'
export const ACCENT_HEX = '#4458be'

/** Total approved comments in a two-level tree, replies included. */
export function countComments(comments: Comment[]): number {
  return comments.reduce((n, c) => n + 1 + c.replies.length, 0)
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * "4 minutes ago" for anything inside a week, an absolute date after that.
 * Rendered with `suppressHydrationWarning`: the server and the client can
 * land either side of a minute boundary, and a one-word difference is not
 * worth a hydration error.
 */
export function relativeDate(iso: string): string {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ''

  const diff = Date.now() - then
  if (diff < MINUTE) return 'just now'
  if (diff < HOUR) {
    const n = Math.floor(diff / MINUTE)
    return `${n} minute${n === 1 ? '' : 's'} ago`
  }
  if (diff < DAY) {
    const n = Math.floor(diff / HOUR)
    return `${n} hour${n === 1 ? '' : 's'} ago`
  }
  if (diff < 7 * DAY) {
    const n = Math.floor(diff / DAY)
    return `${n} day${n === 1 ? '' : 's'} ago`
  }
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** `12 likes`, `1 like`, `no likes` — used in meta rows. */
export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`
}
