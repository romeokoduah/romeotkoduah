import 'server-only'
import { sql } from './db'
import type { Album, Photo } from './blog-types'
import { slugify } from './blog-types'

interface AlbumRow {
  id: string
  slug: string
  title: string
  description: string
  sort: number
  cover_photo_id: string | null
  cover_url: string | null
  cover_thumb_url: string | null
  photo_count: number
  created_at: Date
}

function toAlbum(r: AlbumRow): Album {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    sort: r.sort,
    coverPhotoId: r.cover_photo_id,
    coverUrl: r.cover_url,
    coverThumbUrl: r.cover_thumb_url,
    photoCount: r.photo_count,
    createdAt: r.created_at.toISOString(),
  }
}

/**
 * Albums with a cover. When no cover has been chosen explicitly, the most
 * recent photo in the album stands in, so a new album never looks empty.
 */
/** Built per call: evaluating `sql` at module scope would connect on import. */
const albumSelect = () => sql`
  a.id, a.slug, a.title, a.description, a.sort, a.cover_photo_id, a.created_at,
  coalesce(cover.url, latest.url)             AS cover_url,
  coalesce(cover.thumb_url, latest.thumb_url) AS cover_thumb_url,
  (SELECT count(*) FROM photos p WHERE p.album_id = a.id)::int AS photo_count
`

const albumJoins = () => sql`
  LEFT JOIN photos cover ON cover.id = a.cover_photo_id
  LEFT JOIN LATERAL (
    SELECT url, thumb_url FROM photos p
    WHERE p.album_id = a.id
    ORDER BY p.sort ASC, p.created_at DESC LIMIT 1
  ) latest ON true
`

export async function listAlbums(): Promise<Album[]> {
  const rows = await sql<AlbumRow[]>`
    SELECT ${albumSelect()} FROM albums a ${albumJoins()}
    ORDER BY a.sort ASC, a.created_at DESC
  `
  return rows.map(toAlbum)
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const rows = await sql<AlbumRow[]>`
    SELECT ${albumSelect()} FROM albums a ${albumJoins()}
    WHERE a.slug = ${slug} LIMIT 1
  `
  return rows[0] ? toAlbum(rows[0]) : null
}

interface PhotoRow {
  id: string
  album_id: string | null
  url: string
  thumb_url: string
  width: number
  height: number
  tone: string
  caption: string
  alt: string
  taken_at: Date | null
  sort: number
}

function toPhoto(r: PhotoRow): Photo {
  return {
    id: r.id,
    albumId: r.album_id,
    url: r.url,
    thumbUrl: r.thumb_url,
    width: r.width,
    height: r.height,
    tone: r.tone,
    caption: r.caption,
    alt: r.alt,
    takenAt: r.taken_at ? r.taken_at.toISOString() : null,
    sort: r.sort,
  }
}

export async function listPhotos(albumId: string): Promise<Photo[]> {
  const rows = await sql<PhotoRow[]>`
    SELECT id, album_id, url, thumb_url, width, height, tone, caption, alt, taken_at, sort
    FROM photos WHERE album_id = ${albumId}
    ORDER BY sort ASC, created_at ASC
  `
  return rows.map(toPhoto)
}

/** Most recent photos across every album — used for the gallery landing strip. */
export async function listRecentPhotos(limit = 12): Promise<Photo[]> {
  const rows = await sql<PhotoRow[]>`
    SELECT id, album_id, url, thumb_url, width, height, tone, caption, alt, taken_at, sort
    FROM photos ORDER BY created_at DESC LIMIT ${limit}
  `
  return rows.map(toPhoto)
}

/* ============================== mutations ================================ */

async function uniqueAlbumSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'album'
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`
    const rows = await sql<{ id: string }[]>`
      SELECT id FROM albums WHERE slug = ${candidate} LIMIT 1
    `
    if (rows.length === 0 || rows[0].id === excludeId) return candidate
  }
  return `${root}-${Date.now()}`
}

export async function createAlbum(input: {
  title: string
  description?: string
}): Promise<Album> {
  const slug = await uniqueAlbumSlug(input.title)
  const rows = await sql<{ id: string }[]>`
    INSERT INTO albums (slug, title, description)
    VALUES (${slug}, ${input.title}, ${input.description ?? ''})
    RETURNING id
  `
  const album = await getAlbumById(rows[0].id)
  if (!album) throw new Error('Album vanished immediately after insert')
  return album
}

export async function getAlbumById(id: string): Promise<Album | null> {
  const rows = await sql<AlbumRow[]>`
    SELECT ${albumSelect()} FROM albums a ${albumJoins()}
    WHERE a.id = ${id} LIMIT 1
  `
  return rows[0] ? toAlbum(rows[0]) : null
}

export async function updateAlbum(
  id: string,
  input: { title?: string; description?: string; coverPhotoId?: string | null; sort?: number },
): Promise<Album | null> {
  const current = await getAlbumById(id)
  if (!current) return null
  const slug = input.title ? await uniqueAlbumSlug(input.title, id) : current.slug

  await sql`
    UPDATE albums SET
      title = ${input.title ?? current.title},
      slug = ${slug},
      description = ${input.description ?? current.description},
      cover_photo_id = ${
        input.coverPhotoId === undefined ? current.coverPhotoId : input.coverPhotoId
      },
      sort = ${input.sort ?? current.sort}
    WHERE id = ${id}
  `
  return getAlbumById(id)
}

export async function deleteAlbum(id: string): Promise<void> {
  await sql`DELETE FROM albums WHERE id = ${id}`
}

export async function insertPhoto(input: {
  albumId: string | null
  url: string
  thumbUrl: string
  width: number
  height: number
  tone: string
  caption?: string
  alt?: string
  takenAt?: Date | null
}): Promise<Photo> {
  const rows = await sql<PhotoRow[]>`
    INSERT INTO photos (album_id, url, thumb_url, width, height, tone, caption, alt, taken_at, sort)
    VALUES (${input.albumId}, ${input.url}, ${input.thumbUrl}, ${input.width},
            ${input.height}, ${input.tone}, ${input.caption ?? ''}, ${input.alt ?? ''},
            ${input.takenAt ?? null},
            coalesce((SELECT max(sort) + 1 FROM photos WHERE album_id = ${input.albumId}), 0))
    RETURNING id, album_id, url, thumb_url, width, height, tone, caption, alt, taken_at, sort
  `
  return toPhoto(rows[0])
}

export async function updatePhoto(
  id: string,
  input: { caption?: string; alt?: string; sort?: number; albumId?: string | null },
): Promise<void> {
  await sql`
    UPDATE photos SET
      caption = coalesce(${input.caption ?? null}, caption),
      alt = coalesce(${input.alt ?? null}, alt),
      sort = coalesce(${input.sort ?? null}, sort),
      album_id = ${input.albumId === undefined ? sql`album_id` : input.albumId}
    WHERE id = ${id}
  `
}

/** Returns the stored file paths so the caller can remove them from disk. */
export async function deletePhoto(id: string): Promise<{ url: string; thumbUrl: string } | null> {
  const rows = await sql<{ url: string; thumb_url: string }[]>`
    DELETE FROM photos WHERE id = ${id} RETURNING url, thumb_url
  `
  return rows[0] ? { url: rows[0].url, thumbUrl: rows[0].thumb_url } : null
}
