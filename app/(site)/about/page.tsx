import type { Metadata } from 'next'
import Image from 'next/image'
import type {
  Award,
  Certification,
  EducationEntry,
  Membership,
  SkillGroup,
} from '@/content'
import {
  AWARDS,
  CERTIFICATIONS,
  EDUCATION,
  MEMBERSHIPS,
  PROFILE,
  SKILLS,
} from '@/content'

import { siteImages } from '@/lib/images'
import { Btn, BtnRow, Chip, Eyebrow, Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { PageHero } from '@/components/site/page-hero'

/*
 * The content modules use `as const satisfies` to keep their literals narrow,
 * which leaves optional fields absent from the members that omit them. Widen
 * to the declared interfaces here so the optional fields can be read.
 */
const EDUCATION_ENTRIES: readonly EducationEntry[] = EDUCATION
const AWARD_ENTRIES: readonly Award[] = AWARDS
const CERTIFICATION_ENTRIES: readonly Certification[] = CERTIFICATIONS
const MEMBERSHIP_ENTRIES: readonly Membership[] = MEMBERSHIPS
const SKILL_GROUPS: readonly SkillGroup[] = SKILLS

const ACCENT = 'var(--color-ember)'

/** One token colour per skill group, cycled — matches the site's colour blocking. */
const SKILL_ACCENTS = [
  '#0b472c',
  '#a4400a',
  '#4458be',
  '#c14300',
  '#158753',
  '#0b472c',
]

/** Certification years, newest first. Handles spans such as "2024–25". */
const CERT_YEARS = Array.from(new Set(CERTIFICATIONS.map((c) => c.year))).sort(
  (a, b) => b.localeCompare(a),
)

export const metadata: Metadata = {
  title: 'About',
  description:
    'Romeo Tweneboah Koduah — environmental engineer and water data scientist. Biography, education, awards and fellowships, certifications, professional memberships and technical skills.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const { portrait } = siteImages()

  return (
    <>
      <PageHero
        eyebrow="About"
        title={PROFILE.name}
        lede={PROFILE.title}
        accent={ACCENT}
      />

      {/* ============================== BIO ============================== */}
      <Section>
        <Wide>
          {portrait ? (
            <div className="grid items-start gap-s30 lg:grid-cols-[1fr_340px]">
              <Reveal>
                <p className="max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
                  {PROFILE.bio[0]}
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="relative aspect-2/3 w-full">
                  <Image
                    src={portrait}
                    alt={PROFILE.name}
                    fill
                    sizes="(min-width: 1024px) 340px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </Reveal>
            </div>
          ) : (
            <Reveal>
              <p className="max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
                {PROFILE.bio[0]}
              </p>
            </Reveal>
          )}

          {PROFILE.bio.slice(1).map((para, i) => (
            <Reveal key={i} delay={0.06 * (i + 1)}>
              <p className="mt-7 max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
                {para}
              </p>
            </Reveal>
          ))}
        </Wide>
      </Section>

      {/* ============================ EDUCATION ========================== */}
      <Section tone="soft" id="education">
        <Wide>
          <Reveal>
            <Eyebrow style={{ color: ACCENT }}>Education</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-ink">
              Environmental engineering, then the politics that surrounds it.
            </h2>
          </Reveal>

          <ul className="mt-s40 max-w-(--container-measure)">
            {EDUCATION_ENTRIES.map((e, i) => (
              <Reveal key={e.id} delay={0.06 * i}>
                <li className="rule py-7 first:border-t-0 first:pt-0">
                  <h3 className="text-ink">{e.degree}</h3>
                  <p className="mt-3 font-body text-sm text-ink/70">
                    {e.institution} · {e.location}
                  </p>
                  <p className="mt-1 font-body text-sm tabular-nums text-ink/55">
                    {e.period}
                  </p>
                  {e.award ? (
                    <p className="mt-4">
                      <Chip accent={ACCENT}>{e.award}</Chip>
                    </p>
                  ) : null}
                  {e.thesis ? (
                    <p className="mt-4 font-body text-sm italic leading-relaxed text-ink/75">
                      {e.thesis}
                    </p>
                  ) : null}
                </li>
              </Reveal>
            ))}
          </ul>
        </Wide>
      </Section>

      {/* ============================= AWARDS ============================ */}
      <Section id="awards">
        <Wide>
          <Reveal>
            <Eyebrow style={{ color: 'var(--color-rust)' }}>
              Awards &amp; fellowships
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-rust">
              Selection, scholarship and recognition.
            </h2>
          </Reveal>

          <ul className="mt-s40 max-w-(--container-measure)">
            {AWARD_ENTRIES.map((a, i) => (
              <Reveal key={a.id} delay={0.04 * i}>
                <li className="rule grid gap-2 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] sm:gap-6">
                  <span className="font-head text-lg leading-none tabular-nums text-rust">
                    {a.year}
                  </span>
                  <div>
                    <p className="font-body text-base font-semibold leading-snug text-ink">
                      {a.title}
                    </p>
                    {a.org ? (
                      <p className="mt-1 font-body text-sm text-ink/65">{a.org}</p>
                    ) : null}
                    {a.detail ? (
                      <p className="mt-2 font-body text-sm leading-relaxed text-ink/60">
                        {a.detail}
                      </p>
                    ) : null}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </Wide>
      </Section>

      {/* ========================= CERTIFICATIONS ======================== */}
      <Section tone="soft" id="certifications">
        <Wide>
          <Reveal>
            <Eyebrow style={{ color: 'var(--color-indigo)' }}>
              Certifications &amp; professional training
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-indigo">
              Modelling, safety, facilitation and policy, kept current.
            </h2>
          </Reveal>

          <div className="mt-s40 max-w-(--container-measure)">
            {CERT_YEARS.map((year, i) => (
              <Reveal key={year} delay={0.05 * i}>
                <div className="rule grid gap-3 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] sm:gap-6">
                  <span className="font-head text-lg leading-none tabular-nums text-indigo">
                    {year}
                  </span>
                  <ul className="space-y-4">
                    {CERTIFICATION_ENTRIES.filter((c) => c.year === year).map((c) => (
                      <li key={c.id}>
                        <p className="font-body text-sm font-semibold leading-snug text-ink">
                          {c.title}
                        </p>
                        {c.issuer ? (
                          <p className="mt-1 font-body text-sm text-ink/60">
                            {c.issuer}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Wide>
      </Section>

      {/* ========================== MEMBERSHIPS ========================== */}
      <Section id="memberships">
        <Wide>
          <Reveal>
            <Eyebrow style={{ color: 'var(--color-forest)' }}>
              Professional memberships &amp; licensure
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-forest">
              Registered practice, and the networks behind it.
            </h2>
          </Reveal>

          <ul className="mt-s40 grid gap-6 sm:grid-cols-2">
            {MEMBERSHIP_ENTRIES.map((m, i) => (
              <Reveal key={m.id} delay={0.05 * i}>
                <li className="h-full border-2 border-forest/25 bg-paper p-6">
                  <p className="font-head text-xl leading-none text-forest">
                    {m.role}
                  </p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">
                    {m.org}
                  </p>
                  {m.credential ? (
                    <p className="mt-4">
                      <Chip accent="var(--color-forest)">{m.credential}</Chip>
                    </p>
                  ) : null}
                </li>
              </Reveal>
            ))}
          </ul>
        </Wide>
      </Section>

      {/* ============================= SKILLS ============================ */}
      <Section tone="soft" id="skills">
        <Wide>
          <Reveal>
            <Eyebrow style={{ color: 'var(--color-emerald)' }}>
              Technical skills
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-emerald">
              The toolkit, from earth observation to production software.
            </h2>
          </Reveal>

          <div className="mt-s40 grid gap-s30 md:grid-cols-2">
            {SKILL_GROUPS.map((group, i) => {
              const accent = SKILL_ACCENTS[i % SKILL_ACCENTS.length]
              return (
                <Reveal key={group.id} delay={0.05 * i}>
                  <div className="border-t-2 pt-6" style={{ borderColor: accent }}>
                    <h3 className="leading-tight" style={{ color: accent }}>
                      {group.title}
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          <Chip accent={accent}>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Wide>
      </Section>

      {/* ============================== CTA ============================== */}
      <Section tone="forest" className="text-center">
        <Wide>
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-soft">
              The record is here. The next question is yours.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <BtnRow align="center" className="mt-9">
              <Btn href="/contact">Get in touch</Btn>
              <Btn href="/publications" variant="outline" accent="var(--color-soft)">
                Read the publications
              </Btn>
            </BtnRow>
          </Reveal>
        </Wide>
      </Section>
    </>
  )
}
