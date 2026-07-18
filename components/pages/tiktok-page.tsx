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
        className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -right-24 bottom-32 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-[100px]"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-[90px]"
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
          backgroundSize: '32px 32px',
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

  const gridVideos = useMemo(() => {
    const featuredIds = new Set(featured.map((v) => v.id))
    return videos.filter((v) => !featuredIds.has(v.id) || featured.length === 0)
  }, [videos, featured])

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
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <AmbientBackground />

      {/* ── Hero ── */}
      <section className="relative border-b border-white/5">
        <div className="container-max section-padding pb-16 pt-8 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Profile row */}
              <div className="mb-8 flex items-center gap-5">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400 via-primary to-fuchsia-500 opacity-80 blur-sm" />
                  <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-white/10 md:h-24 md:w-24">
                    <Image
                      src="/images/logo.jpg"
                      alt="Active Movers"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold ring-2 ring-[#030712]">
                    ✓
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-cyan-300">
                    {language === 'am' ? 'ኦፊሴላዊ ቻናል' : 'Official Channel'}
                  </p>
                  <h2 className="text-2xl font-bold md:text-3xl">
                    {SOCIAL.tiktok.handle}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Video className="h-4 w-4 text-primary" />
                      {videos.length}+ {language === 'am' ? 'ቪዲዮዎች' : 'videos'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-pink-400" />
                      {language === 'am' ? 'እውነተኛ መጓጓዣ' : 'Real moves daily'}
                    </span>
                  </div>
                </div>
              </div>

              <Badge className="mb-5 border-0 bg-white/10 text-white backdrop-blur-md">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
                {SOCIAL.tiktok.handle}
              </Badge>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                  {t('tiktok.pageTitle')}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
                {t('tiktok.pageSubtitle')}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={handleFollow}
                  size="lg"
                  className="bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 px-8 shadow-lg shadow-primary/30 hover:opacity-95"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('tiktok.followOnTiktok')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
                  asChild
                >
                  <Link href="/booking">{t('header.bookNow')}</Link>
                </Button>
              </div>
            </motion.div>

            {/* Floating thumbnail collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block"
            >
              {heroThumbs.map((video, i) => {
                const positions = [
                  { top: '0%', left: '5%', rotate: -8, z: 2 },
                  { top: '8%', left: '42%', rotate: 4, z: 4 },
                  { top: '35%', left: '0%', rotate: 6, z: 1 },
                  { top: '30%', left: '38%', rotate: -4, z: 5 },
                  { top: '58%', left: '12%', rotate: -6, z: 3 },
                  { top: '52%', left: '48%', rotate: 8, z: 2 },
                ]
                const pos = positions[i] ?? positions[0]
                return (
                  <motion.div
                    key={video.id}
                    className="absolute w-[130px]"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      zIndex: pos.z,
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
                      onClick={setActiveVideo}
                      size="sm"
                      variant="cinema"
                      className="w-[130px] shadow-2xl"
                    />
                  </motion.div>
                )
              })}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured spotlight ── */}
      {featured.length > 0 && (
        <section className="relative border-b border-white/5 py-12 md:py-16">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 flex items-end justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                  {language === 'am' ? 'ተመራጭ' : 'Spotlight'}
                </p>
                <h2 className="mt-1 text-2xl font-bold md:text-3xl">
                  {t('tiktok.featured')}
                </h2>
              </div>
              <Button
                variant="ghost"
                className="hidden text-gray-400 hover:text-white sm:flex"
                onClick={handleFollow}
              >
                {t('tiktok.followOnTiktok')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-12 md:gap-5">
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
              <div className="flex flex-col gap-4 md:col-span-5 md:gap-5">
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

      {/* ── Main feed ── */}
      <section className="relative py-12 md:py-20">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                {language === 'am' ? 'ሁሉም ቪዲዮዎች' : 'All Videos'}
              </h2>
              <p className="mt-1 text-gray-500">
                {language === 'am'
                  ? 'ይመልከቱ፣ ይጫወቱ እና ይጋሩ'
                  : 'Watch, play, and share our latest clips'}
              </p>
            </div>
            <TikTokFilters
              value={category}
              onChange={setCategory}
              theme="dark"
              className="md:max-w-xl"
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
              className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center backdrop-blur-sm"
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
      <section className="relative pb-20 pt-4">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-emerald-600/90 to-cyan-600/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10"
            />
            <div className="relative z-10 px-8 py-14 text-center md:px-16 md:py-20">
              <Share2 className="mx-auto mb-4 h-10 w-10 text-white/80" />
              <h3 className="text-3xl font-bold md:text-4xl">{t('tiktok.ctaTitle')}</h3>
              <p className="mx-auto mt-4 max-w-xl text-lg text-green-50/90">
                {t('tiktok.ctaSubtitle')}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white px-8 text-green-700 shadow-xl hover:bg-green-50"
                  asChild
                >
                  <Link href="/booking">{t('tiktok.bookFromVideo')}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
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
        open={!!activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  )
}
