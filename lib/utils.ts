import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Splits a long project title at its first spaced dash, so the short name can
 * be set as the heading and the expansion as a line beneath it:
 * "GUARDIAN — Ghana Unified Referral…" → ["GUARDIAN", "Ghana Unified Referral…"].
 */
export function splitTitle(title: string): [string, string | null] {
  const m = title.match(/^(.+?)\s[—–]\s(.+)$/)
  return m ? [m[1], m[2]] : [title, null]
}
