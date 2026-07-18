'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Volume2, VolumeX, Radio, Maximize2 } from 'lucide-react'
import { TikTokPlayer } from '@/components/marketing/tiktok-player'
import { useLanguage } from '@/contexts/language-context'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'
import { cn } from '@/lib/utils'

interface TikTokAutoplayStripProps {
  videos: TikTokVideoPublic[]
  onVideoClick?: (video: TikTokVideoPublic) => void
  className?: string
  /** Nest inside a parent card (e.g. homepage) — drops outer section chrome */
  embedded?: boolean
  hideHeader?: boolean
  muted?: boolean
  onMutedChange?: (muted: boolean) => void
}

function AutoplayPhone({
  video,
  isActive,
  isMuted,
  onSelect,
  onExpand,
  index,
  playAllInView = false,
}: {
  video: TikTokVideoPublic
  isActive: boolean
  isMuted: boolean
  onSelect: () => void
  onExpand: () => void
  index: number
  playAllInView?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.55, margin: '-5% 0px' })
  const shouldPlay =
    inView && (isMuted && playAllInView ? true : isActive)
  const { language } = useLanguage()
  const title =
    language === 'am' && video.titleAm ? video.titleAm : video.title

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="shrink-0 snap-center"
    >
      <div
        className={cn(
          'group relative transition-transform duration-300',
          isActive && 'scale-[1.03] md:scale-[1.02]'
        )}
      >
        <div
          className={cn(
            'absolute -inset-2 rounded-[2rem] transition-opacity duration-500',
            shouldPlay
              ? 'bg-gradient-to-br from-cyan-400/50 via-primary/45 to-fuchsia-500/35 opacity-100 blur-lg'
              : 'opacity-0'
          )}
        />

        <div
          className={cn(
            'relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-gray-600 to-gray-900 p-[3px] shadow-2xl transition-all',
            shouldPlay ? 'ring-2 ring-primary/70' : 'ring-1 ring-white/10'
          )}
        >
          <button
            type="button"
            onClick={onSelect}
            className="block w-full text-left"
            aria-label={`Select ${title}`}
          >
            <div className="overflow-hidden rounded-[1.6rem] bg-black">
              <div className="flex justify-center bg-black py-1.5">
                <div className="h-3.5 w-14 rounded-full bg-gray-800 sm:h-4 sm:w-16" />
              </div>
              <div className="relative aspect-[9/16] w-[min(78vw,240px)] sm:w-[210px] md:w-[220px]">
                {shouldPlay ? (
                  <TikTokPlayer
                    key={`${video.videoId}-${isMuted}`}
                    videoId={video.videoId}
                    active={shouldPlay}
                    muted={isMuted}
                    keepMounted
                    title={title}
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: video.thumbnailUrl
                        ? `url(${video.thumbnailUrl})`
                        : undefined,
                    }}
                  >
                    {!video.thumbnailUrl && (
                      <div className="h-full w-full bg-gradient-to-br from-primary to-green-900" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm sm:h-12 sm:w-12">
                        <div className="ml-1 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-white sm:border-y-8 sm:border-l-[14px]" />
                      </div>
                    </div>
                  </div>
                )}

                {shouldPlay && (
                  <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    {language === 'am' ? 'ቀጥታ' : 'LIVE'}
                  </div>
                )}

                {shouldPlay && isMuted && (
                  <div className="pointer-events-none absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                    <VolumeX className="h-3 w-3" />
                    {language === 'am' ? 'ድምፅ ጠፍቷል' : 'Muted'}
                  </div>
                )}
              </div>
              <div className="flex justify-center bg-black py-1.5">
                <div className="h-1 w-16 rounded-full bg-white/25 sm:w-20" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onExpand}
            className="absolute right-2 top-10 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/75 group-hover:opacity-100 focus:opacity-100"
            aria-label="Open full player"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2.5 line-clamp-2 max-w-[min(78vw,240px)] text-center text-[11px] font-medium text-gray-400 sm:max-w-[210px] sm:text-xs md:max-w-[220px]">
          {title}
        </p>
      </div>
    </motion.div>
  )
}

