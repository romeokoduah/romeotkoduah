import type { MetadataRoute } from 'next'
import { PRACTICES, PROJECTS } from '@/content'
import { listPublishedPosts } from '@/lib/blog'
import { listAlbums } from '@/lib/gallery'

const BASE = 'https://romeotkoduah.org'

/** Blog posts and albums come from the database, so this is built per request. */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const top = [
    { path: '/', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/blog', priority: 0.8 },
    { path: '/gallery', priority: 0.7 },
    { path: '/publications', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
  ]

  const entries: MetadataRoute.Sitemap = [
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

  // A sitemap is worth having even when the database is briefly unreachable —
  // the static half is still correct, so degrade rather than 500.
  try {
    const [posts, albums] = await Promise.all([listPublishedPosts(), listAlbums()])

    for (const post of posts) {
      entries.push({
        url: `${BASE}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
    for (const album of albums) {
      entries.push({
        url: `${BASE}/gallery/${album.slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  } catch {
    // fall through with the static entries
  }

  return entries
}
