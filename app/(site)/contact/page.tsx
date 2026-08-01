import type { Metadata } from 'next'
import Link from 'next/link'
import { PRACTICES, PROFILE } from '@/content'
import { Btn, BtnRow, Eyebrow, Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { PageHero } from '@/components/site/page-hero'

const ACCENT = 'var(--color-rust)'

/** One token colour per contact row, cycled. */
const ROW_ACCENTS = ['#a4400a', '#0b472c', '#4458be', '#158753']

const EMAIL = PROFILE.contact.find((c) => c.label === 'Email')

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Romeo Tweneboah Koduah about research collaborations, policy and regulatory work, hydrological modelling and data science, digital systems, facilitation and training.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={'Let’s talk.'}
        lede="Research collaborations, policy and regulatory work, modelling and data science, digital systems, facilitation and training."
        accent={ACCENT}
      />

      {/* ============================ CHANNELS =========================== */}
      <Section>
        <Wide>
          <Reveal>
            <p className="max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
              Email is the surest route and is read every day. If a proposal, a
              basin, a dataset or a programme is already on the table, say so in
              the first line — it gets a faster and more useful answer than a
              general introduction.
            </p>
          </Reveal>

          <ul className="mt-s40 max-w-(--container-measure)">
            {PROFILE.contact.map((c, i) => {
              const accent = ROW_ACCENTS[i % ROW_ACCENTS.length]
              const isMailto = c.href.startsWith('mailto:')
              return (
                <Reveal key={c.label} delay={0.05 * i}>
                  <li className="mt-4 first:mt-0">
                    <a
                      href={c.href}
                      target={isMailto ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-2 p-6 transition-colors duration-150 hover:bg-soft sm:p-7"
                      style={{ borderColor: accent }}
                    >
                      <span
                        className="font-head text-2xl leading-none"
                        style={{ color: accent }}
                      >
                        {c.label}
                      </span>
                      <span className="flex items-baseline gap-3 font-body text-sm leading-relaxed break-all text-ink/75">
                        {c.value}
                        <span
                          aria-hidden
                          className="transition-transform duration-150 group-hover:translate-x-1"
                          style={{ color: accent }}
                        >
                          →
                        </span>
                      </span>
                    </a>
                  </li>
                </Reveal>
              )
            })}
          </ul>

          {EMAIL ? (
            <Reveal delay={0.24}>
              <BtnRow className="mt-s30">
                <Btn href={EMAIL.href}>Email Romeo</Btn>
                <Btn href="/about" variant="outline" accent="var(--color-forest)">
                  Read the background
                </Btn>
              </BtnRow>
            </Reveal>
          ) : null}
        </Wide>
      </Section>

      {/* ========================= WHAT I TAKE ON ======================== */}
      <Section tone="soft">
        <Wide>
          <Reveal>
            <Eyebrow style={{ color: ACCENT }}>What I take on</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-3xl text-rust">
              Five practices, and the kind of brief each one answers.
            </h2>
          </Reveal>

          <ul className="mt-s40 grid gap-6 md:grid-cols-2">
            {PRACTICES.map((p, i) => (
              <Reveal key={p.key} delay={0.05 * i}>
                <li className="h-full">
                  <Link
                    href={p.href}
                    className="group flex h-full flex-col border-2 bg-paper p-6 transition-colors duration-150 hover:bg-soft"
                    style={{ borderColor: p.accent }}
                  >
                    <span
                      className="font-body text-[11px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: p.accent }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 leading-[1.1]" style={{ color: p.accent }}>
                      {p.label}
                    </h3>
                    <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-ink/75">
                      {p.blurb}
                    </p>
                    <span
                      className="mt-6 font-body text-sm font-bold transition-transform duration-150 group-hover:translate-x-1"
                      style={{ color: p.accent }}
                    >
                      {p.short} <span aria-hidden>→</span>
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </Wide>
      </Section>
    </>
  )
}
