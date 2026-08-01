import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAlbumById, listPhotos } from '@/lib/gallery'
import type { Album, Photo } from '@/lib/blog-types'
import { AlbumPhotos } from '@/components/admin/album-photos'
import { AlbumSettings } from '@/components/admin/album-settings'
import { DeleteAlbum } from '@/components/admin/album-actions'
import { ErrorNote, PageHead } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  let album: Album | null = null
  let photos: Photo[] = []
  let error: string | null = null

  try {
    ;[album, photos] = await Promise.all([getAlbumById(id), listPhotos(id)])
  } catch {
    error = 'The album could not be loaded — the database is not answering.'
  }

  if (error) return <ErrorNote>{error}</ErrorNote>
  if (!album) notFound()

  return (
    <>
      <Link
        href="/admin/gallery"
        className="mb-4 inline-block font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/50 underline underline-offset-4 transition-colors hover:text-ink"
      >
        ← All albums
      </Link>

      <PageHead
        title={album.title}
        lede={`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'} · /gallery/${
          album.slug
        }`}
        actions={
          <>
            <Link
              href={`/gallery/${album.slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-body text-xs font-bold uppercase tracking-[0.1em] underline underline-offset-4 hover:text-rust"
            >
              View
            </Link>
            <DeleteAlbum id={album.id} photoCount={photos.length} redirectTo="/admin/gallery" />
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <AlbumSettings
          id={album.id}
          title={album.title}
          description={album.description}
        />
        <AlbumPhotos
          albumId={album.id}
          photos={photos}
          coverPhotoId={album.coverPhotoId}
        />
      </div>
    </>
  )
}
