'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { readingMinutes, slugify } from '@/lib/blog-types'
import type { Photo, Post, PostStatus } from '@/lib/blog-types'
import { deletePostAction, savePostAction } from '@/app/admin/actions'
import { ConfirmAction } from './confirm-action'
import { CoverPicker } from './cover-picker'
import {
  BTN,
  BTN_GHOST,
  ErrorNote,
  Field,
  INPUT,
  OkNote,
  PANEL,
  StatusChip,
  TEXTAREA,
  stampTime,
} from './ui'

/* --------------------------------------------------------------- preview -- */

/**
 * Preview styling lives here rather than in globals: the public article page
 * sets its own measure and scale, and the pane must not inherit the 70px
 * display headings meant for a full-width page.
 *
 * Raw HTML is deliberately not enabled — `react-markdown` ignores it unless
 * `rehype-raw` is added, and it will not be.
 */
const PREVIEW = [
  'font-body text-[15px] leading-[1.7] text-ink break-words',
  '[&_h1]:mb-2 [&_h1]:mt-6 [&_h1]:font-head [&_h1]:text-[28px] [&_h1]:font-medium [&_h1]:leading-tight',
  '[&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:font-head [&_h2]:text-[22px] [&_h2]:font-medium [&_h2]:leading-tight',
  '[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-head [&_h3]:text-[18px] [&_h3]:font-medium [&_h3]:leading-tight',
  '[&_h4]:mb-1 [&_h4]:mt-4 [&_h4]:font-head [&_h4]:text-[16px] [&_h4]:font-medium',
  '[&_p]:my-3',
  '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1',
  '[&_a]:text-ember [&_a]:underline [&_a]:underline-offset-2',
  '[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-forest [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink/70',
  '[&_code]:bg-soft [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px]',
  '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:border-2 [&_pre]:border-ink/12 [&_pre]:bg-soft [&_pre]:p-3',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_img]:my-4 [&_img]:max-w-full',
  '[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[13px]',
  '[&_th]:border [&_th]:border-ink/15 [&_th]:bg-soft [&_th]:px-2 [&_th]:py-1 [&_th]:text-left',
  '[&_td]:border [&_td]:border-ink/15 [&_td]:px-2 [&_td]:py-1',
  '[&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-ink/12',
  '[&_input[type=checkbox]]:mr-1.5',
].join(' ')

/* ------------------------------------------------------------- component -- */

interface Snapshot {
  title: string
  slug: string
  excerpt: string
  tags: string
  coverUrl: string
  body: string
}

type Pane = 'write' | 'split' | 'preview'

