'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, Pin, Play, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getCategoryLabel } from '@/lib/tiktok/categories'
import { useLanguage } from '@/contexts/language-context'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'
import { cn } from '@/lib/utils'

export type TikTokCardVariant = 'default' | 'spotlight' | 'cinema' | 'masonry'

interface TikTokFacadeCardProps {
  video: TikTokVideoPublic
  onClick: (video: TikTokVideoPublic) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: TikTokCardVariant
  index?: number
}

function formatViews(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return String(count)
}

export function TikTokFacadeCard({
  video,
  onClick,
  className,
  size = 'md',
  variant = 'default',
  index = 0,
}: TikTokFacadeCardProps) {
  const { language } = useLanguage()
  const title =
    language === 'am' && video.titleAm ? video.titleAm : video.title

  const widthClass =
    size === 'sm'
      ? 'w-[140px]'
      : size === 'lg'
        ? 'w-full'
        : 'w-[180px]'

  const isDark = variant === 'cinema' || variant === 'spotlight'

  return (
    <motion.button
      type="button"
      onClick={() => onClick(video)}
      initial={{ opacity: 0, y: variant === 'masonry' ? 24 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: variant === 'masonry' ? (index % 12) * 0.04 : 0,
        type: 'spring',
        stiffness: 120,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group relative shrink-0 snap-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        widthClass,
        variant === 'spotlight' && 'w-full',
        className
      )}
      aria-label={`Play TikTok: ${title}`}
    >
      {/* Animated gradient border */}
      <div
        className={cn(
          'absolute -inset-[1px] rounded-[1.25rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          isDark
            ? 'bg-gradient-to-br from-cyan-400 via-primary to-fuchsia-500'
            : 'bg-gradient-to-br from-primary via-emerald-400 to-lime-300'
        )}
      />
      <div
        className={cn(
          'absolute -inset-[1px] rounded-[1.25rem] opacity-40 blur-md transition-opacity duration-500 group-hover:opacity-70',
          isDark
            ? 'bg-gradient-to-br from-cyan-400/60 via-primary/60 to-fuchsia-500/60'
            : 'bg-gradient-to-br from-primary/50 to-lime-400/50'
        )}
      />

      <div
        className={cn(
          'relative overflow-hidden rounded-[1.2rem] shadow-xl transition-shadow duration-500 group-hover:shadow-2xl',
          isDark ? 'bg-gray-950 ring-1 ring-white/10' : 'bg-gray-900 ring-1 ring-black/5'
        )}
      >
        <div className="relative aspect-[9/16] w-full">
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 280px"
              className="object-cover transition duration-700 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-primary to-emerald-900" />
          )}

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_55%)]" />

          {/* Scan line on hover */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100"
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className={cn(
                'flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300',
                variant === 'spotlight'
                  ? 'h-20 w-20 bg-white/15 ring-2 ring-white/40 group-hover:bg-white/25'
                  : 'h-14 w-14 bg-white/20 ring-1 ring-white/30 group-hover:scale-110 group-hover:bg-primary/80'
              )}
              whileHover={{ scale: 1.1 }}
            >
              <Play
                className={cn(
                  'fill-white text-white',
                  variant === 'spotlight' ? 'ml-1.5 h-9 w-9' : 'ml-1 h-7 w-7'
                )}
              />
            </motion.div>
          </div>

          {/* Top badges */}
          <div className="absolute left-2.5 right-2.5 top-2.5 flex items-start justify-between gap-2">
            <Badge
              className={cn(
                'border-0 text-[10px] font-semibold backdrop-blur-md',
                isDark
                  ? 'bg-black/50 text-white'
                  : 'bg-white/90 text-gray-900'
              )}
            >
              {getCategoryLabel(video.category, language)}
            </Badge>
            {(video.isFeatured || video.isPinned) && (
              <span className="flex items-center gap-0.5 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                {video.isPinned ? (
                  <Pin className="h-3 w-3" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
              </span>
            )}
          </div>

          {/* Bottom meta */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <p
              className={cn(
                'line-clamp-2 font-semibold leading-snug text-white drop-shadow-md',
                variant === 'spotlight' ? 'text-sm md:text-base' : 'text-xs'
              )}
            >
              {title}
            </p>
            {video.viewCountLocal > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-white/80">
                <Eye className="h-3.5 w-3.5" />
                {formatViews(video.viewCountLocal)} views
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  )
}
