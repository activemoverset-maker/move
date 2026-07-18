'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import {
  X,
  ExternalLink,
  Share2,
  MessageCircle,
  Eye,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TikTokPlayer } from '@/components/marketing/tiktok-player'
import { SOCIAL } from '@/lib/social'
import { getCategoryLabel } from '@/lib/tiktok/categories'
import { generateWhatsAppLink } from '@/lib/utils'
import { SITE_CONFIG } from '@/constants/site'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'
import { cn } from '@/lib/utils'

interface TikTokWatchModalProps {
  video: TikTokVideoPublic | null
  /** Playlist for next/prev — defaults to single video */
  videos?: TikTokVideoPublic[]
  open: boolean
  onClose: () => void
  onVideoChange?: (video: TikTokVideoPublic) => void
}

const SWIPE_THRESHOLD = 60

export function TikTokWatchModal({
  video,
  videos: videosProp,
  open,
  onClose,
  onVideoChange,
}: TikTokWatchModalProps) {
  const { language, t } = useLanguage()
  const dragY = useMotionValue(0)
  const dragOpacity = useTransform(dragY, [-120, 0, 120], [0.6, 1, 0.6])

  const playlist = useMemo(() => {
    if (videosProp && videosProp.length > 0) return videosProp
    return video ? [video] : []
  }, [videosProp, video])

  const currentIndex = useMemo(() => {
    if (!video) return -1
    const idx = playlist.findIndex((v) => v.id === video.id)
    return idx >= 0 ? idx : 0
  }, [video, playlist])

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < playlist.length - 1

  const goTo = useCallback(
    (index: number) => {
      const next = playlist[index]
      if (!next) return
      trackEvent({
        action: 'tiktok_modal_navigate',
        category: 'tiktok',
        label: `${index + 1}/${playlist.length}`,
      })
      onVideoChange?.(next)
    },
    [playlist, onVideoChange]
  )

  const goPrev = useCallback(() => {
    if (hasPrev) goTo(currentIndex - 1)
  }, [hasPrev, currentIndex, goTo])

  const goNext = useCallback(() => {
    if (hasNext) goTo(currentIndex + 1)
  }, [hasNext, currentIndex, goTo])

  const recordView = useCallback(async (id: string, videoId: string) => {
    trackEvent({ action: 'tiktok_modal_open', category: 'tiktok', label: videoId })
    try {
      await fetch(`/api/tiktok/${id}/view`, { method: 'POST' })
    } catch {
      // non-blocking
    }
  }, [])

  useEffect(() => {
    if (!open || !video) return
    recordView(video.id, video.videoId)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, video?.id, video?.videoId, recordView, video])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, goPrev, goNext])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -SWIPE_THRESHOLD) goNext()
    else if (info.offset.y > SWIPE_THRESHOLD) goPrev()
    dragY.set(0)
  }

  const title =
    language === 'am' && video?.titleAm ? video.titleAm : video?.title ?? ''

  const whatsappMessage = `Hi Active Movers! I watched your TikTok about "${title}" and I'd like a quote.`

  const handleShare = async () => {
    if (!video) return
    const shareUrl = `${window.location.origin}/tiktok?v=${video.videoId}`
    trackEvent({ action: 'tiktok_share', category: 'tiktok', label: video.videoId })

    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
      }
      await fetch(`/api/tiktok/${video.id}/share`, { method: 'POST' })
    } catch {
      // user cancelled share
    }
  }

  const handleOpenExternal = () => {
    if (!video) return
    trackEvent({ action: 'tiktok_open_external', category: 'tiktok', label: video.videoId })
    window.open(video.url, '_blank', 'noopener,noreferrer')
  }

  const showNav = playlist.length > 1

  return (
    <AnimatePresence>
      {open && video && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 shadow-2xl shadow-primary/10 md:max-h-[92vh] md:flex-row"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Phone + vertical nav */}
            <div className="relative flex w-full shrink-0 flex-col items-center justify-center bg-black p-3 sm:p-4 md:w-[min(380px,42%)] md:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(22,163,74,0.15),transparent_60%)]" />

              {showNav && (
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span>
                    {currentIndex + 1} / {playlist.length}
                  </span>
                  <span className="hidden text-gray-600 sm:inline">
                    · {language === 'am' ? 'ይሸብልሉ ወይም ቀስት ይጫኑ' : 'Swipe or use arrow keys'}
                  </span>
                </div>
              )}

              <div className="relative flex items-center gap-2 sm:gap-3">
                {showNav && (
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!hasPrev}
                    className={cn(
                      'hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 sm:flex',
                      !hasPrev && 'cursor-not-allowed opacity-30'
                    )}
                    aria-label="Previous video"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                )}

                <motion.div
                  className="relative w-full max-w-[min(100%,320px)] touch-pan-y"
                  style={{ y: dragY, opacity: dragOpacity }}
                  drag={showNav ? 'y' : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.35}
                  onDragEnd={handleDragEnd}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="rounded-[2.5rem] bg-gradient-to-b from-gray-700 to-gray-900 p-[3px] shadow-2xl shadow-black/50">
                        <div className="overflow-hidden rounded-[2.35rem] bg-black ring-1 ring-white/10">
                          <div className="relative z-10 flex justify-center bg-black pt-2">
                            <div className="h-6 w-24 rounded-full bg-gray-900" />
                          </div>
                          <div className="relative aspect-[9/16] w-full">
                            <TikTokPlayer
                              videoId={video.videoId}
                              active={open}
                              title={title}
                              className="h-full w-full border-0"
                            />
                          </div>
                          <div className="flex justify-center bg-black py-2">
                            <div className="h-1 w-28 rounded-full bg-white/30" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {showNav && (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasNext}
                    className={cn(
                      'hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 sm:flex',
                      !hasNext && 'cursor-not-allowed opacity-30'
                    )}
                    aria-label="Next video"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Mobile nav pills */}
              {showNav && (
                <div className="mt-3 flex gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!hasPrev}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1 rounded-full border border-white/15 bg-white/5 py-2.5 text-sm text-white',
                      !hasPrev && 'opacity-30'
                    )}
                  >
                    <ChevronUp className="h-4 w-4" />
                    {language === 'am' ? 'ቀዳሚ' : 'Previous'}
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasNext}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1 rounded-full border border-white/15 bg-white/5 py-2.5 text-sm text-white',
                      !hasNext && 'opacity-30'
                    )}
                  >
                    {language === 'am' ? 'ቀጣይ' : 'Next'}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-1 flex-col gap-5 p-6 text-white md:py-10 md:pr-10">
              <div>
                <Badge className="mb-3 border-0 bg-primary/20 text-primary-foreground">
                  {getCategoryLabel(video.category, language)}
                </Badge>
                <h3 className="text-xl font-bold leading-snug md:text-2xl">{title}</h3>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                  <span className="font-semibold text-cyan-400">{SOCIAL.tiktok.handle}</span>
                  {video.viewCountLocal > 0 && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {video.viewCountLocal} views
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-gray-300">
                  {language === 'am'
                    ? 'ይህን ቪዲዮ አይተው መጓጓዣ ለመጠየቅ ወይም ቀጠሮ ለመያዝ ከታች ይንኩ።'
                    : 'Loved this clip? Book your move or message us below.'}
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-2.5">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-emerald-500 shadow-lg shadow-primary/25"
                >
                  <Link
                    href="/booking"
                    onClick={() =>
                      trackEvent({
                        action: 'tiktok_book_cta',
                        category: 'tiktok',
                        label: video.videoId,
                      })
                    }
                  >
                    {t('tiktok.bookFromVideo')}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                  asChild
                >
                  <a
                    href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                    onClick={handleOpenExternal}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t('tiktok.viewOnTiktok')}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {t('tiktok.share')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
