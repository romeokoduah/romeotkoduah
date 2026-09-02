# Command Centre — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a new Next.js repo with the full database schema, two-role authentication with TOTP, an audit log, and both PM2 processes live behind TLS on `todo.romeotkoduah.org`.

**Architecture:** A new repository following the portfolio's proven house pattern — Next standalone under PM2, proxied by nginx, Postgres via `postgres.js` with Drizzle layered on top for typed queries, numbered SQL migrations applied by a dependency-free runner. Sessions are opaque server-side tokens rather than JWTs so the owner can revoke the assistant instantly. Nothing in this phase touches a model, a calendar or a telephony provider.

**Tech Stack:** Next 15 (App Router), React 19, TypeScript, Tailwind v4, `postgres` (postgres.js), `drizzle-orm` + `drizzle-kit`, `@node-rs/argon2`, `otpauth`, `qrcode`, `ioredis`, `bullmq`, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-02-command-centre-design.md`

## Global Constraints

- Next.js App Router with `output: 'standalone'` in `next.config.ts`. The deploy script fails without it.
- All timestamps stored UTC (`timestamptz`). `users.timezone` defaults to `Africa/Accra`.
- Drizzle is used for typed queries. `drizzle-kit` writes plain SQL into `db/migrations/`; the numbered runner applies it. **Never** run `drizzle-kit push` or `migrate` — the runner owns application.
- No Auth.js, no Docker, no Caddy.
- Password hashing is argon2id via `@node-rs/argon2` defaults.
- No secret may reach the client bundle. Anything reading `process.env` for a credential starts with `import 'server-only'`.
- Pure-JS dependencies are preferred over native ones. The repo builds on Windows and runs on Linux; every native module needs a hand-maintained Linux copy on the server (see Task 16).
- Item visibility is the enum `shared | private | secret`. There is no `is_private` boolean anywhere.
- Roles are `owner | assistant`.
- New repo lives at `F:\AI_DEV_LAB\command-centre`. All paths below are relative to that root unless stated.

## Two deltas discovered during planning

The spec says fourteen tables and an extension of the portfolio's `jose` session pattern. Planning surfaced a problem with both:

**A `sessions` table is needed — fifteen tables, not fourteen.** The spec requires that the owner can revoke the assistant's access. A stateless JWT cannot be revoked before it expires, so a signed-cookie-only design fails that requirement for up to twelve hours.

**Session cookies carry an opaque random token, not a JWT.** Given a `sessions` table exists, the token is a random 32-byte value whose SHA-256 hash is stored; verification is a single indexed lookup and revocation is one `UPDATE`. `jose` stays a dependency for the signed acknowledgement links in phase 5.

Update the spec's data model section to match once this plan is approved.

---

### Task 1: Repository scaffold and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.gitignore`, `.env.example`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Test: `tests/harness.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a repo where `npm run typecheck`, `npm run build` and `npm test` all pass.

- [ ] **Step 1: Create the repo and install dependencies**

```bash
mkdir -p /f/AI_DEV_LAB/command-centre && cd /f/AI_DEV_LAB/command-centre
git init
npm init -y
npm i next@^15.5.4 react@^19.1.1 react-dom@^19.1.1 postgres@^3.4.9 drizzle-orm@^0.44.0 \
      @node-rs/argon2@^2.0.2 otpauth@^9.4.0 qrcode@^1.5.4 ioredis@^6.0.0 bullmq@^5.0.0 \
      jose@^6.2.6 zod@^4.4.3 clsx@^2.1.1 tailwind-merge@^3.3.1
npm i -D typescript@^5.7.0 @types/node@^22.10.0 @types/react@^19.1.1 @types/react-dom@^19.1.1 \
      @types/qrcode@^1.5.5 tailwindcss@^4.1.13 @tailwindcss/postcss@^4.1.13 \
      drizzle-kit@^0.31.0 vitest@^3.0.0 server-only@^0.0.1 esbuild@^0.24.0
```

- [ ] **Step 2: Write `package.json` scripts**

Replace the `scripts` block:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build && npm run build:worker",
    "build:worker": "esbuild worker/index.ts --bundle --platform=node --format=esm --target=node22 --outfile=dist/worker.mjs",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "migrate": "node scripts/migrate.mjs",
    "generate": "drizzle-kit generate",
    "worker": "npm run build:worker && node dist/worker.mjs"
  }
}
```

**Why the worker is bundled rather than run from source:** Next's standalone
output traces only the dependencies the *app* imports, so `bullmq` and `ioredis`
would be missing from the deployed `node_modules`. esbuild produces one
self-contained `dist/worker.mjs` with every dependency inlined — no second
`npm install` on the server, no TypeScript loader in production, and no
node_modules for the worker to go stale against. All three of its dependencies
are pure JavaScript, so bundling is safe; `@node-rs/argon2` is never imported by
the worker.

- [ ] **Step 3: Write the config files**

`next.config.ts`:

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  // Required by deploy.ps1 — it packs .next/standalone and nothing else.
  output: 'standalone',
  poweredByHeader: false,
}

export default config
```

`vitest.config.ts` — file parallelism is off because every test file shares one Postgres database:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // Tests share a single Postgres database and truncate between cases.
    // Parallel files would truncate each other's rows mid-assertion.
    fileParallelism: false,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
})
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`.gitignore`:

```
node_modules/
.next/
dist/
out/
.env.local
*.tsbuildinfo
```

- [ ] **Step 4: Write a minimal app shell so `next build` succeeds**

`app/globals.css`:

```css
@import "tailwindcss";
```

`app/layout.tsx`:

```tsx
import './globals.css'

export const metadata = { title: 'Command Centre' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

`app/page.tsx`:

```tsx
export default function Home() {
  return <main>Command Centre</main>
}
```

`postcss.config.mjs`:

```js
export default { plugins: { '@tailwindcss/postcss': {} } }
```

- [ ] **Step 5: Write the failing harness test**

`tests/harness.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { assertEnv } from '../lib/env'

describe('assertEnv', () => {
  it('returns the value when the variable is set', () => {
    process.env.SOME_KEY = 'value'
    expect(assertEnv('SOME_KEY')).toBe('value')
  })

  it('throws a named error when the variable is missing', () => {
    delete process.env.MISSING_KEY
    expect(() => assertEnv('MISSING_KEY')).toThrow('MISSING_KEY is not set')
  })

  it('throws when the variable is present but empty', () => {
    process.env.EMPTY_KEY = ''
    expect(() => assertEnv('EMPTY_KEY')).toThrow('EMPTY_KEY is not set')
  })
})
```

Also create an empty `tests/setup.ts` for now (Task 2 fills it):

```ts
// Database lifecycle hooks are added in Task 2.
export {}
```

- [ ] **Step 6: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../lib/env"`.

- [ ] **Step 7: Write the minimal implementation**

`lib/env.ts` — note this file is deliberately *not* `server-only`, because scripts and the worker import it outside Next:

```ts
/** Reads a required environment variable, failing loudly rather than at 3am. */
export function assertEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set. See .env.example.`)
  return value
}
```

- [ ] **Step 8: Run the tests and the build**

Run: `npm test && npm run typecheck && npm run build`
Expected: 3 tests pass, no type errors, `.next/standalone/server.js` exists.

- [ ] **Step 9: Write `.env.example` and commit**

`.env.example`:

```
# Copy to .env.local for development. On the server these live in
# /root/todo.env, mode 600, never in the repo.

DATABASE_URL=postgres://todoapp:CHANGE_ME@127.0.0.1:5432/todoapp
TEST_DATABASE_URL=postgres://todoapp:CHANGE_ME@127.0.0.1:5432/todoapp_test

# Signs and encrypts. At least 32 characters each.
#   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
SESSION_SECRET=CHANGE_ME_AT_LEAST_32_CHARACTERS_LONG
IP_SALT=CHANGE_ME

# Redis. Database index 3 is this app's; 0 belongs to the portfolio.
REDIS_URL=redis://127.0.0.1:6379/3

# Captures live outside every web root and are served only through an
# authenticated route. Phase 4 uses this; phase 1 only validates it is set.
MEDIA_DIR=/var/www/todo-media

NODE_ENV=development
PORT=3009
```

```bash
git add -A
git commit -m "chore: scaffold repo, Next standalone config and Vitest harness"
```

---

### Task 2: Database client, migration runner and test isolation

**Files:**
- Create: `lib/db.ts`, `scripts/migrate.mjs`, `tests/db.ts`, `tests/setup.ts` (replace)
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: `assertEnv` from Task 1.
- Produces:
  - `sql` — the postgres.js tagged-template client (lazily connected).
  - `db` — the Drizzle client, added in Task 3 once a schema exists.
  - `truncateAll(): Promise<void>` from `tests/db.ts`, called before every test.

- [ ] **Step 1: Create the two local databases**

```bash
createdb todoapp
createdb todoapp_test
```

If Postgres runs on the VPS rather than locally, tunnel it first:
`ssh -i ~/.ssh/contabo_deploy -L 5433:127.0.0.1:5432 root@169.58.42.182` and point both URLs at `127.0.0.1:5433`.

- [ ] **Step 2: Write the failing test**

`tests/db.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sql } from '../lib/db'

describe('database client', () => {
  it('connects lazily and runs a query', async () => {
    const rows = await sql<{ n: number }[]>`SELECT 1::int AS n`
    expect(rows[0].n).toBe(1)
  })

  it('has applied the schema_migrations bookkeeping table', async () => {
    const rows = await sql<{ count: string }[]>`
      SELECT count(*) FROM information_schema.tables
      WHERE table_name = 'schema_migrations'
    `
    expect(Number(rows[0].count)).toBe(1)
  })
})
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `npm test -- tests/db.test.ts`
Expected: FAIL — `Failed to resolve import "../lib/db"`.

- [ ] **Step 4: Write the database client**

`lib/db.ts` — the Proxy defers connection to first query, because `next build` imports every route module to collect its config and must not need a database to do so:

```ts
import postgres from 'postgres'

type Sql = ReturnType<typeof postgres>

declare global {
  // eslint-disable-next-line no-var
  var __sql: Sql | undefined
}

function connect(): Sql {
  const url = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set. See .env.example.')
  return postgres(url, {
    max: 8,
    idle_timeout: 30,
    connect_timeout: 10,
    transform: { undefined: null },
  })
}

function client(): Sql {
  if (!globalThis.__sql) globalThis.__sql = connect()
  return globalThis.__sql
}

/**
 * Behaves exactly like the postgres.js client but connects on first query.
 * `postgres()` returns a callable carrying helper properties, so both the
 * apply and get traps are needed.
 */
export const sql = new Proxy(function noop() {} as unknown as Sql, {
  apply(_t, _this, args: unknown[]) {
    return (client() as unknown as (...a: unknown[]) => unknown)(...args)
  },
  get(_t, prop, receiver) {
    const c = client() as unknown as Record<string | symbol, unknown>
    const value = Reflect.get(c, prop, receiver)
    return typeof value === 'function' ? value.bind(c) : value
  },
  has(_t, prop) {
    return prop in (client() as unknown as object)
  },
}) as Sql
```

- [ ] **Step 5: Write the migration runner**

`scripts/migrate.mjs` — `readdirSync` is non-recursive, so `drizzle-kit`'s `meta/` folder is ignored automatically:

```js
/**
 * Applies db/migrations/*.sql in filename order, once each.
 *
 *   npm run migrate                      # DATABASE_URL
 *   node scripts/migrate.mjs --test      # TEST_DATABASE_URL
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const envFile = join(root, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const useTest = process.argv.includes('--test')
const url = useTest ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
if (!url) {
  console.error(useTest ? 'TEST_DATABASE_URL is not set.' : 'DATABASE_URL is not set.')
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

  const applied = new Set((await sql`SELECT name FROM schema_migrations`).map((r) => r.name))

  const dir = join(root, 'db', 'migrations')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

  let ran = 0
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip    ${file}`)
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
```

- [ ] **Step 6: Write the test database lifecycle**

`tests/db.ts`:

```ts
import { execFileSync } from 'node:child_process'
import { sql } from '../lib/db'

/** Applies every pending migration to TEST_DATABASE_URL. Runs once per suite. */
export function migrateTestDatabase(): void {
  execFileSync('node', ['scripts/migrate.mjs', '--test'], { stdio: 'inherit' })
}

/**
 * Empties every application table between tests. Truncating is used rather
 * than transaction rollback because the code under test holds its own
 * connection from the shared pool and would not see an uncommitted fixture.
 */