function DecorativeFan({ videos }: { videos: TikTokVideoPublic[] }) {
  return (
    <div className="pointer-events-none relative mx-auto mb-6 h-28 w-full max-w-lg sm:mb-8 sm:h-32 md:max-w-2xl">
      {videos.slice(0, 4).map((video, i) => (
        <motion.div
          key={`fan-${video.id}`}
          className="absolute overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10"
          style={{
            left: `${8 + i * 20}%`,
            top: `${4 + (i % 2) * 8}px`,
            width: `${72 - i * 6}px`,
            rotate: `${(i - 1.5) * 14}deg`,
            zIndex: i,
            opacity: 0.35 - i * 0.04,
          }}
          animate={{ y: [0, i % 2 === 0 ? -4 : 4, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt="" className="aspect-[9/16] w-full object-cover" />
          ) : (
            <div className="aspect-[9/16] w-full bg-primary/40" />
          )}
        </motion.div>
      ))}
    </div>
  )
}

export function TikTokAutoplayStrip({
  videos,
  onVideoClick,
  className,
  embedded = false,
  hideHeader = false,
  muted: mutedProp,
  onMutedChange,
}: TikTokAutoplayStripProps) {
  const { language } = useLanguage()
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [internalMuted, setInternalMuted] = useState(true)
  const isMuted = mutedProp ?? internalMuted
  const toggleMuted = () => {
    const next = !isMuted
    if (onMutedChange) onMutedChange(next)
    else setInternalMuted(next)
  }
  const sectionRef = useRef(null)
  const sectionInView = useInView(sectionRef, { amount: 0.15 })

  const clips = videos.slice(0, 5)

  useEffect(() => {
    if (!sectionInView || clips.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % clips.length)
    }, 14000)
    return () => clearInterval(timer)
  }, [sectionInView, clips.length])

  useEffect(() => {
    const el = mobileScrollRef.current
    if (!el) return

    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[]
      if (children.length === 0) return
      const center = el.scrollLeft + el.clientWidth / 2
      let closest = 0
      let minDist = Infinity
      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2
        const dist = Math.abs(center - childCenter)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      })
      setActiveIndex(closest)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [clips.length])

  useEffect(() => {
    const el = mobileScrollRef.current
    if (!el) return
    const child = el.children[activeIndex] as HTMLElement | undefined
    child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeIndex])

  if (clips.length === 0) return null

  const Wrapper = embedded ? 'div' : 'section'

  return (
    <Wrapper
      ref={sectionRef}
      className={cn(
        'relative overflow-hidden',
        embedded ? 'py-6 sm:py-8' : 'border-b border-white/5 py-10 md:py-16',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.14),transparent_65%)]" />
      <motion.div
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[80px]"
      />

      <div
        className={cn(
          'relative z-10',
          embedded ? 'px-4 sm:px-6' : 'container-max px-4 sm:px-6 lg:px-8'
        )}
      >
        {!hideHeader && (
        <div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Radio className="h-4 w-4 animate-pulse text-red-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                {language === 'am' ? 'አሁን ይጫወታል' : 'Now Playing'}
              </span>
            </div>
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
              {language === 'am' ? 'ቪዲዮዎችን በቀጥታ ይመልከቱ' : 'Watch Our Moves Live'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {language === 'am'
                ? 'አምስት ቪዲዮዎች በራስ-ሰር ይጫወታሉ — ይሸብልሉ ወይም ሙሉ ማያ ገፅ ይክፈቱ'
                : 'Five clips auto-play — swipe, tap a phone, or open full screen'}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleMuted}
            className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-gray-300 backdrop-blur-sm transition hover:bg-white/10"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isMuted
              ? language === 'am'
                ? 'ድምፅ አብራ'
                : 'Unmute'
              : language === 'am'
                ? 'ድምፅ አጥፋ'
                : 'Mute'}
          </button>
        </div>
        )}

        <DecorativeFan videos={clips} />

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#030712] to-transparent sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#030712] to-transparent sm:w-12" />

          <div
            ref={mobileScrollRef}
            className="flex gap-4 overflow-x-auto px-2 pb-4 snap-x snap-mandatory scrollbar-hide sm:justify-center sm:gap-5 md:gap-5"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {clips.map((video, index) => (
              <AutoplayPhone
                key={video.id}
                video={video}
                isActive={activeIndex === index}
                isMuted={isMuted}
                index={index}
                playAllInView
                onSelect={() => setActiveIndex(index)}
                onExpand={() => onVideoClick?.(video)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {clips.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                activeIndex === i ? 'w-7 bg-primary' : 'w-2 bg-white/25'
              )}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  )
}
