import type { TikTokVideoRecord } from '@/lib/tiktok/types'
import type { TikTokCategory, TikTokVideoPublic } from '@/lib/tiktok/types'
import { isValidTikTokCategory } from '@/lib/tiktok/categories'

export function mapTikTokVideoToPublic(video: TikTokVideoRecord): TikTokVideoPublic {
  return {
    id: video.id,
    videoId: video.videoId,
    url: video.url,
    title: video.title,
    titleAm: video.titleAm,
    description: video.description,
    descriptionAm: video.descriptionAm,
    thumbnailUrl: video.thumbnailUrl,
    thumbnailWidth: video.thumbnailWidth,
    thumbnailHeight: video.thumbnailHeight,
    username: video.username,
    category: isValidTikTokCategory(video.category) ? video.category : 'moves',
    isFeatured: video.isFeatured,
    isPinned: video.isPinned,
    isActive: video.isActive,
    order: video.order,
    viewCountLocal: video.viewCountLocal,
  }
}

export function mapTikTokVideosToPublic(videos: TikTokVideoRecord[]): TikTokVideoPublic[] {
  return videos.map(mapTikTokVideoToPublic)
}
