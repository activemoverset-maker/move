'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TikTokFacadeCard } from '@/components/marketing/tiktok-facade-card'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'
import { cn } from '@/lib/utils'

interface TikTokFeedGridProps {
  videos: TikTokVideoPublic[]
  onVideoClick: (video: TikTokVideoPublic) => void
  loading?: boolean
  theme?: 'light' | 'dark'
}

export function TikTokFeedGrid({
  videos,
  onVideoClick,
  loading,
  theme = 'light',
}: TikTokFeedGridProps) {
  const isDark = theme === 'dark'

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'aspect-[9/16] animate-pulse rounded-[1.2rem]',
              isDark ? 'bg-white/5' : 'bg-gray-200'
            )}
          />
        ))}
      </div>
    )
  }

  if (videos.length === 0) return null

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
      >
        {videos.map((video, index) => {
          const isHero = index % 11 === 0
          return (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35 }}
              className={cn(
                isHero && 'sm:col-span-2 sm:row-span-1'
              )}
            >
              <TikTokFacadeCard
                video={video}
                onClick={onVideoClick}
                size="lg"
                variant={isDark ? 'masonry' : 'default'}
                index={index}
                className="w-full"
              />
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
