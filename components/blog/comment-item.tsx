'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Comment } from '@/lib/blog-types'
import { displayName } from '@/lib/blog-types'
import { LikeButton } from './like-button'
import { CommentForm, type CommentDraft } from './comment-form'
import { relativeDate } from './shared'

/** A submission this browser has just made, held only in memory. */
export interface LocalComment extends CommentDraft {
  key: string
  createdAt: string
}

/* ------------------------------------------------------------- shell ----- */

function CommentShell({
  authorName,
  createdAt,
  body,
  badge,
  actions,
  children,
}: {
  authorName: string | null
  createdAt: string
  body: string
  badge?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <article>
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="font-head text-[19px] font-medium leading-none text-ink">
          {displayName(authorName)}
        </h4>
        <span aria-hidden className="text-indigo">
          ·
        </span>
        <time
          dateTime={createdAt}
          suppressHydrationWarning
          className="font-body text-[13px] text-ink/55"
        >
          {relativeDate(createdAt)}
        </time>
        {badge}
      </header>

      {/* Plain text, always. Comment bodies are never parsed as markdown or
          HTML — `whitespace-pre-wrap` is the entire formatting model. */}
      <p className="mt-3 whitespace-pre-wrap break-words font-body text-[16px] leading-[1.7] text-ink/85">
        {body}
      </p>

      {actions ? <div className="mt-4 flex flex-wrap items-center gap-4">{actions}</div> : null}
      {children}
    </article>
  )
}

/* ------------------------------------------------------ awaiting review -- */

export function AwaitingComment({ comment }: { comment: LocalComment }) {
  return (
    <div className="border-2 border-dashed border-indigo/45 bg-soft p-5">
      <CommentShell
        authorName={comment.authorName}
        createdAt={comment.createdAt}
        body={comment.body}
        badge={
          <span className="border-2 border-indigo px-2 py-1 font-body text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-indigo">
            Awaiting review
          </span>
        }
      />
      <p className="mt-4 font-body text-[13px] leading-snug text-ink/60">
        Only you can see this. It goes public once Romeo has read it.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------- item ------ */

export function CommentItem({
  comment,
  postId,
  pendingReplies,
  onReplySubmitted,
}: {
  comment: Comment
  postId: string
  pendingReplies: LocalComment[]
  onReplySubmitted: (draft: CommentDraft) => void
}) {
  const [replying, setReplying] = useState(false)

  return (
    <li className="rule pt-s20 first:border-t-0 first:pt-0">
      <CommentShell
        authorName={comment.authorName}
        createdAt={comment.createdAt}
        body={comment.body}
        actions={
          <>
            <LikeButton
              targetType="comment"
              targetId={comment.id}
              initialCount={comment.likeCount}
              initialLiked={comment.likedByMe}
              subject={`the comment by ${displayName(comment.authorName)}`}
            />
            <button
              type="button"
              onClick={() => setReplying((open) => !open)}
              aria-expanded={replying}
              className="font-body text-sm font-bold text-indigo underline underline-offset-4 transition-colors duration-150 hover:text-ember"
            >
              {replying ? 'Cancel reply' : 'Reply'}
            </button>
          </>
        }
      >
        {replying ? (
          <div className="mt-5">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              compact
              autoFocus
              onCancel={() => setReplying(false)}
              onSubmitted={(draft) => {
                setReplying(false)
                onReplySubmitted(draft)
              }}
            />
          </div>
        ) : null}

        {comment.replies.length > 0 || pendingReplies.length > 0 ? (
          <ul className="mt-6 space-y-6 border-l-2 border-indigo/25 pl-5 sm:pl-7">
            {comment.replies.map((reply) => (
              <li key={reply.id}>
                <CommentShell
                  authorName={reply.authorName}
                  createdAt={reply.createdAt}
                  body={reply.body}
                  actions={
                    <LikeButton
                      targetType="comment"
                      targetId={reply.id}
                      initialCount={reply.likeCount}
                      initialLiked={reply.likedByMe}
                      subject={`the reply by ${displayName(reply.authorName)}`}
                    />
                  }
                />
              </li>
            ))}
            {pendingReplies.map((reply) => (
              <li key={reply.key}>
                <AwaitingComment comment={reply} />
              </li>
            ))}
          </ul>
        ) : null}
      </CommentShell>
    </li>
  )
}
