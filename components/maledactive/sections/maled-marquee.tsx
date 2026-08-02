'use client'

import { MapPin } from 'lucide-react'

const AREAS = [
  'Bole',
  'Megenagna',
  'Kazanchis',
  'CMC',
  'Piassa',
  'Sarbet',
  'Gerji',
  'Lebu',
  'Summit',
  'Ayat',
  'All Addis Ababa',
] as const

function MarqueeTrack() {
  const items = [...AREAS, ...AREAS]
  return (
    <div className="flex shrink-0 items-center gap-3 pr-3">
      {items.map((area, i) => (
        <span key={`${area}-${i}`} className="flex shrink-0 items-center gap-3">
          <span className="whitespace-nowrap text-sm font-medium text-slate-300">{area}</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-amber-500/60" aria-hidden />
        </span>
      ))}
    </div>
  )
}

export function MaledMarquee() {
  return (
    <section
      className="relative border-y border-white/10 bg-[#04070d]/90 py-4 backdrop-blur-md"
      aria-label="Service areas"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#04070d] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#04070d] to-transparent sm:w-24" />

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 sm:flex">
          <MapPin className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200">We serve</span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-maled-marquee motion-reduce:animate-none">
            <MarqueeTrack />
            <MarqueeTrack />
          </div>
        </div>
      </div>
    </section>
  )
}
