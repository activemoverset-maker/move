import { NextResponse } from 'next/server'
import { generateNewsSitemap } from '@/lib/sitemap-generator'

export async function GET() {
  try {
    const xml = await generateNewsSitemap()
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating news sitemap:', error)
    return new NextResponse('Error generating news sitemap', { status: 500 })
  }
}
