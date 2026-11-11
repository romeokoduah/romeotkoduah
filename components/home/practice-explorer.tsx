'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface PracticeItem {
  key: string
  label: string
  href: string
  blurb: string
  count: number
  recent: { slug: string; title: string }[]
  photo: { src: string; alt: string; position?: string }
}

/**
 * The live thing on the homepage: pick a practice and the photograph, the
 * description and the recent projects change to that practice. Hover, focus
 * or tap a row. Without script the first practice is open and every row is
 * still a plain link through to its page.
 */
export function PracticeExplorer({ items }: { items: PracticeItem[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
      {/* the photograph: a band above the list on a phone, a sticky 4:5 frame on desktop */}
      <div className="-mx-s30 h-[42svh] lg:sticky lg:top-[12vh] lg:col-span-5 lg:mx-0 lg:h-auto lg:self-start">
        <div className="relative h-full w-full overflow-hidden bg-mist lg:aspect-4/5">
          {items.map((item, i) => (
            <Image
              key={item.key}
              src={item.photo.src}
              alt={item.photo.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className={cn(
                'object-cover transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
              )}
              style={{ objectPosition: item.photo.position ?? 'center' }}
            />
          ))}
        </div>
      </div>

      <div className="lg:col-span-6 lg:col-start-7">
        <h2 id="practices-heading" data-rise className="text-[clamp(1.625rem,1rem+2.4vw,3.25rem)]">
          Five practices
        </h2>
        <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="mt-4 max-w-[46ch] text-muted">
          One question runs through all of them: how a changing climate reshapes water, energy
          and food, and what to do about it.
        </p>

        <ul className="mt-10" aria-labelledby="practices-heading">
          {items.map((item, i) => {
            const open = i === active
            return (
              <li key={item.key} data-rise style={{ '--i': i + 2 } as React.CSSProperties}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`practice-${item.key}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    'group flex min-h-[64px] w-full items-baseline justify-between gap-6 py-3 text-left transition-colors duration-200',
                    open ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  <span
                    className={cn(
                      'font-head text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-none tracking-[-0.01em] transition-transform duration-200',
                      open ? 'font-bold' : 'font-semibold group-hover:translate-x-1',
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="shrink-0 tabular text-[1rem]">
                    {item.count} projects
                  </span>
                </button>

                <div
                  id={`practice-${item.key}`}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 pt-2">
                      <p className="max-w-[52ch]">{item.blurb}</p>
                      <ul className="mt-4 space-y-1.5">
                        {item.recent.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/work/${p.slug}`} className="text-muted underline decoration-2 underline-offset-4 decoration-sky hover:text-ink hover:decoration-ink">
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href={item.href} className="arrow-link mt-5">
                        Open {item.label} <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <Link href="/work" className="btn mt-8">
          <span>Browse every project</span>
        </Link>
      </div>
    </div>
  )
}
