'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Phone, MessageCircle, FileText, ShieldCheck, Truck, MapPin, Activity, ChevronDown } from 'lucide-react'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { ADDIS_PREMIUM_CONTACT, ADDIS_PREMIUM_WHATSAPP_MESSAGES } from '@/lib/addis-premium-config'
import { ADDIS_PREMIUM_IMAGES, ADDIS_HERO_TRUST_CHIPS, ADDIS_FLOATING_STATUS } from '@/lib/addis-premium-data'
import { cn } from '@/lib/utils'
import { ParticleStreaks, GlassPanel } from './ui'

export function AddisPremiumHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yBg = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]), {
    stiffness: 90,
    damping: 28,
  })
  const yContent = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]), {
    stiffness: 70,
    damping: 22,
  })
  const fade = useTransform(scrollYProgress, [0, 0.45], [1, 0.35])

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] overflow-hidden bg-[#030712] pt-20 text-white sm:pt-[5.25rem]"
      aria-labelledby="addis-hero-heading"
    >
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <Image
          src={ADDIS_PREMIUM_IMAGES.hero}
          alt="People unloading furniture from a moving truck in an urban street setting"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#030712]/93 via-[#0b1530]/88 to-[#1a0a04]/75"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_0%_0%,rgba(59,130,246,0.28),transparent_50%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_100%_100%,rgba(234,88,12,0.18),transparent_55%)]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.03)_45%,transparent_55%,transparent_100%)] bg-[length:200%_100%] motion-safe:animate-addis-shimmer-bg" aria-hidden />
        <ParticleStreaks />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[1440px] flex-col px-4 pb-28 pt-8 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:px-10 lg:pb-24 lg:pt-12">
        <motion.div style={{ y: yContent }} className="flex flex-1 flex-col justify-center">
          <div className="relative border-l-2 border-orange-500/70 pl-6 sm:pl-8">
            <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.38em] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]" />
              Addis Ababa · Megenagna HQ
            </p>
            <h1
              id="addis-hero-heading"
              className="max-w-[22ch] text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl sm:leading-[1.02] lg:max-w-none lg:text-6xl xl:text-[4.25rem]"
            >
              <span className="block bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent">
                Relocation, elevated.
              </span>
              <span className="mt-3 block bg-gradient-to-br from-white via-slate-50 to-slate-500 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
                Premium moving in Addis Ababa
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-slate-300/95 sm:text-lg">
              Home and office moves, packing crews, loading and unloading, insured transport, and careful furniture
              handling — run with logistics discipline, not guesswork.
            </p>
            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-2 border-t border-white/10 pt-6 text-center sm:flex sm:max-w-xl sm:gap-10 sm:text-left">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Response</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums text-white sm:text-xl">&lt; 2h</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Dispatch</dt>
                <dd className="mt-1 text-sm font-semibold text-white sm:text-xl">Live</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Coverage</dt>
                <dd className="mt-1 text-sm font-semibold text-white sm:text-xl">Citywide</dd>
              </div>
            </dl>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#addis-contact"
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#f59e0b] px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(234,88,12,0.35)]',
                  'ring-1 ring-orange-200/25 transition hover:shadow-[0_24px_60px_rgba(234,88,12,0.45)] motion-safe:animate-addis-glow-pulse',
                )}
                onClick={() =>
                  trackEvent({ action: 'premium_landing_cta', category: 'cta', label: 'Get Free Quote' })
                }
              >
                <FileText className="h-4 w-4" aria-hidden />
                Get free quote
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href={generateCallLink(ADDIS_PREMIUM_CONTACT.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.07] px-6 py-4 text-sm font-semibold text-white shadow-inner backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.11]"
                onClick={() =>
                  trackEvent({ action: 'premium_landing_cta', category: 'cta', label: 'Call Now' })
                }
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call now
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href={generateWhatsAppLink(ADDIS_PREMIUM_CONTACT.whatsapp, ADDIS_PREMIUM_WHATSAPP_MESSAGES.quote)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-500/[0.12] px-6 py-4 text-sm font-semibold text-emerald-50 shadow-inner backdrop-blur-md transition hover:bg-emerald-500/[0.18]"
                onClick={() =>
                  trackEvent({ action: 'premium_landing_cta', category: 'cta', label: 'WhatsApp' })
                }
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </motion.div>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2.5" aria-label="Trust highlights">
            {ADDIS_HERO_TRUST_CHIPS.map((label) => (
              <li
                key={label}
                className="rounded-full border border-white/12 bg-gradient-to-b from-white/[0.12] to-white/[0.03] px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md sm:text-xs"
              >
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="relative mt-12 flex flex-1 flex-col justify-center lg:mt-0 lg:max-w-md">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <GlassPanel className="relative overflow-hidden rounded-[1.35rem] p-6 ring-1 ring-white/20 sm:p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-orange-500/15 blur-3xl" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Live logistics
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Dispatch board
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/30">
                  <Activity className="h-3.5 w-3.5" aria-hidden />
                  Active
                </span>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-200">
                <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/25 px-3.5 py-3 shadow-inner backdrop-blur-sm">
                  <span className="flex items-center gap-2.5 text-slate-300">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-400/25">
                      <MapPin className="h-4 w-4 text-sky-300" aria-hidden />
                    </span>
                    Route
                  </span>
                  <span className="text-right text-xs font-semibold tracking-wide text-white">{ADDIS_FLOATING_STATUS.route}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/25 px-3.5 py-3 shadow-inner backdrop-blur-sm">
                  <span className="flex items-center gap-2.5 text-slate-300">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 ring-1 ring-orange-400/25">
                      <Truck className="h-4 w-4 text-orange-200" aria-hidden />
                    </span>
                    Fleet
                  </span>
                  <span className="text-xs font-semibold text-white">{ADDIS_FLOATING_STATUS.load}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/25 px-3.5 py-3 shadow-inner backdrop-blur-sm">
                  <span className="flex items-center gap-2.5 text-slate-300">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-400/25">
                      <ShieldCheck className="h-4 w-4 text-amber-100" aria-hidden />
                    </span>
                    Status
                  </span>
                  <span className="text-xs font-semibold text-emerald-300">{ADDIS_FLOATING_STATUS.eta}</span>
                </div>
              </div>
              <svg
                className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 text-white/10"
                viewBox="0 0 100 100"
                aria-hidden
              >
                <motion.path
                  d="M5 80 Q 40 20 95 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
                />
              </svg>
            </GlassPanel>

            <motion.div
              aria-hidden
              className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl sm:block"
              animate={reduce ? {} : { opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="absolute -bottom-10 -right-4 h-28 w-28 rounded-full bg-orange-500/20 blur-3xl"
              animate={reduce ? {} : { opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2"
          >
            <div className="rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 text-xs text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md motion-safe:animate-addis-float-y">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Next window</p>
              <p className="mt-1.5 text-base font-semibold tracking-tight text-white">Today · PM crew</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 text-xs text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md motion-safe:animate-addis-float-y [animation-delay:0.45s]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Coverage</p>
              <p className="mt-1.5 text-base font-semibold tracking-tight text-white">Megenagna HQ</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-[8] hidden -translate-x-1/2 flex-col items-center gap-1 text-slate-500 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">Explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="h-5 w-5 text-orange-400/80" aria-hidden />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-44 bg-gradient-to-t from-[#020617] via-[#020617]/85 to-transparent" />
    </section>
  )
}
