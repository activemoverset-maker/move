"use client"

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Truck,
  ArrowRight,
  Star,
  Clock,
  Users,
  Award
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'

const AdvancedTruck3D = dynamic(
  () => import('@/components/animations/advanced-truck-3d').then((m) => m.AdvancedTruck3D),
  { ssr: false }
)

const ScrollTriggeredAnimations = dynamic(
  () => import('@/components/animations/scroll-triggered-animations').then((m) => m.ScrollTriggeredAnimations),
  { ssr: false }
)

const HERO_IMAGES = [
  '/images/qua1.png',
  '/images/qua2.png',
  '/images/qua3.png',
  '/images/qua4.png',
  '/images/qua5.png',
]

export function HeroSection() {
  const { t, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFx, setShowFx] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  const springBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 })
  const springTextY = useSpring(textY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    let cancelled = false
    let rotateInterval: ReturnType<typeof setInterval> | undefined

    const startFx = () => {
      if (!cancelled) setShowFx(true)
    }
    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(startFx)
        : globalThis.setTimeout(startFx, 1200)

    const rotationTimer = window.setTimeout(() => {
      if (cancelled) return
      rotateInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
      }, 8000)
    }, 8000)

    return () => {
      cancelled = true
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId as number)
      } else {
        globalThis.clearTimeout(idleId as ReturnType<typeof setTimeout>)
      }
      globalThis.clearTimeout(rotationTimer)
      if (rotateInterval) clearInterval(rotateInterval)
    }
  }, [])

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

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {showFx && (
        <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="animate-mesh-drift absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/25 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-green-400/20 blur-[90px]"
          />
        </div>
      )}

      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: springBackgroundY }}
      >
        <div className="absolute inset-0 opacity-60">
          <Image
            src={HERO_IMAGES[currentImageIndex]}
            alt=""
            fill
            priority={currentImageIndex === 0}
            quality={70}
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {showFx && (
        <>
          <div className="absolute inset-0 z-10 pointer-events-none">
            <AdvancedTruck3D className="h-full" />
          </div>
          <div className="absolute inset-0 z-15 pointer-events-none">
            <ScrollTriggeredAnimations className="h-full" />
          </div>
        </>
      )}

      <div className="absolute inset-0 z-18 bg-black/50 pointer-events-none" />

      <motion.div
        className="relative z-20 container-max text-center text-white px-4"
        style={{ y: springTextY, opacity }}
      >
        <Badge variant="secondary" className="mb-6 text-sm px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
          {t('hero.badge')}
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block drop-shadow-lg">{t('hero.title')}</span>
          {t('hero.subtitle') ? (
            <span className="block bg-gradient-to-r from-green-300 via-primary to-lime-300 bg-clip-text text-transparent drop-shadow-sm">
              {t('hero.subtitle')}
            </span>
          ) : null}
        </h1>

        <p
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
        >
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
            <Link href="/#pricing">
              See 2026 prices
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">{language === 'am' ? 'ይሸብልሉ' : 'Scroll'}</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
