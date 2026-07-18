import { NextRequest, NextResponse } from 'next/server'
import {
  createTikTokVideoFromUrl,
  listAllTikTokVideosAdmin,
} from '@/lib/tiktok/service'
import { mapTikTokVideoToPublic } from '@/lib/tiktok/map'
import { isValidTikTokCategory } from '@/lib/tiktok/categories'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const videos = await listAllTikTokVideosAdmin()
    return NextResponse.json(videos)
  } catch (error) {
    console.error('GET /api/admin/tiktok error:', error)
    return NextResponse.json({ error: 'Failed to fetch TikTok videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, title, titleAm, description, descriptionAm, category, isFeatured, isPinned, isActive } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'TikTok video URL is required' }, { status: 400 })
    }

    const video = await createTikTokVideoFromUrl({
      url,
      title,
      titleAm,
      description,
      descriptionAm,
      category: isValidTikTokCategory(category) ? category : undefined,
      isFeatured: Boolean(isFeatured),
      isPinned: Boolean(isPinned),
      isActive: isActive !== false,
    })

    return NextResponse.json(mapTikTokVideoToPublic(video), { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add video'
    console.error('POST /api/admin/tiktok error:', error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
