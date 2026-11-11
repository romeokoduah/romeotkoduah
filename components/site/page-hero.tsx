import Image from 'next/image'
import type { ReactNode } from 'react'
import type { PagePhoto } from '@/content/photos'
import { Wide } from './primitives'

/**
 * Interior-page opening: a whole field of sky, the title large on the shared
 * left edge, the lede at lead size beneath it, and optionally one photograph
 * standing in the right-hand columns down to the field's lower edge.
 *
 * `eyebrow` and `accent` are kept for call-site compatibility but are no
 * longer drawn; fold real information into the lede instead.
 */
export function PageHero({
  title,
  lede,
  photo,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  accent?: string
  photo?: PagePhoto
  children?: ReactNode
}) {
  return (
    <div className="bg-sky">
      <Wide className={photo ? 'grid gap-10 pt-s40 lg:grid-cols-12 lg:gap-8' : 'pb-s50 pt-s40'}>
        <div className={photo ? 'lg:col-span-7 lg:pb-s50' : undefined}>
          <h1
            data-rise
            className="max-w-[18ch] text-[clamp(3rem,1.6rem+5.4vw,7rem)] leading-[0.9] text-ink"
          >
            {title}
          </h1>
          {lede ? (
            <p
              data-rise
              style={{ '--i': 1 } as React.CSSProperties}
              className="mt-8 max-w-[60ch] text-(length:--text-step-lead) leading-[1.4] text-ink"
            >
              {lede}
            </p>
          ) : null}
          {children ? (
            <div data-rise style={{ '--i': 2 } as React.CSSProperties} className="mt-8">
              {children}
            </div>
          ) : null}
        </div>

        {photo ? (
          <figure data-rise style={{ '--i': 2 } as React.CSSProperties} className="lg:col-span-5 lg:self-end">
            <div className="relative aspect-4/3 w-full overflow-hidden lg:aspect-4/5">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: photo.position ?? 'center' }}
              />
            </div>
            {photo.credit ? (
              <figcaption className="bg-sky py-3 text-[0.9375rem] text-ink">{photo.credit}</figcaption>
            ) : (
              <div className="h-0" />
            )}
          </figure>
        ) : null}
      </Wide>
    </div>
  )
}
