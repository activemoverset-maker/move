'use client'

import { MALED_SERVICES } from '@/lib/maledactive-data'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledReveal, MaledStagger, MaledStaggerItem } from '@/components/maledactive/motion/maled-reveal'
import { MaledCta } from '@/components/maledactive/sections/maled-cta'

export function MaledServicesPage() {
  return (
    <>
      <section className="bg-[#0a0f1a] pb-8 pt-28 sm:pt-32" aria-labelledby="maled-services-page-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <MaledReveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Services</p>
            <h1 id="maled-services-page-heading" className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Complete moving solutions
            </h1>
            <p className="mt-4 text-slate-400">
              Whether you&apos;re moving home or relocating your office, Maled Active provides end-to-end
              support with a professional crew and transparent pricing.
            </p>
          </MaledReveal>
        </div>
      </section>

      <section className="bg-[#0a0f1a] pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <MaledStagger className="space-y-6">
            {MALED_SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <MaledStaggerItem key={service.id}>
                  <MaledGlassPanel className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                      <div className="inline-flex shrink-0 rounded-2xl bg-amber-500/15 p-4 text-amber-400">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
                        <p className="mt-3 text-slate-400">{service.description}</p>
                        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </MaledGlassPanel>
                </MaledStaggerItem>
              )
            })}
          </MaledStagger>
        </div>
      </section>

      <MaledCta />
    </>
  )
}
