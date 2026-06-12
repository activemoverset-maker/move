'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ADDIS_PREMIUM_PROCESS } from '@/lib/addis-premium-data'
import { Reveal } from './ui'

export function AddisPremiumProcess() {
  const reduce = useReducedMotion()

  return (
    <section
      id="addis-process"
      className="scroll-mt-[5.5rem] relative overflow-hidden bg-white py-24 sm:py-32"
      aria-labelledby="addis-process-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(226 232 240) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-100 to-transparent blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-500">Process</p>
          <h2
            id="addis-process-heading"
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl"
          >
            A single timeline — no ambiguity at hand-off
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Five orchestrated steps from first message to placement — each gate owned by a lead coordinator.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-20 max-w-3xl">
          <div
            className="absolute left-[1.25rem] top-4 bottom-4 w-px bg-gradient-to-b from-blue-600/50 via-slate-200 to-orange-400/50 sm:left-8"
            aria-hidden
          />
          <ol className="relative space-y-12">
            {ADDIS_PREMIUM_PROCESS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05}>
                <li className="relative flex gap-6 sm:gap-10">
                  <motion.div
                    initial={reduce ? false : { scale: 0.88, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-900 shadow-lg shadow-slate-900/10 ring-4 ring-slate-100 sm:h-14 sm:w-14 sm:text-sm"
                  >
                    {i + 1}
                  </motion.div>
                  <div className="flex-1 rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_2px_0_rgba(15,23,42,0.04),0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-md transition hover:border-slate-300 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Phase {step.step}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
