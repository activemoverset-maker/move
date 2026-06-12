'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Phone, MessageCircle, ArrowUpRight } from 'lucide-react'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { ADDIS_PREMIUM_CONTACT, ADDIS_PREMIUM_WHATSAPP_MESSAGES } from '@/lib/addis-premium-config'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '#addis-services', label: 'Services' },
  { href: '#addis-trust', label: 'Why us' },
  { href: '#addis-showcase', label: 'Work' },
  { href: '#addis-process', label: 'Process' },
  { href: '#addis-testimonials', label: 'Stories' },
  { href: '#addis-areas', label: 'Areas' },
  { href: '#addis-contact', label: 'Contact' },
] as const

export function AddisPremiumHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[60] transition-[background,box-shadow,border-color,backdrop-filter] duration-500',
        scrolled
          ? 'border-b border-white/[0.09] bg-[#020617]/88 shadow-[0_12px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl backdrop-saturate-150'
          : 'border-b border-white/[0.04] bg-gradient-to-b from-[#020617]/95 via-[#020617]/55 to-transparent backdrop-blur-md',
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent opacity-80" />

      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:px-10">
        <Link
          href="/addis-active-movers"
          className="group flex items-center gap-3"
          onClick={() => trackEvent({ action: 'premium_header', category: 'nav', label: 'logo' })}
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#0f172a] shadow-[0_12px_28px_rgba(30,64,175,0.45)] ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-[1.03]">
            <span className="relative text-sm font-bold tracking-tight text-white">AAM</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-orange-500/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="hidden min-[380px]:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">Addis Ababa</p>
            <p className="text-[15px] font-semibold leading-tight tracking-tight text-white">Addis Active Movers</p>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-0.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1 shadow-inner shadow-black/20 lg:flex"
          aria-label="Landing sections"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative rounded-xl px-3.5 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:text-white"
              onClick={() => trackEvent({ action: 'premium_header_nav', category: 'nav', label: item.label })}
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 rounded-xl bg-white/[0.06] opacity-0 transition-opacity hover:opacity-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <a
            href={generateWhatsAppLink(ADDIS_PREMIUM_CONTACT.whatsapp, ADDIS_PREMIUM_WHATSAPP_MESSAGES.quote)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:border-emerald-400/35 hover:bg-emerald-500/10 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]"
            onClick={() => trackEvent({ action: 'premium_header_cta', category: 'cta', label: 'WhatsApp' })}
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden />
            <span className="hidden md:inline">WhatsApp</span>
          </a>
          <a
            href={generateCallLink(ADDIS_PREMIUM_CONTACT.phone)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-medium text-white transition hover:border-orange-400/40 hover:bg-orange-500/10"
            onClick={() => trackEvent({ action: 'premium_header_cta', category: 'cta', label: 'Call' })}
          >
            <Phone className="h-4 w-4 text-orange-300" aria-hidden />
            <span className="hidden md:inline">Call</span>
          </a>
          <a
            href="#addis-contact"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f59e0b] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_28px_rgba(234,88,12,0.35)] ring-1 ring-orange-200/20 transition hover:brightness-110 hover:shadow-[0_12px_36px_rgba(234,88,12,0.45)]"
            onClick={() => trackEvent({ action: 'premium_header_cta', category: 'cta', label: 'Quote' })}
          >
            Get quote
            <ArrowUpRight className="h-4 w-4 opacity-90" aria-hidden />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white shadow-inner lg:hidden"
          aria-expanded={open}
          aria-controls="addis-premium-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="addis-premium-mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-[#020617]/96 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex max-h-[min(70vh,calc(100dvh-4rem))] flex-col gap-0.5 overflow-y-auto px-4 py-4" aria-label="Mobile">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
                  onClick={() => {
                    setOpen(false)
                    trackEvent({ action: 'premium_header_nav', category: 'nav', label: `mobile ${item.label}` })
                  }}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                <a
                  href={generateWhatsAppLink(ADDIS_PREMIUM_CONTACT.whatsapp, ADDIS_PREMIUM_WHATSAPP_MESSAGES.quote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-50"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={generateCallLink(ADDIS_PREMIUM_CONTACT.phone)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href="#addis-contact"
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f59e0b] py-3 text-sm font-semibold text-white shadow-lg"
                  onClick={() => setOpen(false)}
                >
                  Get quote
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
