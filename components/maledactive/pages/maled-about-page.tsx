'use client'

import { MALED_VALUES } from '@/lib/maledactive-data'
import { MALED_SITE } from '@/lib/maledactive-config'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledReveal, MaledStagger, MaledStaggerItem } from '@/components/maledactive/motion/maled-reveal'
import { MaledCta } from '@/components/maledactive/sections/maled-cta'

export function MaledAboutPage() {
  return (
    <>
      <section className="bg-[#0a0f1a] pb-8 pt-28 sm:pt-32" aria-labelledby="maled-about-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <MaledReveal className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">About us</p>
            <h1 id="maled-about-heading" className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your trusted moving partner in Addis Ababa
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              {MALED_SITE.name} was built on a simple promise: make every move smooth, safe, and
              stress-free. From packing fragile items to coordinating full office relocations, our team
              brings professionalism and care to every job.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              We serve families, professionals, and businesses across Addis Ababa with reliable crews,
              honest communication, and competitive pricing. When you work with us, you get a partner
              who treats your belongings — and your time — with respect.
            </p>
          </MaledReveal>
        </div>
      </section>

      <section className="bg-[#060a12] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <MaledReveal className="mb-10">
            <h2 className="text-2xl font-semibold text-white">Our values</h2>
          </MaledReveal>
          <MaledStagger className="grid gap-5 md:grid-cols-3">
            {MALED_VALUES.map((value) => (
              <MaledStaggerItem key={value.title}>
                <MaledGlassPanel className="h-full p-6">
                  <h3 className="text-lg font-semibold text-amber-400">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{value.description}</p>
                </MaledGlassPanel>
              </MaledStaggerItem>
            ))}
          </MaledStagger>
        </div>
      </section>

      <MaledCta />
    </>
  )
}
