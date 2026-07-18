'use client'

import { motion } from 'framer-motion'
import { TikTokFacadeCard } from '@/components/marketing/tiktok-facade-card'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'
import { cn } from '@/lib/utils'

interface TikTokHeroCollageProps {
  videos: TikTokVideoPublic[]
  onVideoClick: (video: TikTokVideoPublic) => void
  className?: string
}

const DESKTOP_POSITIONS = [
  { top: '0%', left: '5%', rotate: -8, z: 2, w: 130 },
  { top: '8%', left: '42%', rotate: 4, z: 4, w: 130 },
  { top: '35%', left: '0%', rotate: 6, z: 1, w: 130 },
  { top: '30%', left: '38%', rotate: -4, z: 5, w: 130 },
  { top: '58%', left: '12%', rotate: -6, z: 3, w: 130 },
  { top: '52%', left: '48%', rotate: 8, z: 2, w: 130 },
]

const MOBILE_POSITIONS = [
  { top: '2%', left: '0%', rotate: -14, z: 1, w: 96 },
  { top: '0%', left: '28%', rotate: -2, z: 4, w: 112 },
  { top: '6%', left: '58%', rotate: 12, z: 2, w: 90 },
  { top: '46%', left: '4%', rotate: 10, z: 2, w: 88 },
  { top: '40%', left: '34%', rotate: -8, z: 5, w: 104 },
  { top: '48%', left: '62%', rotate: 6, z: 3, w: 86 },
]

export function TikTokHeroCollage({
  videos,
  onVideoClick,
  className,
}: TikTokHeroCollageProps) {
  if (videos.length === 0) return null

  return (
    <>
      {/* Mobile & tablet layered fan */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={cn(
          'relative mx-auto h-[320px] w-full max-w-md sm:h-[380px] lg:hidden',
          className
        )}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[60px]" />
        <div className="pointer-events-none absolute right-4 top-8 h-24 w-24 rounded-full bg-cyan-500/15 blur-[50px]" />

        {videos.slice(0, 6).map((video, i) => {
          const pos = MOBILE_POSITIONS[i] ?? MOBILE_POSITIONS[0]
          return (
            <motion.div
              key={video.id}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                zIndex: pos.z,
                width: pos.w,
                rotate: `${pos.rotate}deg`,
              }}
              animate={{ y: [0, i % 2 === 0 ? -7 : 7, 0] }}
              transition={{
                duration: 3.2 + i * 0.35,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <TikTokFacadeCard
                video={video}
                onClick={onVideoClick}
                size="sm"
                variant="cinema"
                index={i}
                className="w-full shadow-2xl shadow-black/50"
              />
            </motion.div>
          )
        })}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#030712]/60 to-transparent" />
      </motion.div>

      {/* Desktop collage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={cn(
          'relative mx-auto hidden h-[420px] w-full max-w-md lg:block',
          className
        )}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-[80px]" />

        {videos.slice(0, 6).map((video, i) => {
          const pos = DESKTOP_POSITIONS[i] ?? DESKTOP_POSITIONS[0]
          return (
            <motion.div
              key={video.id}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                zIndex: pos.z,
                width: pos.w,
                rotate: `${pos.rotate}deg`,
              }}
              animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <TikTokFacadeCard
                video={video}
                onClick={onVideoClick}
                size="sm"
                variant="cinema"
                index={i}
                className="w-full shadow-2xl"
              />
            </motion.div>
          )
        })}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
      </motion.div>
    </>
  )
}
