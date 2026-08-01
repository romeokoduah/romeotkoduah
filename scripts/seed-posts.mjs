/**
 * Seeds the three starter posts as DRAFTS, so nothing is published without
 * Romeo reading it first.
 *
 *   node scripts/seed-posts.mjs
 *
 * Idempotent: a post whose slug already exists is left alone.
 *
 * Imports content/starter-posts.ts directly — Node 22.6+ strips the types.
 * Run against the server database through a tunnel:
 *   ssh -i ~/.ssh/contabo_deploy -L 5433:127.0.0.1:5432 -N root@169.58.42.182
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'
import { STARTER_POSTS } from '../content/starter-posts.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const envFile = join(root, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

function readingMinutes(md) {
  const words = md.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} })

try {
  let created = 0
  for (const post of STARTER_POSTS) {
    const existing = await sql`SELECT id FROM posts WHERE slug = ${post.slug} LIMIT 1`
    if (existing.length > 0) {
      console.log(`  skip    ${post.slug} (already present)`)
      continue
    }
    await sql`
      INSERT INTO posts (slug, title, excerpt, body_md, tags, status, reading_minutes)
      VALUES (${post.slug}, ${post.title}, ${post.excerpt}, ${post.bodyMd},
              ${post.tags}, 'draft', ${readingMinutes(post.bodyMd)})
    `
    console.log(`  created ${post.slug} (${readingMinutes(post.bodyMd)} min read, draft)`)
    created++
  }
  console.log(
    created === 0
      ? 'Nothing to do — all starter posts already exist.'
      : `Seeded ${created} draft post(s). Review and publish them from /admin/posts.`,
  )
} catch (err) {
  console.error('Seed failed:', err.message)
  process.exitCode = 1
} finally {
  await sql.end({ timeout: 5 })
}
