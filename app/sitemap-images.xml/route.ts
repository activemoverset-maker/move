import { NextResponse } from 'next/server'
import { generateImageSitemap } from '@/lib/sitemap-generator'

export async function GET() {
  try {
    const xml = generateImageSitemap()
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating image sitemap:', error)
    return new NextResponse('Error generating image sitemap', { status: 500 })
  }
}
