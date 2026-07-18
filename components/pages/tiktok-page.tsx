'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Play,
  Sparkles,
  Video,
  Heart,
  Share2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TikTokFilters } from '@/components/marketing/tiktok-filters'
import { TikTokFeedGrid } from '@/components/marketing/tiktok-feed-grid'
import { TikTokWatchModal } from '@/components/marketing/tiktok-watch-modal'
import { TikTokFacadeCard } from '@/components/marketing/tiktok-facade-card'
import { TikTokHeroCollage } from '@/components/marketing/tiktok-hero-collage'
import { TikTokAutoplayStrip } from '@/components/marketing/tiktok-autoplay-strip'
import { TikTokLayeredFan } from '@/components/marketing/tiktok-layered-fan'
import { useTikTokFeed } from '@/lib/tiktok/use-tiktok-feed'
import { SOCIAL } from '@/lib/social'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'
import type { TikTokCategory, TikTokVideoPublic } from '@/lib/tiktok/types'

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.15),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(217,70,239,0.1),transparent_40%)]" />
      <div className="absolute inset-0 bg-[url('/images/logo.jpg')] bg-center opacity-[0.02] mix-blend-overlay" />
      <motion.div
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px] md:h-96 md:w-96 md:blur-[120px]"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -right-24 bottom-32 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-[80px] md:h-80 md:w-80 md:blur-[100px]"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/25 blur-[70px] md:h-64 md:w-64 md:blur-[90px]"
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}

