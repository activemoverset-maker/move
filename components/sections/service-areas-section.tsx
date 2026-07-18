'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Navigation, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

const AREAS = [
  { id: 'bole', en: 'Bole', am: 'ቦሌ', x: '72%', y: '38%' },
  { id: 'megenagna', en: 'Megenagna', am: 'መገናኛ', x: '68%', y: '28%' },
  { id: 'cmc', en: 'CMC', am: 'ሲኤምሲ', x: '55%', y: '22%' },
  { id: 'piassa', en: 'Piassa', am: 'ፒያሳ', x: '42%', y: '35%' },
  { id: 'kazanchis', en: 'Kazanchis', am: 'ካዛንቺስ', x: '48%', y: '42%' },
  { id: 'bole-bulbula', en: 'Bole Bulbula', am: 'ቦሌ ቡልቡላ', x: '78%', y: '52%', href: '/bole-bulbula' },
  { id: 'gerji', en: 'Gerji', am: 'ገርጂ', x: '65%', y: '48%' },
  { id: 'ayat', en: 'Ayat', am: 'አያት', x: '82%', y: '30%' },
  { id: 'lideta', en: 'Lideta', am: 'ልደታ', x: '38%', y: '48%' },
  { id: 'summit', en: 'Summit', am: 'ሰሚት', x: '58%', y: '55%' },
]

export function ServiceAreasSection() {
  const { language } = useLanguage()
  const [active, setActive] = useState<string | null>(null)
  const isAm = language === 'am'

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-gray-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            <Navigation className="mr-1.5 h-3.5 w-3.5" />
            {isAm ? 'አገልግሎት አካባቢ' : 'Service Areas'}
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            {isAm ? (
              'በአዲስ አበባ ሁሉ እንገኛለን'
            ) : (
              <>
                We Cover{' '}
                <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  All of Addis
                </span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {isAm
              ? 'ከቦሌ እስከ ፒያሳ — የእርስዎን አካባቢ እናውቃለን።'
              : 'From Bole to Piassa — we know your neighborhood.'}
          </p>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Interactive map visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto aspect-square w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-primary/10 ring-1 ring-primary/10"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-green-100/50 to-primary/5 shadow-inner" />
            <div className="absolute inset-4 rounded-[2rem] border border-primary/10 bg-white/60 backdrop-blur-sm" />

            {/* Grid lines */}
            <div className="absolute inset-8 rounded-3xl opacity-30">
              {[...Array(6)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-primary/20"
                  style={{ top: `${(i + 1) * 16.66}%` }}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute bottom-0 top-0 border-l border-primary/20"
                  style={{ left: `${(i + 1) * 16.66}%` }}
                />
              ))}
            </div>

            {/* Center pulse */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20"
            />
            <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40">
              <MapPin className="h-7 w-7" />
            </div>

            {/* Area pins */}
            {AREAS.map((area, index) => (
              <motion.button
                key={area.id}
                type="button"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.06, type: 'spring' }}
                whileHover={{ scale: 1.15 }}
                onClick={() => setActive(active === area.id ? null : area.id)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: area.x, top: area.y }}
              >
                <motion.span
                  animate={
                    active === area.id
                      ? { scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ duration: 1.5, repeat: active === area.id ? Infinity : 0 }}
                  className={`block h-3 w-3 rounded-full ring-4 ring-white ${
                    active === area.id ? 'bg-primary' : 'bg-green-400'
                  }`}
                />
              </motion.button>
            ))}

            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-primary/20 bg-white px-5 py-3 shadow-xl"
                >
                  <p className="text-center text-sm font-bold text-gray-900">
                    {isAm
                      ? AREAS.find((a) => a.id === active)?.am
                      : AREAS.find((a) => a.id === active)?.en}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Area chips */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-3">
              {AREAS.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  onHoverStart={() => setActive(area.id)}
                  onHoverEnd={() => setActive(null)}
                >
                  {area.href ? (
                    <Link
                      href={area.href}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {isAm ? area.am : area.en}
                    </Link>
                  ) : (
                    <span className="inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {isAm ? area.am : area.en}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-gray-600">
              {isAm
                ? 'አካባቢዎን አልተገኘም? ደህንነቱ የተጠበቀ መጓጓዣ ለመጠየቅ ያግኙን።'
                : "Don't see your area? Contact us — we likely still serve you."}
            </p>

            <Button asChild className="mt-6" size="lg">
              <Link href="/contact">
                {isAm ? 'አግኙን' : 'Get in Touch'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
