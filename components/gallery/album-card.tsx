import Link from 'next/link'
import type { Album } from '@/lib/blog-types'

/**
 * Monogram shown until an album has a photo to stand as its cover. Two
 * initials at most — a wall of five-letter marks reads as noise.
 */
function monogram(title: string): string {
  const words = title
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z0-9]/g, ''))
    .filter(Boolean)

  if (words.length === 0) return '—'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function photoCount(n: number): string {
  return n === 1 ? '1 photograph' : `${n} photographs`
}

/**
 * Album tile for the gallery index. Cover fills the top at a fixed 4:3 so the
 * grid keeps a straight baseline; the photographs themselves are shown at
 * their true proportions inside the album. Tiles are separated by space, not
 * framed.
 *
 * `accent` is accepted for call-site compatibility; the palette is fixed now.
 */
export function AlbumCard({ album }: { album: Album; accent?: string }) {
  return (
    <Link href={`/gallery/${album.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-mist">
        {album.coverThumbUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={album.coverThumbUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="flex h-full w-full items-center justify-center bg-sky">
            <span className="select-none font-head text-[3rem] leading-none tracking-tight text-ink">
              {monogram(album.title)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h2 className="font-head text-(length:--text-h3) leading-[1.05] text-ink transition-colors duration-150 group-hover:text-muted">
          {album.title}
        </h2>

        <p className="mt-2 font-body text-[0.9375rem] tabular-nums text-muted">
          {photoCount(album.photoCount)}
        </p>

        {album.description ? (
          <p className="mt-3 font-body leading-relaxed text-ink">{album.description}</p>
        ) : null}

        <span className="arrow-link mt-5 self-start text-ink">
          Open the album <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
