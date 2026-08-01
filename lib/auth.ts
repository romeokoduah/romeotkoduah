import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { hash as argonHash, verify as argonVerify } from '@node-rs/argon2'
import { sql } from './db'

const COOKIE = 'rtk_admin'
const MAX_AGE = 60 * 60 * 12 // 12 hours

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET must be set and at least 32 characters.')
  }
  return new TextEncoder().encode(s)
}

export async function hashPassword(plain: string): Promise<string> {
  return argonHash(plain)
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argonVerify(hash, plain)
  } catch {
    return false
  }
}

/** Issues the session cookie after a successful login. */
export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE)
}

/** The signed-in admin's id, or null. Verifies the signature every call. */
export async function currentAdminId(): Promise<string | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}

export async function requireAdmin(): Promise<string> {
  const id = await currentAdminId()
  if (!id) throw new Error('UNAUTHORISED')
  return id
}

export async function findAdminByEmail(email: string) {
  const rows = await sql<{ id: string; email: string; password_hash: string }[]>`
    SELECT id, email, password_hash FROM admin_user
    WHERE lower(email) = lower(${email}) LIMIT 1
  `
  return rows[0] ?? null
}

export async function setAdminPassword(id: string, plain: string): Promise<void> {
  const hash = await hashPassword(plain)
  await sql`
    UPDATE admin_user SET password_hash = ${hash}, updated_at = now()
    WHERE id = ${id}
  `
}
