import type { Metadata } from 'next'
import { PAGE_PHOTOS } from '@/content/photos'
import Link from 'next/link'
import { PRACTICES, PROJECTS, projectsByPractice } from '@/content'
import { PageHero } from '@/components/site/page-hero'
import { ProjectCard } from '@/components/site/project-card'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Every project across research and hydrology, policy and consulting, AI and digital systems, communications, and training.',
  alternates: { canonical: '/work' },
}

export default function WorkIndexPage() {
  return (
    <>
      <PageHero
        title="Work"
        lede={`${PROJECTS.length} projects across five practices, from continental discharge models to national regulation and the software that carries them.`}
        photo={PAGE_PHOTOS.work}
      >
        <nav aria-label="Practices" className="flex flex-wrap gap-x-7 gap-y-3">
          {PRACTICES.map((p) => (
            <a key={p.key} href={`#${p.key}`} className="arrow-link">
              {p.short}
            </a>
          ))}
        </nav>
      </PageHero>

      {PRACTICES.map((p, i) => {
        const projects = projectsByPractice(p.key)
        return (
          <section
            key={p.key}
            id={p.key}
            aria-labelledby={`${p.key}-heading`}
            className={cn('py-s60', i % 2 === 1 && 'bg-mist')}
          >
            <div className="mx-auto max-w-(--container-wide) px-s30">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <h2 id={`${p.key}-heading`} data-rise className="max-w-[24ch]">
                  {p.label}
                </h2>
                <Link href={p.href} className="arrow-link" data-rise>
                  The practice <span aria-hidden>→</span>
                </Link>
              </div>
              <p data-rise className="mt-6 max-w-[60ch]">
                {p.blurb}
              </p>
              <div className="mt-s40 grid gap-x-14 gap-y-16 lg:grid-cols-2">
                {projects.map((project) => (
                  <div key={project.slug} data-rise>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
