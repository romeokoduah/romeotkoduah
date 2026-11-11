import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAlbumBySlug, listPhotos } from '@/lib/gallery'
import { Section, Wide } from '@/components/site/primitives'
import { PhotoGrid } from '@/components/gallery/photo-grid'

/** Photographs are read at request time; the build must not need a database. */
export const dynamic = 'force-dynamic'

/** `--color-emerald`, as a literal — inline colour maths needs the hex. */
const ACCENT_HEX = '#0e1822'

type PageProps = { params: Promise<{ slug: string }> }

function photoCount(n: number): string {
  return n === 1 ? '1 photograph' : `${n} photographs`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)

  if (!album) return { title: 'Album not found' }

  const description =
    album.description.trim() ||
    `${photoCount(album.photoCount)} from ${album.title}.`

  return {
    title: album.title,
    description,
    alternates: { canonical: `/gallery/${album.slug}` },
    openGraph: {
      type: 'article',
      url: `/gallery/${album.slug}`,
      title: `${album.title} — Romeo Tweneboah Koduah`,
      description,
      images: album.coverUrl ? [{ url: album.coverUrl }] : undefined,
    },
  }
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)

  if (!album) notFound()

  const photos = await listPhotos(album.id)

  return (
    <>
      {/* ============================== HEADER ============================== */}
      <div className="bg-sky pb-s50 pt-s40">
        <Wide>
          <h1 data-rise className="max-w-[24ch] text-ink">
            {album.title}
          </h1>

          <p
            data-rise
            style={{ '--i': 1 } as React.CSSProperties}
            className="mt-6 font-body text-(length:--text-step-lead) tabular-nums text-ink"
          >
            {photoCount(photos.length)}.
          </p>

          {album.description ? (
            <p
              data-rise
              style={{ '--i': 2 } as React.CSSProperties}
              className="mt-4 max-w-[60ch] font-body text-(length:--text-step-lead) leading-[1.4] text-ink"
            >
              {album.description}
            </p>
          ) : null}

          <p data-rise style={{ '--i': 3 } as React.CSSProperties} className="mt-8">
            <Link href="/gallery" className="arrow-link text-ink">
              <span aria-hidden>←</span> All albums
            </Link>
          </p>
        </Wide>
      </div>

      {/* =============================== GRID =============================== */}
      <Section>
        <Wide>
          {photos.length > 0 ? (
            <PhotoGrid
              photos={photos}
              albumTitle={album.title}
              accent={ACCENT_HEX}
            />
          ) : (
            <div className="max-w-(--container-measure)">
              <h2 data-rise className="text-ink">
                This album is empty
              </h2>
              <p
                data-rise
                style={{ '--i': 1 } as React.CSSProperties}
                className="mt-6 font-body text-(length:--text-step-lead) leading-[1.5] text-ink"
              >
                Nothing has been added to {album.title} yet. Try one of the other
                albums in the meantime.
              </p>
              <p className="mt-7">
                <Link href="/gallery" className="arrow-link text-ink">
                  Back to the gallery <span aria-hidden>→</span>
                </Link>
              </p>
            </div>
          )}
        </Wide>
      </Section>
    </>
  )
}
