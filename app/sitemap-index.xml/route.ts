import { NextResponse } from 'next/server'
import { generateSitemapIndex } from '@/lib/sitemap-generator'

export async function GET() {
  try {
    const xml = generateSitemapIndex()
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap index:', error)
    return new NextResponse('Error generating sitemap index', { status: 500 })
  }
}
