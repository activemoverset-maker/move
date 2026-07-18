'use client'

import { useCallback, useEffect, useState } from 'react'
import type { TikTokPlacement } from '@/lib/tiktok/placements'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'

export function useTikTokPlacement(placement: TikTokPlacement) {
  const [videos, setVideos] = useState<TikTokVideoPublic[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tiktok?placement=${encodeURIComponent(placement)}`)
      const data = await res.json()
      setVideos(Array.isArray(data.videos) ? data.videos : [])
    } catch {
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [placement])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return { videos, loading }
}
