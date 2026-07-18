'use client'

import { motion } from 'framer-motion'
import { TikTokFacadeCard } from '@/components/marketing/tiktok-facade-card'
import { useLanguage } from '@/contexts/language-context'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'

interface TikTokLayeredFanProps {
  videos: TikTokVideoPublic[]
  onVideoClick: (video: TikTokVideoPublic) => void
}

const FAN_LAYOUT = [
  { left: '4%', rotate: -14, z: 1, delay: 0 },
  { left: '22%', rotate: -4, z: 3, delay: 0.05 },
  { left: '40%', rotate: 6, z: 5, delay: 0.1 },
  { left: '58%', rotate: -6, z: 4, delay: 0.15 },
  { left: '76%', rotate: 12, z: 2, delay: 0.2 },
]

export function TikTokLayeredFan({ videos, onVideoClick }: TikTokLayeredFanProps) {
  const { language } = useLanguage()
  if (videos.length < 3) return null

  return (
    <section className="relative overflow-hidden border-b border-white/5 py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.08),transparent_60%)]" />

      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400/80"
        >
          {language === 'am' ? 'ከቲክቶክ' : 'From the feed'}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-lg font-bold text-white sm:text-xl"
        >
          {language === 'am' ? 'ተደራራቅ ቪዲዮዎች' : 'Stacked & ready to watch'}
        </motion.h3>

        {/* Mobile: overlapping horizontal fan */}
        <div className="relative mx-auto h-[220px] max-w-lg sm:hidden">
          {videos.slice(0, 5).map((video, i) => {
            const layout = FAN_LAYOUT[i] ?? FAN_LAYOUT[0]
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30, rotate: layout.rotate }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: layout.delay }}
                className="absolute bottom-0 w-[30%] max-w-[110px]"
                style={{
                  left: layout.left,
                  zIndex: layout.z,
                  rotate: `${layout.rotate}deg`,
                }}
                whileHover={{ y: -10, zIndex: 20 }}
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
        </div>

        {/* Tablet+ */}
        <div className="relative mx-auto hidden h-[260px] max-w-3xl sm:block md:h-[300px]">
          {videos.slice(0, 5).map((video, i) => {
            const layout = FAN_LAYOUT[i] ?? FAN_LAYOUT[0]
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: layout.delay }}
                className="absolute bottom-0 w-[140px] md:w-[160px]"
                style={{
                  left: layout.left,
                  zIndex: layout.z,
                  rotate: `${layout.rotate}deg`,
                }}
                whileHover={{ y: -12, zIndex: 20, scale: 1.04 }}
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
        </div>
      </div>
    </section>
  )
}
