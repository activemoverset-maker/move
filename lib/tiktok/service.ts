import { SOCIAL } from '@/lib/social'
import { fetchTikTokOEmbed } from '@/lib/tiktok/oembed'
import { assertActiveMoversVideoUrl, extractTikTokVideoId } from '@/lib/tiktok/parse'
import { mapTikTokVideoToPublic } from '@/lib/tiktok/map'
import {
  createTikTokId,
  readTikTokVideos,
  sortTikTokVideos,
  writeTikTokVideos,
} from '@/lib/tiktok/store'
import type { TikTokCategory, TikTokVideoPublic, TikTokVideoRecord } from '@/lib/tiktok/types'
import { isValidTikTokCategory } from '@/lib/tiktok/categories'
import {
  isTikTokPlacement,
  TIKTOK_PLACEMENTS,
  type TikTokPlacement,
} from '@/lib/tiktok/placements'

export interface ListTikTokVideosOptions {
  featured?: boolean
  category?: string
  limit?: number
  activeOnly?: boolean
  placement?: TikTokPlacement
  videoIds?: string[]
}

function filterVideos(
  videos: TikTokVideoRecord[],
  options: ListTikTokVideosOptions
): TikTokVideoRecord[] {
  const { featured, category, limit = 50, activeOnly = true } = options

  let filtered = videos

  if (activeOnly) {
    filtered = filtered.filter((v) => v.isActive)
  }
  if (featured !== undefined) {
    filtered = filtered.filter((v) => v.isFeatured === featured)
  }
  if (category && category !== 'all' && isValidTikTokCategory(category)) {
    filtered = filtered.filter((v) => v.category === category)
  }

  return sortTikTokVideos(filtered).slice(0, Math.min(Math.max(limit, 1), 100))
}

export async function listTikTokVideos(
  options: ListTikTokVideosOptions = {}
): Promise<TikTokVideoPublic[]> {
  const { placement, videoIds } = options

  if (placement && isTikTokPlacement(placement)) {
    return getVideosByPlacement(placement)
  }

  if (videoIds?.length) {
    return getVideosByIds(videoIds, options.activeOnly !== false)
  }

  const videos = readTikTokVideos()
  return filterVideos(videos, options).map(mapTikTokVideoToPublic)
}

export async function getVideosByPlacement(
  placement: TikTokPlacement
): Promise<TikTokVideoPublic[]> {
  const meta = TIKTOK_PLACEMENTS[placement]
  return getVideosByIds(meta.videoIds, true)
}

export async function getVideosByIds(
  videoIds: string[],
  activeOnly = true
): Promise<TikTokVideoPublic[]> {
  const all = readTikTokVideos()
  const map = new Map(all.map((v) => [v.videoId, v]))

  const ordered = videoIds
    .map((id) => map.get(id))
    .filter((v): v is TikTokVideoRecord => Boolean(v))
    .filter((v) => (activeOnly ? v.isActive : true))

  return ordered.map(mapTikTokVideoToPublic)
}

export async function listAllTikTokVideosAdmin(): Promise<TikTokVideoPublic[]> {
  const videos = sortTikTokVideos(readTikTokVideos())
  return videos.map(mapTikTokVideoToPublic)
}

export async function getTikTokVideoById(id: string): Promise<TikTokVideoRecord | null> {
  return readTikTokVideos().find((v) => v.id === id) ?? null
}

export async function getTikTokVideoByVideoId(
  videoId: string
): Promise<TikTokVideoPublic | null> {
  const video = readTikTokVideos().find((v) => v.videoId === videoId && v.isActive)
  return video ? mapTikTokVideoToPublic(video) : null
}

export async function incrementTikTokView(id: string): Promise<void> {
  const videos = readTikTokVideos()
  const index = videos.findIndex((v) => v.id === id)
  if (index === -1) return

  videos[index] = {
    ...videos[index],
    viewCountLocal: videos[index].viewCountLocal + 1,
    updatedAt: new Date().toISOString(),
  }
  writeTikTokVideos(videos)
}

export async function incrementTikTokShare(id: string): Promise<void> {
  const videos = readTikTokVideos()
  const index = videos.findIndex((v) => v.id === id)
  if (index === -1) return

  videos[index] = {
    ...videos[index],
    shareCountLocal: videos[index].shareCountLocal + 1,
    updatedAt: new Date().toISOString(),
  }
  writeTikTokVideos(videos)
}

