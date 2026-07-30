import manifest from '@/content/image-manifest.json'

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
