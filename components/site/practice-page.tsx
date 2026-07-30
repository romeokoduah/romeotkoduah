import Link from 'next/link'
import {
  PRACTICES,
  PRACTICE_BY_KEY,
  PROJECTS,
  projectsByPractice,
  speakingByKind,
} from '@/content'
import type { Practice, SpeakingKind } from '@/content'
import { Eyebrow, Section, Wide } from './primitives'
import { PageHero } from './page-hero'
import { ProjectCard } from './project-card'
import { Reveal } from './reveal'

/**
 * The shared body behind /research, /consulting, /systems, /communications and
 * /speaking. Each route file is a thin wrapper that supplies the practice key
 * and its own metadata; everything below is common.
 */

/** Section labels for the itemised speaking record, in display order. */
const SPEAKING_GROUPS = [
  { kind: 'facilitation', label: 'Facilitation' },
  { kind: 'conference', label: 'Conferences & convening' },
  { kind: 'training', label: 'Training' },
  { kind: 'teaching', label: 'Teaching' },
  { kind: 'leadership', label: 'Leadership & mentorship' },
] as const satisfies readonly { kind: SpeakingKind; label: string }[]

function projectCount(practice: Practice): number {
  return PROJECTS.filter((p) => p.practice === practice).length
}

/* -------------------------------------------------------------------------- */
/* Speaking — the itemised record, set as an editorial definition list          */
/* -------------------------------------------------------------------------- */

function SpeakingRecord({ accent }: { accent: string }) {
  return (
    <Section tone="soft">
      <Wide>
        <Reveal>
          <Eyebrow style={{ color: accent }}>The itemised record</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-3xl" style={{ color: accent }}>
            Facilitation, teaching, convening and coaching.
          </h2>
        </Reveal>

        <div className="mt-s40 space-y-s30">
          {SPEAKING_GROUPS.map((group, gi) => {
            const entries = speakingByKind(group.kind)
            if (entries.length === 0) return null

            return (
              <Reveal key={group.kind} delay={0.05 * gi}>
                <section>
                  <h3
                    className="border-b-2 pb-3 font-head"
                    style={{ borderColor: accent, color: accent }}
                  >
                    {group.label}
                  </h3>

                  <dl className="mt-2">
                    {entries.map((entry) => {
                      const meta = [entry.org, entry.period, entry.location].filter(
                        Boolean,
                      )

                      return (
                        <div
                          key={entry.id}
                          className="rule grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
                        >
                          <dt className="font-body text-sm font-bold text-ink/70">
                            {entry.role}
                          </dt>
                          <dd>
                            <p className="font-head text-(length:--text-h4) leading-tight text-ink">
                              {entry.title}
                            </p>
                            {meta.length > 0 ? (
                              <p className="mt-2 font-body text-[13px] font-semibold text-ink/55">
                                {meta.join(' · ')}
                              </p>
                            ) : null}
                            {entry.detail ? (
                              <p className="mt-3 max-w-(--container-measure) font-body text-sm leading-relaxed text-ink/75">
                                {entry.detail}
                              </p>
                            ) : null}
                          </dd>
                        </div>
                      )
                    })}
                  </dl>
                </section>
              </Reveal>
            )
          })}
        </div>
      </Wide>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* Cross-navigation to the other four practices                                */
/* -------------------------------------------------------------------------- */

function PracticeCrossNav({ current }: { current: Practice }) {
  const others = PRACTICES.filter((p) => p.key !== current)

  return (
    <Section>
      <Wide>
        <Reveal>
          <Eyebrow className="text-ink/50">Continue through the practice</Eyebrow>
        </Reveal>

        <ul className="mt-s20">
          {others.map((p, i) => (
            <li key={p.key}>
              <Reveal delay={0.05 * i}>
                <Link
                  href={p.href}
                  className="group grid gap-y-3 border-t-2 py-6 transition-colors duration-150 hover:bg-soft md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-x-8"
                  style={{ borderColor: p.accent }}
                >
                  <span
                    className="font-head text-(length:--text-h3) leading-none"
                    style={{ color: p.accent }}
                  >
                    {p.label}
                  </span>
                  <span className="font-body text-sm leading-relaxed text-ink/70">
                    {p.blurb}
                  </span>
                  <span
                    className="inline-flex items-center gap-2 font-body text-sm font-bold whitespace-nowrap transition-transform duration-150 group-hover:translate-x-1"
                    style={{ color: p.accent }}
                  >
                    {projectCount(p.key)} projects <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Wide>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export function PracticePage({ practice }: { practice: Practice }) {
  const meta = PRACTICE_BY_KEY[practice]
  const projects = projectsByPractice(practice)

  return (
    <>
      <PageHero
        eyebrow="Practice"
        title={meta.label}
        lede={meta.blurb}
        accent={meta.accent}
      />

      <Section>
        <Wide>
          <Reveal>
            <Eyebrow style={{ color: meta.accent }}>
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </Eyebrow>
          </Reveal>

          <div className="mt-s20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={0.05 * i}>
                <ProjectCard project={project} className="h-full" priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </Wide>
      </Section>

      {practice === 'speaking' ? <SpeakingRecord accent={meta.accent} /> : null}

      <PracticeCrossNav current={practice} />
    </>
  )
}
