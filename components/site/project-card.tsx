import Image from 'next/image'
import Link from 'next/link'
import { PRACTICE_BY_KEY } from '@/content'
import type { Project } from '@/content/types'
import { logoFor, projectImages } from '@/lib/images'
import { cn, splitTitle } from '@/lib/utils'

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
  const name = org.split(/[—–,]/)[0].replace(/[()./]/g, ' ').trim()

  const words = name.split(/\s+/).filter((w) => w && !STOPWORDS.has(w.toLowerCase()))
  if (words.length === 0) return org.slice(0, 4).toUpperCase()

  // An existing acronym in the name beats initials composed from it —
  // "ATEC / DESS Ghana" should read ATEC, not ADG.
  const existing = words.find((w) => /^[A-Z]{3,6}$/.test(w))
  if (existing) return existing

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

/** Institution mark on a mist field: most logos are multi-colour and need a light ground. */
function LogoTile({ logo, project }: { logo: string; project: Project }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-mist px-6 py-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={`${project.org} logo`}
        loading="lazy"
        decoding="async"
        className="max-h-[72px] max-w-[74%] object-contain"
      />
    </div>
  )
}

/** Typographic tile for projects with neither photograph nor logo. */
function FallbackTile({ project }: { project: Project }) {
  const invert = inverted(project.slug)
  const mark = initials(project.org)
  const size =
    mark.length <= 3 ? 'text-[3.25rem]' : mark.length === 4 ? 'text-[2.75rem]' : 'text-[2.125rem]'

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        invert ? 'bg-sky text-ink' : 'bg-ink text-sky',
      )}
      aria-hidden
    >
      <span className={cn('select-none font-head font-bold leading-none tracking-[-0.02em]', size)}>
        {mark}
      </span>
    </div>
  )
}

/**
 * One entry in a project index: a picture on the left, the words on the
 * right, separated from its neighbours by space rather than a box.
 */
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
  const logo = cover ? null : logoFor(project.slug)
  const [name, expansion] = splitTitle(project.title)

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn('group grid gap-5 sm:grid-cols-[200px_1fr] sm:gap-7', className)}
    >
      <div className="relative aspect-16/9 w-full self-start overflow-hidden sm:aspect-4/3">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 640px) 200px, 100vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            priority={priority}
          />
        ) : logo ? (
          <LogoTile logo={logo} project={project} />
        ) : (
          <FallbackTile project={project} />
        )}
      </div>

      <div>
        <h3 className="font-head text-[clamp(1.375rem,1.2rem+0.4vw,1.625rem)] leading-[1.02] tracking-[-0.01em] transition-colors duration-150 group-hover:text-muted">
          {name}
        </h3>
        {expansion ? (
          <p className="mt-1.5 text-[1.0625rem] font-medium leading-snug text-ink">{expansion}</p>
        ) : null}
        <p className="mt-2 text-[0.9375rem] text-muted">
          {practice.short} · {project.org.split(/ [—–] /)[0]} · {project.period}
        </p>
        <p className="mt-3 hidden max-w-[60ch] text-[1.0625rem] leading-[1.5] sm:block">
          {project.summary}
        </p>
      </div>
    </Link>
  )
}
