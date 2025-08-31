import { NextResponse } from 'next/server'
import { generateSitemap, generateSitemapXML } from '@/lib/sitemap-generator'

export async function GET() {
  try {
    const sitemap = await generateSitemap()
    const xml = generateSitemapXML(sitemap)
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
