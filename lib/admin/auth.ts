import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

import { ADMIN_COOKIE_NAME } from '@/lib/admin/constants'

export { ADMIN_COOKIE_NAME }

const TOKEN_MAX_AGE_SEC = 60 * 60 * 24 * 7 // 7 days

export type AdminTokenPayload = {
  sub: string
  email: string
  name: string
}

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return new TextEncoder().encode(secret)
}

export async function signAdminToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE_SEC}s`)
    .sign(getJwtSecretKey())
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())
    const sub = payload.sub
    const email = payload.email
    const name = payload.name
    if (!sub || typeof email !== 'string') return null
    return {
      sub,
      email,
      name: typeof name === 'string' ? name : '',
    }
  } catch {
    return null
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: TOKEN_MAX_AGE_SEC,
  }
}

export async function getAdminFromCookies(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function getAdminFromRequest(
  request: NextRequest
): Promise<AdminTokenPayload | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}
