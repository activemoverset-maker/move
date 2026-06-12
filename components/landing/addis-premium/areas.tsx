'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Route } from 'lucide-react'
import { ADDIS_PREMIUM_AREAS } from '@/lib/addis-premium-data'
import { Reveal } from './ui'
import { cn } from '@/lib/utils'

export function AddisPremiumAreas() {
  const patternId = `addis-map-${useId().replace(/:/g, '')}`

  return (
    <section
      id="addis-areas"
      className="scroll-mt-[5.5rem] relative overflow-hidden bg-[#030712] py-24 text-white sm:py-32"
      aria-labelledby="addis-areas-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]" aria-hidden>
        <defs>
          <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-500">Service areas</p>
          <h2
            id="addis-areas-heading"
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            Citywide coverage — dispatch from Megenagna
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            Rapid crew routing across core Addis corridors — hubbed at Megenagna (መገናኛ) with the same service standard
            in every listed district.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[72%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-orange-400/35 to-transparent lg:block"
            initial={{ opacity: 0, scaleX: 0.35 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          {ADDIS_PREMIUM_AREAS.map((area, i) => (
            <Reveal key={area.name} delay={i * 0.03} y={12}>
              <motion.article
                whileHover={{ y: -5, transition: { type: 'spring', stiffness: 420, damping: 26 } }}
                className={cn(
                  'relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl transition-shadow hover:shadow-[0_0_0_1px_rgba(251,191,36,0.3)]',
                  area.featured &&
                    'ring-1 ring-amber-400/45 shadow-[0_0_60px_rgba(251,191,36,0.14)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.12),transparent_55%)]',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{area.name}</h3>
                    {area.script ? (
                      <p className="mt-1 text-sm text-amber-200/95" lang="am">
                        {area.script}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]',
                      area.featured && 'border-amber-400/55 bg-amber-500/15 text-amber-100',
                    )}
                  >
                    {area.featured ? <Route className="h-4 w-4" aria-hidden /> : <MapPin className="h-4 w-4" aria-hidden />}
                  </span>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  {area.featured ? 'Head office & dispatch' : 'Same-day crew availability'}
                </p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