export async function truncateAll(): Promise<void> {
  const rows = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> 'schema_migrations'
  `
  if (rows.length === 0) return
  const list = rows.map((r) => `"${r.tablename}"`).join(', ')
  await sql.unsafe(`TRUNCATE ${list} RESTART IDENTITY CASCADE`)
}
```

`tests/setup.ts` (replace the placeholder):

```ts
import { beforeAll, beforeEach, afterAll } from 'vitest'
import { migrateTestDatabase, truncateAll } from './db'
import { sql } from '../lib/db'

process.env.NODE_ENV = 'test'

beforeAll(() => {
  migrateTestDatabase()
})

beforeEach(async () => {
  await truncateAll()
})

afterAll(async () => {
  await sql.end({ timeout: 5 })
})
```

- [ ] **Step 7: Create the migrations directory and run the tests**

```bash
mkdir -p db/migrations
npm test -- tests/db.test.ts
```

Expected: both tests PASS.

- [ ] **Step 8: Commit**

```bash
git add lib/db.ts scripts/migrate.mjs tests/
git commit -m "feat: lazy Postgres client, migration runner and test isolation"
```

---

### Task 3: Schema — enums, users, sessions, push subscriptions, projects

**Files:**
- Create: `db/schema/enums.ts`, `db/schema/users.ts`, `db/schema/projects.ts`, `db/schema/index.ts`, `drizzle.config.ts`
- Modify: `lib/db.ts` (export the Drizzle client)
- Generated: `db/migrations/0000_*.sql`
- Test: `tests/schema-identity.test.ts`

**Interfaces:**
- Consumes: `sql` from Task 2.
- Produces:
  - `db` — Drizzle client bound to the full schema.
  - Tables `users`, `sessions`, `push_subscriptions`, `projects`.
  - `userRole` values `owner | assistant`; `itemVisibility` values `shared | private | secret`.

- [ ] **Step 1: Write the failing test**

`tests/schema-identity.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sql } from '../lib/db'

async function columnDefault(table: string, column: string): Promise<string | null> {
  const rows = await sql<{ column_default: string | null }[]>`
    SELECT column_default FROM information_schema.columns
    WHERE table_name = ${table} AND column_name = ${column}
  `
  return rows[0]?.column_default ?? null
}

describe('identity schema', () => {
  it('defaults a user timezone to Africa/Accra', async () => {
    const def = await columnDefault('users', 'timezone')
    expect(def).toContain('Africa/Accra')
  })

  it('accepts the two valid roles', async () => {
    for (const role of ['owner', 'assistant']) {
      const rows = await sql<{ role: string }[]>`
        INSERT INTO users (name, email, role, password_hash)
        VALUES ('T', ${`${role}@example.com`}, ${role}, 'x')
        RETURNING role
      `
      expect(rows[0].role).toBe(role)
    }
  })

  it('rejects any other role', async () => {
    await expect(sql`
      INSERT INTO users (name, email, role, password_hash)
      VALUES ('T', 'x@example.com', 'superuser', 'x')
    `).rejects.toThrow()
  })

  it('rejects two users with the same email', async () => {
    await sql`INSERT INTO users (name, email, role, password_hash)
              VALUES ('A', 'dup@example.com', 'owner', 'x')`
    await expect(sql`
      INSERT INTO users (name, email, role, password_hash)
      VALUES ('B', 'dup@example.com', 'assistant', 'x')
    `).rejects.toThrow()
  })

  it('cascades session deletion when a user is removed', async () => {
    const [user] = await sql<{ id: string }[]>`
      INSERT INTO users (name, email, role, password_hash)
      VALUES ('A', 'cascade@example.com', 'owner', 'x') RETURNING id
    `
    await sql`
      INSERT INTO sessions (user_id, token_hash, expires_at)
      VALUES (${user.id}, 'hash', now() + interval '1 hour')
    `
    await sql`DELETE FROM users WHERE id = ${user.id}`
    const left = await sql<{ count: string }[]>`SELECT count(*) FROM sessions`
    expect(Number(left[0].count)).toBe(0)
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/schema-identity.test.ts`
Expected: FAIL — `relation "users" does not exist`.

- [ ] **Step 3: Write the enums**

`db/schema/enums.ts`:

```ts
import { pgEnum } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['owner', 'assistant'])

export const projectKind = pgEnum('project_kind', [
  'research', 'consultancy', 'application', 'teaching', 'personal', 'admin',
])

export const itemType = pgEnum('item_type', [
  'task', 'meeting', 'deadline', 'application', 'milestone',
])

export const itemStatus = pgEnum('item_status', [
  'needs_details', 'scheduled', 'in_progress', 'blocked', 'done', 'cancelled',
])

/**
 * Governs both audiences at once. `private` shows the assistant and external
 * calendars an untitled busy block; `secret` hides the item from both and
 * accepts the double-booking risk that implies.
 */
export const itemVisibility = pgEnum('item_visibility', ['shared', 'private', 'secret'])

export const captureKind = pgEnum('capture_kind', ['image', 'audio', 'text'])

export const captureState = pgEnum('capture_state', [
  'pending', 'transcribing', 'extracting', 'done', 'failed',
])

export const reminderChannel = pgEnum('reminder_channel', [
  'push', 'telegram', 'voice', 'email', 'in_app', 'sms',
])

export const reminderState = pgEnum('reminder_state', [
  'pending', 'claimed', 'sent', 'acknowledged', 'cancelled', 'failed',
])

export const calendarProvider = pgEnum('calendar_provider', ['google', 'microsoft'])

export const syncDirection = pgEnum('sync_direction', ['push', 'pull', 'both'])

export const linkOrigin = pgEnum('link_origin', ['local', 'remote'])
```

- [ ] **Step 4: Write the identity tables**

`db/schema/users.ts`:

```ts
import {
  pgTable, uuid, text, timestamp, integer, jsonb, index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { userRole } from './enums'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phoneE164: text('phone_e164'),
  role: userRole('role').notNull(),
  passwordHash: text('password_hash').notNull(),
  totpSecret: text('totp_secret'),
  /** The last accepted TOTP step, so a code cannot be replayed inside its window. */
  totpLastStep: integer('totp_last_step'),
  telegramChatId: text('telegram_chat_id'),
  timezone: text('timezone').notNull().default('Africa/Accra'),
  notificationPrefs: jsonb('notification_prefs').notNull().default(sql`'{}'::jsonb`),
  failedAttempts: integer('failed_attempts').notNull().default(0),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  /** SHA-256 of the cookie value. The raw token is never stored. */
  tokenHash: text('token_hash').notNull().unique(),
  rotatedFrom: uuid('rotated_from'),
  userAgent: text('user_agent'),
  ipHash: text('ip_hash'),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
}, (t) => [index('sessions_user_idx').on(t.userId)])

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('push_subscriptions_user_idx').on(t.userId)])
```

`db/schema/projects.ts`:

```ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { projectKind } from './enums'

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  /** One of the six restrained project colours, as a hex string. */
  colour: text('colour').notNull().default('#8a8f98'),
  kind: projectKind('kind').notNull(),
  status: text('status').notNull().default('active'),
  description: text('description').notNull().default(''),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

`db/schema/index.ts`:

```ts
export * from './enums'
export * from './users'
export * from './projects'
```

- [ ] **Step 5: Configure drizzle-kit and export the Drizzle client**

`drizzle.config.ts`:

```ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema/index.ts',
  // Generated SQL lands beside the hand-written migrations and is applied by
  // scripts/migrate.mjs. Never run `drizzle-kit migrate` or `push`.
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
} satisfies Config
```

Append to `lib/db.ts`:

```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../db/schema'

/** Typed query builder over the same lazily-connected client. */
export const db = drizzle(sql, { schema })
```

- [ ] **Step 6: Generate the migration and apply it**

```bash
npx drizzle-kit generate --name identity
npm run migrate
```

Expected: `db/migrations/0000_identity.sql` created; runner prints `applied 0000_identity.sql`.

Open the generated file and confirm it contains `CREATE TYPE "public"."user_role"` and `CREATE TABLE "users"`. Add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` as the first line if `gen_random_uuid()` is not already available on this Postgres version.

- [ ] **Step 7: Run the tests**

Run: `npm test -- tests/schema-identity.test.ts`
Expected: all 5 tests PASS.

- [ ] **Step 8: Commit**

```bash
git add db/ drizzle.config.ts lib/db.ts tests/schema-identity.test.ts
git commit -m "feat: identity schema — users, sessions, push subscriptions, projects"
```

---

### Task 4: Schema — items, application meta, captures, clarifications, reminders

**Files:**
- Create: `db/schema/items.ts`, `db/schema/captures.ts`, `db/schema/reminders.ts`
- Modify: `db/schema/index.ts`
- Generated: `db/migrations/0001_*.sql`
- Test: `tests/schema-work.test.ts`

**Interfaces:**
- Consumes: `users`, `projects` from Task 3.
- Produces: tables `items`, `application_meta`, `captures`, `clarifications`, `reminders`, and the unique index `reminders_item_offset_idx` on `(item_id, offset_label)` that makes ladder recomputation idempotent.

- [ ] **Step 1: Write the failing test**

`tests/schema-work.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'

let userId: string
let itemId: string

beforeEach(async () => {
  const [u] = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, role, password_hash)
    VALUES ('Owner', 'owner@example.com', 'owner', 'x') RETURNING id
  `
  userId = u.id
  const [i] = await sql<{ id: string }[]>`
    INSERT INTO items (type, title, created_by)
    VALUES ('deadline', 'Abstract due', ${userId}) RETURNING id
  `
  itemId = i.id
})

