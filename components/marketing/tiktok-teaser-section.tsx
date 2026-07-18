'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TikTokFacadeCard } from '@/components/marketing/tiktok-facade-card'
import { TikTokWatchModal } from '@/components/marketing/tiktok-watch-modal'
import { useTikTokPlacement } from '@/lib/tiktok/use-tiktok-placement'
import { TIKTOK_PLACEMENTS, type TikTokPlacement } from '@/lib/tiktok/placements'
import { SOCIAL } from '@/lib/social'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'
import { cn } from '@/lib/utils'

interface TikTokTeaserSectionProps {
  placement: TikTokPlacement
  variant?: 'light' | 'muted' | 'dark'
  className?: string
}

export function TikTokTeaserSection({
  placement,
  variant = 'muted',
  className,
}: TikTokTeaserSectionProps) {
  const { language } = useLanguage()
  const meta = TIKTOK_PLACEMENTS[placement]
  const { videos, loading } = useTikTokPlacement(placement)
  const [activeVideo, setActiveVideo] = useState<TikTokVideoPublic | null>(null)

  const title = language === 'am' ? meta.titleAm : meta.titleEn
  const subtitle = language === 'am' ? meta.subtitleAm : meta.subtitleEn

  const bgClass =
    variant === 'dark'
      ? 'bg-gray-900 text-white'
      : variant === 'light'
        ? 'bg-white'
        : 'bg-gray-50'

  if (!loading && videos.length === 0) return null

  return (
    <section className={cn('section-padding-sm', bgClass, className)}>
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <Badge
              variant="outline"
              className={cn(
                'mb-2',
                variant === 'dark' && 'border-white/20 text-white'
              )}
            >
              {SOCIAL.tiktok.handle}
            </Badge>
            <h2
              className={cn(
                'text-2xl font-bold md:text-3xl',
                variant === 'dark' ? 'text-white' : 'text-gray-900'
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                'mt-2 max-w-2xl text-sm md:text-base',
                variant === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}
            >
              {subtitle}
            </p>
          </div>
          <Button
            variant={variant === 'dark' ? 'outline' : 'default'}
            className={cn(
              'shrink-0',
              variant === 'dark' && 'border-white/20 text-white hover:bg-white/10'
            )}
            asChild
          >
            <Link
              href="/tiktok"
              onClick={() =>
                trackEvent({
                  action: 'tiktok_view_all',
                  category: 'tiktok',
                  label: placement,
                })
              }
            >
              {language === 'am' ? 'ሁሉንም ቪዲዮዎች' : 'All videos'}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {loading ? (
          <div
            className={cn(
              meta.layout === 'grid'
                ? 'grid grid-cols-2 gap-4 md:grid-cols-4'
                : 'flex gap-4 overflow-hidden'
            )}
          >
            {Array.from({ length: meta.videoIds.length }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'animate-pulse rounded-2xl bg-gray-200',
                  meta.layout === 'grid' ? 'aspect-[9/16]' : 'h-[280px] w-[180px] shrink-0',
                  variant === 'dark' && 'bg-gray-800'
                )}
              />
            ))}
          </div>
        ) : meta.layout === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {videos.map((video, index) => (
              <TikTokFacadeCard
                key={video.id}
                video={video}
                onClick={setActiveVideo}
                size="lg"
                variant={variant === 'dark' ? 'cinema' : 'default'}
                index={index}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-thin md:mx-0 md:px-0">
            {videos.map((video, index) => (
              <TikTokFacadeCard
                key={video.id}
                video={video}
                onClick={setActiveVideo}
                size="md"
                variant={variant === 'dark' ? 'cinema' : 'default'}
                index={index}
              />
            ))}
          </div>
        )}
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
