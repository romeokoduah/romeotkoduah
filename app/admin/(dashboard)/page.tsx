import Link from 'next/link'
import { ACCENT, EmptyState, Metric, PageHead, Panel, stampTime } from '@/components/admin/ui'
import { adminCounts, recentActivity } from '@/app/admin/queries'

export const dynamic = 'force-dynamic'

const KIND_LABEL: Record<string, string> = {
  post: 'Post',
  comment: 'Comment',
  photo: 'Photo',
}

export default async function OverviewPage() {
  const [counts, activity] = await Promise.all([adminCounts(), recentActivity(14)])

  return (
    <>
      <PageHead
        title="Overview"
        lede="What is live, what is waiting, and what changed last."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Metric
          label="Awaiting review"
          value={counts.pending}
          href="/admin/comments"
          accent={counts.pending > 0 ? 'var(--color-rust)' : undefined}
          urgent={counts.pending > 0}
        />
        <Metric
          label="Published posts"
          value={counts.published}
          href="/admin/posts"
          accent={ACCENT.published}
        />
        <Metric label="Drafts" value={counts.drafts} href="/admin/posts" />
        <Metric label="Albums" value={counts.albums} href="/admin/gallery" />
        <Metric label="Photos" value={counts.photos} href="/admin/gallery" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Approved comments" value={counts.approved} accent={ACCENT.approved} />
        <Metric label="Rejected" value={counts.rejected} />
        <Metric label="Marked spam" value={counts.spam} accent={ACCENT.spam} />
        <Metric label="Likes" value={counts.likes} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Panel title="Recent activity" note="Newest first, across posts, comments and photos.">
          {activity.length === 0 ? (
            <EmptyState title="Nothing yet">
              Write a post or upload a photo and it will show up here.
            </EmptyState>
          ) : (
            <ul>
              {activity.map((item) => (
                <li
                  key={`${item.kind}-${item.id}`}
                  className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2.5 last:border-b-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={item.href}
                      className="block truncate font-body text-sm font-semibold underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </Link>
                    <span className="font-body text-[11px] uppercase tracking-[0.12em] text-ink/45">
                      {KIND_LABEL[item.kind]} · {item.detail}
                    </span>
                  </div>
                  <time
                    dateTime={item.at}
                    className="shrink-0 font-body text-[11px] tabular-nums text-ink/40"
                  >
                    {stampTime(item.at)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Go to">
          <ul className="flex flex-col">
            {[
              { href: '/admin/posts', label: 'Posts', note: 'Write, edit, publish' },
              {
                href: '/admin/comments',
                label: 'Moderation queue',
                note: `${counts.pending} awaiting review`,
              },
              { href: '/admin/gallery', label: 'Gallery', note: 'Albums and uploads' },
              { href: '/admin/settings', label: 'Settings', note: 'Change your password' },
              { href: '/blog', label: 'The blog, as readers see it', note: 'Opens the public site' },
            ].map((link) => (
              <li key={link.href} className="border-b border-ink/10 last:border-b-0">
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-3 py-2.5 transition-colors hover:text-rust"
                >
                  <span>
                    <span className="block font-body text-sm font-semibold">{link.label}</span>
                    <span className="block font-body text-[11px] text-ink/45">{link.note}</span>
                  </span>
                  <span aria-hidden className="font-head text-lg leading-none text-ink/25 transition-colors group-hover:text-rust">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
