import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  FEATURED_PROJECTS,
  PRACTICE_BY_KEY,
  PROJECTS,
  getProject,
  projectsByPractice,
} from '@/content'
import type { Project } from '@/content'
import { projectImages } from '@/lib/images'
import { Btn, Chip, Eyebrow, Section, Wide } from '@/components/site/primitives'
import { ProjectCard } from '@/components/site/project-card'
import { ProjectGallery } from '@/components/site/project-gallery'
import { Reveal } from '@/components/site/reveal'

type PageProps = { params: Promise<{ slug: string }> }

/** Static export: every detail page is pre-rendered from the content module. */
export function generateStaticParams(): { slug: string }[] {
  return PROJECTS.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) {
    return { title: 'Project not found' }
  }

  const practice = PRACTICE_BY_KEY[project.practice]

  return {
    title: project.title,
    description: project.summary,
    keywords: [...project.tags, project.org, practice.label],
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      url: `/work/${project.slug}`,
      title: `${project.title} — Romeo Tweneboah Koduah`,
      description: project.summary,
    },
  }
}

/** "View the repository" reads better than "Visit the site" for a GitHub link. */
function outboundLabel(href: string): string {
  return /github\.com/i.test(href) ? 'View the repository' : 'Visit the site'
}

/**
 * Three siblings from the same practice, topped up with featured work from the
 * other practices when a practice holds fewer than four projects.
 */
function relatedProjects(project: Project): readonly Project[] {
  const siblings = projectsByPractice(project.practice).filter(
    (p) => p.slug !== project.slug,
  )

  if (siblings.length >= 3) return siblings.slice(0, 3)

  const chosen = new Set(siblings.map((p) => p.slug))
  const fill = FEATURED_PROJECTS.filter(
    (p) => p.practice !== project.practice && !chosen.has(p.slug),
  ).slice(0, 3 - siblings.length)

  return [...siblings, ...fill]
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) notFound()

  const practice = PRACTICE_BY_KEY[project.practice]
  const accent = practice.accent
  const { cover, gallery } = projectImages(project.slug)
  const related = relatedProjects(project)

  const hasOutputs = Boolean(project.outputs && project.outputs.length > 0)
  const hasPartners = Boolean(project.partners && project.partners.length > 0)
  const hasTags = project.tags.length > 0
  const hasAside = hasOutputs || hasPartners || hasTags

  return (
    <>
      {/* ============================= HERO ============================= */}
      <div
        className="border-b-2 py-s50"
        style={{ backgroundColor: `${accent}0d`, borderColor: accent }}
      >
        <Wide>
          <Reveal>
            <Link
              href={practice.href}
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] transition-transform duration-150 hover:translate-x-0.5"
              style={{ color: accent }}
            >
              <span aria-hidden>←</span> {practice.short}
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-4 max-w-4xl" style={{ color: accent }}>
              {project.title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-body text-sm font-semibold text-ink/70">
              <span>{project.org}</span>
              <span aria-hidden style={{ color: accent }}>
                ·
              </span>
              <span>{project.role}</span>
              <span aria-hidden style={{ color: accent }}>
                ·
              </span>
              <span>{project.period}</span>
            </p>
          </Reveal>

          {project.funding ? (
            <Reveal delay={0.16}>
              <p className="mt-3 font-body text-sm text-ink/70">
                <span
                  className="font-bold uppercase tracking-[0.16em] text-[11px]"
                  style={{ color: accent }}
                >
                  Funding
                </span>{' '}
                {project.funding}
              </p>
            </Reveal>
          ) : null}
        </Wide>
      </div>

      {/* ============================ COVER ============================= */}
      {cover ? (
        <div className="relative aspect-21/9 w-full overflow-hidden bg-soft">
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {/* ============================= BODY ============================= */}
      <Section>
        <Wide>
          <div
            className={
              hasAside
                ? 'grid gap-s30 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-s40'
                : ''
            }
          >
            <div>
              <Reveal>
                <p className="max-w-(--container-measure) font-head text-(length:--text-fluid-md) leading-snug text-ink">
                  {project.summary}
                </p>
              </Reveal>

              <div className="mt-8 max-w-(--container-measure) space-y-6">
                {project.body.map((paragraph, i) => (
                  <Reveal key={i} delay={0.05 * i}>
                    <p className="font-body text-(length:--text-fluid-sm) leading-[1.75] text-ink/85">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              {project.href ? (
                <Reveal delay={0.1}>
                  <div className="mt-9">
                    <Btn href={project.href} accent={accent}>
                      {outboundLabel(project.href)}
                    </Btn>
                  </div>
                </Reveal>
              ) : null}
            </div>

            {hasAside ? (
              <aside className="lg:pt-1">
                {hasOutputs ? (
                  <Reveal>
                    <section>
                      <h2
                        className="border-b-2 pb-3 font-head text-(length:--text-h4)"
                        style={{ borderColor: accent, color: accent }}
                      >
                        Outputs
                      </h2>
                      <ul className="mt-1">
                        {project.outputs?.map((output) => (
                          <li
                            key={output}
                            className="rule py-4 font-body text-sm leading-relaxed text-ink/80"
                          >
                            {output}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </Reveal>
                ) : null}

                {hasPartners ? (
                  <Reveal delay={0.06}>
                    <section className={hasOutputs ? 'mt-s30' : undefined}>
                      <h2
                        className="border-b-2 pb-3 font-head text-(length:--text-h4)"
                        style={{ borderColor: accent, color: accent }}
                      >
                        Partners
                      </h2>
                      <ul className="mt-1">
                        {project.partners?.map((partner) => (
                          <li
                            key={partner}
                            className="rule py-3 font-body text-sm leading-relaxed text-ink/80"
                          >
                            {partner}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </Reveal>
                ) : null}

                {hasTags ? (
                  <Reveal delay={0.12}>
                    <section
                      className={hasOutputs || hasPartners ? 'mt-s30' : undefined}
                    >
                      <h2
                        className="border-b-2 pb-3 font-head text-(length:--text-h4)"
                        style={{ borderColor: accent, color: accent }}
                      >
                        Methods and themes
                      </h2>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <li key={tag}>
                            <Chip accent={accent}>{tag}</Chip>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </Reveal>
                ) : null}
              </aside>
            ) : null}
          </div>
        </Wide>
      </Section>

      {/* =========================== GALLERY ============================ */}
      {gallery.length > 0 ? (
        <Section tone="soft">
          <Wide>
            <Reveal>
              <Eyebrow style={{ color: accent }}>From the field</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mt-s20">
                <ProjectGallery
                  images={gallery}
                  title={project.title}
                  accent={accent}
                />
              </div>
            </Reveal>
          </Wide>
        </Section>
      ) : null}

      {/* =========================== RELATED ============================ */}
      {related.length > 0 ? (
        <Section tone={gallery.length > 0 ? 'paper' : 'soft'}>
          <Wide>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <h2 style={{ color: accent }}>More in {practice.short}</h2>
              </Reveal>
              <Reveal delay={0.06}>
                <Btn href={practice.href} variant="outline" accent={accent}>
                  All {practice.short.toLowerCase()} projects
                </Btn>
              </Reveal>
            </div>

            <div className="mt-s40 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((sibling, i) => (
                <Reveal key={sibling.slug} delay={0.05 * i}>
                  <ProjectCard project={sibling} className="h-full" />
                </Reveal>
              ))}
            </div>
          </Wide>
        </Section>
      ) : null}
    </>
  )
}
