export type TikTokCategory =
  | 'moves'
  | 'packing'
  | 'office'
  | 'tips'
  | 'reviews'
  | 'behind_scenes'

export type TikTokHealthStatus = 'ok' | 'removed' | 'error' | 'stale_thumb'

/** Persisted record in data/tiktok/videos.json */
export interface TikTokVideoRecord {
  id: string
  videoId: string
  url: string
  title: string
  titleAm: string | null
  description: string | null
  descriptionAm: string | null
  authorName: string | null
  authorUrl: string | null
  thumbnailUrl: string | null
  thumbnailWidth: number | null
  thumbnailHeight: number | null
  username: string
  category: TikTokCategory
  isFeatured: boolean
  isPinned: boolean
  isActive: boolean
  healthStatus: TikTokHealthStatus
  lastOembedAt: string | null
  order: number
  viewCountLocal: number
  shareCountLocal: number
  source: string
  createdAt: string
  updatedAt: string
}

export interface TikTokVideoPublic {
  id: string
  videoId: string
  url: string
  title: string
  titleAm: string | null
  description: string | null
  descriptionAm: string | null
  thumbnailUrl: string | null
  thumbnailWidth: number | null
  thumbnailHeight: number | null
  username: string
  category: TikTokCategory
  isFeatured: boolean
  isPinned: boolean
  isActive: boolean
  order: number
  viewCountLocal: number
}

export interface TikTokOEmbedResponse {
  version: string
  type: string
  title: string
  author_url: string
  author_name: string
  width: string
  height: string
  html: string
  thumbnail_width?: number
  thumbnail_height?: number
  thumbnail_url?: string
  provider_url: string
  provider_name: string
}
