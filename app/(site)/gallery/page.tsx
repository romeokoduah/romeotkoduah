import type { Metadata } from 'next'
import { listAlbums, listRecentPhotos } from '@/lib/gallery'
import { PageHero } from '@/components/site/page-hero'
import { Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { AlbumCard } from '@/components/gallery/album-card'
import { PhotoGrid } from '@/components/gallery/photo-grid'

/** Albums are read at request time; the build must not need a database. */
export const dynamic = 'force-dynamic'

/** `--color-emerald`, as a literal — inline colour maths needs the hex. */
const ACCENT_HEX = '#0e1822'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photographs from fieldwork, workshops and river basins across Ghana and West Africa.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    type: 'website',
    url: '/gallery',
    title: 'Gallery — Romeo Tweneboah Koduah',
    description:
      'Photographs from fieldwork, workshops and river basins across Ghana and West Africa.',
  },
}

export default async function GalleryIndexPage() {
  const albums = await listAlbums()
  // Only consulted when there is no album to lead with — a gallery that has
  // photographs should never present itself as empty.
  const loose = albums.length === 0 ? await listRecentPhotos(24) : []

  return (
    <>
      <PageHero
        title="Photographs"
        lede="Fieldwork, instrumentation and the people behind the data — river basins, workshops and the places where the modelling meets the ground."
      />

      {albums.length > 0 ? (
        <Section>
          <Wide>
            <div className="grid gap-x-6 gap-y-s40 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <Reveal key={album.id} delay={0.05 * (i % 3)}>
                  <AlbumCard album={album} accent={ACCENT_HEX} />
                </Reveal>
              ))}
            </div>
          </Wide>
        </Section>
      ) : loose.length > 0 ? (
        <Section>
          <Wide>
            <h2 data-rise className="max-w-4xl text-ink">
              Recent, not yet sorted into albums
            </h2>
            <div className="mt-s30">
              <PhotoGrid
                photos={loose}
                albumTitle="Recent photographs"
                accent={ACCENT_HEX}
              />
            </div>
          </Wide>
        </Section>
      ) : (
        <Section tone="soft">
          <Wide>
            <div className="max-w-(--container-measure)">
              <h2 data-rise className="text-ink">
                Still in the darkroom
              </h2>
              <p
                data-rise
                style={{ '--i': 1 } as React.CSSProperties}
                className="mt-6 font-body text-(length:--text-step-lead) leading-[1.5] text-ink"
              >
                No albums have been published yet. Photographs from fieldwork,
                gauging stations and workshops across the basin will appear here as
                they are catalogued.
              </p>
            </div>
          </Wide>
        </Section>
      )}
    </>
  )
}
