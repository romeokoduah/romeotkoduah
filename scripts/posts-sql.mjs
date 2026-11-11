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
import { GALLERY_ALBUMS } from '../content/gallery.ts'

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

// A post that names its own publication date (the date of the event it
// reports) carries that date once published, so the archive reads in the
// order things happened rather than the order they were deployed.
for (const p of STARTER_POSTS) {
  if (!p.publishedAt) continue
  out.push(
    `UPDATE posts SET published_at = ${lit(p.publishedAt)}::timestamptz
WHERE slug = ${lit(p.slug)} AND status = 'published'
  AND published_at IS DISTINCT FROM ${lit(p.publishedAt)}::timestamptz;`,
  )
}

// Gallery albums shipped in content/gallery.ts. An existing album keeps its
// title and description; a photo is added only if its URL is not present yet.
for (const album of GALLERY_ALBUMS) {
  const base = `/images/gallery/${album.slug}`
  out.push(
    `INSERT INTO albums (slug, title, description)
VALUES (${lit(album.slug)}, ${lit(album.title)}, ${lit(album.description)})
ON CONFLICT (slug) DO NOTHING;`,
  )
  album.photos.forEach((p, i) => {
    const url = `${base}/${p.file}.webp`
    out.push(
      `INSERT INTO photos (album_id, url, thumb_url, width, height, tone, caption, alt, taken_at, sort)
SELECT a.id, ${lit(url)}, ${lit(`${base}/${p.file}-thumb.webp`)}, ${p.width}, ${p.height}, ${lit(p.tone)},
       ${lit(p.caption)}, ${lit(p.caption)}, ${lit(album.takenAt)}::timestamptz, ${i}
FROM albums a WHERE a.slug = ${lit(album.slug)}
  AND NOT EXISTS (SELECT 1 FROM photos WHERE url = ${lit(url)});`,
    )
  })
  if (album.photos.length > 0) {
    out.push(
      `UPDATE albums SET cover_photo_id = (SELECT id FROM photos WHERE url = ${lit(`${base}/${album.photos[0].file}.webp`)} LIMIT 1)
WHERE slug = ${lit(album.slug)} AND cover_photo_id IS NULL;`,
    )
  }
}

out.push(`SELECT slug, status, (title || excerpt || body_md) LIKE ${MOJIBAKE} AS still_garbled FROM posts ORDER BY created_at;`)
out.push(`SELECT a.slug AS album, count(p.id) AS photos FROM albums a LEFT JOIN photos p ON p.album_id = a.id GROUP BY a.slug;`)
out.push('COMMIT;')

writeFileSync(outPath, out.join('\n\n') + '\n', 'utf8')
console.log(`wrote ${outPath}`)
