import { MALED_SITE } from '@/lib/maledactive-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const base = MALED_SITE.url.replace(/\/$/, '')
  const body = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
