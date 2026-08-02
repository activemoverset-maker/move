'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { MALED_SERVICES } from '@/lib/maledactive-data'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledReveal, MaledStagger, MaledStaggerItem } from '@/components/maledactive/motion/maled-reveal'
import { MaledSectionHeader } from '@/components/maledactive/ui/maled-section-header'

function maledPath(href: string) {
  return `/sites/maledactive${href}`
}

export function MaledServicesPreview() {
  const reduce = useReducedMotion()
  const [featured, ...rest] = MALED_SERVICES
  const FeaturedIcon = featured.icon

  return (
    <section className="relative bg-[#060a12] py-20 sm:py-28" aria-labelledby="maled-services-heading">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(56,189,248,0.06),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <MaledSectionHeader
            id="maled-services-heading"
            eyebrow="What we do"
            title="Everything you need for a smooth move"
            description="Homes, offices, and everything in between — one team, one plan, zero guesswork."
            className="mb-0"
          />
          <MaledReveal delay={0.1}>
            <Link
              href={maledPath('/services')}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-amber-500/30 hover:bg-white/[0.07]"
            >
              All services
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </Link>
          </MaledReveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <MaledReveal className="lg:col-span-5">
            <motion.div whileHover={reduce ? undefined : { y: -6 }} transition={{ duration: 0.3 }}>
              <MaledGlassPanel className="group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden border-amber-500/10 p-8 sm:p-10">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl transition group-hover:bg-amber-500/25"
                  aria-hidden
                />
                <div className="relative">
                  <span className="inline-flex rounded-2xl bg-gradient-to-br from-amber-400/25 to-amber-600/10 p-4 text-amber-300 ring-1 ring-amber-500/25">
                    <FeaturedIcon className="h-8 w-8" />
                  </span>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500/80">
                    Most popular
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{featured.title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{featured.description}</p>
                  <ul className="mt-6 space-y-2.5">
                    {featured.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] text-amber-400">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={maledPath('/services')}
                  className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold text-amber-400 transition hover:text-amber-300"
                >
                  Learn more
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </MaledGlassPanel>
            </motion.div>
          </MaledReveal>

          <MaledStagger className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {rest.map((service, index) => {
              const Icon = service.icon
              return (
                <MaledStaggerItem key={service.id}>
                  <motion.div whileHover={reduce ? undefined : { y: -5 }} transition={{ duration: 0.25 }}>
                    <MaledGlassPanel className="group relative h-full overflow-hidden p-6 transition hover:border-white/15 hover:bg-white/[0.06] sm:p-7">
                      <span className="absolute right-4 top-4 text-5xl font-black text-white/[0.03] transition group-hover:text-amber-500/[0.06]">
                        {String(index + 2).padStart(2, '0')}
                      </span>
                      <span className="inline-flex rounded-xl bg-white/[0.05] p-3 text-amber-400 ring-1 ring-white/10 transition group-hover:ring-amber-500/20">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-5 text-lg font-bold text-white">{service.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-3">
                        {service.description}
                      </p>
                    </MaledGlassPanel>
                  </motion.div>
                </MaledStaggerItem>
              )
            })}
          </MaledStagger>
        </div>
      </div>
    </section>
  )
}
