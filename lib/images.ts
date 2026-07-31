import manifest from '@/content/image-manifest.json'
import { LOGO_KEYS_BY_SLUG } from '@/content/logos'

export interface ProjectImages {
  cover: string | null
  gallery: string[]
}

export interface SiteImages {
  portrait: string | null
  hero: string | null
  backgrounds: string[]
}

interface Manifest {
  site: SiteImages
  projects: Record<string, ProjectImages>
  logos: Record<string, string>
}

const EMPTY: ProjectImages = { cover: null, gallery: [] }

const typed = manifest as unknown as Manifest

/**
 * Images for a project, resolved from the build-time manifest. Returns empty
 * sets when no photos have been added yet — callers fall back to a typographic
 * tile so the page still reads as finished.
 */
export function projectImages(slug: string): ProjectImages {
  return typed.projects?.[slug] ?? EMPTY
}

export function hasCover(slug: string): boolean {
  return Boolean(typed.projects?.[slug]?.cover)
}

/** Portrait, hero and section-background imagery, when present. */
export function siteImages(): SiteImages {
  return typed.site ?? { portrait: null, hero: null, backgrounds: [] }
}

/** Picks a section background by index, cycling through whatever exists. */
export function backgroundAt(index: number): string | null {
  const bgs = siteImages().backgrounds
  if (bgs.length === 0) return null
  return bgs[index % bgs.length]
}

/**
 * Institution logo for a project: the first key in its fallback chain whose
 * file is actually present. Returns null when nothing is available, so the
 * caller falls back to the typographic monogram.
 */
export function logoFor(slug: string): string | null {
  const keys = LOGO_KEYS_BY_SLUG[slug]
  if (!keys) return null
  for (const key of keys) {
    const path = typed.logos?.[key]
    if (path) return path
  }
  return null
}
