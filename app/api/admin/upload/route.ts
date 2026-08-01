import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/auth'
import { insertPhoto } from '@/lib/gallery'
import { mediaDir, publicUrlFor, removeMediaFile } from '@/app/admin/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* -------------------------------------------------------------------------- */

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
/** What sharp must agree the bytes actually are. A declared MIME type is a
 *  claim by the client; this is the file itself. */
const ALLOWED_FORMAT = new Set(['jpeg', 'jpg', 'png', 'webp', 'avif', 'heif'])

const MAX_BYTES = 15 * 1024 * 1024
const DISPLAY_EDGE = 2000
const THUMB_EDGE = 600
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function hex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
}

/** Average colour of the finished image, painted behind it while it loads. */
async function averageTone(webp: Buffer): Promise<string> {
  try {
    const { data, info } = await sharp(webp)
      .resize(1, 1, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    if (info.channels < 3 || data.length < 3) return '#e7e3df'
    return `#${hex(data[0])}${hex(data[1])}${hex(data[2])}`
  } catch {
    return '#e7e3df'
  }
}

/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  // Authorisation before anything is read from the request body.
  try {
    await requireAdmin()
  } catch {
    return bad('Not signed in.', 401)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return bad('Expected multipart/form-data.')
  }

  const file = form.get('file')
  if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
    return bad('No file was attached under the field "file".')
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return bad('Only JPEG, PNG, WebP and AVIF images can be uploaded.', 415)
  }
  if (file.size <= 0) return bad('That file is empty.')
  if (file.size > MAX_BYTES) {
    return bad(`Images must be 15 MB or smaller — that one is ${(file.size / 1048576).toFixed(1)} MB.`, 413)
  }

  const albumIdRaw = form.get('albumId')
  const albumId = typeof albumIdRaw === 'string' && UUID.test(albumIdRaw) ? albumIdRaw : null
  if (typeof albumIdRaw === 'string' && albumIdRaw.length > 0 && !albumId) {
    return bad('That album id is not valid.')
  }

  const input = Buffer.from(await file.arrayBuffer())

  let width: number
  let height: number
  let display: Buffer
  let thumb: Buffer

  try {
    const probe = await sharp(input).metadata()
    if (!probe.format || !ALLOWED_FORMAT.has(probe.format)) {
      return bad('That file is not a readable image.', 415)
    }

    const displayed = await sharp(input)
      .rotate() // honour EXIF orientation before the dimensions are recorded
      .resize({
        width: DISPLAY_EDGE,
        height: DISPLAY_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true })

    display = displayed.data
    width = displayed.info.width
    height = displayed.info.height

    thumb = await sharp(input)
      .rotate()
      .resize({
        width: THUMB_EDGE,
        height: THUMB_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 78 })
      .toBuffer()
  } catch {
    return bad('That image could not be processed.', 422)
  }

  // The name is ours. Nothing the client sent ever reaches the filesystem.
  const id = randomUUID()
  const displayName = `${id}.webp`
  const thumbName = `${id}-thumb.webp`
  const dir = mediaDir()

  try {
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, displayName), display)
    await writeFile(path.join(dir, thumbName), thumb)
  } catch {
    return bad('The image could not be written to disk.', 500)
  }

  const url = publicUrlFor(displayName)
  const thumbUrl = publicUrlFor(thumbName)

  try {
    const photo = await insertPhoto({
      albumId,
      url,
      thumbUrl,
      width,
      height,
      tone: await averageTone(display),
    })
    return NextResponse.json(photo, { status: 201 })
  } catch {
    // Do not leave orphaned files behind when the row fails to land.
    await removeMediaFile(url)
    await removeMediaFile(thumbUrl)
    return bad('The image was processed but could not be recorded.', 500)
  }
}