export interface CreateTikTokVideoInput {
  url: string
  title?: string
  titleAm?: string
  description?: string
  descriptionAm?: string
  category?: TikTokCategory
  isFeatured?: boolean
  isPinned?: boolean
  isActive?: boolean
}

export async function createTikTokVideoFromUrl(
  input: CreateTikTokVideoInput
): Promise<TikTokVideoRecord> {
  const normalizedUrl = assertActiveMoversVideoUrl(input.url)
  const videoId = extractTikTokVideoId(normalizedUrl)
  if (!videoId) {
    throw new Error('Could not parse TikTok video ID')
  }

  const videos = readTikTokVideos()
  if (videos.some((v) => v.videoId === videoId)) {
    throw new Error('This video is already in the feed')
  }

  const oembed = await fetchTikTokOEmbed(normalizedUrl)
  const nextOrder = videos.reduce((max, v) => Math.max(max, v.order), -1) + 1
  const now = new Date().toISOString()
  const category =
    input.category && isValidTikTokCategory(input.category) ? input.category : 'moves'

  const record: TikTokVideoRecord = {
    id: createTikTokId(),
    videoId,
    url: normalizedUrl,
    title: input.title?.trim() || oembed.title,
    titleAm: input.titleAm?.trim() || null,
    description: input.description?.trim() || null,
    descriptionAm: input.descriptionAm?.trim() || null,
    authorName: oembed.author_name,
    authorUrl: oembed.author_url,
    thumbnailUrl: oembed.thumbnail_url ?? null,
    thumbnailWidth: oembed.thumbnail_width ?? null,
    thumbnailHeight: oembed.thumbnail_height ?? null,
    username: SOCIAL.tiktok.username,
    category,
    isFeatured: input.isFeatured ?? false,
    isPinned: input.isPinned ?? false,
    isActive: input.isActive ?? true,
    healthStatus: 'ok',
    lastOembedAt: now,
    order: nextOrder,
    viewCountLocal: 0,
    shareCountLocal: 0,
    source: 'manual',
    createdAt: now,
    updatedAt: now,
  }

  writeTikTokVideos([...videos, record])
  return record
}

export async function updateTikTokVideo(
  id: string,
  patch: Partial<
    Pick<
      TikTokVideoRecord,
      | 'title'
      | 'titleAm'
      | 'description'
      | 'descriptionAm'
      | 'category'
      | 'isFeatured'
      | 'isPinned'
      | 'isActive'
      | 'order'
    >
  >
): Promise<TikTokVideoRecord> {
  const videos = readTikTokVideos()
  const index = videos.findIndex((v) => v.id === id)
  if (index === -1) throw new Error('Video not found')

  const updated: TikTokVideoRecord = {
    ...videos[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }

  videos[index] = updated
  writeTikTokVideos(videos)
  return updated
}

export async function deleteTikTokVideo(id: string): Promise<void> {
  const videos = readTikTokVideos()
  const next = videos.filter((v) => v.id !== id)
  if (next.length === videos.length) throw new Error('Video not found')
  writeTikTokVideos(next)
}

export async function reorderTikTokVideos(
  items: { id: string; order: number }[]
): Promise<void> {
  const videos = readTikTokVideos()
  const orderMap = new Map(items.map((item) => [item.id, item.order]))

  const updated = videos.map((video) => {
    const order = orderMap.get(video.id)
    if (order === undefined) return video
    return { ...video, order, updatedAt: new Date().toISOString() }
  })

  writeTikTokVideos(updated)
}

export async function refreshTikTokVideoOEmbed(id: string): Promise<TikTokVideoRecord> {
  const videos = readTikTokVideos()
  const index = videos.findIndex((v) => v.id === id)
  if (index === -1) throw new Error('Video not found')

  const current = videos[index]

  try {
    const oembed = await fetchTikTokOEmbed(current.url)
    const updated: TikTokVideoRecord = {
      ...current,
      title: oembed.title || current.title,
      authorName: oembed.author_name,
      authorUrl: oembed.author_url,
      thumbnailUrl: oembed.thumbnail_url ?? current.thumbnailUrl,
      thumbnailWidth: oembed.thumbnail_width ?? current.thumbnailWidth,
      thumbnailHeight: oembed.thumbnail_height ?? current.thumbnailHeight,
      healthStatus: 'ok',
      lastOembedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    videos[index] = updated
    writeTikTokVideos(videos)
    return updated
  } catch (error) {
    videos[index] = {
      ...current,
      healthStatus: 'error',
      updatedAt: new Date().toISOString(),
    }
    writeTikTokVideos(videos)
    throw error
  }
}
