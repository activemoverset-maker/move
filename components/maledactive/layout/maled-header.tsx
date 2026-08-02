'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { MALED_SITE } from '@/lib/maledactive-config'
import { MaledLogo } from '@/components/maledactive/layout/maled-logo'
import { cn, generateCallLink } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

function maledPath(href: string) {
  if (href === '/') return '/sites/maledactive'
  return `/sites/maledactive${href}`
}

export function MaledHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    const internal = maledPath(href)
    if (href === '/') return pathname === internal || pathname === `${internal}/`
    return pathname.startsWith(internal)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-all duration-500 sm:px-6',
          scrolled && 'pt-2',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl px-3 transition-all duration-500 sm:h-[3.75rem] sm:px-4',
            scrolled
              ? 'border border-white/10 bg-[#0a0f1a]/80 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl'
              : 'bg-transparent',
          )}
        >
          <MaledLogo priority imageClassName="h-9 sm:h-10" />

          <nav
            className="hidden items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 md:flex"
            aria-label="Main"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={maledPath(item.href)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  isActive(item.href)
                    ? 'bg-gradient-to-b from-amber-500/25 to-amber-600/10 text-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href={generateCallLink(MALED_SITE.contact.phone)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:text-white"
            >
              <Phone className="h-4 w-4 text-amber-400" />
              <span className="hidden xl:inline">{MALED_SITE.contact.phoneDisplay}</span>
            </Link>
            <Link
              href={maledPath('/contact')}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-5 py-2.5 text-sm font-bold text-[#0a0f1a] shadow-lg shadow-amber-500/20 transition hover:brightness-110"
            >
              Get a Quote
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#04070d]/98 backdrop-blur-2xl md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="flex min-h-screen flex-col items-center justify-center gap-1 p-8" aria-label="Mobile">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={maledPath(item.href)}
                    className={cn(
                      'block rounded-2xl px-8 py-4 text-2xl font-semibold tracking-tight',
                      isActive(item.href) ? 'text-amber-300' : 'text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV.length * 0.07 }}
                className="mt-8 flex w-full max-w-xs flex-col gap-3"
              >
                <Link
                  href={maledPath('/contact')}
                  className="rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 py-4 text-center text-lg font-bold text-[#0a0f1a]"
                >
                  Get a Quote
                </Link>
                <a
                  href={generateCallLink(MALED_SITE.contact.phone)}
                  className="rounded-2xl border border-white/15 py-4 text-center font-semibold text-white"
                >
                  {MALED_SITE.contact.phoneDisplay}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
