import 'server-only'
import { unlink } from 'node:fs/promises'
import path from 'node:path'

/**
 * Where uploaded photos live on disk, and how they are addressed publicly.
 *
 * Everything written here is named by the server — a UUID plus a fixed
 * extension — so an uploaded filename never reaches the filesystem. The
 * removal helper re-derives the path from that same shape and refuses
 * anything that resolves outside the media directory.
 */

export function mediaDir(): string {
  return path.resolve(process.env.MEDIA_DIR ?? './public/media')
}

export function mediaBaseUrl(): string {
  return (process.env.MEDIA_BASE_URL ?? '/media').replace(/\/+$/, '')
}

export function publicUrlFor(filename: string): string {
  return `${mediaBaseUrl()}/${filename}`
}

/** Only ever true for names this application generated. */
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/

/**
 * Deletes one stored file, given the public URL held in the database.
 * Silent on anything it cannot prove is inside MEDIA_DIR — a stored URL that
 * points elsewhere (an external cover image, say) is simply left alone.
 */
export async function removeMediaFile(publicUrl: string | null | undefined): Promise<void> {
  if (!publicUrl) return

  const base = mediaBaseUrl()
  if (!publicUrl.startsWith(`${base}/`)) return

  const name = publicUrl.slice(base.length + 1)
  if (!SAFE_NAME.test(name) || name.includes('..')) return

  const dir = mediaDir()
  const target = path.resolve(dir, name)
  const rel = path.relative(dir, target)
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) return

  await unlink(target).catch(() => {
    /* already gone, or never written — nothing to undo */
  })
}
