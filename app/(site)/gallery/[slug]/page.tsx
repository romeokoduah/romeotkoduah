import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAlbumBySlug, listPhotos } from '@/lib/gallery'
import { Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { PhotoGrid } from '@/components/gallery/photo-grid'

/** Photographs are read at request time; the build must not need a database. */
export const dynamic = 'force-dynamic'

/** `--color-emerald`, as a literal — inline colour maths needs the hex. */
const ACCENT_HEX = '#158753'

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
      <div
        className="border-b-2 bg-soft py-s50"
        style={{ borderColor: ACCENT_HEX }}
      >
        <Wide>
          <Reveal immediate>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] transition-transform duration-150 hover:translate-x-0.5"
              style={{ color: ACCENT_HEX }}
            >
              <span aria-hidden>←</span> All albums
            </Link>
          </Reveal>

          <Reveal immediate delay={0.06}>
            <h1 className="mt-5 max-w-4xl" style={{ color: ACCENT_HEX }}>
              {album.title}
            </h1>
          </Reveal>

          <Reveal immediate delay={0.12}>
            <p className="mt-5 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
              {photoCount(photos.length)}
            </p>
          </Reveal>

          {album.description ? (
            <Reveal immediate delay={0.16}>
              <p className="mt-5 max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
                {album.description}
              </p>
            </Reveal>
          ) : null}
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
            <div
              className="max-w-(--container-measure) border-2 bg-paper p-s30"
              style={{ borderColor: ACCENT_HEX }}
            >
              <h2 style={{ color: ACCENT_HEX }}>This album is empty</h2>
              <p className="mt-6 font-body text-(length:--text-fluid-sm) leading-[1.75] text-ink/85">
                Nothing has been added to {album.title} yet. Try one of the other
                albums in the meantime.
              </p>
              <p className="mt-7">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 font-body text-sm font-bold transition-transform duration-150 hover:translate-x-1"
                  style={{ color: ACCENT_HEX }}
                >
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
