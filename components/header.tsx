"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/constants/site'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { generateCallLink } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, language } = useLanguage()
  const isPremiumLanding = pathname?.startsWith('/addis-active-movers')

  useEffect(() => {
    if (isPremiumLanding) return
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isPremiumLanding])

  if (isPremiumLanding) {
    return null
  }

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/bole-bulbula', label: 'Bole Bulbula' },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/tiktok', label: t('nav.watch') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/guides', label: t('nav.guides') },
    { href: '/contact', label: t('nav.contact') },
  ]

  const handleNavClick = (label: string) => {
    trackEvent({ 
      action: 'navigation_click', 
      category: 'navigation', 
      label: `Header ${label}` 
    })
  }

  const handleCTAClick = (action: string) => {
    trackEvent({ 
      action: action, 
      category: 'cta', 
      label: `Header ${action}` 
    })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        bg-black/60 backdrop-blur-md shadow-md
        ${isScrolled ? 'shadow-lg' : ''}
      `}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3" onClick={() => handleNavClick('Logo')}>
              <div className={`transition-all duration-300 ${
                isScrolled ? 'scale-95' : 'scale-100'
              }`}>
                <Image
                  src="/images/logo.jpg"
                  alt="Active Movers & Packers Logo"
                  width={64}
                  height={64}
                  priority
                  sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 64px"
                  className="h-10 w-10 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-extrabold text-base sm:text-lg md:text-xl text-white tracking-wider font-sans drop-shadow-md leading-tight">{SITE_CONFIG.name}</p>
                <p className="text-xs sm:text-sm md:text-base text-gray-200 font-medium tracking-wide font-sans">Moving & Packing</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className="relative font-semibold text-white hover:text-primary transition-all duration-300 tracking-wide font-sans drop-shadow-sm after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA & Language Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              asChild
              variant="dark-outline"
              size="sm"
              className="border-2 border-white text-white hover:bg-white/10 hover:text-white font-semibold tracking-wide font-sans"
              onClick={() => handleCTAClick('phone_click')}
            >
              <a href={generateCallLink(SITE_CONFIG.links.phone)}>
                <Phone className="w-3 h-3 mr-1.5" />
                {SITE_CONFIG.links.phone.replace('+251', '0')}
              </a>
            </Button>
            <Button asChild variant="dark-outline" size="sm" className="border-2 border-white text-white hover:bg-white/10 hover:text-white font-semibold tracking-wide font-sans" onClick={() => handleCTAClick('contact_click')}>
              <Link href="/contact">
                <Phone className="w-3 h-3 mr-1.5" />
                {t('header.contact')}
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-green-700 text-white font-bold tracking-wide font-sans" onClick={() => handleCTAClick('book_now_click')}>
              <Link href="/booking">{t('header.bookNow')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={
              language === 'am'
                ? isOpen
                  ? 'ምናሌ ዝጋ'
                  : 'ምናሌ ክፈት'
                : isOpen
                  ? 'Close menu'
                  : 'Open menu'
            }
            aria-expanded={isOpen}
            onClick={() => {
              setIsOpen(!isOpen)
              trackEvent({ 
                action: 'mobile_menu_toggle', 
                category: 'navigation', 
                label: isOpen ? 'Close Menu' : 'Open Menu' 
              })
            }}
            className="lg:hidden p-1.5 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-black/90 backdrop-blur-md border-t border-gray-800"
            >
              <nav className="py-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        setIsOpen(false)
                        handleNavClick(`Mobile ${item.label}`)
                      }}
                      className="block px-4 py-2.5 text-white hover:text-primary hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="px-4 pt-3 border-t border-gray-800"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-center mb-2">
                      <LanguageSwitcher />
                    </div>
                    <Button asChild variant="dark-outline" className="w-full border-white text-white hover:bg-white/10 hover:text-white" onClick={() => {
                      setIsOpen(false)
                      handleCTAClick('mobile_contact_click')
                    }}>
                      <Link href="/contact">
                        <Phone className="w-4 h-4 mr-2" />
                        {t('header.contact')}
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-primary hover:bg-green-700 text-white" onClick={() => {
                      setIsOpen(false)
                      handleCTAClick('mobile_book_now_click')
                    }}>
                      <Link href="/booking">
                        {t('header.bookNow')}
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
} 