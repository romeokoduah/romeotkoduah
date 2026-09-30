import type { Metadata } from 'next'
import { listPublishedPosts, listTags } from '@/lib/blog'
import { Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { ArchiveList } from '@/components/blog/archive-list'
import { BlogMasthead } from '@/components/blog/blog-masthead'
import { EmptyState } from '@/components/blog/empty-state'
import { LeadStory } from '@/components/blog/lead-story'
import { TopicBar } from '@/components/blog/topic-bar'

/**
 * Rendered per request. Posts, tags and like counts all live in Postgres, and
 * the build must not need a database to run — the machine builds this before
 * the database credentials are even in place.
 */
export const dynamic = 'force-dynamic'

const DESCRIPTION =
  'Reports, field notes and arguments on water, energy and climate — trainings, projects and policy processes, by Romeo Tweneboah Koduah.'

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

  // One query for the whole archive: the masthead counts the collection, and
  // the filter is applied here rather than in SQL. The archive is small.
  const [all, tags] = await Promise.all([listPublishedPosts(), listTags()])
  const posts = active ? all.filter((p) => p.tags.includes(active)) : all
  const [lead, ...rest] = posts

  const minutes = all.reduce((sum, p) => sum + p.readingMinutes, 0)

  return (
    <>
      <BlogMasthead pieces={all.length} topics={tags.length} minutes={minutes} />

      <Section>
        <Wide>
          <Reveal>
            <TopicBar tags={tags} total={all.length} active={active} />
          </Reveal>

          <div className={tags.length > 0 ? 'mt-s30' : undefined}>
            {lead ? (
              <>
                <Reveal delay={0.06}>
                  <LeadStory post={lead} index={1} />
                </Reveal>
                <ArchiveList posts={rest} startIndex={2} />
              </>
            ) : (
              <Reveal delay={0.06}>
                <EmptyState tag={active} />
              </Reveal>
            )}
          </div>
        </Wide>
      </Section>
    </>
  )
}
