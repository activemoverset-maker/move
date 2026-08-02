'use client'

import { MALED_SITE } from '@/lib/maledactive-config'
import { MaledReveal } from '@/components/maledactive/motion/maled-reveal'

export function MaledLegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-[#0a0f1a] pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <MaledReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
          <div className="prose prose-invert mt-8 max-w-none text-slate-400 prose-headings:text-white prose-a:text-amber-400">
            {children}
          </div>
          <p className="mt-12 text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            <br />
            Contact: {MALED_SITE.contact.email}
          </p>
        </MaledReveal>
      </div>
    </section>
  )
}
