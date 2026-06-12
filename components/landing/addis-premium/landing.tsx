'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { FileText, MessageCircle, Phone } from 'lucide-react'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { ADDIS_PREMIUM_CONTACT, ADDIS_PREMIUM_WHATSAPP_MESSAGES } from '@/lib/addis-premium-config'
import { AddisPremiumHeader } from './addis-premium-header'
import { AddisPremiumHero } from './hero'
import { AddisPremiumServices } from './services'
import { AddisPremiumTrust } from './trust'
import { AddisPremiumShowcase } from './showcase'
import { AddisPremiumProcess } from './process'
import { AddisPremiumTestimonials } from './testimonials'
import { AddisPremiumAreas } from './areas'
import { AddisPremiumCta } from './cta'
import { AddisPremiumSiteFooter } from './site-footer'

function AmbientLayer() {
  const reduce = useReducedMotion()
  if (reduce) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden>
        <div className="absolute -left-[20%] top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="absolute -right-[15%] bottom-[5%] h-[65vmin] w-[65vmin] rounded-full bg-orange-500/10 blur-[100px]" />
      </div>
    )
  }
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-[20%] top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-blue-600/20 blur-[110px]"
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1], x: [0, 24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[5%] h-[65vmin] w-[65vmin] rounded-full bg-orange-500/15 blur-[110px]"
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1.02, 1, 1.05], x: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[50vmin] w-[90vmin] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[130px]"
        animate={{ opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  )
}

export function AddisPremiumLanding() {
  return (
    <div className="addis-premium-landing relative isolate min-h-screen bg-[#020617] pb-28 md:pb-0">
      <AmbientLayer />
      <div className="addis-premium-noise pointer-events-none fixed inset-0 z-[5]" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 z-[4] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_45%),radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.5)_100%)]"
        aria-hidden
      />

      <AddisPremiumHeader />
      <div className="relative z-10">
        <AddisPremiumHero />
        <AddisPremiumServices />
        <AddisPremiumTrust />
        <AddisPremiumShowcase />
        <AddisPremiumProcess />
        <AddisPremiumTestimonials />
        <AddisPremiumAreas />
        <AddisPremiumCta />
        <AddisPremiumSiteFooter />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#030712]/90 p-1.5 shadow-[0_-8px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
          <div className="flex gap-1.5">
            <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
              <Link
                href="#addis-contact"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#f59e0b] py-3.5 text-xs font-semibold text-white shadow-inner shadow-white/10"
                onClick={() => trackEvent({ action: 'premium_sticky_cta', category: 'cta', label: 'Quote' })}
              >
                <FileText className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
                Quote
              </Link>
            </motion.div>
            <motion.a
              href={generateWhatsAppLink(ADDIS_PREMIUM_CONTACT.whatsapp, ADDIS_PREMIUM_WHATSAPP_MESSAGES.sticky)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/[0.12] py-3.5 text-xs font-semibold text-emerald-50"
              whileTap={{ scale: 0.97 }}
              onClick={() => trackEvent({ action: 'premium_sticky_cta', category: 'cta', label: 'WhatsApp' })}
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
              WhatsApp
            </motion.a>
            <motion.a
              href={generateCallLink(ADDIS_PREMIUM_CONTACT.phone)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] py-3.5 text-xs font-semibold text-white"
              whileTap={{ scale: 0.97 }}
              onClick={() => trackEvent({ action: 'premium_sticky_cta', category: 'cta', label: 'Call' })}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              Call
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  )
}
