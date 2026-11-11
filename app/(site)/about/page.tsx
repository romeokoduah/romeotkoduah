import type { Metadata } from 'next'
import Image from 'next/image'
import type { ReactNode } from 'react'
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
import { Btn, BtnRow, Section, Wide } from '@/components/site/primitives'
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

/** Certification years, newest first. Handles spans such as "2024–25". */
const CERT_YEARS = Array.from(new Set(CERTIFICATIONS.map((c) => c.year))).sort(
  (a, b) => b.localeCompare(a),
)

/** A tag set on paper, for use on mist fields where the shared (mist) Chip would vanish. */
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block bg-paper px-3 py-1.5 font-body text-[0.9375rem] font-medium leading-none text-ink">
      {children}
    </span>
  )
}

/** Section opening: a short heading, then its sentence at lead size. */
function SectionIntro({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <>
      <h2 data-rise className="max-w-4xl text-ink">
        {title}
      </h2>
      <p
        data-rise
        style={{ '--i': 1 } as React.CSSProperties}
        className="mt-6 max-w-[48ch] text-(length:--text-step-lead) leading-[1.4] text-ink"
      >
        {children}
      </p>
    </>
  )
}

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
      <PageHero title={PROFILE.name} lede={PROFILE.title} />

      {/* ============================== BIO ============================== */}
      <Section>
        <Wide>
          {portrait ? (
            <div className="grid items-start gap-s30 lg:grid-cols-[1fr_340px]">
              <p
                data-rise
                className="max-w-(--container-measure) font-body text-(length:--text-step-lead) leading-normal text-ink"
              >
                {PROFILE.bio[0]}
              </p>
              <div
                data-rise
                style={{ '--i': 1 } as React.CSSProperties}
                className="relative aspect-2/3 w-full"
              >
                <Image
                  src={portrait}
                  alt={PROFILE.name}
                  fill
                  sizes="(min-width: 1024px) 340px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          ) : (
            <p
              data-rise
              className="max-w-(--container-measure) font-body text-(length:--text-step-lead) leading-normal text-ink"
            >
              {PROFILE.bio[0]}
            </p>
          )}

          {PROFILE.bio.slice(1).map((para, i) => (
            <p
              key={i}
              data-rise
              style={{ '--i': i + 1 } as React.CSSProperties}
              className="mt-7 max-w-(--container-measure) font-body text-(length:--text-step-lead) leading-normal text-ink"
            >
              {para}
            </p>
          ))}
        </Wide>
      </Section>

      {/* ============================ EDUCATION ========================== */}
      <Section tone="soft" id="education">
        <Wide>
          <SectionIntro title="Education">
            Environmental engineering, then the diplomacy that surrounds it.
          </SectionIntro>

          <ul className="mt-s40 max-w-(--container-measure) space-y-s30">
            {EDUCATION_ENTRIES.map((e, i) => (
              <Reveal key={e.id} delay={0.06 * i}>
                <li>
                  <h3 className="text-ink">{e.degree}</h3>
                  <p className="mt-3 font-body text-ink">
                    {e.institution} · {e.location}
                  </p>
                  <p className="mt-1 font-body tabular-nums text-muted">{e.period}</p>
                  {e.award ? (
                    <p className="mt-4">
                      <Tag>{e.award}</Tag>
                    </p>
                  ) : null}
                  {e.thesis ? (
                    <p className="mt-4 font-body italic leading-relaxed text-muted">
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
          <SectionIntro title={<>Awards &amp; fellowships</>}>
            Selection, scholarship and recognition.
          </SectionIntro>

          <ul className="mt-s40 max-w-(--container-measure) space-y-8">
            {AWARD_ENTRIES.map((a, i) => (
              <Reveal key={a.id} delay={0.04 * i}>
                <li className="grid gap-2 sm:grid-cols-[5rem_1fr] sm:gap-6">
                  <span className="font-head text-[1.375rem] leading-none tabular-nums text-ink">
                    {a.year}
                  </span>
                  <div>
                    <p className="font-body font-semibold leading-snug text-ink">{a.title}</p>
                    {a.org ? <p className="mt-1 font-body text-muted">{a.org}</p> : null}
                    {a.detail ? (
                      <p className="mt-2 font-body leading-relaxed text-ink">{a.detail}</p>
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
          <SectionIntro title={<>Certifications &amp; training</>}>
            Modelling, safety, facilitation and policy, kept current.
          </SectionIntro>

          <div className="mt-s40 max-w-(--container-measure) space-y-s30">
            {CERT_YEARS.map((year, i) => (
              <Reveal key={year} delay={0.05 * i}>
                <div className="grid gap-3 sm:grid-cols-[5rem_1fr] sm:gap-6">
                  <span className="font-head text-[1.375rem] leading-none tabular-nums text-ink">
                    {year}
                  </span>
                  <ul className="space-y-4">
                    {CERTIFICATION_ENTRIES.filter((c) => c.year === year).map((c) => (
                      <li key={c.id}>
                        <p className="font-body font-semibold leading-snug text-ink">
                          {c.title}
                        </p>
                        {c.issuer ? (
                          <p className="mt-1 font-body text-muted">{c.issuer}</p>
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
          <SectionIntro title={<>Memberships &amp; licensure</>}>
            Registered practice, and the networks behind it.
          </SectionIntro>

          <ul className="mt-s40 grid gap-6 sm:grid-cols-2">
            {MEMBERSHIP_ENTRIES.map((m, i) => (
              <Reveal key={m.id} delay={0.05 * i}>
                <li className="h-full bg-mist p-7">
                  <p className="font-head text-[1.375rem] leading-none text-ink sm:text-[1.625rem]">{m.role}</p>
                  <p className="mt-3 font-body leading-relaxed text-ink">{m.org}</p>
                  {m.credential ? (
                    <p className="mt-4">
                      <Tag>{m.credential}</Tag>
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
          <SectionIntro title="Technical skills">
            The toolkit, from earth observation to production software.
          </SectionIntro>

          <div className="mt-s40 grid gap-x-s30 gap-y-20 md:grid-cols-2">
            {SKILL_GROUPS.map((group, i) => (
              <Reveal key={group.id} delay={0.05 * i}>
                <div>
                  <h3 className="leading-tight text-ink">{group.title}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Wide>
      </Section>

      {/* ============================== CTA ============================== */}
      <Section tone="ink" className="text-center">
        <Wide>
          <h2 data-rise className="mx-auto max-w-4xl text-paper">
            The record is here. The next question is yours.
          </h2>
          <div data-rise style={{ '--i': 1 } as React.CSSProperties}>
            <BtnRow align="center" className="mt-9">
              <Btn href="/contact">Get in touch</Btn>
              <Btn href="/publications" variant="outline" accent="var(--color-paper)">
                Read the publications
              </Btn>
            </BtnRow>
          </div>
        </Wide>
      </Section>
    </>
  )
}