describe('work schema', () => {
  it('defaults a new item to shared visibility and needs_details status', async () => {
    const [row] = await sql<{ visibility: string; status: string }[]>`
      SELECT visibility, status FROM items WHERE id = ${itemId}
    `
    expect(row.visibility).toBe('shared')
    expect(row.status).toBe('needs_details')
  })

  it('accepts all three visibility levels and rejects a fourth', async () => {
    for (const v of ['shared', 'private', 'secret']) {
      await sql`UPDATE items SET visibility = ${v} WHERE id = ${itemId}`
    }
    await expect(
      sql`UPDATE items SET visibility = 'hidden' WHERE id = ${itemId}`,
    ).rejects.toThrow()
  })

  it('allows a null start, which is what needs_details means', async () => {
    const [row] = await sql<{ starts_at: Date | null }[]>`
      SELECT starts_at FROM items WHERE id = ${itemId}
    `
    expect(row.starts_at).toBeNull()
  })

  it('rejects a second reminder with the same item and offset label', async () => {
    await sql`
      INSERT INTO reminders (item_id, channel, fire_at, offset_label)
      VALUES (${itemId}, 'push', now(), 'T-7d')
    `
    await expect(sql`
      INSERT INTO reminders (item_id, channel, fire_at, offset_label)
      VALUES (${itemId}, 'push', now(), 'T-7d')
    `).rejects.toThrow()
  })

  it('allows the same offset label on a different item', async () => {
    const [other] = await sql<{ id: string }[]>`
      INSERT INTO items (type, title, created_by)
      VALUES ('deadline', 'Other', ${userId}) RETURNING id
    `
    await sql`
      INSERT INTO reminders (item_id, channel, fire_at, offset_label)
      VALUES (${itemId}, 'push', now(), 'T-7d')
    `
    await sql`
      INSERT INTO reminders (item_id, channel, fire_at, offset_label)
      VALUES (${other.id}, 'push', now(), 'T-7d')
    `
    const rows = await sql<{ count: string }[]>`SELECT count(*) FROM reminders`
    expect(Number(rows[0].count)).toBe(2)
  })

  it('starts every reminder unclaimed', async () => {
    const [r] = await sql<{ claimed_at: Date | null; state: string }[]>`
      INSERT INTO reminders (item_id, channel, fire_at, offset_label)
      VALUES (${itemId}, 'voice', now(), 'T-2h')
      RETURNING claimed_at, state
    `
    expect(r.claimed_at).toBeNull()
    expect(r.state).toBe('pending')
  })

  it('keeps the transcript on the capture record', async () => {
    const [c] = await sql<{ transcript: string | null }[]>`
      INSERT INTO captures (kind, transcript, created_by)
      VALUES ('audio', 'meeting on Thursday', ${userId})
      RETURNING transcript
    `
    expect(c.transcript).toBe('meeting on Thursday')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/schema-work.test.ts`
Expected: FAIL — `relation "items" does not exist`.

- [ ] **Step 3: Write the item tables**

`db/schema/items.ts`:

```ts
import {
  pgTable, uuid, text, timestamp, boolean, integer, jsonb, numeric, date, index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { itemType, itemStatus, itemVisibility } from './enums'
import { users } from './users'
import { projects } from './projects'

export const items = pgTable('items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  type: itemType('type').notNull(),
  title: text('title').notNull(),
  notes: text('notes').notNull().default(''),
  /** Null is meaningful: the extractor refused to invent a date. */
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  allDay: boolean('all_day').notNull().default(false),
  timezone: text('timezone').notNull().default('Africa/Accra'),
  status: itemStatus('status').notNull().default('needs_details'),
  priority: integer('priority').notNull().default(0),
  visibility: itemVisibility('visibility').notNull().default('shared'),
  captureId: uuid('capture_id'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  extractionConfidence: jsonb('extraction_confidence'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('items_starts_idx').on(t.startsAt),
  index('items_status_idx').on(t.status),
  index('items_project_idx').on(t.projectId),
])

export const applicationMeta = pgTable('application_meta', {
  itemId: uuid('item_id').primaryKey()
    .references(() => items.id, { onDelete: 'cascade' }),
  funder: text('funder'),
  awardValue: numeric('award_value'),
  portalUrl: text('portal_url'),
  decisionExpectedOn: date('decision_expected_on'),
  requiredDocuments: jsonb('required_documents').notNull().default(sql`'[]'::jsonb`),
  referees: jsonb('referees').notNull().default(sql`'[]'::jsonb`),
})
```

`db/schema/captures.ts`:

```ts
import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { captureKind, captureState } from './enums'
import { users } from './users'
import { items } from './items'

export const captures = pgTable('captures', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  kind: captureKind('kind').notNull(),
  /** Path under MEDIA_DIR. Never a public URL — these are served authenticated. */
  storagePath: text('storage_path'),
  rawText: text('raw_text'),
  /** Kept so a bad extraction can be read against what was actually heard. */
  transcript: text('transcript'),
  modelResponse: jsonb('model_response'),
  state: captureState('state').notNull().default('pending'),
  failureReason: text('failure_reason'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('captures_state_idx').on(t.state)])

export const clarifications = pgTable('clarifications', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  fieldName: text('field_name').notNull(),
  questionText: text('question_text').notNull(),
  /** Enumerated answers where the ambiguity is enumerable. Free text is the fallback. */
  options: jsonb('options').notNull().default(sql`'[]'::jsonb`),
  answerText: text('answer_text'),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('clarifications_open_idx').on(t.itemId)])
```

`db/schema/reminders.ts`:

```ts
import {
  pgTable, uuid, text, timestamp, integer, uniqueIndex, index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { reminderChannel, reminderState } from './enums'
import { items } from './items'

export const reminders = pgTable('reminders', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  channel: reminderChannel('channel').notNull(),
  fireAt: timestamp('fire_at', { withTimezone: true }).notNull(),
  /** Stable rung name, e.g. 'T-7d'. Half of the idempotency key. */
  offsetLabel: text('offset_label').notNull(),
  state: reminderState('state').notNull().default('pending'),
  attemptCount: integer('attempt_count').notNull().default(0),
  /** Set by the dispatcher's conditional claim. A crash cannot double-send. */
  claimedAt: timestamp('claimed_at', { withTimezone: true }),
  providerMessageId: text('provider_message_id'),
  acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  // Makes ladder recomputation an upsert rather than a source of duplicates.
  uniqueIndex('reminders_item_offset_idx').on(t.itemId, t.offsetLabel),
  index('reminders_due_idx').on(t.fireAt).where(sql`state = 'pending'`),
])
```

Update `db/schema/index.ts`:

```ts
export * from './enums'
export * from './users'
export * from './projects'
export * from './items'
export * from './captures'
export * from './reminders'
```

- [ ] **Step 4: Generate, apply and run the tests**

```bash
npx drizzle-kit generate --name work
npm run migrate
npm test -- tests/schema-work.test.ts
```

Expected: `0001_work.sql` applied; all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add db/ tests/schema-work.test.ts
git commit -m "feat: work schema — items, captures, clarifications, idempotent reminders"
```

---

### Task 5: Schema — calendar, audit log, settings, job log, glossary

**Files:**
- Create: `db/schema/calendar.ts`, `db/schema/ops.ts`
- Modify: `db/schema/index.ts`
- Generated: `db/migrations/0002_*.sql`
- Test: `tests/schema-ops.test.ts`

**Interfaces:**
- Consumes: `users`, `items` from Tasks 3–4.
- Produces: tables `calendar_accounts`, `calendar_links`, `audit_log`, `settings`, `job_log`, `glossary_terms`.

- [ ] **Step 1: Write the failing test**

`tests/schema-ops.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'

let userId: string

beforeEach(async () => {
  const [u] = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, role, password_hash)
    VALUES ('Owner', 'owner@example.com', 'owner', 'x') RETURNING id
  `
  userId = u.id
})

describe('operations schema', () => {
  it('stores audit entries with before and after snapshots', async () => {
    const [row] = await sql<{ before: unknown; after: unknown }[]>`
      INSERT INTO audit_log (actor_user_id, action, entity, entity_id, before, after)
      VALUES (${userId}, 'update', 'items', gen_random_uuid(),
              ${sql.json({ title: 'Old' })}, ${sql.json({ title: 'New' })})
      RETURNING before, after
    `
    expect(row.before).toEqual({ title: 'Old' })
    expect(row.after).toEqual({ title: 'New' })
  })

  it('keeps settings unique by key', async () => {
    await sql`INSERT INTO settings (key, value) VALUES ('digest_hour', ${sql.json(6)})`
    await expect(
      sql`INSERT INTO settings (key, value) VALUES ('digest_hour', ${sql.json(7)})`,
    ).rejects.toThrow()
  })

  it('stores a calendar account with encrypted token columns', async () => {
    const [row] = await sql<{ access_token_enc: string }[]>`
      INSERT INTO calendar_accounts
        (user_id, provider, calendar_id, access_token_enc, refresh_token_enc)
      VALUES (${userId}, 'google', 'primary', 'ENCRYPTED', 'ENCRYPTED')
      RETURNING access_token_enc
    `
    expect(row.access_token_enc).toBe('ENCRYPTED')
  })

  it('keeps glossary terms unique so keyterms are not sent twice', async () => {
    await sql`INSERT INTO glossary_terms (term, kind) VALUES ('Kwame Nkrumah', 'person')`
    await expect(
      sql`INSERT INTO glossary_terms (term, kind) VALUES ('Kwame Nkrumah', 'person')`,
    ).rejects.toThrow()
  })

  it('records a job log entry', async () => {
    const [row] = await sql<{ worker: string; state: string }[]>`
      INSERT INTO job_log (worker, job_id, state)
      VALUES ('dispatcher', 'job-1', 'completed')
      RETURNING worker, state
    `
    expect(row.worker).toBe('dispatcher')
    expect(row.state).toBe('completed')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/schema-ops.test.ts`
Expected: FAIL — `relation "audit_log" does not exist`.

- [ ] **Step 3: Write the calendar tables**

`db/schema/calendar.ts`:

```ts
import {
  pgTable, uuid, text, timestamp, primaryKey, index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { calendarProvider, syncDirection, linkOrigin } from './enums'
import { users } from './users'
import { items } from './items'

export const calendarAccounts = pgTable('calendar_accounts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: calendarProvider('provider').notNull(),
  calendarId: text('calendar_id').notNull(),
  /** AES-256-GCM ciphertext. Plaintext tokens never touch this database. */
  accessTokenEnc: text('access_token_enc').notNull(),
  refreshTokenEnc: text('refresh_token_enc').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  syncToken: text('sync_token'),
  syncDirection: syncDirection('sync_direction').notNull().default('both'),
  subscriptionId: text('subscription_id'),
  subscriptionExpiresAt: timestamp('subscription_expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const calendarLinks = pgTable('calendar_links', {
  itemId: uuid('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  calendarAccountId: uuid('calendar_account_id').notNull()
    .references(() => calendarAccounts.id, { onDelete: 'cascade' }),
  externalEventId: text('external_event_id').notNull(),
  externalEtag: text('external_etag'),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  /** 'remote' events are never deleted by this app, only unlinked. */
  origin: linkOrigin('origin').notNull().default('local'),
}, (t) => [
  primaryKey({ columns: [t.itemId, t.calendarAccountId] }),
  index('calendar_links_external_idx').on(t.calendarAccountId, t.externalEventId),
])
```

- [ ] **Step 4: Write the operations tables**

`db/schema/ops.ts`:

```ts
import {
  pgTable, uuid, text, timestamp, jsonb, index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: uuid('entity_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('audit_log_recent_idx').on(t.createdAt)])

/** Every schedule and threshold. Changing a reminder hour must never need a deploy. */
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const jobLog = pgTable('job_log', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  worker: text('worker').notNull(),
  jobId: text('job_id'),
  state: text('state').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  error: text('error'),
  payload: jsonb('payload'),
}, (t) => [index('job_log_worker_idx').on(t.worker, t.startedAt)])

/** Feeds Deepgram keyterms and the extraction prompt's proper-noun repair list. */
export const glossaryTerms = pgTable('glossary_terms', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  term: text('term').notNull().unique(),
  kind: text('kind').notNull(),
  aliases: text('aliases').array().notNull().default(sql`'{}'::text[]`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

Update `db/schema/index.ts` to add `export * from './calendar'` and `export * from './ops'`.

- [ ] **Step 5: Generate, apply and run the tests**

```bash
npx drizzle-kit generate --name ops
npm run migrate
npm test
```

Expected: `0002_ops.sql` applied; every test file passes.

- [ ] **Step 6: Commit**

```bash
git add db/ tests/schema-ops.test.ts
git commit -m "feat: calendar, audit, settings, job log and glossary schema"
```

---

### Task 6: Password hashing and the user repository

**Files:**
- Create: `lib/passwords.ts`, `lib/users.ts`
- Test: `tests/passwords.test.ts`, `tests/users.test.ts`

**Interfaces:**
- Consumes: `db`, `sql`, `users` table.
- Produces:
  - `hashPassword(plain: string): Promise<string>`
  - `verifyPassword(hash: string, plain: string): Promise<boolean>`
  - `type Role = 'owner' | 'assistant'`
  - `type AppUser = { id: string; name: string; email: string; role: Role; passwordHash: string; totpSecret: string | null; totpLastStep: number | null; failedAttempts: number; lockedUntil: Date | null; timezone: string }`
  - `findUserByEmail(email: string): Promise<AppUser | null>`
  - `findUserById(id: string): Promise<AppUser | null>`

- [ ] **Step 1: Write the failing tests**

`tests/passwords.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../lib/passwords'

describe('passwords', () => {
  it('produces an argon2id hash, not the plaintext', async () => {
    const hash = await hashPassword('correct horse battery staple')
    expect(hash).toMatch(/^\$argon2id\$/)
    expect(hash).not.toContain('correct horse')
  })

  it('verifies the right password', async () => {
    const hash = await hashPassword('s3cret-passphrase')
    expect(await verifyPassword(hash, 's3cret-passphrase')).toBe(true)
  })

  it('rejects the wrong password', async () => {
    const hash = await hashPassword('s3cret-passphrase')
    expect(await verifyPassword(hash, 'wrong')).toBe(false)
  })

  it('returns false rather than throwing on a malformed hash', async () => {
    expect(await verifyPassword('not-a-hash', 'anything')).toBe(false)
  })

  it('salts, so the same password hashes differently twice', async () => {
    const a = await hashPassword('same')
    const b = await hashPassword('same')
    expect(a).not.toBe(b)
  })
})
```

`tests/users.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'
import { findUserByEmail, findUserById } from '../lib/users'

beforeEach(async () => {
  await sql`
    INSERT INTO users (name, email, role, password_hash)
    VALUES ('Romeo', 'Owner@Example.com', 'owner', 'hash-value')
  `
})

describe('user repository', () => {
  it('finds a user by email case-insensitively', async () => {
    const user = await findUserByEmail('owner@example.com')
    expect(user?.name).toBe('Romeo')
    expect(user?.role).toBe('owner')
  })

  it('returns null for an unknown email', async () => {
    expect(await findUserByEmail('nobody@example.com')).toBeNull()
  })

  it('exposes the fields the login flow needs', async () => {
    const user = await findUserByEmail('owner@example.com')
    expect(user?.passwordHash).toBe('hash-value')
    expect(user?.totpSecret).toBeNull()
    expect(user?.failedAttempts).toBe(0)
    expect(user?.timezone).toBe('Africa/Accra')
  })

  it('finds the same user by id', async () => {
    const byEmail = await findUserByEmail('owner@example.com')
    const byId = await findUserById(byEmail!.id)
    expect(byId?.email).toBe('Owner@Example.com')
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- tests/passwords.test.ts tests/users.test.ts`
Expected: FAIL — cannot resolve `../lib/passwords` and `../lib/users`.

- [ ] **Step 3: Write the implementations**

`lib/passwords.ts`:

```ts
import { hash as argonHash, verify as argonVerify } from '@node-rs/argon2'

/** argon2id with the library defaults, which are the OWASP-recommended ones. */
export async function hashPassword(plain: string): Promise<string> {
  return argonHash(plain)
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argonVerify(hash, plain)
  } catch {
    // A malformed stored hash is a failed login, not a crashed request.
    return false
  }
}
```

`lib/users.ts`:

```ts
import { sql } from './db'

export type Role = 'owner' | 'assistant'

export type AppUser = {
  id: string
  name: string
  email: string
  role: Role
  passwordHash: string
  totpSecret: string | null
  totpLastStep: number | null
  failedAttempts: number
  lockedUntil: Date | null
  timezone: string
}

type Row = {
  id: string
  name: string
  email: string
  role: Role
  password_hash: string
  totp_secret: string | null
  totp_last_step: number | null
  failed_attempts: number
  locked_until: Date | null
  timezone: string
}

function toUser(row: Row): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash,
    totpSecret: row.totp_secret,
    totpLastStep: row.totp_last_step,
    failedAttempts: row.failed_attempts,
    lockedUntil: row.locked_until,
    timezone: row.timezone,
  }
}

const COLUMNS = sql`
  id, name, email, role, password_hash, totp_secret, totp_last_step,
  failed_attempts, locked_until, timezone
`

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const rows = await sql<Row[]>`
    SELECT ${COLUMNS} FROM users WHERE lower(email) = lower(${email}) LIMIT 1
  `
  return rows[0] ? toUser(rows[0]) : null
}

export async function findUserById(id: string): Promise<AppUser | null> {
  const rows = await sql<Row[]>`
    SELECT ${COLUMNS} FROM users WHERE id = ${id} LIMIT 1
  `
  return rows[0] ? toUser(rows[0]) : null
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/passwords.test.ts tests/users.test.ts`
Expected: 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/passwords.ts lib/users.ts tests/passwords.test.ts tests/users.test.ts
git commit -m "feat: argon2id password hashing and user repository"
```

---

### Task 7: TOTP enrolment and verification

**Files:**
- Create: `lib/totp.ts`
- Test: `tests/totp.test.ts`

**Interfaces:**
- Consumes: `AppUser` from Task 6.
- Produces:
  - `generateTotpSecret(): string` — base32.
  - `totpUri(email: string, secret: string): string`
  - `totpQrDataUrl(uri: string): Promise<string>`
  - `verifyTotp(secret: string, token: string, lastStep: number | null): { ok: boolean; step: number | null }`

`otpauth` is pure JavaScript, deliberately: a native TOTP library would need the same hand-maintained Linux build that `@node-rs/argon2` already does.

- [ ] **Step 1: Write the failing test**

`tests/totp.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { TOTP, Secret } from 'otpauth'
import { generateTotpSecret, totpUri, verifyTotp } from '../lib/totp'

function currentToken(secret: string): string {
  return new TOTP({ secret: Secret.fromBase32(secret), digits: 6, period: 30 }).generate()
}

describe('totp', () => {
  it('generates a base32 secret of usable length', () => {
    const secret = generateTotpSecret()
    expect(secret).toMatch(/^[A-Z2-7]+$/)
    expect(secret.length).toBeGreaterThanOrEqual(32)
  })

  it('builds an otpauth uri carrying the issuer and account', () => {
    const uri = totpUri('owner@example.com', generateTotpSecret())
    expect(uri).toMatch(/^otpauth:\/\/totp\//)
    expect(uri).toContain('issuer=Command%20Centre')
    expect(uri).toContain('owner%40example.com')
  })

  it('accepts the current code', () => {
    const secret = generateTotpSecret()
    const result = verifyTotp(secret, currentToken(secret), null)
    expect(result.ok).toBe(true)
    expect(result.step).toBeTypeOf('number')
  })

  it('rejects a wrong code', () => {
    const secret = generateTotpSecret()
    expect(verifyTotp(secret, '000000', null).ok).toBe(false)
  })

  it('rejects a code already used in this step, so it cannot be replayed', () => {
    const secret = generateTotpSecret()
    const token = currentToken(secret)
    const first = verifyTotp(secret, token, null)
    expect(first.ok).toBe(true)
    const replay = verifyTotp(secret, token, first.step)
    expect(replay.ok).toBe(false)
  })

  it('rejects a non-numeric code without throwing', () => {
    const secret = generateTotpSecret()
    expect(verifyTotp(secret, 'abcdef', null).ok).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/totp.test.ts`
Expected: FAIL — cannot resolve `../lib/totp`.

- [ ] **Step 3: Write the implementation**

`lib/totp.ts`:

```ts
import { TOTP, Secret } from 'otpauth'
import QRCode from 'qrcode'

const ISSUER = 'Command Centre'
const DIGITS = 6
const PERIOD = 30

function totp(secret: string): TOTP {
  return new TOTP({
    issuer: ISSUER,
    algorithm: 'SHA1',
    digits: DIGITS,
    period: PERIOD,
    secret: Secret.fromBase32(secret),
  })
}

/** 160 bits of entropy, base32 encoded — what authenticator apps expect. */
export function generateTotpSecret(): string {
  return new Secret({ size: 20 }).base32
}

export function totpUri(email: string, secret: string): string {
  return new TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: 'SHA1',
    digits: DIGITS,
    period: PERIOD,
    secret: Secret.fromBase32(secret),
  }).toString()
}

export async function totpQrDataUrl(uri: string): Promise<string> {
  return QRCode.toDataURL(uri, { margin: 1, width: 240 })
}

/**
 * Verifies a code and returns the time step it belongs to. Callers persist the
 * step on the user so the same code cannot be replayed within its 30 seconds,
 * which is the window an attacker reading it over a shoulder actually has.
 */
export function verifyTotp(
  secret: string,
  token: string,
  lastStep: number | null,
): { ok: boolean; step: number | null } {
  if (!/^\d{6}$/.test(token)) return { ok: false, step: null }

  const delta = totp(secret).validate({ token, window: 1 })
  if (delta === null) return { ok: false, step: null }

  const step = Math.floor(Date.now() / 1000 / PERIOD) + delta
  if (lastStep !== null && step <= lastStep) return { ok: false, step: null }

  return { ok: true, step }
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/totp.test.ts`
Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/totp.ts tests/totp.test.ts
git commit -m "feat: TOTP enrolment, verification and replay protection"
```

---

### Task 8: Sessions — issue, verify, rotate, revoke

**Files:**
- Create: `lib/sessions.ts`
- Test: `tests/sessions.test.ts`

**Interfaces:**
- Consumes: `sql`, `sessions` table, `findUserById`.
- Produces:
  - `SESSION_COOKIE = 'cc_session'`
  - `issueSession(userId, meta): Promise<{ token: string; expiresAt: Date }>`
  - `resolveSession(token): Promise<{ userId: string; sessionId: string; shouldRotate: boolean } | null>`
  - `rotateSession(sessionId, meta): Promise<{ token: string; expiresAt: Date }>`
  - `revokeSession(sessionId): Promise<void>`
  - `revokeAllSessionsFor(userId): Promise<void>`

- [ ] **Step 1: Write the failing test**

`tests/sessions.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'
import {
  issueSession, resolveSession, rotateSession, revokeSession, revokeAllSessionsFor,
} from '../lib/sessions'

let userId: string
const meta = { userAgent: 'test', ipHash: 'abc' }

beforeEach(async () => {
  const [u] = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, role, password_hash)
    VALUES ('Romeo', 'owner@example.com', 'owner', 'x') RETURNING id
  `
  userId = u.id
})

describe('sessions', () => {
  it('issues a token that resolves to the user', async () => {
    const { token } = await issueSession(userId, meta)
    const resolved = await resolveSession(token)
    expect(resolved?.userId).toBe(userId)
  })

  it('never stores the raw token', async () => {
    const { token } = await issueSession(userId, meta)
    const rows = await sql<{ token_hash: string }[]>`SELECT token_hash FROM sessions`
    expect(rows[0].token_hash).not.toBe(token)
    expect(rows[0].token_hash).toHaveLength(64)
  })

  it('rejects an unknown token', async () => {
    expect(await resolveSession('not-a-real-token')).toBeNull()
  })

  it('rejects an expired session', async () => {
    const { token } = await issueSession(userId, meta)
    await sql`UPDATE sessions SET expires_at = now() - interval '1 minute'`
    expect(await resolveSession(token)).toBeNull()
  })

  it('rejects a revoked session immediately', async () => {
    const { token } = await issueSession(userId, meta)
    const resolved = await resolveSession(token)
    await revokeSession(resolved!.sessionId)
    expect(await resolveSession(token)).toBeNull()
  })

  it('revokes every session for a user, which is how the owner cuts off the assistant', async () => {
    const a = await issueSession(userId, meta)
    const b = await issueSession(userId, meta)
    await revokeAllSessionsFor(userId)
    expect(await resolveSession(a.token)).toBeNull()
    expect(await resolveSession(b.token)).toBeNull()
  })

  it('asks for rotation once the session is past its halfway point', async () => {
    const { token } = await issueSession(userId, meta)
    expect((await resolveSession(token))?.shouldRotate).toBe(false)
    await sql`UPDATE sessions SET issued_at = now() - interval '11 hours'`
    expect((await resolveSession(token))?.shouldRotate).toBe(true)
  })

  it('rotation issues a new token and kills the old one', async () => {
    const first = await issueSession(userId, meta)
    const resolved = await resolveSession(first.token)
    const second = await rotateSession(resolved!.sessionId, meta)
    expect(second.token).not.toBe(first.token)
    expect(await resolveSession(first.token)).toBeNull()
    expect((await resolveSession(second.token))?.userId).toBe(userId)
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/sessions.test.ts`
Expected: FAIL — cannot resolve `../lib/sessions`.

- [ ] **Step 3: Write the implementation**

`lib/sessions.ts`:

```ts
import { randomBytes, createHash } from 'node:crypto'
import { sql } from './db'

export const SESSION_COOKIE = 'cc_session'

const LIFETIME_HOURS = 12
/** Past halfway, the next request gets a fresh token. */
const ROTATE_AFTER_HOURS = LIFETIME_HOURS / 2

export type SessionMeta = { userAgent?: string | null; ipHash?: string | null }

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

async function insert(
  userId: string,
  meta: SessionMeta,
  rotatedFrom: string | null,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString('base64url')
  const rows = await sql<{ expires_at: Date }[]>`
    INSERT INTO sessions (user_id, token_hash, rotated_from, user_agent, ip_hash, expires_at)
    VALUES (
      ${userId}, ${hashToken(token)}, ${rotatedFrom},
      ${meta.userAgent ?? null}, ${meta.ipHash ?? null},
      now() + ${`${LIFETIME_HOURS} hours`}::interval
    )
    RETURNING expires_at
  `
  return { token, expiresAt: rows[0].expires_at }
}

export async function issueSession(userId: string, meta: SessionMeta) {
  return insert(userId, meta, null)
}

/**
 * Resolves a cookie value to its user. One indexed lookup, and revocation is
 * immediate — the reason sessions are stored rather than signed.
 */
export async function resolveSession(
  token: string,
): Promise<{ userId: string; sessionId: string; shouldRotate: boolean } | null> {
  const rows = await sql<{ id: string; user_id: string; issued_at: Date }[]>`
    SELECT id, user_id, issued_at FROM sessions
    WHERE token_hash = ${hashToken(token)}
      AND revoked_at IS NULL
      AND expires_at > now()
    LIMIT 1
  `
  const row = rows[0]
  if (!row) return null

  await sql`UPDATE sessions SET last_seen_at = now() WHERE id = ${row.id}`

  const ageHours = (Date.now() - row.issued_at.getTime()) / 3_600_000
  return {
    userId: row.user_id,
    sessionId: row.id,
    shouldRotate: ageHours >= ROTATE_AFTER_HOURS,
  }
}

export async function rotateSession(sessionId: string, meta: SessionMeta) {
  const rows = await sql<{ user_id: string }[]>`
    UPDATE sessions SET revoked_at = now()
    WHERE id = ${sessionId} AND revoked_at IS NULL
    RETURNING user_id
  `
  if (!rows[0]) throw new Error('Cannot rotate a session that is already gone.')
  return insert(rows[0].user_id, meta, sessionId)
}

export async function revokeSession(sessionId: string): Promise<void> {
  await sql`UPDATE sessions SET revoked_at = now() WHERE id = ${sessionId}`
}

export async function revokeAllSessionsFor(userId: string): Promise<void> {
  await sql`
    UPDATE sessions SET revoked_at = now()
    WHERE user_id = ${userId} AND revoked_at IS NULL
  `
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/sessions.test.ts`
Expected: 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/sessions.ts tests/sessions.test.ts
git commit -m "feat: revocable, rotating server-side sessions"
```

---

### Task 9: Login throttling — per-IP and per-account

**Files:**
- Create: `lib/redis.ts`, `lib/throttle.ts`
- Test: `tests/throttle.test.ts`

**Interfaces:**
- Consumes: `sql`, `users` table.
- Produces:
  - `hashIp(ip: string): string`
  - `checkIpThrottle(ipHash: string): Promise<boolean>` — false means blocked. **Fails open** if Redis is unreachable.
  - `recordFailedAttempt(userId: string): Promise<void>`
  - `clearFailedAttempts(userId: string): Promise<void>`
  - `isAccountLocked(user: AppUser): boolean`

Two layers, deliberately asymmetric: the Redis per-IP limit fails open, because a dead Redis must not lock the owner out of their own console; the Postgres per-account lockout is authoritative and always enforced.

- [ ] **Step 1: Write the failing test**

`tests/throttle.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'
import { findUserByEmail } from '../lib/users'
import {
  hashIp, recordFailedAttempt, clearFailedAttempts, isAccountLocked,
} from '../lib/throttle'

let userId: string

beforeEach(async () => {
  const [u] = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, role, password_hash)
    VALUES ('Romeo', 'owner@example.com', 'owner', 'x') RETURNING id
  `
  userId = u.id
})

describe('throttling', () => {
  it('hashes an IP rather than storing it', () => {
    process.env.IP_SALT = 'test-salt'
    const hash = hashIp('102.176.0.1')
    expect(hash).not.toContain('102.176')
    expect(hash).toHaveLength(64)
  })

  it('produces a different hash for a different address', () => {
    process.env.IP_SALT = 'test-salt'
    expect(hashIp('1.1.1.1')).not.toBe(hashIp('2.2.2.2'))
  })

  it('counts failed attempts', async () => {
    await recordFailedAttempt(userId)
    await recordFailedAttempt(userId)
    const user = await findUserByEmail('owner@example.com')
    expect(user?.failedAttempts).toBe(2)
  })

  it('locks the account on the fifth failure', async () => {
    for (let i = 0; i < 5; i++) await recordFailedAttempt(userId)
    const user = await findUserByEmail('owner@example.com')
    expect(isAccountLocked(user!)).toBe(true)
  })

  it('does not lock before the fifth failure', async () => {
    for (let i = 0; i < 4; i++) await recordFailedAttempt(userId)
    const user = await findUserByEmail('owner@example.com')
    expect(isAccountLocked(user!)).toBe(false)
  })

  it('clears the counter and the lock on a successful login', async () => {
    for (let i = 0; i < 5; i++) await recordFailedAttempt(userId)
    await clearFailedAttempts(userId)
    const user = await findUserByEmail('owner@example.com')
    expect(user?.failedAttempts).toBe(0)
    expect(isAccountLocked(user!)).toBe(false)
  })

  it('treats a lock whose time has passed as expired', async () => {
    await sql`
      UPDATE users SET failed_attempts = 5, locked_until = now() - interval '1 minute'
      WHERE id = ${userId}
    `
    const user = await findUserByEmail('owner@example.com')
    expect(isAccountLocked(user!)).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/throttle.test.ts`
Expected: FAIL — cannot resolve `../lib/throttle`.

- [ ] **Step 3: Write the Redis client**

`lib/redis.ts`:

```ts
import Redis from 'ioredis'

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | null | undefined
}

/**
 * Returns the shared client, or null when REDIS_URL is unset. Callers must
 * handle null — rate limiting is a convenience, not a correctness guarantee.
 */
export function redis(): Redis | null {
  if (globalThis.__redis !== undefined) return globalThis.__redis
  const url = process.env.REDIS_URL
  globalThis.__redis = url
    ? new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: false })
    : null
  globalThis.__redis?.on('error', () => {
    // Logged by ioredis already; swallowed so an unreachable Redis is not fatal.
  })
  return globalThis.__redis
}
```

- [ ] **Step 4: Write the throttle**

`lib/throttle.ts`:

```ts
import { createHash } from 'node:crypto'
import { sql } from './db'
import { redis } from './redis'
import type { AppUser } from './users'

const IP_WINDOW_SECONDS = 900
const IP_MAX_ATTEMPTS = 20
const ACCOUNT_MAX_ATTEMPTS = 5
const ACCOUNT_LOCK_MINUTES = 15

export function hashIp(ip: string): string {
  const salt = process.env.IP_SALT ?? ''
  return createHash('sha256').update(salt + ip).digest('hex')
}

/**
 * Per-IP limit. Fails OPEN: an unreachable Redis must not lock the owner out
 * of their own console. The per-account lockout below is the real defence.
 */
export async function checkIpThrottle(ipHash: string): Promise<boolean> {
  const client = redis()
  if (!client) return true
  try {
    const key = `login:ip:${ipHash}`
    const count = await client.incr(key)
    if (count === 1) await client.expire(key, IP_WINDOW_SECONDS)
    return count <= IP_MAX_ATTEMPTS
  } catch {
    return true
  }
}

export async function recordFailedAttempt(userId: string): Promise<void> {
  await sql`
    UPDATE users
    SET failed_attempts = failed_attempts + 1,
        locked_until = CASE
          WHEN failed_attempts + 1 >= ${ACCOUNT_MAX_ATTEMPTS}
          THEN now() + ${`${ACCOUNT_LOCK_MINUTES} minutes`}::interval
          ELSE locked_until
        END,
        updated_at = now()
    WHERE id = ${userId}
  `
}

export async function clearFailedAttempts(userId: string): Promise<void> {
  await sql`
    UPDATE users SET failed_attempts = 0, locked_until = NULL, updated_at = now()
    WHERE id = ${userId}
  `
}

export function isAccountLocked(user: AppUser): boolean {
  return user.lockedUntil !== null && user.lockedUntil.getTime() > Date.now()
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test -- tests/throttle.test.ts`
Expected: 7 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/redis.ts lib/throttle.ts tests/throttle.test.ts
git commit -m "feat: per-IP and per-account login throttling"
```

---

### Task 10: The login flow

**Files:**
- Create: `lib/login.ts`, `app/login/page.tsx`, `app/login/actions.ts`
- Test: `tests/login.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 6–9.
- Produces:
  - `type LoginResult = { ok: true; userId: string } | { ok: false; reason: 'invalid' | 'locked' | 'throttled' | 'totp_required' | 'totp_invalid' }`
  - `attemptLogin(input: { email: string; password: string; totp?: string; ipHash: string }): Promise<LoginResult>`

`attemptLogin` is pure logic with no cookies or redirects, so it is testable without a request. The server action wraps it.

- [ ] **Step 1: Write the failing test**

`tests/login.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'
import { hashPassword } from '../lib/passwords'
import { generateTotpSecret } from '../lib/totp'
import { TOTP, Secret } from 'otpauth'
import { attemptLogin } from '../lib/login'
import { findUserByEmail } from '../lib/users'

const PASSWORD = 'a-long-enough-passphrase'
let secret: string

function code(): string {
  return new TOTP({ secret: Secret.fromBase32(secret), digits: 6, period: 30 }).generate()
}

beforeEach(async () => {
  secret = generateTotpSecret()
  await sql`
    INSERT INTO users (name, email, role, password_hash, totp_secret)
    VALUES ('Romeo', 'owner@example.com', 'owner', ${await hashPassword(PASSWORD)}, ${secret})
  `
})

describe('attemptLogin', () => {
  const base = { email: 'owner@example.com', ipHash: 'iphash' }

  it('asks for a TOTP code when the password is right but no code was given', async () => {
    const result = await attemptLogin({ ...base, password: PASSWORD })
    expect(result).toEqual({ ok: false, reason: 'totp_required' })
  })

  it('succeeds with the right password and the right code', async () => {
    const result = await attemptLogin({ ...base, password: PASSWORD, totp: code() })
    expect(result.ok).toBe(true)
  })

  it('rejects a wrong password', async () => {
    const result = await attemptLogin({ ...base, password: 'wrong', totp: code() })
    expect(result).toEqual({ ok: false, reason: 'invalid' })
  })

  it('gives the same answer for an unknown email as for a wrong password', async () => {
    const result = await attemptLogin({
      email: 'nobody@example.com', password: 'wrong', ipHash: 'iphash',
    })
    expect(result).toEqual({ ok: false, reason: 'invalid' })
  })

  it('rejects a wrong TOTP code', async () => {
    const result = await attemptLogin({ ...base, password: PASSWORD, totp: '000000' })
    expect(result).toEqual({ ok: false, reason: 'totp_invalid' })
  })

  it('counts a wrong password against the account', async () => {
    await attemptLogin({ ...base, password: 'wrong' })
    const user = await findUserByEmail(base.email)
    expect(user?.failedAttempts).toBe(1)
  })

  it('refuses a locked account even with correct credentials', async () => {
    await sql`
      UPDATE users SET failed_attempts = 5, locked_until = now() + interval '15 minutes'
    `
    const result = await attemptLogin({ ...base, password: PASSWORD, totp: code() })
    expect(result).toEqual({ ok: false, reason: 'locked' })
  })

  it('clears the failure counter after a successful login', async () => {
    await attemptLogin({ ...base, password: 'wrong' })
    await attemptLogin({ ...base, password: PASSWORD, totp: code() })
    const user = await findUserByEmail(base.email)
    expect(user?.failedAttempts).toBe(0)
  })

  it('refuses to reuse the same TOTP code twice', async () => {
    const token = code()
    const first = await attemptLogin({ ...base, password: PASSWORD, totp: token })
    expect(first.ok).toBe(true)
    const second = await attemptLogin({ ...base, password: PASSWORD, totp: token })
    expect(second).toEqual({ ok: false, reason: 'totp_invalid' })
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/login.test.ts`
Expected: FAIL — cannot resolve `../lib/login`.

- [ ] **Step 3: Write the login logic**

`lib/login.ts`:

```ts
import { sql } from './db'
import { findUserByEmail } from './users'
import { verifyPassword, hashPassword } from './passwords'
import { verifyTotp } from './totp'
import {
  checkIpThrottle, recordFailedAttempt, clearFailedAttempts, isAccountLocked,
} from './throttle'

export type LoginResult =
  | { ok: true; userId: string }
  | { ok: false; reason: 'invalid' | 'locked' | 'throttled' | 'totp_required' | 'totp_invalid' }

export type LoginInput = {
  email: string
  password: string
  totp?: string
  ipHash: string
}

/** Burned when the email is unknown, so timing does not reveal which accounts exist. */
const DUMMY_HASH_PROMISE = hashPassword('timing-equaliser')

export async function attemptLogin(input: LoginInput): Promise<LoginResult> {
  if (!(await checkIpThrottle(input.ipHash))) {
    return { ok: false, reason: 'throttled' }
  }

  const user = await findUserByEmail(input.email)
  if (!user) {
    await verifyPassword(await DUMMY_HASH_PROMISE, input.password)
    return { ok: false, reason: 'invalid' }
  }

  if (isAccountLocked(user)) return { ok: false, reason: 'locked' }

  if (!(await verifyPassword(user.passwordHash, input.password))) {
    await recordFailedAttempt(user.id)
    return { ok: false, reason: 'invalid' }
  }

  // Password is right. Second factor is mandatory for both roles.
  if (!user.totpSecret) {
    // An account mid-enrolment cannot log in; finish enrolment from the CLI.
    return { ok: false, reason: 'invalid' }
  }
  if (!input.totp) return { ok: false, reason: 'totp_required' }

  const { ok, step } = verifyTotp(user.totpSecret, input.totp, user.totpLastStep)
  if (!ok) {
    await recordFailedAttempt(user.id)
    return { ok: false, reason: 'totp_invalid' }
  }

  await sql`UPDATE users SET totp_last_step = ${step} WHERE id = ${user.id}`
  await clearFailedAttempts(user.id)
  return { ok: true, userId: user.id }
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/login.test.ts`
Expected: 9 tests PASS.

- [ ] **Step 5: Write the server action and the login page**

`app/login/actions.ts`:

```ts
'use server'

import 'server-only'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { attemptLogin } from '@/lib/login'
import { issueSession, SESSION_COOKIE } from '@/lib/sessions'
import { hashIp } from '@/lib/throttle'

const MESSAGES: Record<string, string> = {
  invalid: 'Email, password or code was wrong.',
  locked: 'Too many attempts. Try again in fifteen minutes.',
  throttled: 'Too many attempts from this network. Try again shortly.',
  totp_required: 'Enter the six-digit code from your authenticator.',
  totp_invalid: 'That code was wrong or already used.',
}

export async function loginAction(_prev: unknown, form: FormData) {
  const head = await headers()
  const ip = head.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

  const result = await attemptLogin({
    email: String(form.get('email') ?? ''),
    password: String(form.get('password') ?? ''),
    totp: String(form.get('totp') ?? '') || undefined,
    ipHash: hashIp(ip),
  })

  if (!result.ok) {
    return { error: MESSAGES[result.reason], needsTotp: result.reason !== 'invalid' }
  }

  const { token, expiresAt } = await issueSession(result.userId, {
    userAgent: head.get('user-agent'),
    ipHash: hashIp(ip),
  })

  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })

  redirect('/')
}

export async function logoutAction() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) {
    const { resolveSession, revokeSession } = await import('@/lib/sessions')
    const resolved = await resolveSession(token)
    if (resolved) await revokeSession(resolved.sessionId)
  }
  jar.delete(SESSION_COOKIE)
  redirect('/login')
}
```

`app/login/page.tsx` — deliberately plain; the design token layer arrives in phase 2:

```tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <main>
      <h1>Command Centre</h1>
      <form action={action}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" />

        <label htmlFor="password">Password</label>
        <input
          id="password" name="password" type="password" required
          autoComplete="current-password"
        />

        <label htmlFor="totp">Authenticator code</label>
        <input
          id="totp" name="totp" inputMode="numeric" pattern="[0-9]{6}"
          autoComplete="one-time-code"
        />

        {state?.error && <p role="alert">{state.error}</p>}

        <button type="submit" disabled={pending}>
          {pending ? 'Checking' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 6: Verify the build and commit**

Run: `npm run typecheck && npm run build && npm test`
Expected: all green.

```bash
git add lib/login.ts app/login tests/login.test.ts
git commit -m "feat: login flow with mandatory TOTP second factor"
```

---

### Task 11: Route guards and middleware

**Files:**
- Create: `lib/roles.ts`, `lib/guards.ts`, `middleware.ts`
- Test: `tests/roles.test.ts`

**Interfaces:**
- Consumes: `resolveSession`, `findUserById`.
- Produces:
  - `assertOwner(user: AppUser): void` from **`lib/roles.ts`** — throws `FORBIDDEN`.
  - `currentUser(): Promise<AppUser | null>` from `lib/guards.ts`
  - `requireUser(): Promise<AppUser>` — redirects to `/login` when absent.
  - `requireOwner(): Promise<AppUser>` — redirects to `/` when the user is an assistant.

**Why `assertOwner` lives in its own file:** `lib/guards.ts` starts with
`import 'server-only'`, and that package throws when imported outside a React
Server Component — including from Vitest. Role logic is the most
security-critical code in the phase and must be directly testable, so the pure
predicate lives in `lib/roles.ts`, which imports nothing server-bound. Server
code and tests both import it from there.

- [ ] **Step 1: Write the failing test**

`tests/roles.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { assertOwner } from '../lib/roles'
import type { AppUser } from '../lib/users'

function user(role: 'owner' | 'assistant'): AppUser {
  return {
    id: 'id', name: 'N', email: 'e@example.com', role,
    passwordHash: 'x', totpSecret: null, totpLastStep: null,
    failedAttempts: 0, lockedUntil: null, timezone: 'Africa/Accra',
  }
}

describe('assertOwner', () => {
  it('allows the owner through', () => {
    expect(() => assertOwner(user('owner'))).not.toThrow()
  })

  it('refuses an assistant', () => {
    expect(() => assertOwner(user('assistant'))).toThrow('FORBIDDEN')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/roles.test.ts`
Expected: FAIL — cannot resolve `../lib/roles`.

- [ ] **Step 3: Write the pure role predicate**

`lib/roles.ts` — no `server-only`, no imports beyond a type:

```ts
import type { AppUser } from './users'

/** Throws FORBIDDEN for an assistant. Callers convert that into a redirect. */
export function assertOwner(user: AppUser): void {
  if (user.role !== 'owner') throw new Error('FORBIDDEN')
}
```

- [ ] **Step 4: Write the guards**

`lib/guards.ts`:

```ts
import 'server-only'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, resolveSession, rotateSession } from './sessions'
import { findUserById, type AppUser } from './users'

export async function currentUser(): Promise<AppUser | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null

  const resolved = await resolveSession(token)
  if (!resolved) return null

  if (resolved.shouldRotate) {
    const head = await headers()
    const next = await rotateSession(resolved.sessionId, {
      userAgent: head.get('user-agent'),
      ipHash: null,
    })
    jar.set(SESSION_COOKIE, next.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: next.expiresAt,
    })
  }

  return findUserById(resolved.userId)
}

export async function requireUser(): Promise<AppUser> {
  const user = await currentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireOwner(): Promise<AppUser> {
  const user = await requireUser()
  if (user.role !== 'owner') redirect('/')
  return user
}
```

Add the import at the top of the file alongside the others, so server code has
one place to reach for both:

```ts
export { assertOwner } from './roles'
```

- [ ] **Step 5: Write the middleware**

`middleware.ts` — a cheap cookie-presence check only. It cannot query Postgres (Edge runtime), so `requireUser` remains the real gate:

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from './lib/sessions'

const PUBLIC = ['/login', '/api/health']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next()

  // Presence only. Validity is checked by requireUser() on the server, which
  // can reach the database; the Edge runtime cannot.
  if (!request.cookies.get(SESSION_COOKIE)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 6: Run tests and build, then commit**

Run: `npm test && npm run build`
Expected: 2 new tests pass, build succeeds.

```bash
git add lib/roles.ts lib/guards.ts middleware.ts tests/roles.test.ts
git commit -m "feat: session guards, role checks and security headers"
```

---

### Task 12: Audit log

**Files:**
- Create: `lib/audit.ts`, `app/activity/page.tsx`
- Test: `tests/audit.test.ts`

**Interfaces:**
- Consumes: `sql`, `auditLog` table, `AppUser`.
- Produces:
  - `recordAudit(entry: { actorUserId: string; action: string; entity: string; entityId?: string | null; before?: unknown; after?: unknown }): Promise<void>`
  - `recentActivity(limit?: number): Promise<ActivityRow[]>` where `ActivityRow = { id, actorName, action, entity, entityId, before, after, createdAt }`

- [ ] **Step 1: Write the failing test**

`tests/audit.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'
import { recordAudit, recentActivity } from '../lib/audit'

let assistantId: string

beforeEach(async () => {
  const [u] = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, role, password_hash)
    VALUES ('Assistant', 'pa@example.com', 'assistant', 'x') RETURNING id
  `
  assistantId = u.id
})

describe('audit log', () => {
  it('stores the before and after snapshots', async () => {
    await recordAudit({
      actorUserId: assistantId,
      action: 'update',
      entity: 'items',
      before: { title: 'Draft' },
      after: { title: 'Final' },
    })
    const rows = await recentActivity()
    expect(rows[0].before).toEqual({ title: 'Draft' })
    expect(rows[0].after).toEqual({ title: 'Final' })
  })

  it('names the actor, which is the point of the activity view', async () => {
    await recordAudit({ actorUserId: assistantId, action: 'create', entity: 'items' })
    const rows = await recentActivity()
    expect(rows[0].actorName).toBe('Assistant')
  })

  it('returns the newest entry first', async () => {
    await recordAudit({ actorUserId: assistantId, action: 'first', entity: 'items' })
    await recordAudit({ actorUserId: assistantId, action: 'second', entity: 'items' })
    const rows = await recentActivity()
    expect(rows[0].action).toBe('second')
  })

  it('honours the limit', async () => {
    for (let i = 0; i < 5; i++) {
      await recordAudit({ actorUserId: assistantId, action: `a${i}`, entity: 'items' })
    }
    expect(await recentActivity(2)).toHaveLength(2)
  })

  it('accepts an entry with no snapshots, such as a login', async () => {
    await recordAudit({ actorUserId: assistantId, action: 'login', entity: 'sessions' })
    const rows = await recentActivity()
    expect(rows[0].before).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/audit.test.ts`
Expected: FAIL — cannot resolve `../lib/audit`.

- [ ] **Step 3: Write the implementation**

`lib/audit.ts`:

```ts
import { sql } from './db'

export type AuditEntry = {
  actorUserId: string
  action: string
  entity: string
  entityId?: string | null
  before?: unknown
  after?: unknown
}

export type ActivityRow = {
  id: string
  actorName: string | null
  action: string
  entity: string
  entityId: string | null
  before: unknown
  after: unknown
  createdAt: Date
}

/**
 * Every mutating action by either role lands here. The snapshots are what make
 * "what did my assistant change today" answerable rather than guessable.
 */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  await sql`
    INSERT INTO audit_log (actor_user_id, action, entity, entity_id, before, after)
    VALUES (
      ${entry.actorUserId}, ${entry.action}, ${entry.entity},
      ${entry.entityId ?? null},
      ${entry.before === undefined ? null : sql.json(entry.before as never)},
      ${entry.after === undefined ? null : sql.json(entry.after as never)}
    )
  `
}

export async function recentActivity(limit = 100): Promise<ActivityRow[]> {
  const rows = await sql<{
    id: string
    actor_name: string | null
    action: string
    entity: string
    entity_id: string | null
    before: unknown
    after: unknown
    created_at: Date
  }[]>`
    SELECT a.id, u.name AS actor_name, a.action, a.entity, a.entity_id,
           a.before, a.after, a.created_at
    FROM audit_log a
    LEFT JOIN users u ON u.id = a.actor_user_id
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `
  return rows.map((r) => ({
    id: r.id,
    actorName: r.actor_name,
    action: r.action,
    entity: r.entity,
    entityId: r.entity_id,
    before: r.before,
    after: r.after,
    createdAt: r.created_at,
  }))
}
```

- [ ] **Step 4: Write the activity page**

`app/activity/page.tsx`:

```tsx
import { requireOwner } from '@/lib/guards'
import { recentActivity } from '@/lib/audit'

export default async function ActivityPage() {
  await requireOwner()
  const rows = await recentActivity(100)

  return (
    <main>
      <h1>Activity</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">When</th>
            <th scope="col">Who</th>
            <th scope="col">Action</th>
            <th scope="col">Entity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <time dateTime={row.createdAt.toISOString()}>
                  {row.createdAt.toISOString().replace('T', ' ').slice(0, 16)}
                </time>
              </td>
              <td>{row.actorName ?? 'deleted user'}</td>
              <td>{row.action}</td>
              <td>{row.entity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p>Nothing has been changed yet.</p>}
    </main>
  )
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- tests/audit.test.ts && npm run build`
Expected: 5 tests PASS, build succeeds.

```bash
git add lib/audit.ts app/activity tests/audit.test.ts
git commit -m "feat: audit log with before/after snapshots and owner activity view"
```

---

### Task 13: Account bootstrap script

**Files:**
- Create: `scripts/create-user.mjs`
- Test: manual, documented below (this is an operational script run over SSH, and mocking a TTY to test it would test the mock)

**Interfaces:**
- Consumes: the `users` table, argon2, `otpauth`.
- Produces: `node scripts/create-user.mjs <email> --name "<name>" --role owner|assistant --out <path>`

- [ ] **Step 1: Write the script**

`scripts/create-user.mjs`:

```js
/**
 * Creates or resets an account, generating both the password and the TOTP
 * secret. Writes them once to --out with mode 600; neither is ever printed.
 *
 *   node scripts/create-user.mjs romeo@example.com \
 *     --name "Romeo Tweneboah Koduah" --role owner --out /root/cc-owner.txt
 */
import { randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'
import { hash as argonHash } from '@node-rs/argon2'
import { Secret, TOTP } from 'otpauth'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const envFile = join(root, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : null
}

const email = args.find((a) => !a.startsWith('--') && a.includes('@'))
const name = flag('name')
const role = flag('role')
const outPath = flag('out')

if (!email || !name || !role || !outPath) {
  console.error(
    'Usage: node scripts/create-user.mjs <email> --name "<name>" ' +
    '--role owner|assistant --out <path>',
  )
  process.exit(1)
}
if (role !== 'owner' && role !== 'assistant') {
  console.error('--role must be owner or assistant.')
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const password = randomBytes(24).toString('base64url')
const passwordHash = await argonHash(password)
const totpSecret = new Secret({ size: 20 }).base32
const uri = new TOTP({
  issuer: 'Command Centre',
  label: email,
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: Secret.fromBase32(totpSecret),
}).toString()

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} })

try {
  const existing = await sql`SELECT id FROM users WHERE lower(email) = lower(${email})`
  if (existing.length > 0) {
    await sql`
      UPDATE users
      SET name = ${name}, role = ${role}, password_hash = ${passwordHash},
          totp_secret = ${totpSecret}, totp_last_step = NULL,
          failed_attempts = 0, locked_until = NULL, updated_at = now()
      WHERE id = ${existing[0].id}
    `
    console.log(`Reset ${email} (${role}).`)
  } else {
    await sql`
      INSERT INTO users (name, email, role, password_hash, totp_secret)
      VALUES (${name}, ${email}, ${role}, ${passwordHash}, ${totpSecret})
    `
    console.log(`Created ${email} (${role}).`)
  }

  writeFileSync(
    outPath,
    [
      `email:    ${email}`,
      `password: ${password}`,
      `totp:     ${totpSecret}`,
      `uri:      ${uri}`,
      '',
      'Add the uri to an authenticator app, sign in, then delete this file.',
      '',
    ].join('\n'),
    { mode: 0o600 },
  )
  chmodSync(outPath, 0o600)
  console.log(`Credentials written to ${outPath} (mode 600).`)
} catch (err) {
  console.error('Failed:', err.message)
  process.exitCode = 1
} finally {
  await sql.end({ timeout: 5 })
}
```

- [ ] **Step 2: Verify it end to end against the local database**

```bash
node scripts/create-user.mjs test@example.com --name "Test" --role owner \
  --out /tmp/cc-test.txt
cat /tmp/cc-test.txt
```

Expected: the file lists an email, a password, a base32 secret and an `otpauth://` URI. Add the URI to an authenticator app, run `npm run dev`, and sign in at `http://localhost:3000/login` with the password and a live code.

- [ ] **Step 3: Verify the negative paths**

```bash
node scripts/create-user.mjs test@example.com --name "T" --role superuser --out /tmp/x
```

Expected: exits 1 with `--role must be owner or assistant.`

```bash
node scripts/create-user.mjs test@example.com --name "T" --role owner
```

Expected: exits 1 with the usage line.

- [ ] **Step 4: Clean up and commit**

```bash
rm -f /tmp/cc-test.txt
git add scripts/create-user.mjs
git commit -m "feat: account bootstrap script with password and TOTP provisioning"
```

---

### Task 14: Owner-only account administration screen

**Files:**
- Create: `lib/accounts.ts`, `app/admin/accounts/page.tsx`, `app/admin/accounts/actions.ts`
- Test: `tests/accounts.test.ts`

**Interfaces:**
- Consumes: `assertOwner`, `hashPassword`, `generateTotpSecret`, `totpUri`, `totpQrDataUrl`, `recordAudit`, `revokeAllSessionsFor`.
- Produces:
  - `createAssistant(actor: AppUser, input: { name: string; email: string }): Promise<{ userId: string; password: string; totpSecret: string; uri: string }>`
  - `listAccounts(): Promise<{ id: string; name: string; email: string; role: Role; lastSeenAt: Date | null }[]>`
  - `revokeAccess(actor: AppUser, userId: string): Promise<void>`

- [ ] **Step 1: Write the failing test**

`tests/accounts.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { sql } from '../lib/db'
import { createAssistant, listAccounts, revokeAccess } from '../lib/accounts'
import { findUserByEmail, type AppUser } from '../lib/users'
import { issueSession, resolveSession } from '../lib/sessions'
import { recentActivity } from '../lib/audit'

let owner: AppUser
let assistantActor: AppUser

beforeEach(async () => {
  await sql`
    INSERT INTO users (name, email, role, password_hash)
    VALUES ('Romeo', 'owner@example.com', 'owner', 'x'),
           ('PA', 'pa@example.com', 'assistant', 'x')
  `
  owner = (await findUserByEmail('owner@example.com'))!
  assistantActor = (await findUserByEmail('pa@example.com'))!
})

describe('account administration', () => {
  it('lets the owner create an assistant with generated credentials', async () => {
    const result = await createAssistant(owner, {
      name: 'New PA', email: 'newpa@example.com',
    })
    expect(result.password.length).toBeGreaterThan(20)
    expect(result.totpSecret).toMatch(/^[A-Z2-7]+$/)
    expect(result.uri).toContain('otpauth://')

    const created = await findUserByEmail('newpa@example.com')
    expect(created?.role).toBe('assistant')
    expect(created?.passwordHash).not.toBe(result.password)
  })

  it('refuses an assistant trying to create an account', async () => {
    await expect(
      createAssistant(assistantActor, { name: 'X', email: 'x@example.com' }),
    ).rejects.toThrow('FORBIDDEN')
  })

  it('writes an audit entry that never contains the password', async () => {
    const result = await createAssistant(owner, {
      name: 'New PA', email: 'newpa@example.com',
    })
    const rows = await recentActivity()
    const entry = rows.find((r) => r.action === 'create_assistant')
    expect(entry).toBeDefined()
    expect(JSON.stringify(entry)).not.toContain(result.password)
    expect(JSON.stringify(entry)).not.toContain(result.totpSecret)
  })

  it('refuses a duplicate email', async () => {
    await expect(
      createAssistant(owner, { name: 'Dup', email: 'pa@example.com' }),
    ).rejects.toThrow()
  })

  it('lists both accounts', async () => {
    const rows = await listAccounts()
    expect(rows).toHaveLength(2)
    expect(rows.map((r) => r.role).sort()).toEqual(['assistant', 'owner'])
  })

  it('revokes every session when the owner cuts off an assistant', async () => {
    const { token } = await issueSession(assistantActor.id, {})
    expect(await resolveSession(token)).not.toBeNull()
    await revokeAccess(owner, assistantActor.id)
    expect(await resolveSession(token)).toBeNull()
  })

  it('refuses an assistant trying to revoke anyone', async () => {
    await expect(revokeAccess(assistantActor, owner.id)).rejects.toThrow('FORBIDDEN')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/accounts.test.ts`
Expected: FAIL — cannot resolve `../lib/accounts`.

- [ ] **Step 3: Write the implementation**

`lib/accounts.ts`:

```ts
import { randomBytes } from 'node:crypto'
import { sql } from './db'
import { hashPassword } from './passwords'
import { generateTotpSecret, totpUri } from './totp'
// From ./roles, not ./guards — lib/accounts.ts is imported by tests, and
// guards.ts pulls in `server-only`, which throws outside a server component.
import { assertOwner } from './roles'
import { recordAudit } from './audit'
import { revokeAllSessionsFor } from './sessions'
import type { AppUser, Role } from './users'

export type AccountRow = {
  id: string
  name: string
  email: string
  role: Role
  lastSeenAt: Date | null
}

/**
 * Returns the plaintext password and TOTP secret exactly once, to be shown to
 * the owner and never stored. Only the argon2 hash reaches the database, and
 * neither value appears in the audit entry.
 */
export async function createAssistant(
  actor: AppUser,
  input: { name: string; email: string },
): Promise<{ userId: string; password: string; totpSecret: string; uri: string }> {
  assertOwner(actor)

  const password = randomBytes(24).toString('base64url')
  const totpSecret = generateTotpSecret()

  const rows = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, role, password_hash, totp_secret)
    VALUES (${input.name}, ${input.email}, 'assistant',
            ${await hashPassword(password)}, ${totpSecret})
    RETURNING id
  `

  await recordAudit({
    actorUserId: actor.id,
    action: 'create_assistant',
    entity: 'users',
    entityId: rows[0].id,
    after: { name: input.name, email: input.email, role: 'assistant' },
  })

  return {
    userId: rows[0].id,
    password,
    totpSecret,
    uri: totpUri(input.email, totpSecret),
  }
}

export async function listAccounts(): Promise<AccountRow[]> {
  const rows = await sql<{
    id: string; name: string; email: string; role: Role; last_seen_at: Date | null
  }[]>`
    SELECT u.id, u.name, u.email, u.role,
           (SELECT max(s.last_seen_at) FROM sessions s
             WHERE s.user_id = u.id AND s.revoked_at IS NULL) AS last_seen_at
    FROM users u
    ORDER BY u.role, u.name
  `
  return rows.map((r) => ({
    id: r.id, name: r.name, email: r.email, role: r.role, lastSeenAt: r.last_seen_at,
  }))
}

export async function revokeAccess(actor: AppUser, userId: string): Promise<void> {
  assertOwner(actor)
  await revokeAllSessionsFor(userId)
  await recordAudit({
    actorUserId: actor.id,
    action: 'revoke_sessions',
    entity: 'users',
    entityId: userId,
  })
}
```

- [ ] **Step 4: Write the server actions and page**

`app/admin/accounts/actions.ts`:

```ts
'use server'

import 'server-only'
import { revalidatePath } from 'next/cache'
import { requireOwner } from '@/lib/guards'
import { createAssistant, revokeAccess } from '@/lib/accounts'
import { totpQrDataUrl } from '@/lib/totp'

export async function createAssistantAction(_prev: unknown, form: FormData) {
  const owner = await requireOwner()
  const name = String(form.get('name') ?? '').trim()
  const email = String(form.get('email') ?? '').trim()
  if (!name || !email.includes('@')) return { error: 'Name and a valid email are required.' }

  try {
    const created = await createAssistant(owner, { name, email })
    revalidatePath('/admin/accounts')
    // Shown once. Nothing here is persisted or logged.
    return {
      credentials: {
        email,
        password: created.password,
        qr: await totpQrDataUrl(created.uri),
      },
    }
  } catch (err) {
    const message = err instanceof Error && err.message.includes('duplicate')
      ? 'That email already has an account.'
      : 'Could not create the account.'
    return { error: message }
  }
}

export async function revokeAccessAction(form: FormData) {
  const owner = await requireOwner()
  await revokeAccess(owner, String(form.get('userId')))
  revalidatePath('/admin/accounts')
}
```

`app/admin/accounts/page.tsx`:

```tsx
import { requireOwner } from '@/lib/guards'
import { listAccounts } from '@/lib/accounts'
import { revokeAccessAction } from './actions'
import { NewAssistantForm } from './new-assistant-form'

export default async function AccountsPage() {
  await requireOwner()
  const accounts = await listAccounts()

  return (
    <main>
      <h1>Accounts</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Last seen</th>
            <th scope="col">Access</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.email}</td>
              <td>{account.role}</td>
              <td>{account.lastSeenAt?.toISOString().slice(0, 16) ?? 'never'}</td>
              <td>
                <form action={revokeAccessAction}>
                  <input type="hidden" name="userId" value={account.id} />
                  <button type="submit">Sign out everywhere</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add an assistant</h2>
      <NewAssistantForm />
    </main>
  )
}
```

`app/admin/accounts/new-assistant-form.tsx`:

```tsx
'use client'

import { useActionState } from 'react'
import { createAssistantAction } from './actions'

export function NewAssistantForm() {
  const [state, action, pending] = useActionState(createAssistantAction, null)

  if (state && 'credentials' in state && state.credentials) {
    return (
      <div>
        <h3>Credentials for {state.credentials.email}</h3>
        <p>
          These are shown once and are not stored. Copy them somewhere safe, then
          reload this page.
        </p>
        <p>
          <strong>Password:</strong> <code>{state.credentials.password}</code>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={state.credentials.qr} alt="Authenticator enrolment QR code" />
      </div>
    )
  }

  return (
    <form action={action}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      {state && 'error' in state && state.error && <p role="alert">{state.error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Creating' : 'Create assistant'}
      </button>
    </form>
  )
}
```

- [ ] **Step 5: Run tests and build, then commit**

Run: `npm test -- tests/accounts.test.ts && npm run build`
Expected: 7 tests PASS, build succeeds.

```bash
git add lib/accounts.ts app/admin tests/accounts.test.ts
git commit -m "feat: owner-only account administration with one-time credential display"
```

---

### Task 15: Worker process and job log

**Files:**
- Create: `worker/index.ts`, `worker/job-log.ts`, `app/api/health/route.ts`
- Test: `tests/job-log.test.ts`

**Interfaces:**
- Consumes: `sql`, `jobLog` table, `redis()`.
- Produces:
  - `startJob(worker: string, jobId: string | null, payload?: unknown): Promise<string>` — returns the log row id.
  - `finishJob(id: string, state: 'completed' | 'failed', error?: string): Promise<void>`
  - A `todo-worker` entrypoint that connects to Redis, registers a heartbeat queue, and exits non-zero if Redis is unreachable at boot.
  - `dist/worker.mjs` — the esbuild bundle PM2 actually runs.

This task exists in phase 1 so the second PM2 process is real and monitored from the first deploy. The workers themselves arrive in phases 3–7.

- [ ] **Step 1: Write the failing test**

`tests/job-log.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sql } from '../lib/db'
import { startJob, finishJob } from '../worker/job-log'

describe('job log', () => {
  it('records a started job as running', async () => {
    const id = await startJob('dispatcher', 'job-1', { due: 3 })
    const [row] = await sql<{ state: string; payload: unknown }[]>`
      SELECT state, payload FROM job_log WHERE id = ${id}
    `
    expect(row.state).toBe('running')
    expect(row.payload).toEqual({ due: 3 })
  })

  it('marks a job completed and stamps the finish time', async () => {
    const id = await startJob('digest', null)
    await finishJob(id, 'completed')
    const [row] = await sql<{ state: string; finished_at: Date | null }[]>`
      SELECT state, finished_at FROM job_log WHERE id = ${id}
    `
    expect(row.state).toBe('completed')
    expect(row.finished_at).not.toBeNull()
  })

  it('keeps the error text on a failed job, which is what makes it debuggable', async () => {
    const id = await startJob('intake', 'job-2')
    await finishJob(id, 'failed', 'DeepSeek returned 400')
    const [row] = await sql<{ state: string; error: string | null }[]>`
      SELECT state, error FROM job_log WHERE id = ${id}
    `
    expect(row.state).toBe('failed')
    expect(row.error).toBe('DeepSeek returned 400')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/job-log.test.ts`
Expected: FAIL — cannot resolve `../worker/job-log`.

- [ ] **Step 3: Write the job log**

`worker/job-log.ts`:

```ts
import { sql } from '../lib/db'

export async function startJob(
  worker: string,
  jobId: string | null,
  payload?: unknown,
): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    INSERT INTO job_log (worker, job_id, state, payload)
    VALUES (${worker}, ${jobId}, 'running',
            ${payload === undefined ? null : sql.json(payload as never)})
    RETURNING id
  `
  return rows[0].id
}

export async function finishJob(
  id: string,
  state: 'completed' | 'failed',
  error?: string,
): Promise<void> {
  await sql`
    UPDATE job_log
    SET state = ${state}, finished_at = now(), error = ${error ?? null}
    WHERE id = ${id}
  `
}
```

- [ ] **Step 4: Write the worker entrypoint**

`worker/index.ts` — deliberately minimal; it proves the process, the Redis connection and the job log all work before any real worker depends on them:

```ts
import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { startJob, finishJob } from './job-log'

const url = process.env.REDIS_URL
if (!url) {
  console.error('REDIS_URL is not set. The worker cannot start.')
  process.exit(1)
}

// BullMQ requires this setting and refuses to run without it.
const connection = new IORedis(url, { maxRetriesPerRequest: null })
const PREFIX = 'todo'

const heartbeat = new Queue('heartbeat', { connection, prefix: PREFIX })

new Worker(
  'heartbeat',
  async (job) => {
    const logId = await startJob('heartbeat', job.id ?? null)
    try {
      await finishJob(logId, 'completed')
    } catch (err) {
      await finishJob(logId, 'failed', err instanceof Error ? err.message : String(err))
      throw err
    }
  },
  { connection, prefix: PREFIX },
)

// Every five minutes, so `job_log` shows at a glance whether the worker is alive.
await heartbeat.upsertJobScheduler('heartbeat-tick', { every: 5 * 60 * 1000 })

console.log('todo-worker started')

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    await connection.quit()
    process.exit(0)
  })
}
```

- [ ] **Step 5: Write the health endpoint**

`app/api/health/route.ts`:

```ts
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await sql`SELECT 1`
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 503 })
  }
}
```

- [ ] **Step 6: Verify the worker bundles and starts**

```bash
npm test -- tests/job-log.test.ts
npm run worker
```

Expected: 3 tests pass; esbuild writes `dist/worker.mjs` as a single file; the
worker prints `todo-worker started` and stays running. Confirm the bundle is
self-contained — `node dist/worker.mjs` must work from a directory with no
`node_modules`, which is exactly the situation on the server. After five
minutes, `psql todoapp -c "SELECT worker, state FROM job_log"` shows a completed
`heartbeat` row. Stop it with Ctrl-C and confirm it exits cleanly.

- [ ] **Step 7: Commit**

```bash
git add worker/ app/api/health tests/job-log.test.ts
git commit -m "feat: worker process, heartbeat scheduler and job log"
```

---

### Task 16: Deployment — nginx, PM2, TLS, native modules

**Files:**
- Create: `deploy.ps1`, `docs/deployment.md`
- Server: `/etc/nginx/sites-available/todo.romeotkoduah.org`, `/root/todo.env`

**Interfaces:**
- Consumes: the built standalone output from every prior task.
- Produces: `https://todo.romeotkoduah.org` serving the login page, with `todo-app` and `todo-worker` both running under PM2.

**The native module trap:** `@node-rs/argon2` ships a platform-specific binary. The bundle is built on Windows, so its natives cannot run on Ubuntu. The portfolio already solved this by keeping Linux builds in a separate directory and copying them in on every deploy; this app needs the same, or every login 500s with "Failed to load native binding".

- [ ] **Step 1: Confirm the port and Redis index are free**

```bash
ssh -i ~/.ssh/contabo_deploy root@169.58.42.182 'pm2 list && ss -lntp | grep -E ":(3009|3010)"'
```

Expected: no process on 3009. If something holds it, pick the next free port and use it consistently in `.env.example`, the nginx vhost and `/root/todo.env`.

- [ ] **Step 2: Create the database, role, directories and secrets**

```bash
sudo -u postgres createuser --pwprompt todoapp
sudo -u postgres createdb -O todoapp todoapp
sudo -u postgres psql -d todoapp -c 'GRANT ALL ON SCHEMA public TO todoapp;'
sudo -u postgres psql -d todoapp -c 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'

mkdir -p /var/www/todo-app /var/www/todo-media /var/www/todo-native
chmod 750 /var/www/todo-media

cat > /root/todo.env <<'EOF'
DATABASE_URL=postgres://todoapp:<password>@127.0.0.1:5432/todoapp
SESSION_SECRET=<openssl rand -base64 48 | tr -d '/+='>
IP_SALT=<openssl rand -base64 24 | tr -d '/+='>
REDIS_URL=redis://127.0.0.1:6379/3
MEDIA_DIR=/var/www/todo-media
NODE_ENV=production
PORT=3009
EOF
chmod 600 /root/todo.env
```

- [ ] **Step 3: Build the Linux native modules on the server**

```bash
mkdir -p /var/www/todo-native && cd /var/www/todo-native
npm init -y
npm i @node-rs/argon2@^2.0.2
```

This directory is built once and reused by every deploy. Rebuild it only when the dependency version changes.

- [ ] **Step 4: Write the nginx vhost**

`/etc/nginx/sites-available/todo.romeotkoduah.org`:

```nginx
server {
    server_name todo.romeotkoduah.org;

    # No public alias for uploads. Captures are private and are served only
    # through the authenticated route in the app.

    location / {
        proxy_pass http://127.0.0.1:3009;
        proxy_http_version 1.1;
        proxy_set_header Upgrade            $http_upgrade;
        proxy_set_header Connection         'upgrade';
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    listen 80;
}
```

`X-Forwarded-For` is load bearing: the per-IP login throttle reads it, and without it every attempt looks like `127.0.0.1` and one attacker locks out the whole limiter.

```bash
ln -s /etc/nginx/sites-available/todo.romeotkoduah.org /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

Always `nginx -t` first, and always `reload`, never `restart` — the box runs ten other production sites.

- [ ] **Step 5: Point DNS and issue the certificate**

Add an A record for `todo.romeotkoduah.org` → `169.58.42.182`, wait for it to resolve, then:

```bash
certbot --nginx -d todo.romeotkoduah.org
```

Certbot rewrites the vhost to listen on 443 and adds the redirect. Then add HSTS inside the new `server` block and reload:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

- [ ] **Step 6: Write the deploy script**

`deploy.ps1` — adapted from the portfolio's, with the second PM2 process added:

```powershell
# Build and deploy todo.romeotkoduah.org to the Contabo VPS.
#
#   ./deploy.ps1              build, upload, reload both processes
#   ./deploy.ps1 -Migrate     also run pending migrations first
#   ./deploy.ps1 -SkipBuild   ship the existing build

param(
    [switch]$SkipBuild,
    [switch]$Migrate
)

$ErrorActionPreference = "Stop"

$Server  = "root@169.58.42.182"
$Key     = "$env:USERPROFILE\.ssh\contabo_deploy"
$AppDir  = "/var/www/todo-app"
$AppName = "todo-app"
$WorkerName = "todo-worker"
$SshOpts = @("-i", $Key, "-o", "IdentitiesOnly=yes", "-o", "BatchMode=yes")
$Root    = $PSScriptRoot
$Tarball = Join-Path $env:TEMP "todo-app.tgz"
$Staging = Join-Path $env:TEMP "todo-staging"

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    $msg" -ForegroundColor Green }

if (-not $SkipBuild) {
    Step "Building"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed - nothing was deployed." }
}

$StandaloneDir = Join-Path $Root ".next\standalone"
if (-not (Test-Path $StandaloneDir)) {
    throw "No .next/standalone. Is output: 'standalone' still set in next.config.ts?"
}

Step "Assembling"
if (Test-Path $Staging) { Remove-Item $Staging -Recurse -Force }
New-Item -ItemType Directory -Path $Staging -Force | Out-Null

Copy-Item "$StandaloneDir\*" $Staging -Recurse -Force
New-Item -ItemType Directory -Path "$Staging\.next" -Force | Out-Null
Copy-Item (Join-Path $Root ".next\static") "$Staging\.next\static" -Recurse -Force
if (Test-Path (Join-Path $Root "public")) {
    Copy-Item (Join-Path $Root "public") "$Staging\public" -Recurse -Force
}

# Migrations, scripts and the bundled worker travel with the app. The worker
# ships as one esbuild bundle because Next's tracing never sees bullmq.
Copy-Item (Join-Path $Root "db") "$Staging\db" -Recurse -Force
New-Item -ItemType Directory -Path "$Staging\dist" -Force | Out-Null
Copy-Item (Join-Path $Root "dist\worker.mjs") "$Staging\dist\" -Force
New-Item -ItemType Directory -Path "$Staging\scripts" -Force | Out-Null
Copy-Item (Join-Path $Root "scripts\migrate.mjs") "$Staging\scripts\" -Force
Copy-Item (Join-Path $Root "scripts\create-user.mjs") "$Staging\scripts\" -Force

Step "Packing"
if (Test-Path $Tarball) { Remove-Item $Tarball -Force }
tar -czf $Tarball -C $Staging .
if ($LASTEXITCODE -ne 0) { throw "tar failed." }
Ok "$([math]::Round((Get-Item $Tarball).Length / 1MB, 2)) MB"

Step "Uploading"
scp @SshOpts $Tarball "${Server}:/tmp/todo-app.tgz"
if ($LASTEXITCODE -ne 0) { throw "Upload failed." }

Step "Swapping in"
$migrateStep = if ($Migrate) { "cd $AppDir && node scripts/migrate.mjs" } else { "true" }
$remote = @"
set -e
rm -rf ${AppDir}.new
mkdir -p ${AppDir}.new
tar -xzf /tmp/todo-app.tgz -C ${AppDir}.new
test -f ${AppDir}.new/server.js
rm -rf ${AppDir}.old
if [ -d ${AppDir} ]; then mv ${AppDir} ${AppDir}.old; fi
mv ${AppDir}.new ${AppDir}

# @node-rs/argon2 ships a platform-specific binary. The bundle is built on
# Windows, so its natives are unusable here - swap in the Linux builds. Without
# this, every login 500s with "Failed to load native binding".
NATIVE=/var/www/todo-native/node_modules
if [ -d "`$NATIVE" ]; then
  rm -rf ${AppDir}/node_modules/@node-rs
  cp -r "`$NATIVE/@node-rs" ${AppDir}/node_modules/@node-rs
else
  echo "WARNING: `$NATIVE missing - login will fail. See docs/deployment.md."
fi

set -a; . /root/todo.env; set +a
$migrateStep

if pm2 describe ${AppName} > /dev/null 2>&1; then
  pm2 reload ${AppName} --update-env
else
  cd ${AppDir} && pm2 start server.js --name ${AppName} --update-env
fi

if pm2 describe ${WorkerName} > /dev/null 2>&1; then
  pm2 reload ${WorkerName} --update-env
else
  cd ${AppDir} && pm2 start dist/worker.mjs --name ${WorkerName} --update-env
fi
pm2 save
"@

ssh @SshOpts $Server $remote
if ($LASTEXITCODE -ne 0) { throw "Remote deploy failed." }

Step "Verifying"
$health = ssh @SshOpts $Server "curl -sf http://127.0.0.1:3009/api/health"
if ($health -notmatch '"ok":true') { throw "Health check failed: $health" }
Ok "https://todo.romeotkoduah.org is up"
```

- [ ] **Step 7: Deploy and create the owner account**

```powershell
./deploy.ps1 -Migrate
```

Then on the server:

```bash
cd /var/www/todo-app
set -a; . /root/todo.env; set +a
node scripts/create-user.mjs romeo.tweneboahkoduah@gmail.com \
  --name "Romeo Tweneboah Koduah" --role owner --out /root/cc-owner.txt
cat /root/cc-owner.txt
```

Add the `otpauth://` URI to an authenticator app, sign in at
`https://todo.romeotkoduah.org/login`, then `rm /root/cc-owner.txt`.

- [ ] **Step 8: Verify the phase is actually done**

Confirm each of these before calling phase 1 complete:

```bash
pm2 describe todo-app    | grep status   # online
pm2 describe todo-worker | grep status   # online
curl -sI https://todo.romeotkoduah.org | grep -i strict-transport-security
```

- Signing in with a wrong password five times locks the account for fifteen minutes.
- A correct password with no code asks for the code rather than signing in.
- The same six-digit code refused on a second use.
- `/activity` and `/admin/accounts` redirect an assistant to `/`.
- `SELECT worker, state FROM job_log` shows a completed heartbeat row.
- `https://todo.romeotkoduah.org/media/` returns 404, not a directory listing.

- [ ] **Step 9: Write the deployment doc and commit**

Write `docs/deployment.md` covering: server and app directory, the port, `/root/todo.env`, the `todo-native` directory and why it exists, the nginx vhost, the two PM2 processes, `pm2 logs todo-app` / `pm2 logs todo-worker`, and the rollback path (`mv /var/www/todo-app.old /var/www/todo-app && pm2 reload todo-app`).

```bash
git add deploy.ps1 docs/deployment.md
git commit -m "chore: deploy script, nginx vhost and deployment documentation"
```

---

## Phase 1 done means

Both PM2 processes online, TLS live on the real domain, the full fifteen-table schema migrated, both accounts able to sign in with password and TOTP, the assistant unable to reach owner-only screens, every account action written to the audit log, and `npm test` green with roughly sixty tests.

Phase 2 (projects, items, the fourteen-day runway, the today list) starts from here.
