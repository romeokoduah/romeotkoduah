/**
 * Writes SQL that seeds content/starter-posts.ts into the posts table.
 *
 *   node scripts/posts-sql.mjs --out posts.sql [--publish slug,slug] [--replace slug,slug]
 *
 * The server's Node may be too old to import TypeScript, so the deploy turns
 * the posts into plain SQL here and runs it with psql on the server.
 *
 * The file is written here, as UTF-8, rather than printed: PowerShell decodes a
 * native command's stdout with the console code page, which turned every curly
 * quote and dash into CP437 mojibake ("ΓÇÖ") on the first deploy.
 *
 * Idempotent. A post that already exists keeps its title, body and status, so
 * dashboard edits survive, with two exceptions: slugs passed to --replace are
 * overwritten from the file, and any row still carrying that mojibake is
 * repaired. A post whose slug changed is renamed first via `previousSlugs`.
 * New posts go in as drafts; only slugs passed to --publish are published.
 */
import { randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { STARTER_POSTS } from '../content/starter-posts.ts'

const args = process.argv.slice(2)

function listArg(flag) {
  const i = args.indexOf(flag)
  return i >= 0 ? (args[i + 1] ?? '').split(',').filter(Boolean) : []
}

const outIdx = args.indexOf('--out')
const outPath = outIdx >= 0 ? args[outIdx + 1] : null
const publish = listArg('--publish')
const replace = listArg('--replace')

if (!outPath) {
  console.error('Usage: node scripts/posts-sql.mjs --out <file> [--publish slugs] [--replace slugs]')
  process.exit(1)
}
for (const slug of [...publish, ...replace]) {
  if (!STARTER_POSTS.some((p) => p.slug === slug)) {
    console.error(`no starter post with slug "${slug}"`)
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

// 'ΓÇ' spelled in ASCII, so this file's own encoding can never matter.
const MOJIBAKE = `'%' || chr(915) || chr(199) || '%'`

const out = [`SET client_encoding = 'UTF8';`, 'BEGIN;']

for (const p of STARTER_POSTS) {
  for (const old of p.previousSlugs ?? []) {
    out.push(
      `UPDATE posts SET slug = ${lit(p.slug)}, updated_at = now()
WHERE slug = ${lit(old)} AND NOT EXISTS (SELECT 1 FROM posts WHERE slug = ${lit(p.slug)});`,
    )
  }

  const tags = `ARRAY[${p.tags.map(lit).join(', ')}]::text[]`
  const overwrite = replace.includes(p.slug) ? 'TRUE' : 'FALSE'
  out.push(
    `INSERT INTO posts (slug, title, excerpt, body_md, cover_url, tags, status, reading_minutes)
VALUES (${lit(p.slug)}, ${lit(p.title)}, ${lit(p.excerpt)}, ${lit(p.bodyMd)},
        ${lit(p.coverUrl ?? null)}, ${tags}, 'draft', ${readingMinutes(p.bodyMd)})
ON CONFLICT (slug) DO UPDATE SET
  title           = CASE WHEN ${overwrite} OR (posts.title || posts.excerpt || posts.body_md) LIKE ${MOJIBAKE} THEN EXCLUDED.title ELSE posts.title END,
  excerpt         = CASE WHEN ${overwrite} OR (posts.title || posts.excerpt || posts.body_md) LIKE ${MOJIBAKE} THEN EXCLUDED.excerpt ELSE posts.excerpt END,
  body_md         = CASE WHEN ${overwrite} OR (posts.title || posts.excerpt || posts.body_md) LIKE ${MOJIBAKE} THEN EXCLUDED.body_md ELSE posts.body_md END,
  tags            = CASE WHEN ${overwrite} OR (posts.title || posts.excerpt || posts.body_md) LIKE ${MOJIBAKE} THEN EXCLUDED.tags ELSE posts.tags END,
  reading_minutes = CASE WHEN ${overwrite} OR (posts.title || posts.excerpt || posts.body_md) LIKE ${MOJIBAKE} THEN EXCLUDED.reading_minutes ELSE posts.reading_minutes END,
  cover_url       = CASE WHEN ${overwrite} THEN EXCLUDED.cover_url ELSE COALESCE(posts.cover_url, EXCLUDED.cover_url) END,
  updated_at      = CASE WHEN ${overwrite} OR (posts.title || posts.excerpt || posts.body_md) LIKE ${MOJIBAKE} THEN now() ELSE posts.updated_at END;`,
  )
}

for (const slug of publish) {
  out.push(
    `UPDATE posts SET status = 'published', published_at = COALESCE(published_at, now()), updated_at = now()
WHERE slug = ${lit(slug)} AND status = 'draft';`,
  )
}

out.push(`SELECT slug, status, (title || excerpt || body_md) LIKE ${MOJIBAKE} AS still_garbled FROM posts ORDER BY created_at;`)
out.push('COMMIT;')

writeFileSync(outPath, out.join('\n\n') + '\n', 'utf8')
console.log(`wrote ${outPath}`)
