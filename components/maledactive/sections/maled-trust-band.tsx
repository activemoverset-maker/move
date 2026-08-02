'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Award, Clock, Smile, Truck } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'
import { MALED_STATS } from '@/lib/maledactive-data'
import { MaledReveal } from '@/components/maledactive/motion/maled-reveal'

const STAT_ICONS = [Truck, Smile, Award, Clock] as const

export function MaledTrustBand() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#060a12] py-14 sm:py-16"
      aria-label="Company statistics"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(245,158,11,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <MaledReveal>
          <div className="rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-10">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
              {MALED_STATS.map((stat, i) => {
                const Icon = STAT_ICONS[i]
                return (
                  <div
                    key={stat.label}
                    className="relative text-center lg:border-l lg:border-white/[0.06] lg:pl-8 lg:text-left first:lg:border-l-0 first:lg:pl-0"
                  >
                    <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 lg:mx-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-3xl font-bold tabular-nums text-transparent sm:text-4xl lg:text-5xl">
                      <CountUp end={stat.value} inView={inView} suffix={stat.suffix} />
                    </p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </MaledReveal>
      </div>
    </section>
  )
}
