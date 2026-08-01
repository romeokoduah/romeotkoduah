import type { MetadataRoute } from 'next'

const BASE = 'https://romeotkoduah.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The dashboard and its endpoints have nothing to index, and keeping
        // them out of results avoids advertising the login form.
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
