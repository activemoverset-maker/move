'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { ADDIS_PREMIUM_CONTACT, ADDIS_PREMIUM_WHATSAPP_MESSAGES } from '@/lib/addis-premium-config'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

const footerLinks = [
  { href: '/addis-active-movers#addis-services', label: 'Services' },
  { href: '/addis-active-movers#addis-process', label: 'Process' },
  { href: '/addis-active-movers#addis-contact', label: 'Quote' },
  { href: '/booking', label: 'Book online' },
]

const corporateLinks = [
  { href: '/', label: 'Corporate home' },
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms-of-service', label: 'Terms' },
]

export function AddisPremiumSiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#020617] py-20 text-slate-300" role="contentinfo">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-sm font-semibold text-white ring-1 ring-white/15">
                AAM
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">Addis Active Movers</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Relocation · Addis Ababa</p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-400">
              Premium residential and commercial relocation — disciplined crews, modern fleet, and transparent
              execution from first scope to final placement.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90" aria-hidden />
                <span>
                  Head office: <span className="text-white">Megenagna (መገናኛ)</span>, Addis Ababa, Ethiopia
                </span>
              </p>
              <a
                href={generateCallLink(ADDIS_PREMIUM_CONTACT.phone)}
                className="flex items-center gap-2 text-slate-300 transition hover:text-white"
                onClick={() => trackEvent({ action: 'premium_footer_phone', category: 'contact', label: 'phone' })}
              >
                <Phone className="h-4 w-4 text-sky-400" aria-hidden />
                {ADDIS_PREMIUM_CONTACT.phone}
              </a>
              <a
                href={`mailto:${ADDIS_PREMIUM_CONTACT.email}`}
                className="flex items-center gap-2 text-slate-300 transition hover:text-white"
                onClick={() => trackEvent({ action: 'premium_footer_email', category: 'contact', label: 'email' })}
              >
                <Mail className="h-4 w-4 text-orange-300" aria-hidden />
                {ADDIS_PREMIUM_CONTACT.email}
              </a>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7" aria-label="Footer">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">This page</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {footerLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-white" prefetch={false}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">Corporate</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {corporateLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-white" prefetch={false}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">Social</p>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  aria-label="Facebook"
                  onClick={() => trackEvent({ action: 'premium_footer_social', category: 'social', label: 'facebook' })}
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  aria-label="Instagram"
                  onClick={() => trackEvent({ action: 'premium_footer_social', category: 'social', label: 'instagram' })}
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  aria-label="Twitter"
                  onClick={() => trackEvent({ action: 'premium_footer_social', category: 'social', label: 'twitter' })}
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
              <a
                href={generateWhatsAppLink(ADDIS_PREMIUM_CONTACT.whatsapp, ADDIS_PREMIUM_WHATSAPP_MESSAGES.quote)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
              >
                WhatsApp chat
              </a>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-10 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Addis Active Movers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
