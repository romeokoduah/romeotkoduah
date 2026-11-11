import Link from 'next/link'
import { PRACTICE_PHOTOS } from '@/content/photos'
import {
  PRACTICES,
  PRACTICE_BY_KEY,
  PROJECTS,
  projectsByPractice,
  speakingByKind,
} from '@/content'
import type { Practice, SpeakingKind } from '@/content'
import { Section, Wide } from './primitives'
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

function SpeakingRecord() {
  return (
    <Section tone="soft">
      <Wide>
        <Reveal>
          <h2 className="max-w-3xl">The full record</h2>
        </Reveal>

        <div className="mt-s40 space-y-s30">
          {SPEAKING_GROUPS.map((group, gi) => {
            const entries = speakingByKind(group.kind)
            if (entries.length === 0) return null

            return (
              <Reveal key={group.kind} delay={0.05 * gi}>
                <section>
                  <h3 className="font-head">
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
                          <dt className="font-body text-[1rem] font-medium text-muted">
                            {entry.role}
                          </dt>
                          <dd>
                            <p className="font-head text-(length:--text-h4) leading-tight text-ink">
                              {entry.title}
                            </p>
                            {meta.length > 0 ? (
                              <p className="mt-2 font-body text-[0.9375rem] text-muted">
                                {meta.join(' · ')}
                              </p>
                            ) : null}
                            {entry.detail ? (
                              <p className="mt-3 max-w-(--container-measure) font-body leading-relaxed text-ink">
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
    <Section tone="sky">
      <Wide>
        <Reveal>
          <h2>The other four practices</h2>
        </Reveal>

        <ul className="mt-s40">
          {others.map((p, i) => (
            <li key={p.key}>
              <Reveal delay={0.05 * i}>
                <Link
                  href={p.href}
                  className="group grid gap-y-3 py-6 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-x-10"
                >
                  <span className="font-head text-(length:--text-h3) font-bold leading-none transition-transform duration-200 group-hover:translate-x-1">
                    {p.label}
                  </span>
                  <span className="font-body leading-relaxed text-ink">{p.blurb}</span>
                  <span className="inline-flex items-center gap-2 whitespace-nowrap font-body font-medium transition-transform duration-150 group-hover:translate-x-1">
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
        title={meta.label}
        lede={`${meta.blurb} ${projects.length} ${projects.length === 1 ? 'project' : 'projects'} below.`}
        photo={PRACTICE_PHOTOS[practice]}
      />

      <Section>
        <Wide>
          <div className="grid gap-x-14 gap-y-14 lg:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={0.05 * i}>
                <ProjectCard project={project} className="h-full" priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </Wide>
      </Section>

      {practice === 'speaking' ? <SpeakingRecord /> : null}

      <PracticeCrossNav current={practice} />
    </>
  )
}
