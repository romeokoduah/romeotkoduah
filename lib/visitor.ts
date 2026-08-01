import 'server-only'
import { createHash, randomUUID } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import Redis from 'ioredis'

const VISITOR_COOKIE = 'rtk_visitor'
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365

/**
 * A random id in a first-party cookie. It exists so the same browser cannot
 * like the same thing twice. It is not an identity, is never shown, and is
 * never joined to anything else.
 */
export async function visitorId(): Promise<string> {
  const jar = await cookies()
  const existing = jar.get(VISITOR_COOKIE)?.value
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing

  const id = randomUUID()
  jar.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: VISITOR_MAX_AGE,
  })
  return id
}

/** Reads the visitor id without issuing one — safe in server components. */
export async function peekVisitorId(): Promise<string | null> {
  const jar = await cookies()
  const v = jar.get(VISITOR_COOKIE)?.value
  return v && /^[0-9a-f-]{36}$/i.test(v) ? v : null
}

/**
 * Salted hash of the client address. Stored for rate limiting and spam
 * correlation only — the raw address is never persisted or displayed.
 */
export async function clientIpHash(): Promise<string> {
  const h = await headers()
  const raw =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  const salt = process.env.IP_SALT ?? 'rtk-default-salt'
  return createHash('sha256').update(`${salt}:${raw}`).digest('hex').slice(0, 32)
}

/* ------------------------------------------------------------ rate limit -- */

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined
}

function redis(): Redis {
  if (!globalThis.__redis) {
    globalThis.__redis = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', {
      maxRetriesPerRequest: 2,
      lazyConnect: false,
      // A rate limiter that cannot reach Redis must not take the site down.
      enableOfflineQueue: false,
    })
    globalThis.__redis.on('error', () => {})
  }
  return globalThis.__redis
}

/**
 * Fixed-window limiter. Returns whether the action is allowed and how many
 * remain. Fails open: if Redis is unreachable the approval queue is still
 * there, and a down cache should not block a legitimate reader.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ ok: boolean; remaining: number }> {
  try {
    const r = redis()
    const k = `rl:${key}`
    const n = await r.incr(k)
    if (n === 1) await r.expire(k, windowSeconds)
    return { ok: n <= limit, remaining: Math.max(0, limit - n) }
  } catch {
    return { ok: true, remaining: limit }
  }
}
