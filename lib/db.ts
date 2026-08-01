import 'server-only'
import postgres from 'postgres'

/**
 * Single Postgres client, reused across hot reloads in development so we do not
 * leak connections. Plain SQL by design — the schema is small enough that an
 * ORM would cost more than it saves.
 *
 * The client is created on first use, not at import. `next build` imports every
 * route module to collect its configuration, and connecting there would make
 * the build require a database it has no business needing.
 */

type Sql = ReturnType<typeof postgres>

declare global {
  // eslint-disable-next-line no-var
  var __sql: Sql | undefined
}

function connect(): Sql {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.',
    )
  }
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
 * Behaves exactly like the `postgres` tagged-template client, but defers the
 * connection to the first query. `postgres()` returns a callable carrying
 * helper properties, so both traps are needed.
 */
export const sql = new Proxy(function noop() {} as unknown as Sql, {
  apply(_target, _thisArg, args: unknown[]) {
    return (client() as unknown as (...a: unknown[]) => unknown)(...args)
  },
  get(_target, prop, receiver) {
    const c = client() as unknown as Record<string | symbol, unknown>
    const value = Reflect.get(c, prop, receiver)
    return typeof value === 'function' ? value.bind(c) : value
  },
  has(_target, prop) {
    return prop in (client() as unknown as object)
  },
}) as Sql
