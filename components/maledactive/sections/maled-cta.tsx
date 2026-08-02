'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { MALED_ASSETS, MALED_SITE, MALED_WHATSAPP_MESSAGES } from '@/lib/maledactive-config'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledReveal } from '@/components/maledactive/motion/maled-reveal'

function maledPath(href: string) {
  return `/sites/maledactive${href}`
}

export function MaledCta() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-[#060a12] py-20 sm:py-28" aria-labelledby="maled-cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MaledReveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
            {/* Background image */}
            <div className="absolute inset-0" aria-hidden>
              <Image
                src={MALED_ASSETS.hero}
                alt=""
                fill
                className="object-cover object-center scale-105 blur-sm"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-[#060a12]/88" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060a12]/95 via-[#060a12]/80 to-amber-950/40" />
            </div>

            <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16 lg:p-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Get started</p>
                <h2
                  id="maled-cta-heading"
                  className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
                >
                  Ready to move? Let&apos;s plan it together.
                </h2>
                <p className="mt-4 max-w-lg text-base text-slate-400">
                  Call, WhatsApp, or send a quick message — we&apos;ll get back to you with a quote and
                  a clear moving plan.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={maledPath('/contact')}
                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 px-7 py-4 text-sm font-bold text-[#0a0f1a] shadow-lg shadow-amber-500/30"
                  >
                    Request a Quote
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={generateCallLink(MALED_SITE.contact.phone)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm"
                  >
                    <Phone className="h-4 w-4 text-amber-400" />
                    {MALED_SITE.contact.phoneDisplay}
                  </a>
                </div>
              </div>

              <motion.div
                initial={reduce ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <MaledGlassPanel className="p-6 sm:p-8">
                  <p className="text-sm font-semibold text-white">Prefer WhatsApp?</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Send us your move details and we&apos;ll reply with availability and pricing.
                  </p>
                  <a
                    href={generateWhatsAppLink(
                      MALED_SITE.contact.whatsapp,
                      decodeURIComponent(MALED_WHATSAPP_MESSAGES.quote),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white transition hover:bg-emerald-500"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Typical response time: under 1 hour
                  </p>
                </MaledGlassPanel>
              </motion.div>
            </div>
          </div>
        </MaledReveal>
      </div>
    </section>
  )
}
