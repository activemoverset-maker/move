'use client'

import { useCallback, useEffect, useState } from 'react'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'

interface UseTikTokFeedOptions {
  featured?: boolean
  category?: string
  limit?: number
}

export function useTikTokFeed(options: UseTikTokFeedOptions = {}) {
  const [videos, setVideos] = useState<TikTokVideoPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (options.featured) params.set('featured', '1')
      if (options.category && options.category !== 'all') params.set('category', options.category)
      if (options.limit) params.set('limit', String(options.limit))

      const res = await fetch(`/api/tiktok?${params.toString()}`)
      const data = await res.json()
      setVideos(Array.isArray(data.videos) ? data.videos : [])
    } catch {
      setError('Could not load TikTok videos')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [options.featured, options.category, options.limit])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return { videos, loading, error, refetch: fetchVideos }
}