export function PostEditor({ post, photos }: { post: Post; photos: Photo[] }) {
  const router = useRouter()

  const initial: Snapshot = useMemo(
    () => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      tags: post.tags.join(', '),
      coverUrl: post.coverUrl ?? '',
      body: post.bodyMd,
    }),
    [post],
  )

  const [draft, setDraft] = useState<Snapshot>(initial)
  const [saved, setSaved] = useState<Snapshot>(initial)
  const [status, setStatus] = useState<PostStatus>(post.status)
  const [slugTouched, setSlugTouched] = useState(post.slug !== slugify(post.title))
  const [pane, setPane] = useState<Pane>('split')
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [leaveTo, setLeaveTo] = useState<string | null>(null)
  const [busy, startTransition] = useTransition()

  const dirty = useMemo(
    () => (Object.keys(draft) as (keyof Snapshot)[]).some((k) => draft[k] !== saved[k]),
    [draft, saved],
  )

  const set = <K extends keyof Snapshot>(key: K, value: Snapshot[K]) => {
    setNote(null)
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const setTitle = (value: string) => {
    setNote(null)
    setDraft((d) => ({
      ...d,
      title: value,
      slug: slugTouched ? d.slug : slugify(value),
    }))
  }

  /* --- unsaved-work guard ------------------------------------------------ */

  const leaving = useRef(false)

  useEffect(() => {
    if (!dirty) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (leaving.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    // Intercepting the click keeps the warning inline. `window.confirm` would
    // do the same job with a dialog nobody can style or read.
    const onClick = (event: MouseEvent) => {
      if (leaving.current || event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor =
        event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href') ?? ''
      if (!href || href.startsWith('#')) return
      // Leaving the origin entirely is a full page load, which `beforeunload`
      // already covers; only in-app navigation needs intercepting.
      if (anchor.origin !== window.location.origin) return

      event.preventDefault()
      event.stopPropagation()
      setLeaveTo(`${anchor.pathname}${anchor.search}${anchor.hash}`)
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClick, true)
    }
  }, [dirty])

  /* --- saving ------------------------------------------------------------ */

  const persist = async (nextStatus?: PostStatus): Promise<boolean> => {
    setError(null)
    setNote(null)

    const payload: Snapshot = { ...draft, slug: slugify(draft.slug || draft.title) }

    const result = await savePostAction({
      id: post.id,
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      bodyMd: payload.body,
      coverUrl: payload.coverUrl,
      tags: payload.tags,
      status: nextStatus,
    })

    if (!result.ok) {
      setError(result.error)
      return false
    }

    setDraft(payload)
    setSaved(payload)
    if (nextStatus) setStatus(nextStatus)
    setNote(
      nextStatus === 'published'
        ? 'Published.'
        : nextStatus === 'draft'
          ? 'Moved back to draft.'
          : 'Saved.',
    )
    router.refresh()
    return true
  }

  const save = (nextStatus?: PostStatus) => {
    if (busy) return
    startTransition(() => {
      void persist(nextStatus)
    })
  }

  const go = (href: string) => {
    leaving.current = true
    router.push(href)
  }

  /* --- render ------------------------------------------------------------ */

  const minutes = readingMinutes(draft.body)
  const words = draft.body.trim() ? draft.body.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col gap-4">
      {/* ---- header ------------------------------------------------------ */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <StatusChip status={status} />
            {dirty && (
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-rust">
                Unsaved changes
              </span>
            )}
          </div>
          <h1 className="font-head text-[30px] font-medium uppercase leading-none tracking-[0.02em]">
            {draft.title || 'Untitled post'}
          </h1>
          <p className="mt-1.5 font-body text-xs text-ink/50">
            {minutes} min read · {words.toLocaleString('en-GB')} words · last saved{' '}
            {stampTime(post.updatedAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={BTN_GHOST} disabled={busy} onClick={() => save()}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          {status === 'published' ? (
            <button
              type="button"
              className={BTN_GHOST}
              disabled={busy}
              onClick={() => save('draft')}
            >
              Unpublish
            </button>
          ) : (
            <button type="button" className={BTN} disabled={busy} onClick={() => save('published')}>
              Publish
            </button>
          )}
          <ConfirmAction
            label="Delete"
            confirmLabel="Delete post"
            question="Delete permanently?"
            run={() => deletePostAction(post.id)}
            onDone={() => go('/admin/posts')}
          />
        </div>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      {note && !dirty && <OkNote>{note}</OkNote>}

      {leaveTo && (
        <div className="flex flex-wrap items-center gap-3 border-2 border-rust bg-rust/5 px-4 py-3">
          <span className="font-body text-xs font-bold uppercase tracking-[0.1em] text-rust">
            You have unsaved changes
          </span>
          <button type="button" className={BTN_GHOST} onClick={() => setLeaveTo(null)}>
            Stay here
          </button>
          <button
            type="button"
            className={BTN_GHOST}
            disabled={busy}
            onClick={() => {
              const target = leaveTo
              setLeaveTo(null)
              startTransition(async () => {
                // Navigate only once the write has landed — leaving early
                // would be exactly the loss this banner exists to prevent.
                if (await persist()) {
                  if (target) go(target)
                } else {
                  setLeaveTo(target)
                }
              })
            }}
          >
            Save and leave
          </button>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-body text-xs font-semibold text-ink/60 underline underline-offset-4 hover:text-ink"
            onClick={() => {
              const target = leaveTo
              setLeaveTo(null)
              if (target) go(target)
            }}
          >
            Discard and leave
          </button>
        </div>
      )}

      {/* ---- metadata ---------------------------------------------------- */}
      <section className={`${PANEL} grid gap-4 p-4 lg:grid-cols-2`}>
        <Field label="Title" htmlFor="post-title">
          <input
            id="post-title"
            value={draft.title}
            className={INPUT}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field
          label="Slug"
          htmlFor="post-slug"
          hint={
            <>
              Reads as <code>/blog/{slugify(draft.slug || draft.title) || '…'}</code>
              {!slugTouched && ' — following the title until you edit it.'}
            </>
          }
        >
          <input
            id="post-slug"
            value={draft.slug}
            className={INPUT}
            onChange={(e) => {
              setSlugTouched(true)
              set('slug', e.target.value)
            }}
          />
        </Field>

        <Field
          label="Excerpt"
          htmlFor="post-excerpt"
          hint="The standfirst on the index and in search results."
          className="lg:col-span-2"
        >
          <textarea
            id="post-excerpt"
            rows={2}
            value={draft.excerpt}
            className={TEXTAREA}
            onChange={(e) => set('excerpt', e.target.value)}
          />
        </Field>

        <Field label="Tags" htmlFor="post-tags" hint="Comma separated.">
          <input
            id="post-tags"
            value={draft.tags}
            placeholder="hydrology, policy, ghana"
            className={INPUT}
            onChange={(e) => set('tags', e.target.value)}
          />
        </Field>

        <Field label="Cover image">
          <CoverPicker
            value={draft.coverUrl}
            photos={photos}
            onChange={(url) => set('coverUrl', url)}
          />
        </Field>
      </section>

      {/* ---- body -------------------------------------------------------- */}
      <section className={PANEL}>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink/12 px-4 py-2.5">
          <h2 className="font-head text-base font-medium uppercase leading-none tracking-[0.06em]">
            Body — Markdown
          </h2>
          <div
            role="group"
            aria-label="Editor panes"
            className="flex border-2 border-ink/15"
          >
            {(['write', 'split', 'preview'] as Pane[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={pane === option}
                onClick={() => setPane(option)}
                className={`cursor-pointer border-0 px-3 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] leading-none transition-colors ${
                  pane === option ? 'bg-ink text-soft' : 'bg-transparent text-ink/55 hover:text-ink'
                } ${option === 'split' ? 'hidden md:block' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        </header>

        <div
          className={`grid ${
            pane === 'split' ? 'md:grid-cols-2 md:divide-x-2 md:divide-ink/12' : 'grid-cols-1'
          }`}
        >
          {pane !== 'preview' && (
            <div className="p-4">
              <label htmlFor="post-body" className="sr-only">
                Post body, Markdown
              </label>
              <textarea
                id="post-body"
                value={draft.body}
                spellCheck
                placeholder={'## A heading\n\nWrite in Markdown. Tables, task lists and\nstrikethrough all work — GitHub-flavoured.'}
                className={`${TEXTAREA} min-h-[60vh] font-mono text-[13px] leading-[1.7]`}
                onChange={(e) => set('body', e.target.value)}
              />
            </div>
          )}

          {pane !== 'write' && (
            <div className="min-w-0 overflow-x-auto p-4">
              {draft.body.trim() ? (
                <div className={PREVIEW}>
                  <Markdown remarkPlugins={[remarkGfm]}>{draft.body}</Markdown>
                </div>
              ) : (
                <p className="font-body text-sm text-ink/40">
                  The preview appears as you type.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
