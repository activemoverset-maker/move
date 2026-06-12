'use client'

import { motion } from 'framer-motion'
import { ADDIS_PREMIUM_SERVICES } from '@/lib/addis-premium-data'
import { Reveal } from './ui'
import { cn } from '@/lib/utils'

export function AddisPremiumServices() {
  return (
    <section
      id="addis-services"
      className="scroll-mt-[5.5rem] relative overflow-hidden bg-[#f4f6f9] py-28 sm:py-36"
      aria-labelledby="addis-services-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.9),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
      <div className="pointer-events-none absolute -left-48 top-0 h-[560px] w-[560px] rounded-full bg-[conic-gradient(from_200deg_at_50%_50%,rgba(37,99,235,0.14),transparent,rgba(234,88,12,0.1))] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-sky-200/30 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-slate-500">Capabilities</p>
          <h2
            id="addis-services-heading"
            className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]"
          >
            Modular relocation lines — composed for Addis Ababa
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Combine residential, commercial, and logistics support in one coordinated scope — clear crew sizing,
            vehicle allocation, and timing you can plan around.
          </p>
        </Reveal>

        <div className="mt-20 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {ADDIS_PREMIUM_SERVICES.map((s, i) => {
            const Icon = s.icon
            const featured = i === 0
            const n = String(i + 1).padStart(2, '0')
            return (
              <Reveal
                key={s.title}
                delay={i * 0.035}
                y={18}
                className={cn(featured && 'sm:col-span-2 xl:col-span-2 xl:row-span-2')}
              >
                <motion.article
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 26 } }}
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white/90 p-7 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_28px_60px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-shadow duration-500',
                    'hover:border-slate-300/90 hover:shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_36px_80px_-16px_rgba(37,99,235,0.12)]',
                    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[1.75rem] before:p-px before:opacity-0 before:transition-opacity before:duration-500',
                    'before:bg-[linear-gradient(135deg,rgba(59,130,246,0.35),transparent_42%,rgba(251,146,60,0.28))]',
                    'hover:before:opacity-100',
                    featured && 'min-h-[300px] justify-between xl:min-h-0 xl:p-10',
                  )}
                >
                  <span className="pointer-events-none absolute right-5 top-5 font-mono text-4xl font-bold tabular-nums text-slate-200/80 transition-colors group-hover:text-slate-300/90">
                    {n}
                  </span>
                  <div className="pointer-events-none absolute -right-16 top-24 h-48 w-48 rounded-full bg-blue-500/[0.06] blur-3xl transition-opacity group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div
                      className={cn(
                        'relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1c3a] via-[#1e40af] to-[#172554] text-white shadow-[0_16px_40px_rgba(30,64,175,0.35)] ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-[1.05]',
                        featured ? 'h-[4.5rem] w-[4.5rem]' : 'h-14 w-14',
                      )}
                    >
                      <Icon className={featured ? 'h-9 w-9' : 'h-7 w-7'} aria-hidden />
                      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <span className="rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                      {featured ? 'Signature' : 'Line'}
                    </span>
                  </div>
                  <div className={cn('relative', featured && 'mt-10 flex-1 xl:mt-12')}>
                    <h3
                      className={cn(
                        'pr-14 font-semibold tracking-tight text-slate-950',
                        featured ? 'text-2xl sm:text-3xl lg:text-[2.15rem]' : 'mt-7 text-lg',
                      )}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={cn(
                        'leading-relaxed text-slate-600',
                        featured ? 'mt-5 max-w-xl text-base sm:text-lg' : 'mt-3 text-sm sm:text-[15px]',
                      )}
                    >
                      {s.description}
                    </p>
                  </div>
                  <div className="relative mt-7 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-800/85 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="h-px w-10 bg-gradient-to-r from-blue-600 to-orange-500" />
                    Scope planning included
                  </div>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
