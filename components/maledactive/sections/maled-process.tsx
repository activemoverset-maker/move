'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MALED_PROCESS_STEPS } from '@/lib/maledactive-data'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledSectionHeader } from '@/components/maledactive/ui/maled-section-header'

export function MaledProcess() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineScale = useTransform(scrollYProgress, [0.15, 0.65], [0, 1])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#04070d] py-20 sm:py-28"
      aria-labelledby="maled-process-heading"
    >
      <div className="pointer-events-none absolute inset-0 maled-grid-bg opacity-30" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_50%,rgba(56,189,248,0.07),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <MaledSectionHeader
          id="maled-process-heading"
          eyebrow="How it works"
          title="Four steps to a stress-free move"
          description="Simple, transparent, and designed to keep you informed at every stage."
          align="center"
          className="mb-16"
        />

        <div className="relative">
          <div className="absolute left-0 right-0 top-[2.85rem] hidden h-px bg-white/[0.08] lg:block" aria-hidden>
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600/50"
              style={{ scaleX: reduce ? 1 : lineScale }}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {MALED_PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={reduce ? false : { opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : reduce ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <MaledGlassPanel className="group relative h-full overflow-hidden p-6 transition hover:border-amber-500/20 lg:pt-10">
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl opacity-0 transition group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="relative z-10 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-black text-[#0a0f1a] shadow-lg shadow-amber-500/30">
                    {step.step}
                  </span>
                  <h3 className="relative z-10 text-lg font-bold text-white">{step.title}</h3>
                  <p className="relative z-10 mt-2.5 text-sm leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </MaledGlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
