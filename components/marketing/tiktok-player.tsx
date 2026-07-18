'use client'

import { useEffect, useRef } from 'react'
import { buildTikTokPlayerSrc, postToTikTokPlayer } from '@/lib/tiktok/player'

interface TikTokPlayerProps {
  videoId: string
  active: boolean
  className?: string
  title?: string
}

export function TikTokPlayer({ videoId, active, className, title }: TikTokPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!active || !iframeRef.current) return
    postToTikTokPlayer(iframeRef.current, 'play')
  }, [active, videoId])

  if (!active) return null

  return (
    <iframe
      ref={iframeRef}
      src={buildTikTokPlayerSrc(videoId, { autoplay: true, muted: false, rel: false })}
      title={title ?? 'TikTok video'}
      className={className}
      allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  )
}
