'use client'

import { CheckCircle2, Headphones, Package, Users } from 'lucide-react'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledStagger, MaledStaggerItem } from '@/components/maledactive/motion/maled-reveal'
import { MaledSectionHeader } from '@/components/maledactive/ui/maled-section-header'

const REASONS = [
  {
    icon: Users,
    title: 'Trained moving crews',
    description: 'Experienced teams who handle furniture, appliances, and fragile items with real care.',
    accent: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]',
    iconBg: 'from-amber-500/20 to-amber-600/5',
  },
  {
    icon: Package,
    title: 'Packing done right',
    description: 'Quality materials and proper techniques so nothing arrives scratched or broken.',
    accent: 'group-hover:shadow-[0_0_40px_rgba(56,189,248,0.12)]',
    iconBg: 'from-sky-500/20 to-sky-600/5',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent pricing',
    description: 'Clear quotes upfront — no surprise fees on moving day.',
    accent: 'group-hover:shadow-[0_0_40px_rgba(52,211,153,0.12)]',
    iconBg: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    icon: Headphones,
    title: 'Responsive support',
    description: 'Reach us by phone or WhatsApp. We answer fast and keep you updated.',
    accent: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]',
    iconBg: 'from-violet-500/20 to-violet-600/5',
  },
] as const

export function MaledWhyUs() {
  return (
    <section className="relative overflow-hidden bg-[#04070d] py-20 sm:py-28" aria-labelledby="maled-why-heading">
      <div className="pointer-events-none absolute inset-0 maled-grid-bg opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(245,158,11,0.1),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <MaledSectionHeader
            id="maled-why-heading"
            eyebrow="Why Maledactive"
            title="A moving company that shows up prepared"
            description="We built Maledactive around what customers care about most: reliability, careful handling, and communication you can count on from the first call to the last box."
          />

          <MaledStagger className="grid gap-4 sm:grid-cols-2">
            {REASONS.map((item) => {
              const Icon = item.icon
              return (
                <MaledStaggerItem key={item.title}>
                  <MaledGlassPanel
                    className={`group relative h-full overflow-hidden p-6 transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.06] ${item.accent}`}
                  >
                    <span
                      className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${item.iconBg} p-3.5 text-amber-300 ring-1 ring-white/10 transition group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  </MaledGlassPanel>
                </MaledStaggerItem>
              )
            })}
          </MaledStagger>
        </div>
      </div>
    </section>
  )
}
