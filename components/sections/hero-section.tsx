"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Phone, 
  ArrowRight, 
  Star, 
  Clock, 
  Shield,
  MapPin,
  Package,
  Users,
  Award
} from 'lucide-react'
import { SITE_CONFIG } from '@/constants/site'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { TruckAnimation } from '@/components/animations/truck-animation'
import { ScrollTriggeredAnimations } from '@/components/animations/scroll-triggered-animations'
import { AdvancedTruck3D } from '@/components/animations/advanced-truck-3d'

export function HeroSection() {
  const { t, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  const springBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 })
  const springTextY = useSpring(textY, { stiffness: 50, damping: 20 })

  // Background images for the rotating effect
  const backgroundImages = [
    '/images/qua1.png',
    '/images/qua2.png',
    '/images/qua3.png',
    '/images/qua4.png',
    '/images/qua5.png',
    '/images/6048392380857567568.jpg',
    '/images/6048392380857567570.jpg',
    '/images/6048392380857567571.jpg',
    '/images/6048392380857567572.jpg',
    '/images/6048392380857567580.jpg',
    '/images/6048392380857567581.jpg'
  ]

  useEffect(() => {
    setMounted(true)
    setIsVisible(true)

    // Rotate background images
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  const handleCTAClick = (action: string) => {
    trackEvent({ 
      action: action, 
      category: 'hero', 
      label: `Hero ${action}` 
    })
  }

  const handleServiceClick = () => {
    trackEvent({ 
      action: 'view_services_click', 
      category: 'hero', 
      label: 'Hero View Services' 
    })
  }

  const stats = [
    { icon: Users, value: '500+', label: language === 'am' ? 'ደስ ያለው ደንበኛ' : 'Happy Customers' },
    { icon: Star, value: '5.0', label: language === 'am' ? 'ደረጃ' : 'Rating' },
    { icon: Clock, value: '24/7', label: language === 'am' ? 'ድጋፍ' : 'Support' },
    { icon: Award, value: '10+', label: language === 'am' ? 'የስራ ዓመት' : 'Years Experience' }
  ]

  // Don't render animations until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section 
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Static Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{
              backgroundImage: `url(${backgroundImages[0]})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Strong Text Overlay for Better Visibility */}
        <div className="absolute inset-0 z-18 bg-black/50 pointer-events-none" />

        {/* Static Content */}
        <div className="relative z-20 container-max text-center text-white px-4">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            {t('hero.badge')}
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block">{t('hero.title')}</span>
            <span className="block text-primary">{t('hero.subtitle')}</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-8 leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-4 bg-primary hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/booking">
                <Truck className="w-5 h-5 mr-2" />
                {t('hero.bookMove')}
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/services">
                {t('hero.viewServices')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: springBackgroundY }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Advanced 3D Truck Animation */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AdvancedTruck3D className="h-full" />
      </div>

      {/* Scroll Triggered Animations */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        <ScrollTriggeredAnimations className="h-full" />
      </div>

      {/* Strong Text Overlay for Better Visibility */}
      <div className="absolute inset-0 z-18 bg-black/50 pointer-events-none" />

      {/* Content */}
      <motion.div 
        className="relative z-20 container-max text-center text-white px-4"
        style={{ y: springTextY, opacity }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            {t('hero.badge')}
          </Badge>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span className="block">{t('hero.title')}</span>
          <span className="block text-primary">{t('hero.subtitle')}</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto mb-8 leading-relaxed font-semibold"
          style={{
            textShadow: `
              -1px -1px 0 #000,
               1px -1px 0 #000,
              -1px  1px 0 #000,
               1px  1px 0 #000,
               0px -2px 4px rgba(0,0,0,0.8),
               0px  2px 4px rgba(0,0,0,0.8),
              -2px  0px 4px rgba(0,0,0,0.8),
               2px  0px 4px rgba(0,0,0,0.8)
            `
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {t('hero.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-8 py-4 bg-primary hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => handleCTAClick('book_move_click')}
          >
            <Link href="/booking">
              <Truck className="w-5 h-5 mr-2" />
              {t('hero.bookMove')}
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={handleServiceClick}
          >
            <Link href="/services">
              {t('hero.viewServices')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Action Buttons */}
        <motion.div 
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <Button
            asChild
            size="lg"
            className="w-14 h-14 rounded-full bg-primary hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            onClick={() => handleCTAClick('call_click')}
          >
            <a href={generateCallLink(SITE_CONFIG.links.phone)}>
              <Phone className="w-6 h-6" />
            </a>
          </Button>
          
          <Button
            asChild
            size="lg"
            className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            onClick={() => handleCTAClick('whatsapp_click')}
          >
            <a href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, 'Hello! I need information about your moving services.')}>
              <span className="text-lg">💬</span>
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: -1,
          ease: "easeInOut"
        }}
      >
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">{language === 'am' ? 'ይሸብልሉ' : 'Scroll'}</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{
                y: [0, 12, 0]
              }}
              transition={{
                duration: 2,
                repeat: -1,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
} 