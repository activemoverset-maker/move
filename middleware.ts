import { NextRequest, NextResponse } from 'next/server'
import {
  isLocalDevHost,
  isMaledActiveHost,
  MALED_BLOCKED_ON_MALED,
  MALED_INTERNAL_PREFIX,
  toMaledInternalPath,
} from '@/lib/maledactive-host'
import { ADMIN_COOKIE_NAME } from '@/lib/admin/constants'
import { verifyAdminTokenEdge } from '@/lib/admin/auth-edge'

async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl
  const isAdminArea =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  const isPublicAdmin =
    pathname === '/admin/login' || pathname === '/api/admin/login'
  const isTelegramWebhook = pathname === '/api/telegram/webhook'

  if (!isAdminArea || isPublicAdmin || isTelegramWebhook) {
    return null
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const admin = token ? await verifyAdminTokenEdge(token) : null

  if (admin) {
    return null
  }

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const { pathname } = request.nextUrl

  const adminGate = await requireAdminAuth(request)
  if (adminGate) {
    return adminGate
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname.startsWith('/fonts')) {
    return NextResponse.next()
  }

  if (isMaledActiveHost(host)) {
    if (MALED_BLOCKED_ON_MALED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith(MALED_INTERNAL_PREFIX)) {
      const response = NextResponse.next()
      response.headers.set('x-site-id', 'maledactive')
      return response
    }

    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = toMaledInternalPath(pathname)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-site-id', 'maledactive')

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    })
  }

  if (pathname.startsWith(MALED_INTERNAL_PREFIX)) {
    // Local dev: allow direct /sites/maledactive preview without redirect
    if (isLocalDevHost(host)) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-site-id', 'maledactive')
      return NextResponse.next({
        request: { headers: requestHeaders },
      })
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2)$).*)'],
}
