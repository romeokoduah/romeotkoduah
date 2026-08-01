import type { Metadata } from 'next'
import { listAlbums, listRecentPhotos } from '@/lib/gallery'
import { PageHero } from '@/components/site/page-hero'
import { Eyebrow, Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { AlbumCard } from '@/components/gallery/album-card'
import { PhotoGrid } from '@/components/gallery/photo-grid'

/** Albums are read at request time; the build must not need a database. */
export const dynamic = 'force-dynamic'

/** `--color-emerald`, as a literal — inline colour maths needs the hex. */
const ACCENT_HEX = '#158753'

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
        eyebrow="Gallery"
        title="Photographs"
        lede="Fieldwork, instrumentation and the people behind the data — river basins, workshops and the places where the modelling meets the ground."
        accent={ACCENT_HEX}
      />

      {albums.length > 0 ? (
        <Section>
          <Wide>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <Reveal>
              <Eyebrow style={{ color: ACCENT_HEX }}>Recent</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-3 max-w-3xl">Not yet sorted into albums</h2>
            </Reveal>
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
            <div
              className="max-w-(--container-measure) border-2 bg-paper p-s30"
              style={{ borderColor: ACCENT_HEX }}
            >
              <h2 style={{ color: ACCENT_HEX }}>Still in the darkroom</h2>
              <p className="mt-6 font-body text-(length:--text-fluid-sm) leading-[1.75] text-ink/85">
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