export function TikTokPage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const deepLinkVideoId = searchParams.get('v')

  const [category, setCategory] = useState<TikTokCategory | 'all'>('all')
  const { videos, loading } = useTikTokFeed({
    category: category === 'all' ? undefined : category,
    limit: 48,
  })

  const [activeVideo, setActiveVideo] = useState<TikTokVideoPublic | null>(null)

  const featured = useMemo(
    () => videos.filter((v) => v.isFeatured || v.isPinned).slice(0, 3),
    [videos]
  )

  const autoplayVideos = useMemo(() => {
    const featuredFirst = videos.filter((v) => v.isFeatured || v.isPinned)
    if (featuredFirst.length >= 5) return featuredFirst.slice(0, 5)
    if (featuredFirst.length >= 1) {
      const rest = videos.filter((v) => !featuredFirst.some((f) => f.id === v.id))
      return [...featuredFirst, ...rest].slice(0, 5)
    }
    return videos.slice(0, 5)
  }, [videos])

  const gridVideos = useMemo(() => {
    const featuredIds = new Set(featured.map((v) => v.id))
    const autoplayIds = new Set(autoplayVideos.map((v) => v.id))
    return videos.filter(
      (v) =>
        (!featuredIds.has(v.id) || featured.length === 0) &&
        !autoplayIds.has(v.id)
    )
  }, [videos, featured, autoplayVideos])

  const heroThumbs = useMemo(() => videos.slice(0, 6), [videos])

  useEffect(() => {
    if (!deepLinkVideoId || videos.length === 0) return
    const match = videos.find((v) => v.videoId === deepLinkVideoId)
    if (match) setActiveVideo(match)
  }, [deepLinkVideoId, videos])

  const handleFollow = () => {
    trackEvent({ action: 'tiktok_follow_click', category: 'tiktok', label: 'hub' })
    window.open(SOCIAL.tiktok.profileUrl, '_blank', 'noopener,noreferrer')
  }

  const spotlight = featured[0]
  const sideFeatured = featured.slice(1)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <AmbientBackground />

      {/* ── Hero ── */}
      <section className="relative border-b border-white/5">
        <div className="container-max px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 md:pb-24 md:pt-8 lg:px-8">
          {/* Mobile: collage first for visual impact */}
          <div className="mb-8 lg:hidden">
            <TikTokHeroCollage videos={heroThumbs} onVideoClick={setActiveVideo} />
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <div className="mb-6 flex items-center justify-center gap-4 lg:mb-8 lg:justify-start">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400 via-primary to-fuchsia-500 opacity-80 blur-sm" />
                  <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-white/10 sm:h-20 sm:w-20 md:h-24 md:w-24">
                    <Image
                      src="/images/logo.jpg"
                      alt="Active Movers"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold ring-2 ring-[#030712] sm:h-7 sm:w-7 sm:text-xs">
                    ✓
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-cyan-300 sm:text-sm">
                    {language === 'am' ? 'ኦፊሴላዊ ቻናል' : 'Official Channel'}
                  </p>
                  <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
                    {SOCIAL.tiktok.handle}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400 sm:mt-2 sm:gap-4 sm:text-sm">
                    <span className="flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                      {videos.length}+ {language === 'am' ? 'ቪዲዮዎች' : 'videos'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-pink-400 sm:h-4 sm:w-4" />
                      {language === 'am' ? 'እውነተኛ መጓጓዣ' : 'Real moves daily'}
                    </span>
                  </div>
                </div>
              </div>

              <Badge className="mb-4 border-0 bg-white/10 text-white backdrop-blur-md">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
                {SOCIAL.tiktok.handle}
              </Badge>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                  {t('tiktok.pageTitle')}
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0">
                {t('tiktok.pageSubtitle')}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                <Button
                  onClick={handleFollow}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 px-8 shadow-lg shadow-primary/30 hover:opacity-95 sm:w-auto"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('tiktok.followOnTiktok')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto"
                  asChild
                >
                  <Link href="/booking">{t('header.bookNow')}</Link>
                </Button>
              </div>
            </motion.div>

            {/* Desktop collage */}
            <div className="hidden lg:block">
              <TikTokHeroCollage videos={heroThumbs} onVideoClick={setActiveVideo} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Auto-play strip (5 videos) ── */}
      {!loading && autoplayVideos.length > 0 && (
        <TikTokAutoplayStrip
          videos={autoplayVideos}
          onVideoClick={setActiveVideo}
        />
      )}

      {/* ── Featured spotlight ── */}
      {featured.length > 0 && (
        <section className="relative border-b border-white/5 py-10 md:py-16">
          <div className="container-max px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 flex items-end justify-between gap-4 md:mb-8"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 sm:text-sm">
                  {language === 'am' ? 'ተመራጭ' : 'Spotlight'}
                </p>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl md:text-3xl">
                  {t('tiktok.featured')}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hidden shrink-0 text-gray-400 hover:text-white sm:flex"
                onClick={handleFollow}
              >
                {t('tiktok.followOnTiktok')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Mobile: horizontal scroll with edge fades */}
            <div className="relative md:hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#030712] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#030712] to-transparent" />
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {featured.map((video, i) => (
                <div
                  key={video.id}
                  className="w-[min(75vw,280px)] shrink-0 snap-center"
                >
                  <TikTokFacadeCard
                    video={video}
                    onClick={setActiveVideo}
                    variant={i === 0 ? 'spotlight' : 'cinema'}
                    size="lg"
                    className="w-full"
                  />
                </div>
              ))}
              </div>
            </div>

            {/* Desktop: asymmetric grid */}
            <div className="hidden gap-5 md:grid md:grid-cols-12">
              {spotlight && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="md:col-span-7"
                >
                  <TikTokFacadeCard
                    video={spotlight}
                    onClick={setActiveVideo}
                    variant="spotlight"
                    size="lg"
                    className="w-full"
                  />
                </motion.div>
              )}
              <div className="flex flex-col gap-5 md:col-span-5">
                {sideFeatured.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex-1"
                  >
                    <TikTokFacadeCard
                      video={video}
                      onClick={setActiveVideo}
                      variant="cinema"
                      size="lg"
                      className="w-full"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Layered fan strip ── */}
      {heroThumbs.length >= 3 && (
        <TikTokLayeredFan videos={heroThumbs} onVideoClick={setActiveVideo} />
      )}

      {/* ── Main feed ── */}
      <section className="relative py-10 md:py-20">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
                {language === 'am' ? 'ሁሉም ቪዲዮዎች' : 'All Videos'}
              </h2>
              <p className="mt-1 text-sm text-gray-500 md:text-base">
                {language === 'am'
                  ? 'ይመልከቱ፣ ይጫወቱ እና ይጋሩ'
                  : 'Watch, play, and share our latest clips'}
              </p>
            </div>
            <TikTokFilters
              value={category}
              onChange={setCategory}
              theme="dark"
              className="w-full md:max-w-xl"
            />
          </motion.div>

          <TikTokFeedGrid
            videos={gridVideos.length > 0 ? gridVideos : videos}
            onVideoClick={setActiveVideo}
            loading={loading}
            theme="dark"
          />

          {!loading && videos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center backdrop-blur-sm sm:p-12"
            >
              <Play className="mx-auto mb-4 h-12 w-12 text-gray-600" />
              <p className="mb-6 text-gray-400">{t('tiktok.emptyState')}</p>
              <Button onClick={handleFollow} className="bg-primary">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t('tiktok.followOnTiktok')}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 sm:rounded-[2rem]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-emerald-600/90 to-cyan-600/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10 sm:h-64 sm:w-64"
            />
            <div className="relative z-10 px-6 py-10 text-center sm:px-8 sm:py-14 md:px-16 md:py-20">
              <Share2 className="mx-auto mb-4 h-8 w-8 text-white/80 sm:h-10 sm:w-10" />
              <h3 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                {t('tiktok.ctaTitle')}
              </h3>
              <p className="mx-auto mt-4 max-w-xl text-base text-green-50/90 sm:text-lg">
                {t('tiktok.ctaSubtitle')}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                <Button
                  size="lg"
                  className="w-full bg-white text-green-700 shadow-xl hover:bg-green-50 sm:w-auto"
                  asChild
                >
                  <Link href="/booking">{t('tiktok.bookFromVideo')}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                  onClick={handleFollow}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('tiktok.followOnTiktok')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <TikTokWatchModal
        video={activeVideo}
        videos={videos}
        open={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        onVideoChange={(v) => {
          setActiveVideo(v)
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `/tiktok?v=${v.videoId}`)
          }
        }}
      />
    </div>
  )
}
