'use client'

import { useEffect, useRef } from 'react'
import { buildTikTokPlayerSrc, postToTikTokPlayer } from '@/lib/tiktok/player'

interface TikTokPlayerProps {
  videoId: string
  active: boolean
  className?: string
  title?: string
  /** Muted autoplay is required for mobile browser policies */
  muted?: boolean
  /** Keep iframe mounted after first activation (smoother pause/resume) */
  keepMounted?: boolean
}

export function TikTokPlayer({
  videoId,
  active,
  className,
  title,
  muted = false,
  keepMounted = false,
}: TikTokPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hasMountedRef = useRef(false)

  if (active) hasMountedRef.current = true

  useEffect(() => {
    if (!iframeRef.current) return
    if (active) {
      postToTikTokPlayer(iframeRef.current, 'play')
    } else if (keepMounted) {
      postToTikTokPlayer(iframeRef.current, 'pause')
    }
  }, [active, videoId, keepMounted])

  if (!active && !keepMounted) return null
  if (!active && keepMounted && !hasMountedRef.current) return null

  return (
    <iframe
      ref={iframeRef}
      src={buildTikTokPlayerSrc(videoId, {
        autoplay: active,
        muted: muted || !active,
        rel: false,
        loop: true,
      })}
      title={title ?? 'TikTok video'}
      className={className}
      allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      loading={active ? 'eager' : 'lazy'}
    />
  )
}
