import Link from 'next/link'
import { listAllPosts } from '@/lib/blog'
import { NewPost } from '@/components/admin/new-post'
import { PostRowActions } from '@/components/admin/post-row-actions'
import {
  ACCENT,
  EmptyState,
  ErrorNote,
  PageHead,
  Panel,
  StatusChip,
  stamp,
} from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

type Row = Awaited<ReturnType<typeof listAllPosts>>[number]

export default async function PostsPage() {
  let posts: Row[] = []
  let error: string | null = null

  try {
    posts = await listAllPosts()
  } catch {
    error = 'The posts could not be loaded — the database is not answering.'
  }

  const published = posts.filter((p) => p.status === 'published').length
  const drafts = posts.length - published

  return (
    <>
      <PageHead
        title="Posts"
        lede={`${published} published, ${drafts} ${drafts === 1 ? 'draft' : 'drafts'}.`}
        actions={<NewPost />}
      />

      {error && <div className="mb-4">
        <ErrorNote>{error}</ErrorNote>
      </div>}

      <Panel bodyClassName="p-0">
        {posts.length === 0 && !error ? (
          <div className="p-4">
            <EmptyState title="No posts yet">
              Start with a working title — the slug, excerpt and body all come later.
            </EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink/12">
                  {['Title', 'Status', 'Published', 'Likes', 'Comments', ''].map((h, i) => (
                    <th
                      key={h || i}
                      scope="col"
                      className={`px-4 py-2.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50 ${
                        i >= 3 && i <= 4 ? 'text-right' : ''
                      } ${i === 5 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const isDraft = post.status === 'draft'
                  return (
                    <tr
                      key={post.id}
                      className={`border-b border-ink/10 last:border-b-0 ${
                        isDraft ? 'bg-soft/60' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div
                          className="border-l-[3px] pl-3"
                          style={{
                            borderColor: isDraft ? ACCENT.draft : ACCENT.published,
                          }}
                        >
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className={`block font-head text-lg font-medium leading-tight underline-offset-4 hover:underline ${
                              isDraft ? 'text-ink/65' : ''
                            }`}
                          >
                            {post.title || 'Untitled'}
                          </Link>
                          <span className="mt-0.5 block font-body text-[11px] text-ink/40">
                            /{post.slug}
                            {post.tags.length > 0 && ` · ${post.tags.join(', ')}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip status={post.status} />
                      </td>
                      <td className="px-4 py-3 font-body text-xs tabular-nums text-ink/60">
                        {post.publishedAt ? stamp(post.publishedAt) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-head text-base tabular-nums">
                        {post.likeCount}
                      </td>
                      <td className="px-4 py-3 text-right font-head text-base tabular-nums">
                        {post.commentCount}
                      </td>
                      <td className="px-4 py-3">
                        <PostRowActions id={post.id} slug={post.slug} status={post.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  )
}
