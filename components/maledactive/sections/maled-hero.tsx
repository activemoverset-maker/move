'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react'
import { MALED_ASSETS, MALED_SITE, MALED_WHATSAPP_MESSAGES } from '@/lib/maledactive-config'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledParticleStreaks } from '@/components/maledactive/motion/maled-ui'

function maledPath(href: string) {
  return `/sites/maledactive${href}`
}

const FLOATING_STATS = [
  { icon: Star, label: '4.9 rating', sub: 'Trusted locally' },
  { icon: Truck, label: '500+ moves', sub: 'Addis Ababa' },
  { icon: Clock, label: 'Same-day', sub: 'When urgent' },
] as const

export function MaledHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yFloat = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 48]), {
    stiffness: 80,
    damping: 24,
  })
  const imageScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06]), {
    stiffness: 60,
    damping: 20,
  })

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] overflow-hidden bg-[#04070d] pt-20 text-white sm:pt-24"
      aria-labelledby="maled-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 maled-grid-bg opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_10%_-10%,rgba(245,158,11,0.22),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_95%_30%,rgba(56,189,248,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#04070d_0%,transparent_30%,#060a12_100%)]" />
        <MaledParticleStreaks />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-10 px-4 pb-32 pt-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-8">
        <div className="order-2 lg:order-1">
          <motion.p
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-amber-400/20 bg-gradient-to-r from-amber-500/15 to-amber-600/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:text-[11px]"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </span>
            Addis Ababa · Professional Movers
          </motion.p>

          <h1
            id="maled-hero-heading"
            className="text-[2.75rem] font-bold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem]"
          >
            <motion.span
              className="block text-slate-500"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              Your move,
            </motion.span>
            <motion.span
              className="mt-1 block bg-gradient-to-br from-white via-amber-50 to-amber-400 bg-clip-text text-transparent drop-shadow-sm"
              initial={reduce ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              handled with care.
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-slate-400"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6 }}
          >
            {MALED_SITE.tagline}. Trained crews, honest quotes, and smooth relocations across
            Addis Ababa — homes and offices alike.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              href={maledPath('/contact')}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 px-8 py-4 text-sm font-bold text-[#0a0f1a] shadow-[0_4px_0_0_rgba(180,83,9,0.5),0_12px_40px_rgba(245,158,11,0.35)] transition hover:brightness-105 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(180,83,9,0.5)]"
            >
              Get a Free Quote
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <a
              href={generateWhatsAppLink(
                MALED_SITE.contact.whatsapp,
                decodeURIComponent(MALED_WHATSAPP_MESSAGES.quote),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-7 py-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              WhatsApp
            </a>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-8"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62, duration: 0.6 }}
          >
            <a
              href={generateCallLink(MALED_SITE.contact.phone)}
              className="col-span-2 flex items-center gap-3 transition hover:opacity-90 sm:col-span-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 text-amber-400 ring-1 ring-amber-500/20">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Call us
                </span>
                <span className="text-lg font-bold text-white">{MALED_SITE.contact.phoneDisplay}</span>
              </span>
            </a>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-600/5 text-sky-400 ring-1 ring-sky-500/20">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Based in
                </span>
                <span className="font-bold text-white">Addis Ababa</span>
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ y: yFloat }}
          className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none"
        >
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-amber-500/25 via-amber-600/5 to-sky-500/15 blur-3xl"
              aria-hidden
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.12] p-1 shadow-[0_32px_100px_rgba(0,0,0,0.65)]">
              <div className="relative overflow-hidden rounded-[1.65rem]">
                <motion.div style={{ scale: imageScale }} className="relative aspect-[5/4] sm:aspect-[4/3]">
                  <Image
                    src={MALED_ASSETS.hero}
                    alt="Maledactive Movers truck"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 90vw, 45vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04070d] via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#04070d]/50 via-transparent to-amber-500/10" />
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0a0f1a]/75 p-4 backdrop-blur-2xl sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-white">Fully insured</p>
                        <p className="text-xs text-slate-400">Residential & commercial</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/30">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop floating badges */}
            <div className="hidden lg:block">
              {FLOATING_STATS.map((stat, i) => {
                const Icon = stat.icon
                const positions = [
                  'absolute -left-8 top-12 z-10',
                  'absolute -right-10 top-[38%] z-10',
                  'absolute -left-6 bottom-32 z-10',
                ]
                return (
                  <motion.div
                    key={stat.label}
                    className={positions[i]}
                    animate={reduce ? undefined : { y: [0, -6, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                  >
                    <MaledGlassPanel className="flex items-center gap-3 px-4 py-3 shadow-2xl ring-1 ring-white/10">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs font-bold text-white">{stat.label}</span>
                        <span className="block text-[10px] text-slate-500">{stat.sub}</span>
                      </span>
                    </MaledGlassPanel>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Mobile stats row */}
          <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
            {FLOATING_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <MaledGlassPanel key={stat.label} className="px-2 py-3 text-center">
                  <Icon className="mx-auto h-4 w-4 text-amber-400" />
                  <p className="mt-1.5 text-[10px] font-bold leading-tight text-white">{stat.label}</p>
                </MaledGlassPanel>
              )
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 lg:bottom-10 lg:block"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="flex flex-col items-center gap-1 text-slate-600">
          <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5" aria-hidden />
        </span>
      </motion.div>
    </section>
  )
}
