'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { ADDIS_PREMIUM_TESTIMONIALS } from '@/lib/addis-premium-data'
import { Reveal, GlassPanel } from './ui'
import { cn } from '@/lib/utils'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/)
  const a = parts[0]?.[0] ?? ''
  const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : (parts[0]?.[1] ?? '')
  return (a + b).toUpperCase()
}

export function AddisPremiumTestimonials() {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const t = ADDIS_PREMIUM_TESTIMONIALS[index]

  const avatarStyle = useMemo(() => {
    const hues = [210, 24, 160, 200]
    const h = hues[index % hues.length]
    return {
      background: `linear-gradient(135deg, hsl(${h} 70% 42%), hsl(${(h + 40) % 360} 65% 35%))`,
    }
  }, [index])

  const next = () => setIndex((i) => (i + 1) % ADDIS_PREMIUM_TESTIMONIALS.length)
  const prev = () =>
    setIndex((i) => (i - 1 + ADDIS_PREMIUM_TESTIMONIALS.length) % ADDIS_PREMIUM_TESTIMONIALS.length)

  return (
    <section
      id="addis-testimonials"
      className="scroll-mt-[5.5rem] relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-[#f4f6f8] py-24 sm:py-32"
      aria-labelledby="addis-testimonials-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Reveal className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-500">Client stories</p>
            <h2
              id="addis-testimonials-heading"
              className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl"
            >
              Operators and residents — same bar for quality
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-600/20 via-orange-500/15 to-slate-300/25 p-[1px] shadow-[0_40px_100px_rgba(15,23,42,0.1)]">
            <GlassPanel className="rounded-[1.7rem] border-slate-200/60 bg-white/90 p-8 shadow-none before:via-slate-300/25 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={reduce ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -28 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center"
              >
                <div
                  className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl text-2xl font-semibold tracking-tight text-white shadow-inner ring-2 ring-white/30 md:mx-0"
                  style={avatarStyle}
                  aria-hidden
                >
                  {initialsFromName(t.name)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                    ))}
                    <span className="sr-only">{t.rating} out of 5 stars</span>
                  </div>
                  <span
                    className="mt-4 block font-serif text-5xl leading-none text-slate-200/90 sm:text-6xl"
                    aria-hidden
                  >
                    “
                  </span>
                  <blockquote className="-mt-2 text-xl font-medium leading-relaxed tracking-tight text-slate-900 sm:text-2xl">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{t.name}</span>
                    <span className="text-slate-400"> · </span>
                    <span>{t.role}</span>
                  </figcaption>
                </div>
              </motion.div>
            </AnimatePresence>
            </GlassPanel>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {ADDIS_PREMIUM_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-10 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
