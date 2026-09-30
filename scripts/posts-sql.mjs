/**
 * Prints SQL that seeds content/starter-posts.ts into the posts table.
 *
 *   node scripts/posts-sql.mjs [--publish slug,slug] > posts.sql
 *
 * The server's Node may be too old to import TypeScript, so the deploy turns
 * the posts into plain SQL here and pipes that to psql over SSH instead of
 * running seed-posts.mjs remotely.
 *
 * Idempotent. A post that already exists keeps its title, body and status —
 * edits made in the dashboard are never overwritten. Everything is inserted as
 * a draft; only slugs passed to --publish are published, and only if they are
 * still drafts.
 */
import { randomBytes } from 'node:crypto'
import { STARTER_POSTS } from '../content/starter-posts.ts'

const args = process.argv.slice(2)
const pubIdx = args.indexOf('--publish')
const publish = pubIdx >= 0 ? (args[pubIdx + 1] ?? '').split(',').filter(Boolean) : []

for (const slug of publish) {
  if (!STARTER_POSTS.some((p) => p.slug === slug)) {
    console.error(`--publish: no starter post with slug "${slug}"`)
    process.exit(1)
  }
}

/** Dollar-quoting with a random tag: no escaping, and no tag the text can contain. */
function lit(value) {
  if (value == null) return 'NULL'
  let tag
  do tag = `$q${randomBytes(4).toString('hex')}$`
  while (value.includes(tag))
  return `${tag}${value}${tag}`
}

function readingMinutes(md) {
  const words = md.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const out = ['BEGIN;']

for (const p of STARTER_POSTS) {
  const tags = `ARRAY[${p.tags.map(lit).join(', ')}]::text[]`
  out.push(
    `INSERT INTO posts (slug, title, excerpt, body_md, cover_url, tags, status, reading_minutes)
VALUES (${lit(p.slug)}, ${lit(p.title)}, ${lit(p.excerpt)}, ${lit(p.bodyMd)},
        ${lit(p.coverUrl ?? null)}, ${tags}, 'draft', ${readingMinutes(p.bodyMd)})
ON CONFLICT (slug) DO UPDATE SET cover_url = COALESCE(posts.cover_url, EXCLUDED.cover_url);`,
  )
}

for (const slug of publish) {
  out.push(
    `UPDATE posts SET status = 'published', published_at = COALESCE(published_at, now()), updated_at = now()
WHERE slug = ${lit(slug)} AND status = 'draft';`,
  )
}

out.push(`SELECT slug, status FROM posts ORDER BY created_at;`)
out.push('COMMIT;')

process.stdout.write(out.join('\n\n') + '\n')
