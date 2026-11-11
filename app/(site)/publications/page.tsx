import { Fragment } from 'react'
import { PAGE_PHOTOS } from '@/content/photos'
import type { Metadata } from 'next'
import type { Publication } from '@/content'
import { PUBLICATION_SECTIONS, publicationsByKind } from '@/content'
import { Btn, BtnRow, Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { PageHero } from '@/components/site/page-hero'

/** Romeo's own name, exactly as it appears in every CV author string. */
const SELF = 'Koduah, R. T.'

/**
 * Renders an author string with Romeo's own name in bold. Split on the exact
 * substring rather than injecting markup — no `dangerouslySetInnerHTML`.
 */
function Authors({ value }: { value: string }) {
  const parts = value.split(SELF)
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 ? (
            <strong className="font-bold text-ink">{SELF}</strong>
          ) : null}
        </Fragment>
      ))}
    </>
  )
}

function Citation({ item }: { item: Publication }) {
  return (
    <li>
      {item.authors ? (
        <p className="font-body leading-relaxed text-muted">
          <Authors value={item.authors} />
          {item.year ? <span className="tabular-nums"> ({item.year}).</span> : null}
        </p>
      ) : item.year ? (
        <p className="font-body font-bold tabular-nums text-muted">{item.year}</p>
      ) : null}

      <p className="mt-2 font-body text-(length:--text-step-lead) font-semibold leading-snug text-ink">
        {item.title}
      </p>

      {item.venue || item.locator ? (
        <p className="mt-2 font-body leading-relaxed text-muted">
          {item.venue ? <em>{item.venue}</em> : null}
          {item.venue && item.locator ? ', ' : null}
          {item.locator ? <span className="tabular-nums">{item.locator}</span> : null}
        </p>
      ) : null}

      {item.note ? (
        <p className="mt-4 inline-block bg-sky px-3 py-1.5 font-body text-[0.9375rem] font-semibold leading-none text-ink">
          {item.note}
        </p>
      ) : null}
    </li>
  )
}

const COUNTS = PUBLICATION_SECTIONS.map((s) => publicationsByKind(s.kind).length)

const LEDE = `${COUNTS[0]} peer-reviewed journal articles, ${COUNTS[1]} manuscripts under review and ${COUNTS[2]} policy and technical reports — hydrology, water accounting, small hydropower, and the regulation and investment planning that follows from them.`

function entryCount(n: number): string {
  return n === 1 ? '1 entry.' : `${n} entries.`
}

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Peer-reviewed journal articles, manuscripts under review, and policy and technical reports by Romeo Tweneboah Koduah on hydrology, water accounting, small hydropower, carbon markets and clean-energy regulation.',
  alternates: { canonical: '/publications' },
}

export default function PublicationsPage() {
  return (
    <>
      <PageHero title="Publications" lede={LEDE} photo={PAGE_PHOTOS.publications} />

      {PUBLICATION_SECTIONS.map((section, i) => {
        const items = publicationsByKind(section.kind)
        if (items.length === 0) return null

        return (
          <Section
            key={section.kind}
            tone={i % 2 === 1 ? 'soft' : 'paper'}
            id={section.kind}
          >
            <Wide>
              <h2 data-rise className="max-w-4xl text-ink">
                {section.title}
              </h2>
              <p
                data-rise
                style={{ '--i': 1 } as React.CSSProperties}
                className="mt-5 text-(length:--text-step-lead) leading-[1.4] tabular-nums text-muted"
              >
                {entryCount(items.length)}
              </p>

              <ul className="mt-s40 max-w-(--container-measure) space-y-10">
                {items.map((item, j) => (
                  <Reveal key={item.id} delay={0.05 * j}>
                    <Citation item={item} />
                  </Reveal>
                ))}
              </ul>
            </Wide>
          </Section>
        )
      })}

      <Section tone="ink" className="text-center">
        <Wide>
          <h2 data-rise className="mx-auto max-w-4xl text-paper">
            Looking for a preprint, a dataset or a co-author?
          </h2>
          <div data-rise style={{ '--i': 1 } as React.CSSProperties}>
            <BtnRow align="center" className="mt-9">
              <Btn href="/contact">Get in touch</Btn>
              <Btn href="/research" variant="outline" accent="var(--color-paper)">
                The research behind them
              </Btn>
            </BtnRow>
          </div>
        </Wide>
      </Section>
    </>
  )
}
