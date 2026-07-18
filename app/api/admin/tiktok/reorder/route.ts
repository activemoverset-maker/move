import { NextRequest, NextResponse } from 'next/server'
import { reorderTikTokVideos } from '@/lib/tiktok/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { videos } = body

    if (!videos || !Array.isArray(videos)) {
      return NextResponse.json({ error: 'Invalid videos data' }, { status: 400 })
    }

    await reorderTikTokVideos(
      videos
        .filter((item) => item?.id && typeof item.order === 'number')
        .map((item) => ({ id: item.id, order: item.order }))
    )

    return NextResponse.json({ message: 'Videos reordered successfully' })
  } catch (error) {
    console.error('PUT /api/admin/tiktok/reorder error:', error)
    return NextResponse.json({ error: 'Failed to reorder videos' }, { status: 500 })
  }
}
