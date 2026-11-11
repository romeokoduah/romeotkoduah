import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { splitTitle } from '@/lib/utils'
import { notFound } from 'next/navigation'
import {
  FEATURED_PROJECTS,
  PRACTICE_BY_KEY,
  PROJECTS,
  getProject,
  projectsByPractice,
} from '@/content'
import type { Project } from '@/content'
import { logoFor, projectImages } from '@/lib/images'
import { Btn, Chip, Section, Wide } from '@/components/site/primitives'
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
  const logo = logoFor(project.slug)
  const { cover, gallery } = projectImages(project.slug)
  const related = relatedProjects(project)

  const hasOutputs = Boolean(project.outputs && project.outputs.length > 0)
  const hasPartners = Boolean(project.partners && project.partners.length > 0)
  const hasTags = project.tags.length > 0
  const hasAside = hasOutputs || hasPartners || hasTags

  return (
    <>
      {/* ============================= HERO ============================= */}
      <div className="bg-sky pb-s50 pt-s40">
        <Wide>
          {logo ? (
            <div data-rise className="mb-8">
              {/* Explicit height, auto width: several of these SVGs carry a
                  viewBox but no intrinsic size, so max-* alone collapses them
                  to zero inside a shrink-to-fit parent. */}
              <div className="inline-flex items-center bg-paper px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={`${project.org} logo`}
                  className="h-[46px] w-auto max-w-[240px] object-contain"
                />
              </div>
            </div>
          ) : null}

          {/* Long titles take a wider measure rather than a smaller size. */}
          <h1
            data-rise
            style={{ '--i': 1 } as React.CSSProperties}
            className="max-w-[24ch] text-ink"
          >
            {splitTitle(project.title)[0]}
          </h1>
          {splitTitle(project.title)[1] ? (
            <p
              data-rise
              style={{ '--i': 1 } as React.CSSProperties}
              className="mt-5 max-w-[40ch] font-head text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.01em] text-muted"
            >
              {splitTitle(project.title)[1]}
            </p>
          ) : null}

          <p
            data-rise
            style={{ '--i': 2 } as React.CSSProperties}
            className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-body text-(length:--text-step-lead) leading-[1.4] text-ink"
          >
            <span>{project.org}</span>
            <span aria-hidden>·</span>
            <span>{project.role}</span>
            <span aria-hidden>·</span>
            <span>{project.period}</span>
          </p>

          {project.funding ? (
            <p
              data-rise
              style={{ '--i': 3 } as React.CSSProperties}
              className="mt-3 max-w-[60ch] font-body text-ink"
            >
              <span className="font-semibold">Funding:</span> {project.funding}
            </p>
          ) : null}

          <p data-rise style={{ '--i': 4 } as React.CSSProperties} className="mt-8">
            <Link href={practice.href} className="arrow-link text-ink">
              <span aria-hidden>←</span> {practice.short}
            </Link>
          </p>
        </Wide>
      </div>

      {/* ============================ COVER ============================= */}
      {cover ? (
        <div className="relative aspect-21/9 w-full overflow-hidden bg-mist">
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
              <p
                data-rise
                className="max-w-(--container-measure) font-body text-(length:--text-step-lead) font-medium leading-snug text-ink"
              >
                {project.summary}
              </p>

              <div className="mt-8 max-w-(--container-measure) space-y-6">
                {project.body.map((paragraph, i) => (
                  <p
                    key={i}
                    data-rise
                    style={{ '--i': i + 1 } as React.CSSProperties}
                    className="font-body leading-[1.7] text-ink"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {project.href ? (
                <div data-rise className="mt-9">
                  <Btn href={project.href}>{outboundLabel(project.href)}</Btn>
                </div>
              ) : null}
            </div>

            {hasAside ? (
              <aside className="space-y-s30 lg:pt-1">
                {hasOutputs ? (
                  <section data-rise>
                    <h2 className="font-head text-(length:--text-h4) text-ink">Outputs</h2>
                    <ul className="mt-4 space-y-4">
                      {project.outputs?.map((output) => (
                        <li key={output} className="font-body leading-relaxed text-ink">
                          {output}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {hasPartners ? (
                  <section data-rise style={{ '--i': 1 } as React.CSSProperties}>
                    <h2 className="font-head text-(length:--text-h4) text-ink">Partners</h2>
                    <ul className="mt-4 space-y-3">
                      {project.partners?.map((partner) => (
                        <li key={partner} className="font-body leading-relaxed text-ink">
                          {partner}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {hasTags ? (
                  <section data-rise style={{ '--i': 2 } as React.CSSProperties}>
                    <h2 className="font-head text-(length:--text-h4) text-ink">
                      Methods and themes
                    </h2>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <Chip>{tag}</Chip>
                        </li>
                      ))}
                    </ul>
                  </section>
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
            <h2 data-rise className="text-ink">
              From the field
            </h2>
            <div data-rise style={{ '--i': 1 } as React.CSSProperties} className="mt-s40">
              <ProjectGallery images={gallery} title={project.title} />
            </div>
          </Wide>
        </Section>
      ) : null}

      {/* =========================== RELATED ============================ */}
      {related.length > 0 ? (
        <Section tone={gallery.length > 0 ? 'paper' : 'soft'}>
          <Wide>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 data-rise className="text-ink">
                More in {practice.short}
              </h2>
              <div data-rise style={{ '--i': 1 } as React.CSSProperties}>
                <Btn href={practice.href} variant="outline">
                  All {practice.short.toLowerCase()} projects
                </Btn>
              </div>
            </div>

            <div className="mt-s40 grid gap-x-14 gap-y-12 lg:grid-cols-2">
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
