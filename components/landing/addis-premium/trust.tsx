'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { ADDIS_PREMIUM_STATS, ADDIS_PREMIUM_TRUST_POINTS } from '@/lib/addis-premium-data'
import { Reveal, useCountUp } from './ui'

function StatCard({
  label,
  value,
  suffix,
  delay,
}: {
  label: string
  value: number
  suffix: string
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const count = useCountUp(value, 1600, inView)
  const reduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.35rem] border border-white/[0.14] bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/25 blur-2xl transition-opacity group-hover:opacity-100" />
      <p className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="relative mt-5 text-4xl font-semibold tabular-nums tracking-tight text-white sm:text-5xl">
        {count}
        <span className="bg-gradient-to-r from-orange-200 to-amber-100 bg-clip-text text-transparent">{suffix}</span>
      </p>
    </motion.div>
  )
}

export function AddisPremiumTrust() {
  return (
    <section
      id="addis-trust"
      className="scroll-mt-[5.5rem] relative overflow-hidden bg-[#020617] py-28 text-white sm:py-36"
      aria-labelledby="addis-trust-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_15%_-15%,rgba(59,130,246,0.26),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_100%_100%,rgba(234,88,12,0.16),transparent_52%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(92vw,760px)] w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045] opacity-50" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(72vw,560px)] w-[min(72vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-slate-500">Why us</p>
            <h2
              id="addis-trust-heading"
              className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.06]"
            >
              Execution you can brief once — then watch land cleanly
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400">
              Disciplined crews, maintained fleet, and clear communication protocols — so your move reads as controlled
              operations: insured, scheduled, and quietly high-end.
            </p>
            <ul className="mt-12 grid gap-3 sm:grid-cols-2" role="list">
              {ADDIS_PREMIUM_TRUST_POINTS.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-white/[0.12] hover:bg-white/[0.06]"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {ADDIS_PREMIUM_STATS.map((s, i) => (
              <StatCard key={s.label} {...s} delay={0.08 * i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
