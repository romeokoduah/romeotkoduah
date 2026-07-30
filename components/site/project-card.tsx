import Image from 'next/image'
import Link from 'next/link'
import { PRACTICE_BY_KEY } from '@/content'
import type { Project } from '@/content/types'
import { projectImages } from '@/lib/images'
import { cn } from '@/lib/utils'

const STOPWORDS = new Set([
  'of',
  'the',
  'and',
  'for',
  'in',
  'on',
  'to',
  'a',
  'at',
  'via',
])

/**
 * Monogram for an organisation. Several `org` values are descriptive phrases
 * rather than names ("Pitched to the International Organization for Migration
 * (IOM)"), so prefer an explicit parenthetical acronym, then an existing
 * all-caps name, and only then fall back to composed initials.
 */
function initials(org: string): string {
  const parenthetical = org.match(/\(([A-Z][A-Za-z]{1,6}\+?)\)/)
  if (parenthetical) return parenthetical[1].toUpperCase()

  // Everything before a dash or comma is the name; the rest is description.
  const name = org.split(/[—–,]/)[0].replace(/[().]/g, ' ').trim()

  const words = name.split(/\s+/).filter((w) => w && !STOPWORDS.has(w.toLowerCase()))
  if (words.length === 0) return org.slice(0, 4).toUpperCase()

  // A single token that is already an acronym or a short name stands alone.
  if (words.length === 1) return words[0].toUpperCase().slice(0, 6)

  return words
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 5)
}

/** Deterministic per-slug variation, so a grid isn't a wall of one colour. */
function inverted(slug: string): boolean {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h % 2 === 1
}

/**
 * Typographic tile shown until a `cover.jpg` is dropped into
 * public/images/projects/<slug>/. Keeps the grid looking finished from day one.
 */
function FallbackTile({ project, accent }: { project: Project; accent: string }) {
  const invert = inverted(project.slug)
  const mark = initials(project.org)

  // Long monograms need to step down so they never clip the tile.
  const size =
    mark.length <= 3 ? 'text-[3.5rem]' : mark.length === 4 ? 'text-[3rem]' : 'text-[2.25rem]'

  return (
    <div
      className="relative flex aspect-16/10 w-full items-center justify-center overflow-hidden"
      style={
        invert
          ? { backgroundColor: 'var(--color-soft)', borderBottom: `2px solid ${accent}` }
          : { backgroundColor: accent }
      }
      aria-hidden
    >
      <span
        className={cn('select-none font-head leading-none tracking-tight', size)}
        style={{ color: invert ? accent : 'rgba(255,255,255,0.92)' }}
      >
        {mark}
      </span>
      <span
        className="absolute bottom-3 right-4 font-body text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: invert ? `${accent}99` : 'rgba(255,255,255,0.55)' }}
      >
        {project.period}
      </span>
    </div>
  )
}

export function ProjectCard({
  project,
  className,
  priority = false,
}: {
  project: Project
  className?: string
  priority?: boolean
}) {
  const practice = PRACTICE_BY_KEY[project.practice]
  const { cover } = projectImages(project.slug)

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        'group flex flex-col border-2 bg-paper transition-colors duration-150',
        className,
      )}
      style={{ borderColor: practice.accent }}
    >
      {cover ? (
        <div className="relative aspect-16/10 w-full overflow-hidden">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
            priority={priority}
          />
        </div>
      ) : (
        <FallbackTile project={project} accent={practice.accent} />
      )}

      <div className="flex flex-1 flex-col p-5">
        <p
          className="font-body text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ color: practice.accent }}
        >
          {practice.short}
        </p>

        <h3 className="mt-2 font-head leading-[1.15]">{project.title}</h3>

        <p className="mt-2 font-body text-[13px] font-semibold text-ink/55">
          {project.org} · {project.period}
        </p>

        <p className="mt-3 font-body text-sm leading-relaxed text-ink/80">
          {project.summary}
        </p>

        <span
          className="mt-5 inline-flex items-center gap-2 font-body text-sm font-bold transition-transform duration-150 group-hover:translate-x-1"
          style={{ color: practice.accent }}
        >
          Read more <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
