import { jwtVerify } from 'jose'
import type { AdminTokenPayload } from '@/lib/admin/auth'

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) return new Uint8Array()
  return new TextEncoder().encode(secret)
}

/** Edge-safe JWT verify for middleware (HS256 only). */
export async function verifyAdminTokenEdge(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), { algorithms: ['HS256'] })
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
