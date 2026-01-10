"use client"

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react'
import { SITE_CONFIG } from '@/constants/site'
import { generateCallLink, generateWhatsAppLink, generateTelegramLink } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'

export function BoleBulbulaFooter() {
  const { t } = useLanguage()

  const handleFooterLinkClick = (section: string, link: string) => {
    trackEvent({
      action: 'footer_link_click',
      category: 'navigation',
      label: `${section} - ${link}`
    })
  }

  const handleSocialClick = (platform: string) => {
    trackEvent({
      action: 'social_media_click',
      category: 'social',
      label: platform
    })
  }

  const handlePhoneClick = () => {
    trackEvent({
      action: 'phone_click',
      category: 'contact',
      label: 'Footer Phone'
    })
  }

  return (
    <footer className="bg-gray-900 text-white overflow-hidden">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Google Maps Section */}
        <div className="py-8 sm:py-12 border-b border-gray-800">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{t('footer.findUs')}</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Bole Bulbula Branch Location
            </p>
          </div>
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5486!2d38.8234!3d9.0036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f8b8b8b8b8b%3A0x1234567890abcdef!2sBole%20Bulbula%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Active Movers Bole Bulbula Branch Location"
              className="absolute inset-0"
            />
            {/* Map Overlay for better integration */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-12">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <img
                  src="/images/logo.jpg"
                  alt="Active Movers & Packers Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Active Movers Bole Bulbula</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">Bole Bulbula Branch</p>
                <p className="text-xs sm:text-sm text-primary font-medium">Bole Bulbula Moving Experts</p>
              </div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed break-words">
              Bole Bulbula's trusted moving partner. Specialized Bole Bulbula moving services for Bole Bulbula residents.
              We understand Bole Bulbula and make your Bole Bulbula move stress-free.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Quick Links', 'Home')}>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/bole-bulbula" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Quick Links', 'Bole Bulbula Branch')}>
                  Bole Bulbula Branch
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Quick Links', 'Services')}>
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Quick Links', 'Blog')}>
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Quick Links', 'Contact')}>
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Quick Links', 'Book Now')}>
                  {t('header.bookNow')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">{t('footer.ourServices')}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/services/local-moving" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Services', 'Local Moving')}>
                  Local Moving
                </Link>
              </li>
              <li>
                <Link href="/services/packaging" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Services', 'Packaging')}>
                  Packaging Services
                </Link>
              </li>
              <li>
                <Link href="/services/storage" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Services', 'Storage')}>
                  Storage Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/office-relocation" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 block break-words" onClick={() => handleFooterLinkClick('Services', 'Office Relocation')}>
                  Office Relocation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">{t('footer.contactInfo')}</h4>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <a
                  href={generateCallLink('+251982260000')}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 break-all"
                  onClick={handlePhoneClick}
                >
                  +251982260000
                </a>
              </div>
              <div className="flex items-start space-x-2.5 sm:space-x-3">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm sm:text-base leading-relaxed break-words flex-1">
                  Bole Bulbula, Addis Ababa, Ethiopia
                </span>
              </div>
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base break-words">
                  {t('footer.businessHours')}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-3 sm:pt-4">
              <h5 className="text-xs sm:text-sm font-semibold mb-2.5 sm:mb-3">{t('footer.followUs')}</h5>
              <div className="flex space-x-2.5 sm:space-x-3">
                <a
                  href="#"
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors flex-shrink-0"
                  aria-label="Facebook"
                  onClick={() => handleSocialClick('Facebook')}
                >
                  <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <a
                  href="#"
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors flex-shrink-0"
                  aria-label="Instagram"
                  onClick={() => handleSocialClick('Instagram')}
                >
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <a
                  href="#"
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors flex-shrink-0"
                  aria-label="Twitter"
                  onClick={() => handleSocialClick('Twitter')}
                >
                  <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left break-words">
              © {new Date().getFullYear()} Active Movers Bole Bulbula Branch - Serving Bole Bulbula with Pride. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-center sm:text-left break-words" onClick={() => handleFooterLinkClick('Legal', 'Privacy Policy')}>
                {t('footer.legal.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-center sm:text-left break-words" onClick={() => handleFooterLinkClick('Legal', 'Terms of Service')}>
                {t('footer.legal.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
