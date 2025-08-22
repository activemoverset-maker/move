import { NextRequest, NextResponse } from 'next/server'
import { SitemapManager } from '@/lib/admin/sitemap-manager'

export async function GET() {
  try {
    const stats = await SitemapManager.getSitemapStats()
    const validation = await SitemapManager.validateSitemap()
    
    return NextResponse.json({
      stats,
      validation,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching sitemap info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sitemap information' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'update-sitemap':
        const sitemapResult = await SitemapManager.updateSitemap()
        return NextResponse.json(sitemapResult)

      case 'update-robots':
        const robotsResult = await SitemapManager.updateRobotsTxt()
        return NextResponse.json(robotsResult)

      case 'force-refresh':
        const refreshResult = await SitemapManager.forceRefresh()
        return NextResponse.json(refreshResult)

      case 'validate':
        const validation = await SitemapManager.validateSitemap()
        return NextResponse.json(validation)

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing sitemap action:', error)
    return NextResponse.json(
      { error: 'Failed to process sitemap action' },
      { status: 500 }
    )
  }
}
