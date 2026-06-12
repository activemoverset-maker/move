'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { ADDIS_PREMIUM_IMAGES } from '@/lib/addis-premium-data'
import { Reveal } from './ui'

const GALLERY_CAPTIONS = [
  'Loading sealed cartons into a relocation truck',
  'Careful unload of wrapped furniture from the vehicle',
  'Fleet-ready moving truck and crew staging',
  'Warehouse shelving and boxed inventory in motion',
  'Logistics floor with staged crates and pallets',
  'Office floor transition — workstations and seating',
] as const

export function AddisPremiumShowcase() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: scrollerRef,
    offset: ['start end', 'end start'],
  })
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -72]), {
    stiffness: 76,
    damping: 28,
  })

  return (
    <section
      id="addis-showcase"
      className="scroll-mt-[5.5rem] relative overflow-hidden bg-[#020617] py-28 text-white sm:py-36"
      aria-labelledby="addis-showcase-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,7,18,0.85)_100%)]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-500">Field operations</p>
          <h2
            id="addis-showcase-heading"
            className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
          >
            From loading bay to hand-off — one visual language
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Scroll-staggered gallery with parallax drift. Imagery sourced from verified Unsplash relocation and
            logistics photography.
          </p>
        </Reveal>

        <div ref={scrollerRef} className="relative mt-16">
          <motion.div
            style={{ x }}
            className="flex gap-5 overflow-x-auto pb-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-7 [&::-webkit-scrollbar]:hidden"
          >
            {ADDIS_PREMIUM_IMAGES.gallery.map((src, idx) => (
              <motion.figure
                key={src}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="group relative min-w-[82vw] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/[0.06] sm:min-w-[58vw] lg:min-w-[44vw]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={src}
                    alt={GALLERY_CAPTIONS[idx] ?? 'Relocation and logistics photography'}
                    fill
                    className="object-cover transition duration-[900ms] ease-out group-hover:scale-[1.045]"
                    sizes="(max-width: 768px) 82vw, 42vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/95 via-[#030712]/35 to-transparent" />
                  <div className="absolute inset-0 opacity-0 mix-blend-soft-light transition duration-500 group-hover:opacity-100 bg-gradient-to-tr from-blue-500/25 to-orange-500/10" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400">
                      Sequence {String(idx + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">
                      {GALLERY_CAPTIONS[idx]}
                    </p>
                  </figcaption>
                </div>
              </motion.figure>
            ))}
          </motion.div>
          <p className="mt-3 text-center text-xs text-slate-500 sm:hidden">Swipe for more →</p>
        </div>
      </div>
    </section>
  )
}
