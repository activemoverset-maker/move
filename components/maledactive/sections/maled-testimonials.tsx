'use client'

import { Quote, Star } from 'lucide-react'
import { MALED_TESTIMONIALS } from '@/lib/maledactive-data'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledStagger, MaledStaggerItem } from '@/components/maledactive/motion/maled-reveal'
import { MaledSectionHeader } from '@/components/maledactive/ui/maled-section-header'

export function MaledTestimonials() {
  const [featured, ...others] = MALED_TESTIMONIALS

  return (
    <section className="relative bg-[#060a12] py-20 sm:py-28" aria-labelledby="maled-testimonials-heading">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_100%,rgba(245,158,11,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <MaledSectionHeader
          id="maled-testimonials-heading"
          eyebrow="Testimonials"
          title="Real moves. Real feedback."
          className="mb-14"
        />

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MaledGlassPanel className="relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden border-amber-500/10 p-8 sm:min-h-[320px] sm:p-10">
              <Quote className="absolute -right-4 -top-4 h-32 w-32 text-amber-500/[0.07]" aria-hidden />
              <div className="relative">
                <div className="mb-6 flex gap-1">
                  {Array.from({ length: featured.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-xl font-medium leading-snug text-white sm:text-2xl sm:leading-snug">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
              </div>
              <footer className="relative mt-8 flex items-center gap-4 border-t border-white/[0.08] pt-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 text-lg font-black text-[#0a0f1a] shadow-lg shadow-amber-500/25">
                  {featured.name.charAt(0)}
                </span>
                <div>
                  <p className="text-lg font-bold text-white">{featured.name}</p>
                  <p className="text-sm text-slate-500">{featured.service}</p>
                </div>
              </footer>
            </MaledGlassPanel>
          </div>

          <MaledStagger className="grid gap-5 lg:col-span-5">
            {others.map((item) => (
              <MaledStaggerItem key={item.id}>
                <MaledGlassPanel className="flex h-full flex-col p-6 transition hover:border-white/15 sm:p-7">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-slate-300">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-5 border-t border-white/[0.06] pt-4">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.service}</p>
                  </footer>
                </MaledGlassPanel>
              </MaledStaggerItem>
            ))}
          </MaledStagger>
        </div>
      </div>
    </section>
  )
}
