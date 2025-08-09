"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, Send } from 'lucide-react'
import { generateCallLink, generateWhatsAppLink, generateTelegramLink } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'
import { SITE_CONFIG } from '@/constants/site'

export function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show buttons when scrolled down, hide when scrolling up
      if (currentScrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleCallClick = () => {
    trackEvent({ 
      action: 'floating_call_click', 
      category: 'contact', 
      label: 'Floating Call Button' 
    })
  }

  const handleWhatsAppClick = () => {
    trackEvent({ 
      action: 'floating_whatsapp_click', 
      category: 'contact', 
      label: 'Floating WhatsApp Button' 
    })
  }

  const handleTelegramClick = () => {
    trackEvent({ 
      action: 'floating_telegram_click', 
      category: 'contact', 
      label: 'Floating Telegram Button' 
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 z-40 flex flex-col gap-2 sm:gap-3"
        >
          {/* Call Button */}
          <motion.a
            href={generateCallLink(SITE_CONFIG.links.phone)}
            onClick={handleCallClick}
            className="relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-10 h-10 sm:w-11 sm:h-11 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer relative overflow-hidden"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>

            {/* Pulsing effect */}
            <motion.div
              className="absolute inset-0 bg-green-600 rounded-full opacity-75"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.75, 0, 0.75],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Tooltip */}
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-2 py-1.5 rounded whitespace-nowrap relative">
                {t('floatingButtons.callNow')}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-3 border-l-gray-900 border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
              </div>
            </div>
          </motion.a>

          {/* WhatsApp Button */}
                      <motion.a
              href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, 'Hello! I need moving services.')}
              onClick={handleWhatsAppClick}
              className="relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
            <motion.div
              className="w-10 h-10 sm:w-11 sm:h-11 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>

            {/* Tooltip */}
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-2 py-1.5 rounded whitespace-nowrap relative">
                {t('floatingButtons.whatsapp')}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-3 border-l-gray-900 border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
              </div>
            </div>
          </motion.a>

          {/* Telegram Button */}
          <motion.a
            href={generateTelegramLink('activemovers', 'Hello! I need moving services.')}
            onClick={handleTelegramClick}
            className="relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
              whileHover={{ rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>

            {/* Tooltip */}
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-2 py-1.5 rounded whitespace-nowrap relative">
                {t('floatingButtons.telegram')}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-3 border-l-gray-900 border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
              </div>
            </div>
          </motion.a>

          {/* Quick Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 p-2.5 max-w-48"
          >
            <div className="text-center">
              <h4 className="text-xs font-semibold text-gray-900 mb-1">{t('floatingButtons.quickContact')}</h4>
              <p className="text-xs text-gray-600 mb-2">{SITE_CONFIG.links.phone}</p>
              <div className="flex justify-center space-x-1">
                <a
                  href={generateCallLink(SITE_CONFIG.links.phone)}
                  className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  onClick={handleCallClick}
                >
                  <Phone className="w-3 h-3 text-white" />
                </a>
                <a
                  href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, 'Hello! I need moving services.')}
                  className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-3 h-3 text-white" />
                </a>
                <a
                  href={generateTelegramLink('activemovers', 'Hello! I need moving services.')}
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  onClick={handleTelegramClick}
                >
                  <Send className="w-3 h-3 text-white" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 













