'use client'

import { useState } from 'react'
import type { Comment } from '@/lib/blog-types'
import { CommentForm, type CommentDraft } from './comment-form'
import { AwaitingComment, CommentItem, type LocalComment } from './comment-item'
import { countComments, plural } from './shared'

/**
 * The comment section.
 *
 * A client component even though the thread itself is server-rendered, because
 * the one thing a moderated comment box must not do is look like it swallowed
 * what you wrote. Submissions are held here for the life of the page and shown
 * back to their author, clearly marked as not yet public — approved comments
 * arrive from the server on the next request as normal.
 */
export function Comments({
  postId,
  comments,
}: {
  postId: string
  comments: Comment[]
}) {
  const [mine, setMine] = useState<LocalComment[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  function accept(draft: CommentDraft) {
    setMine((current) => [
      ...current,
      {
        ...draft,
        key: `${Date.now()}-${current.length}`,
        createdAt: new Date().toISOString(),
      },
    ])
    setNotice(
      draft.parentId
        ? 'Reply received. It is in the queue for review and will appear once it is approved.'
        : 'Comment received. It is in the queue for review and will appear once it is approved.',
    )
  }

  const approved = countComments(comments)
  const mineTop = mine.filter((c) => c.parentId === null)

  return (
    <section id="comments" className="scroll-mt-28">
      <h2 className="font-head text-(length:--text-h3) leading-tight text-indigo">
        {approved === 0 ? 'Comments' : plural(approved, 'comment')}
      </h2>
      <p className="mt-3 max-w-[52ch] font-body text-[15px] leading-relaxed text-ink/65">
        Give a name or stay anonymous. Everything is read before it appears, so
        there is a wait between posting and publication.
      </p>

      <div className="mt-s20">
        <CommentForm postId={postId} onSubmitted={accept} />
      </div>

      {/* `role="status"` so the confirmation is announced rather than merely
          appearing somewhere below the fold. */}
      <div role="status" aria-live="polite">
        {notice ? (
          <p className="mt-6 border-l-4 border-indigo bg-soft px-5 py-4 font-body text-[15px] leading-relaxed text-ink/80">
            {notice}
          </p>
        ) : null}
      </div>

      {mineTop.length > 0 ? (
        <ul className="mt-s20 space-y-5">
          {mineTop.map((c) => (
            <li key={c.key}>
              <AwaitingComment comment={c} />
            </li>
          ))}
        </ul>
      ) : null}

      {comments.length > 0 ? (
        <ul className="mt-s30 space-y-s20">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              pendingReplies={mine.filter((c) => c.parentId === comment.id)}
              onReplySubmitted={accept}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-s30 border-t-2 border-ink/12 pt-6 font-body text-[15px] text-ink/55">
          No comments here yet. Yours would be the first.
        </p>
      )}
    </section>
  )
}
