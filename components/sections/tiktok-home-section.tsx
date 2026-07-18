'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  ExternalLink,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TikTokAutoplayStrip } from '@/components/marketing/tiktok-autoplay-strip'
import { TikTokFacadeCard } from '@/components/marketing/tiktok-facade-card'
import { TikTokWatchModal } from '@/components/marketing/tiktok-watch-modal'
import { useTikTokFeed } from '@/lib/tiktok/use-tiktok-feed'
import { SOCIAL } from '@/lib/social'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'

export function TikTokHomeSection() {
  const { t, language } = useLanguage()
  const { videos, loading } = useTikTokFeed({ limit: 20 })
  const [activeVideo, setActiveVideo] = useState<TikTokVideoPublic | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  const autoplayVideos = useMemo(() => {
    const featured = videos.filter((v) => v.isFeatured || v.isPinned)
    if (featured.length >= 5) return featured.slice(0, 5)
    if (featured.length > 0) {
      const rest = videos.filter((v) => !featured.some((f) => f.id === v.id))
      return [...featured, ...rest].slice(0, 5)
    }
    return videos.slice(0, 5)
  }, [videos])

  const moreVideos = useMemo(() => {
    const used = new Set(autoplayVideos.map((v) => v.id))
    return videos.filter((v) => !used.has(v.id)).slice(0, 4)
  }, [videos, autoplayVideos])

  const handleFollow = () => {
    trackEvent({ action: 'tiktok_follow_click', category: 'tiktok', label: 'home' })
    window.open(SOCIAL.tiktok.profileUrl, '_blank', 'noopener,noreferrer')
  }

  if (!loading && videos.length === 0) return null

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-white via-green-50/40 to-white">
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-3xl text-center md:mb-12"
        >
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 bg-primary/5 text-primary"
          >
            <Play className="mr-1.5 h-3.5 w-3.5 fill-primary" />
            {SOCIAL.tiktok.handle}
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-gray-900 via-primary to-emerald-600 bg-clip-text text-transparent">
              {t('tiktok.title')}
            </span>
          </h2>
          <p className="mt-4 text-base text-gray-600 md:text-lg">{t('tiktok.subtitle')}</p>
        </motion.div>

        {/* Dark theater stage with autoplay phones */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-cyan-400/40 via-primary/50 to-fuchsia-500/30 opacity-70 blur-md sm:rounded-[2.5rem]" />

          <div className="relative overflow-hidden rounded-[1.85rem] bg-[#030712] shadow-2xl shadow-primary/10 ring-1 ring-white/10 sm:rounded-[2.4rem]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,0.2),transparent_55%)]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />

            <div className="relative border-b border-white/5 px-4 py-5 sm:px-8 sm:py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                      {language === 'am' ? 'አሁን ይጫወታል' : 'Now Playing'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {language === 'am'
                        ? 'አምስት ቪዲዮዎች በራስ-ሰር'
                        : 'Five clips playing automatically'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                  {isMuted
                    ? language === 'am'
                      ? 'ድምፅ አብራ'
                      : 'Unmute'
                    : language === 'am'
                      ? 'ድምፅ አጥፋ'
                      : 'Mute'}
                </button>
              </div>
            </div>

            {!loading && autoplayVideos.length > 0 ? (
              <TikTokAutoplayStrip
                videos={autoplayVideos}
                onVideoClick={setActiveVideo}
                embedded
                hideHeader
                muted={isMuted}
                onMutedChange={setIsMuted}
                className="border-0"
              />
            ) : (
              <div className="flex justify-center gap-4 px-4 py-12">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[280px] w-[160px] animate-pulse rounded-[1.2rem] bg-white/5"
                  />
                ))}
              </div>
            )}

            <div className="border-t border-white/5 px-4 py-5 text-center sm:px-8">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                asChild
              >
                <Link
                  href="/tiktok"
                  onClick={() =>
                    trackEvent({
                      action: 'tiktok_view_all',
                      category: 'tiktok',
                      label: 'home_stage',
                    })
                  }
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('tiktok.viewAll')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* More clips row */}
        {moreVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 md:mt-14"
          >
            <p className="mb-5 text-center text-sm font-semibold uppercase tracking-widest text-gray-500">
              {language === 'am' ? 'ተጨማሪ ከቲክቶክ' : 'More from TikTok'}
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent md:w-12" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent md:w-12" />
              <div className="-mx-2 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide md:justify-center">
                {moreVideos.map((video, index) => (
                  <div key={video.id} className="w-[160px] shrink-0 snap-center sm:w-[180px]">
                    <TikTokFacadeCard
                      video={video}
                      onClick={setActiveVideo}
                      size="md"
                      variant="default"
                      index={index}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button variant="outline" onClick={handleFollow}>
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('tiktok.followOnTiktok')}
          </Button>
          <Button asChild className="bg-gradient-to-r from-primary to-emerald-500 shadow-lg shadow-primary/20">
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
