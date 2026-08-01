/**
 * Applies db/migrations/*.sql in filename order, once each.
 *
 *   npm run migrate
 *
 * Reads DATABASE_URL from the environment (or .env.local when run locally).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Minimal .env.local loader — avoids a dependency for a two-line job.
const envFile = join(root, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const sql = postgres(url, { max: 1, onnotice: () => {} })

try {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `

  const applied = new Set(
    (await sql`SELECT name FROM schema_migrations`).map((r) => r.name),
  )

  const dir = join(root, 'db', 'migrations')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

  let ran = 0
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip   ${file}`)
      continue
    }
    const text = readFileSync(join(dir, file), 'utf8')
    // Each migration is one transaction: a partial apply is worse than none.
    await sql.begin(async (tx) => {
      await tx.unsafe(text)
      await tx`INSERT INTO schema_migrations (name) VALUES (${file})`
    })
    console.log(`  applied ${file}`)
    ran++
  }

  console.log(ran === 0 ? 'Database already up to date.' : `Applied ${ran} migration(s).`)
} catch (err) {
  console.error('Migration failed:', err.message)
  process.exitCode = 1
} finally {
  await sql.end({ timeout: 5 })
}
