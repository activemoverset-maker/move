import { NextRequest, NextResponse } from 'next/server'
import { listTikTokVideos } from '@/lib/tiktok/service'
import { isTikTokPlacement } from '@/lib/tiktok/placements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category') ?? undefined
    const placement = searchParams.get('placement') ?? undefined
    const idsParam = searchParams.get('ids')
    const limit = parseInt(searchParams.get('limit') ?? '50', 10)

    const videos = await listTikTokVideos({
      featured: featured === '1' || featured === 'true' ? true : undefined,
      category,
      placement: placement && isTikTokPlacement(placement) ? placement : undefined,
      videoIds: idsParam ? idsParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      limit: Number.isFinite(limit) ? limit : 50,
      activeOnly: true,
    })

    return NextResponse.json(
      { videos },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('GET /api/tiktok error:', error)
    return NextResponse.json({ videos: [] })
  }
}
