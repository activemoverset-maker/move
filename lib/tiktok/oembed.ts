import { isActiveMoversTikTokAuthor } from '@/lib/social'
import type { TikTokOEmbedResponse } from '@/lib/tiktok/types'

const OEMBED_ENDPOINT = 'https://www.tiktok.com/oembed'
const OEMBED_TIMEOUT_MS = 12_000

export async function fetchTikTokOEmbed(videoUrl: string): Promise<TikTokOEmbedResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), OEMBED_TIMEOUT_MS)

  try {
    const response = await fetch(
      `${OEMBED_ENDPOINT}?url=${encodeURIComponent(videoUrl)}`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'ActiveMoversWebsite/1.0',
        },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? 'Video not found or is private. Only public @activemoverset videos can be embedded.'
          : `TikTok oEmbed failed (${response.status})`
      )
    }

    const data = (await response.json()) as TikTokOEmbedResponse

    if (!data?.title || !data?.author_url) {
      throw new Error('Unexpected oEmbed response from TikTok')
    }

    if (!isActiveMoversTikTokAuthor(data.author_url)) {
      throw new Error('This video is not from @activemoverset')
    }

    return data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('TikTok metadata request timed out. Try again.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
