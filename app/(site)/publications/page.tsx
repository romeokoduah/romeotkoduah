import { Fragment } from 'react'
import type { Metadata } from 'next'
import type { Publication } from '@/content'
import { PUBLICATION_SECTIONS, publicationsByKind } from '@/content'
import { Btn, BtnRow, Eyebrow, Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { PageHero } from '@/components/site/page-hero'

const ACCENT = 'var(--color-forest)'

/** One token colour per section, so the three kinds read apart at a glance. */
const SECTION_ACCENTS: Record<string, string> = {
  journal: '#0b472c',
  'under-review': '#4458be',
  report: '#a4400a',
}

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

function Citation({ item, accent }: { item: Publication; accent: string }) {
  return (
    <li className="rule py-7 first:border-t-0 first:pt-0">
      {item.authors ? (
        <p className="font-body text-sm leading-relaxed text-ink/70">
          <Authors value={item.authors} />
          {item.year ? <span className="tabular-nums"> ({item.year}).</span> : null}
        </p>
      ) : item.year ? (
        <p className="font-body text-sm font-bold tabular-nums" style={{ color: accent }}>
          {item.year}
        </p>
      ) : null}

      <p className="mt-2 font-body text-(length:--text-fluid-md) font-semibold leading-snug text-ink">
        {item.title}
      </p>

      {item.venue || item.locator ? (
        <p className="mt-2 font-body text-sm leading-relaxed text-ink/70">
          {item.venue ? <em>{item.venue}</em> : null}
          {item.venue && item.locator ? ', ' : null}
          {item.locator ? <span className="tabular-nums">{item.locator}</span> : null}
        </p>
      ) : null}

      {item.note ? (
        <p
          className="mt-4 inline-block border-2 px-3 py-1 font-body text-xs font-semibold leading-none"
          style={{ borderColor: accent, color: accent }}
        >
          {item.note}
        </p>
      ) : null}
    </li>
  )
}

const COUNTS = PUBLICATION_SECTIONS.map((s) => publicationsByKind(s.kind).length)

const LEDE = `${COUNTS[0]} peer-reviewed journal articles, ${COUNTS[1]} manuscripts under review and ${COUNTS[2]} policy and technical reports — hydrology, water accounting, small hydropower, and the regulation and investment planning that follows from them.`

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Peer-reviewed journal articles, manuscripts under review, and policy and technical reports by Romeo Tweneboah Koduah on hydrology, water accounting, small hydropower, carbon markets and clean-energy regulation.',
  alternates: { canonical: '/publications' },
}

export default function PublicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Publications"
        title="Journal articles, manuscripts and reports."
        lede={LEDE}
        accent={ACCENT}
      />

      {PUBLICATION_SECTIONS.map((section, i) => {
        const items = publicationsByKind(section.kind)
        if (items.length === 0) return null
        const accent = SECTION_ACCENTS[section.kind] ?? ACCENT

        return (
          <Section
            key={section.kind}
            tone={i % 2 === 1 ? 'soft' : 'paper'}
            id={section.kind}
          >
            <Wide>
              <Reveal>
                <Eyebrow style={{ color: accent }}>
                  {String(i + 1).padStart(2, '0')} ·{' '}
                  {String(items.length).padStart(2, '0')} entries
                </Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-4 max-w-3xl" style={{ color: accent }}>
                  {section.title}
                </h2>
              </Reveal>

              <ul className="mt-s40 max-w-(--container-measure)">
                {items.map((item, j) => (
                  <Reveal key={item.id} delay={0.05 * j}>
                    <Citation item={item} accent={accent} />
                  </Reveal>
                ))}
              </ul>
            </Wide>
          </Section>
        )
      })}

      <Section tone="forest" className="text-center">
        <Wide>
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-soft">
              Looking for a preprint, a dataset or a co-author?
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <BtnRow align="center" className="mt-9">
              <Btn href="/contact">Get in touch</Btn>
              <Btn href="/research" variant="outline" accent="var(--color-soft)">
                The research behind them
              </Btn>
            </BtnRow>
          </Reveal>
        </Wide>
      </Section>
    </>
  )
}
