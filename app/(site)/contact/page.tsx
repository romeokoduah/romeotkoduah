import type { Metadata } from 'next'
import { PAGE_PHOTOS } from '@/content/photos'
import Link from 'next/link'
import { PRACTICES, PROFILE } from '@/content'
import { Btn, BtnRow, Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { PageHero } from '@/components/site/page-hero'

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
        title={'Let’s talk.'}
        lede="Research collaborations, policy and regulatory work, modelling and data science, digital systems, facilitation and training."
        photo={PAGE_PHOTOS.contact}
      />

      {/* ============================ CHANNELS =========================== */}
      <Section>
        <Wide>
          <p
            data-rise
            className="max-w-(--container-measure) font-body text-(length:--text-step-lead) leading-normal text-ink"
          >
            Email is the surest route and is read every day. If a proposal, a
            basin, a dataset or a programme is already on the table, say so in
            the first line — it gets a faster and more useful answer than a
            general introduction.
          </p>

          <ul className="mt-s40 max-w-(--container-measure) space-y-3">
            {PROFILE.contact.map((c, i) => {
              const isMailto = c.href.startsWith('mailto:')
              return (
                <Reveal key={c.label} delay={0.05 * i}>
                  <li>
                    <a
                      href={c.href}
                      target={isMailto ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 bg-mist p-6 transition-colors duration-150 hover:bg-sky sm:p-7"
                    >
                      <span className="font-head text-[1.75rem] leading-none text-ink">
                        {c.label}
                      </span>
                      <span className="flex items-baseline gap-3 font-body leading-relaxed break-all text-ink">
                        {c.value}
                        <span
                          aria-hidden
                          className="transition-transform duration-150 group-hover:translate-x-1"
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
            <div data-rise className="mt-s30">
              <BtnRow>
                <Btn href={EMAIL.href}>Email Romeo</Btn>
                <Btn href="/about" variant="outline">
                  Read the background
                </Btn>
              </BtnRow>
            </div>
          ) : null}
        </Wide>
      </Section>

      {/* ========================= WHAT I TAKE ON ======================== */}
      <Section tone="soft">
        <Wide>
          <h2 data-rise className="max-w-4xl text-ink">
            What I take on
          </h2>
          <p
            data-rise
            style={{ '--i': 1 } as React.CSSProperties}
            className="mt-6 max-w-[48ch] text-(length:--text-step-lead) leading-[1.4] text-ink"
          >
            Five practices, and the kind of brief each one answers.
          </p>

          <ul className="mt-s40 grid gap-6 md:grid-cols-2">
            {PRACTICES.map((p, i) => (
              <Reveal key={p.key} delay={0.05 * i}>
                <li className="h-full">
                  <Link
                    href={p.href}
                    className="group flex h-full flex-col bg-paper p-7 transition-colors duration-150 hover:bg-sky"
                  >
                    <h3 className="leading-[1.05] text-ink">{p.label}</h3>
                    <p className="mt-4 flex-1 font-body leading-relaxed text-ink">{p.blurb}</p>
                    <span className="arrow-link mt-6 self-start text-ink">
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
