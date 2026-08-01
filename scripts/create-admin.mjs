/**
 * Creates (or resets) the single admin account.
 *
 *   node scripts/create-admin.mjs <email> [--out /path/to/write/password]
 *
 * Generates a strong random password, stores only its argon2 hash, and writes
 * the plaintext once to the --out path with mode 600. The password is never
 * printed to stdout, logged, or committed — read it over SSH and change it on
 * first login.
 */
import { randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'
import { hash as argonHash } from '@node-rs/argon2'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const envFile = join(root, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const args = process.argv.slice(2)
const email = args.find((a) => !a.startsWith('--'))
const outIdx = args.indexOf('--out')
const outPath = outIdx >= 0 ? args[outIdx + 1] : null

if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/create-admin.mjs <email> [--out <path>]')
  process.exit(1)
}
if (!outPath) {
  console.error('Refusing to run without --out: the password must go to a file, not the terminal.')
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

// 24 bytes of base64url — ample, and safe to paste into a password manager.
const password = randomBytes(24).toString('base64url')
const passwordHash = await argonHash(password)

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} })

try {
  const existing = await sql`SELECT id FROM admin_user WHERE lower(email) = lower(${email})`
  if (existing.length > 0) {
    await sql`
      UPDATE admin_user SET password_hash = ${passwordHash}, updated_at = now()
      WHERE id = ${existing[0].id}
    `
    console.log(`Reset password for ${email}.`)
  } else {
    await sql`INSERT INTO admin_user (email, password_hash) VALUES (${email}, ${passwordHash})`
    console.log(`Created admin ${email}.`)
  }

  writeFileSync(outPath, password + '\n', { mode: 0o600 })
  chmodSync(outPath, 0o600)
  console.log(`Password written to ${outPath} (mode 600). Read it, then change it on first login.`)
} catch (err) {
  console.error('Failed:', err.message)
  process.exitCode = 1
} finally {
  await sql.end({ timeout: 5 })
}
