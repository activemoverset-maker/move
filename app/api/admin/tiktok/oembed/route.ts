import { NextRequest, NextResponse } from 'next/server'
import { assertActiveMoversVideoUrl } from '@/lib/tiktok/parse'
import { fetchTikTokOEmbed } from '@/lib/tiktok/oembed'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const normalizedUrl = assertActiveMoversVideoUrl(url)
    const oembed = await fetchTikTokOEmbed(normalizedUrl)

    return NextResponse.json({
      url: normalizedUrl,
      title: oembed.title,
      authorName: oembed.author_name,
      authorUrl: oembed.author_url,
      thumbnailUrl: oembed.thumbnail_url ?? null,
      thumbnailWidth: oembed.thumbnail_width ?? null,
      thumbnailHeight: oembed.thumbnail_height ?? null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'oEmbed preview failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
