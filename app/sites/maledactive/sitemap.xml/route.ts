import { MALED_SITE } from '@/lib/maledactive-config'
import { NextResponse } from 'next/server'

const PAGES = ['', '/services', '/about', '/contact', '/privacy-policy', '/terms-of-service']

export async function GET() {
  const base = MALED_SITE.url.replace(/\/$/, '')
  const urls = PAGES.map(
    (path) => `  <url>\n    <loc>${base}${path || '/'}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${path === '' ? '1.0' : '0.8'}</priority>\n  </url>`,
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
