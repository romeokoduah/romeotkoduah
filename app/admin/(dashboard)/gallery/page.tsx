import Link from 'next/link'
import { listAlbums } from '@/lib/gallery'
import type { Album } from '@/lib/blog-types'
import { DeleteAlbum } from '@/components/admin/album-actions'
import { NewAlbum } from '@/components/admin/new-album'
import { EmptyState, ErrorNote, PageHead, stamp } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  let albums: Album[] = []
  let error: string | null = null

  try {
    albums = await listAlbums()
  } catch {
    error = 'The albums could not be loaded — the database is not answering.'
  }

  const photos = albums.reduce((sum, a) => sum + a.photoCount, 0)

  return (
    <>
      <PageHead
        title="Gallery"
        lede={`${albums.length} ${albums.length === 1 ? 'album' : 'albums'}, ${photos} ${
          photos === 1 ? 'photo' : 'photos'
        }.`}
        actions={<NewAlbum />}
      />

      {error && (
        <div className="mb-4">
          <ErrorNote>{error}</ErrorNote>
        </div>
      )}

      {albums.length === 0 && !error ? (
        <EmptyState title="No albums yet">
          An album is just a title and a description — photos go in afterwards, by drag and drop.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albums.map((album) => (
            <li key={album.id} className="flex flex-col border-2 border-ink/12 bg-paper">
              <Link href={`/admin/gallery/${album.id}`} className="group block">
                <div className="aspect-[3/2] w-full overflow-hidden border-b-2 border-ink/12 bg-soft">
                  {album.coverThumbUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={album.coverThumbUrl}
                      alt=""
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-85"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-body text-xs uppercase tracking-[0.16em] text-ink/30">
                      No photos yet
                    </span>
                  )}
                </div>
              </Link>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <Link
                  href={`/admin/gallery/${album.id}`}
                  className="font-head text-xl font-medium leading-tight underline-offset-4 hover:underline"
                >
                  {album.title}
                </Link>
                <p className="font-body text-[11px] uppercase tracking-[0.12em] text-ink/45">
                  {album.photoCount} {album.photoCount === 1 ? 'photo' : 'photos'} · /
                  {album.slug} · {stamp(album.createdAt)}
                </p>
                {album.description && (
                  <p className="mt-1 line-clamp-2 font-body text-xs text-ink/55">
                    {album.description}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href={`/admin/gallery/${album.id}`}
                    className="font-body text-xs font-bold uppercase tracking-[0.1em] underline underline-offset-4 hover:text-rust"
                  >
                    Edit
                  </Link>
                  <DeleteAlbum id={album.id} photoCount={album.photoCount} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
