# Blog, comments and photo gallery — romeotkoduah.org

**Date:** 2026-08-01
**Status:** Approved for implementation

## Goal

Add to the existing site:

- A **blog** with an index and article pages, written and published from an
  admin dashboard.
- **Likes** on posts and on comments.
- **Comments** where a reader may give a name or stay anonymous, with
  one level of threaded replies.
- **Moderation**: nothing appears publicly until Romeo approves it.
- A **photo gallery** with albums and a proper full-screen viewer, managed
  from the same dashboard.

## The architecture change this forces

The site is currently `output: 'export'` — static HTML on nginx, no runtime.
That cannot serve database-backed posts, an admin dashboard, or moderation.
Rendering the blog client-side would leave crawlers with empty pages, which
defeats the purpose of writing.

So the site becomes a **Next.js server application** run under PM2 and proxied
by the existing nginx vhost — the same pattern as the eight other apps already
on the box (`alva`, `cleen`, `crontract`, `eclipse-motors`, `groupeania`,
`groupeania-lms`, `qfc`, `xtension`).

This is well within the machine's means: 5.9 GB RAM available, PostgreSQL 16
and Redis already running, PM2 already managing the other apps.

Consequences:

- Marketing pages keep their current output — statically generated at build
  time and cached, so they stay as fast as they are now.
- Blog, gallery and admin render on the server per request.
- `deploy.ps1` changes from "copy files" to "build, upload, `pm2 reload`".
- The current static site stays live until the new one is verified.

## Stack additions

| Concern | Choice | Why |
|---|---|---|
| Database | PostgreSQL 16 (already running), own database and role | Matches the box's existing pattern |
| DB access | `postgres` (porsager) — small, no ORM | One dependency, plain SQL, easy to audit |
| Migrations | Numbered `.sql` files, applied by a script | No migration framework to learn |
| Rate limiting | Redis (already running) | Per-IP windows, survives restarts |
| Sessions | Signed, HTTP-only cookie (`jose` JWT) | No session table needed |
| Passwords | `@node-rs/argon2` | Only one credential exists — Romeo's |
| Uploads | Local disk, served by nginx | Simpler than MinIO for this volume |
| Editor | Markdown + live preview | Portable, diffable, no lock-in |

## Data model

```sql
posts        id, slug, title, excerpt, body_md, cover_url, tags[],
             status ('draft'|'published'), published_at, reading_minutes,
             created_at, updated_at
comments     id, post_id, parent_id, author_name (null = anonymous),
             body, status ('pending'|'approved'|'rejected'|'spam'),
             ip_hash, user_agent, created_at
likes        id, target_type ('post'|'comment'), target_id,
             visitor_id, created_at        -- unique (target, visitor)
albums       id, slug, title, description, cover_photo_id, sort, created_at
photos       id, album_id, url, thumb_url, width, height, caption,
             alt, taken_at, sort, created_at
admin_user   id, email, password_hash, created_at
```

`visitor_id` is a random UUID in a first-party cookie — enough to stop
double-liking, not an identity. No accounts for readers, ever.

`ip_hash` is a salted hash, never the raw address. It exists only for rate
limiting and spam correlation, and is not displayed anywhere.

## Moderation and abuse

Anonymous comments on an indexed site attract bots within days. Defences:

1. **Approval queue** — nothing is public until approved. This is the backstop
   that makes the rest merely helpful rather than load-bearing.
2. **Rate limit** — per IP, via Redis: 5 comments/hour, 30 likes/hour.
3. **Honeypot field** plus a minimum time-on-form, both silently rejecting.
4. **Length caps** — name 60 chars, body 4000 chars.
5. **Link ceiling** — more than two URLs auto-flags as spam rather than pending.
6. Comment bodies are rendered as **plain text**, never HTML. No markdown, no
   embedded links. This removes the entire XSS and link-spam surface.

## Admin

Single admin user. Login at `/admin`, session cookie, everything behind it.

- **Posts** — list, create, edit, markdown editor with live preview, save
  draft, publish, unpublish, delete.
- **Comments** — queue of pending items with post context; approve, reject,
  mark spam, delete. Badge count of pending items.
- **Gallery** — create albums, drag-and-drop upload with progress, caption and
  alt text per photo, reorder, set album cover, delete.

**Credential handling:** the initial password is generated on the server, and
only its argon2 hash is stored. The plaintext is written once to
`/root/romeotkoduah-admin-initial-password` (mode 600) for Romeo to read over
SSH and change on first login. It is never sent through chat, committed, or
logged.

## Blog reading experience

**Index** (`/blog`) — a featured lead post with cover image and standfirst,
then a two-column list of the rest. Each row: cover thumbnail, tag, title in
Oswald, one-line excerpt, date, reading time, like count. Tag filter along the
top. Empty state that reads deliberately, not broken.

**Article** (`/blog/<slug>`) — centred at the 740px measure, Oswald headline at
`line-height: 1`, standfirst, byline row with date and reading time, full-bleed
cover, then body at 18px/1.75. A thin scroll-progress rule at the top. Pull
quotes and figures break the measure. A sticky like button and comment count at
the side on wide screens. At the end: like, tags, previous/next, then comments.

**Comments** — name-or-anonymous field, honeypot, plain-text body. One level of
replies. Newest first, likes visible per comment. A pending comment shows the
author their own submission with an "awaiting review" note, so it does not feel
like the form swallowed it.

## Gallery

**Index** (`/gallery`) — albums as cards with cover, title, photo count.
**Album** (`/gallery/<slug>`) — justified masonry grid, lazy-loaded, blur-up
placeholders from a stored dominant colour.

**Viewer** — full-screen overlay: arrow-key and swipe navigation, caption and
counter, escape to close, focus trapped, body scroll locked, preloads the
neighbouring images, and deep-links via `?photo=<id>` so a single photo can be
shared. Respects `prefers-reduced-motion`.

Uploads are resized on the server to a 2000px display copy and a 600px
thumbnail, both WebP, with the originals kept.

## Starter content

Three posts drafted from real CV material, clearly marked as drafts for Romeo
to edit before publishing:

1. Ghana's first zero-emission vehicle supply-side regulation — what it took to
   get a technical model adopted as a policy instrument.
2. Using earth observation to monitor water budgets in the White Volta basin.
3. Why GUARDIAN is offline-first — designing child-protection software for the
   districts where connectivity is worst.

## Out of scope

- Reader accounts, subscriptions, email notifications, RSS-to-email.
- Rich text or HTML in comments.
- Multi-author support.
- Analytics beyond like counts.

## Rollout

1. Build and verify locally against a local Postgres.
2. Provision the database and role on the server; run migrations.
3. Deploy as a new PM2 app on a free port; verify directly against the port.
4. Switch the nginx vhost from static root to proxy; keep the static build on
   disk so the previous site can be restored by reverting one nginx file.
5. Verify HTTPS, all existing routes, then blog, gallery and admin.
