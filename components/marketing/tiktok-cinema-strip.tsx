'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, ChevronRight, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TikTokFacadeCard } from '@/components/marketing/tiktok-facade-card'
import { TikTokWatchModal } from '@/components/marketing/tiktok-watch-modal'
import { useTikTokFeed } from '@/lib/tiktok/use-tiktok-feed'
import { SOCIAL } from '@/lib/social'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'

interface TikTokCinemaStripProps {
  limit?: number
}

export function TikTokCinemaStrip({ limit = 6 }: TikTokCinemaStripProps) {
  const { t, language } = useLanguage()
  const { videos, loading } = useTikTokFeed({ featured: true, limit })
  const [activeVideo, setActiveVideo] = useState<TikTokVideoPublic | null>(null)

  const handleFollow = () => {
    trackEvent({ action: 'tiktok_follow_click', category: 'tiktok', label: 'cinema_strip' })
    window.open(SOCIAL.tiktok.profileUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="relative overflow-hidden bg-[#030712] py-20 md:py-28">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,0.2),transparent_55%)]" />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[90px]"
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center md:mb-14"
        >
          <Badge className="mb-4 border-0 bg-white/10 text-white backdrop-blur-md">
            <Play className="mr-1.5 h-3.5 w-3.5 fill-white" />
            {SOCIAL.tiktok.handle}
          </Badge>
          <h2 className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl">
            {t('tiktok.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            {t('tiktok.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center gap-5 overflow-hidden pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[340px] w-[190px] shrink-0 animate-pulse rounded-[1.2rem] bg-white/5"
              />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#030712] to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#030712] to-transparent md:w-24" />
            <div className="-mx-4 flex gap-5 overflow-x-auto px-8 pb-6 pt-2 snap-x snap-mandatory scrollbar-thin md:mx-0 md:justify-center md:px-4">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="shrink-0 snap-center"
                >
                  <TikTokFacadeCard
                    video={video}
                    onClick={setActiveVideo}
                    size="md"
                    variant="cinema"
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
            <p className="mb-4 text-gray-400">{t('tiktok.emptyState')}</p>
            <Button onClick={handleFollow} className="bg-primary">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('tiktok.followOnTiktok')}
            </Button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            variant="outline"
            onClick={handleFollow}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('tiktok.followOnTiktok')}
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-emerald-500 shadow-lg shadow-primary/30"
          >
            <Link
              href="/tiktok"
              onClick={() =>
                trackEvent({ action: 'tiktok_view_all', category: 'tiktok', label: 'home' })
              }
            >
              {t('tiktok.viewAll')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      <TikTokWatchModal
        video={activeVideo}
        videos={videos}
        open={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        onVideoChange={setActiveVideo}
      />
    </section>
  )
}
