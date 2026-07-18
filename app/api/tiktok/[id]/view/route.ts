import { NextRequest, NextResponse } from 'next/server'
import { getTikTokVideoById, incrementTikTokView } from '@/lib/tiktok/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const video = await getTikTokVideoById(id)

    if (!video || !video.isActive) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    await incrementTikTokView(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/tiktok/[id]/view error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
