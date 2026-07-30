import type { MetadataRoute } from 'next'

const BASE = 'https://romeotkoduah.org'

/** Required alongside `output: 'export'` — the route is emitted as a file. */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
