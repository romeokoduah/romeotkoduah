import Link from 'next/link'
import type { CommentStatus, PendingComment } from '@/lib/blog-types'
import { ModerationQueue } from '@/components/admin/moderation-queue'
import { ACCENT, ErrorNote, PageHead } from '@/components/admin/ui'
import { adminCounts, listCommentsByStatus } from '@/app/admin/queries'

export const dynamic = 'force-dynamic'

const TABS: { status: CommentStatus; label: string }[] = [
  { status: 'pending', label: 'Awaiting review' },
  { status: 'approved', label: 'Approved' },
  { status: 'rejected', label: 'Rejected' },
  { status: 'spam', label: 'Spam' },
]

function isStatus(value: string | undefined): value is CommentStatus {
  return value === 'pending' || value === 'approved' || value === 'rejected' || value === 'spam'
}

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: raw } = await searchParams
  const status: CommentStatus = isStatus(raw) ? raw : 'pending'

  let items: PendingComment[] = []
  let counts = { pending: 0, approved: 0, rejected: 0, spam: 0 }
  let error: string | null = null

  try {
    const [list, all] = await Promise.all([listCommentsByStatus(status), adminCounts()])
    items = list
    counts = all
  } catch {
    error = 'The moderation queue could not be loaded — the database is not answering.'
  }

  return (
    <>
      <PageHead
        title="Comments"
        lede="Nothing a reader writes is visible until it is approved here. Every decision can be reversed."
      />

      <nav
        aria-label="Comment status"
        className="mb-4 flex flex-wrap items-center gap-2 border-b-2 border-ink/12 pb-3"
      >
        {TABS.map((tab) => {
          const active = tab.status === status
          const count = counts[tab.status]
          return (
            <Link
              key={tab.status}
              href={`/admin/comments?status=${tab.status}`}
              aria-current={active ? 'page' : undefined}
              className="inline-flex items-center gap-2 border-2 px-3 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] leading-none transition-colors"
              style={
                active
                  ? {
                      backgroundColor: ACCENT[tab.status],
                      borderColor: ACCENT[tab.status],
                      color: '#ffffff',
                    }
                  : {
                      borderColor: 'color-mix(in srgb, var(--color-ink) 15%, transparent)',
                      color: 'color-mix(in srgb, var(--color-ink) 60%, transparent)',
                    }
              }
            >
              {tab.label}
              <span className="font-head text-xs tabular-nums">{count}</span>
            </Link>
          )
        })}
      </nav>

      {error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : (
        <ModerationQueue key={status} status={status} items={items} />
      )}
    </>
  )
}
