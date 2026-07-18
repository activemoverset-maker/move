import { SOCIAL, buildTikTokVideoUrl } from '@/lib/social'

const VIDEO_ID_PATTERNS = [
  /tiktok\.com\/@[^/]+\/video\/(\d+)/i,
  /tiktok\.com\/t\/([A-Za-z0-9]+)/i,
  /vm\.tiktok\.com\/([A-Za-z0-9]+)/i,
  /^\d{10,}$/,
]

export function extractTikTokUsername(url: string): string | null {
  const match = url.trim().match(/tiktok\.com\/@([^/]+)\/video\//i)
  return match?.[1] ?? null
}

export function extractTikTokVideoId(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  for (const pattern of VIDEO_ID_PATTERNS) {
    const match = trimmed.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export function normalizeTikTokVideoUrl(input: string): string | null {
  const trimmed = input.trim()
  const videoId = extractTikTokVideoId(trimmed)
  if (!videoId) return null

  const username = extractTikTokUsername(trimmed)
  if (username) {
    return `https://www.tiktok.com/@${username}/video/${videoId}`
  }

  return buildTikTokVideoUrl(videoId)
}

export function assertActiveMoversVideoUrl(url: string): string {
  const trimmed = url.trim()
  const username = extractTikTokUsername(trimmed)

  if (!username) {
    throw new Error(
      `Paste a full TikTok URL from ${SOCIAL.tiktok.handle}, e.g. ${SOCIAL.tiktok.profileUrl}/video/...`
    )
  }

  if (username.toLowerCase() !== SOCIAL.tiktok.username.toLowerCase()) {
    throw new Error(`Video URL must belong to ${SOCIAL.tiktok.handle}`)
  }

  const normalized = normalizeTikTokVideoUrl(trimmed)
  if (!normalized) {
    throw new Error('Invalid TikTok video URL')
  }

  return normalized
}
