import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  signAdminToken,
} from '@/lib/admin/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const { email, password } = parsed.data
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signAdminToken({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    })

    const response = NextResponse.json({
      ok: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    })
    response.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions())
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
