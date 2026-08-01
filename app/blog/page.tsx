import type { Metadata } from 'next'
import { listPublishedPosts, listTags } from '@/lib/blog'
import { PageHero } from '@/components/site/page-hero'
import { Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { EmptyState } from '@/components/blog/empty-state'
import { FeaturedPost } from '@/components/blog/featured-post'
import { PostRow } from '@/components/blog/post-row'
import { TagFilter } from '@/components/blog/tag-filter'
import { ACCENT_HEX } from '@/components/blog/shared'

/**
 * Rendered per request. Posts, tags and like counts all live in Postgres, and
 * the build must not need a database to run — the machine builds this before
 * the database credentials are even in place.
 */
export const dynamic = 'force-dynamic'

const DESCRIPTION =
  'Writing on hydrology, climate policy, earth observation and the digital systems built around them — by Romeo Tweneboah Koduah.'

export const metadata: Metadata = {
  title: 'Writing',
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Writing — Romeo Tweneboah Koduah',
    description: DESCRIPTION,
  },
}

type PageProps = {
  searchParams: Promise<{ tag?: string | string[] }>
}

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const { tag } = await searchParams
  const active = (Array.isArray(tag) ? tag[0] : tag)?.trim() || undefined

  const [posts, tags] = await Promise.all([listPublishedPosts(active), listTags()])
  const [lead, ...rest] = posts

  return (
    <>
      <PageHero
        eyebrow="Writing"
        title="Notes from the water, energy and climate desk."
        lede="Field notes, method write-ups and arguments about policy — the reasoning behind the projects, written out at length rather than compressed into a slide."
        accent={ACCENT_HEX}
      />

      <Section>
        <Wide>
          {tags.length > 0 ? (
            <Reveal>
              <TagFilter tags={tags} active={active} />
            </Reveal>
          ) : null}

          {posts.length === 0 ? (
            <Reveal delay={0.06}>
              <div className={tags.length > 0 ? 'mt-s30' : undefined}>
                <EmptyState tag={active} />
              </div>
            </Reveal>
          ) : (
            <>
              <Reveal delay={0.06}>
                <div className={tags.length > 0 ? 'mt-s30' : undefined}>
                  <FeaturedPost post={lead} />
                </div>
              </Reveal>

              {rest.length > 0 ? (
                <div className="mt-s50 grid gap-x-s30 gap-y-s30 md:grid-cols-2">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={0.05 * (i % 4)} className="h-full">
                      <PostRow post={post} />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </Wide>
      </Section>
    </>
  )
}
