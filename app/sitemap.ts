import type { MetadataRoute } from 'next'
import { PRACTICES, PROJECTS } from '@/content'

const BASE = 'https://romeotkoduah.org'

/** Required alongside `output: 'export'` — the route is emitted as a file. */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const top = [
    { path: '/', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/publications', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
  ]

  return [
    ...top.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...PRACTICES.map((p) => ({
      url: `${BASE}${p.href}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...PROJECTS.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
