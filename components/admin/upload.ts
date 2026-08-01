import type { Photo } from '@/lib/blog-types'

/**
 * One upload, with progress. `fetch` cannot report how far a request body has
 * got, and a photo upload without a progress bar looks broken, so this stays
 * on XMLHttpRequest.
 */
export function uploadPhoto(
  file: File,
  options: {
    albumId?: string | null
    onProgress?: (percent: number) => void
    signal?: AbortSignal
  } = {},
): Promise<Photo> {
  return new Promise<Photo>((resolve, reject) => {
    const form = new FormData()
    form.set('file', file)
    if (options.albumId) form.set('albumId', options.albumId)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/upload')
    xhr.responseType = 'text'

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        options.onProgress?.(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      let payload: unknown = null
      try {
        payload = JSON.parse(xhr.responseText)
      } catch {
        /* fall through to the status-based message */
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload) {
        options.onProgress?.(100)
        resolve(payload as Photo)
        return
      }

      const message =
        payload && typeof payload === 'object' && 'error' in payload
          ? String((payload as { error: unknown }).error)
          : xhr.status === 401
            ? 'Your session has expired. Sign in again.'
            : `Upload failed (${xhr.status || 'no response'}).`
      reject(new Error(message))
    })

    xhr.addEventListener('error', () => reject(new Error('The upload could not reach the server.')))
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled.')))

    options.signal?.addEventListener('abort', () => xhr.abort(), { once: true })

    xhr.send(form)
  })
}

export const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/avif'
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

/** Checked here as well as on the server, so an obvious mistake fails fast. */
export function rejectionReason(file: File): string | null {
  if (!ACCEPTED_TYPES.split(',').includes(file.type)) {
    return `${file.name}: only JPEG, PNG, WebP and AVIF images are accepted.`
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `${file.name}: ${(file.size / 1048576).toFixed(1)} MB is over the 15 MB limit.`
  }
  return null
}
