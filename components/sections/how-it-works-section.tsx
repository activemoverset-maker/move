'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { CalendarCheck, ClipboardList, Package, Truck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

const STEPS = [
  {
    icon: ClipboardList,
    en: 'Free Quote',
    am: 'ነፃ ዋጋ',
    descEn: 'Tell us about your move — we respond fast with a clear, fair estimate.',
    descAm: 'ስለ መጓጓዣዎ ይንገሩን — ግልጽ እና ፍትሃዊ ዋጋ በፍጥነት እንሰጣለን።',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: CalendarCheck,
    en: 'Book Your Date',
    am: 'ቀንዎን ያስያዙ',
    descEn: 'Pick a time that works. We confirm your slot and send prep tips.',
    descAm: 'ለእርስዎ የሚስማማበትን ጊዜ ይምረጡ። ቀንዎን እናዘጋጃለን።',
    color: 'from-primary to-green-500',
  },
  {
    icon: Package,
    en: 'We Pack & Load',
    am: 'እንጠብቃለን እና እንጭናለን',
    descEn: 'Our crew wraps, packs, and loads everything with care.',
    descAm: 'ቡድናችን ሁሉንም በጥንቃቄ ይጠብቃል፣ ይጠንቀቃል እና ይጭናል።',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Truck,
    en: 'Safe Delivery',
    am: 'ደህንነቱ የተጠበቀ ማድረስ',
    descEn: 'We transport, unload, and set up — stress-free from start to finish.',
    descAm: 'እንጓዛለን፣ እናራታለን እና እናቀናብራለን — ከመጀመሪያ እስከ መጨረሻ ያለ ጫና።',
    color: 'from-green-600 to-lime-500',
  },
]

export function HowItWorksSection() {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4'],
  })

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={containerRef}
      className="section-padding relative overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center md:mb-20"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm font-semibold text-primary">
              {language === 'am' ? 'ቀላል ሂደት' : 'Simple Process'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            {language === 'am' ? (
              'መጓጓዣ እንዴት ይሰራል?'
            ) : (
              <>
                How Your{' '}
                <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  Move Works
                </span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {language === 'am'
              ? 'ከመጀመሪያ ዋጋ እስከ የመጨረሻ ማድረስ — አራት ቀላል ደረጃዎች።'
              : 'From first quote to final delivery — four simple steps.'}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 hidden h-full w-0.5 overflow-hidden bg-gray-200 md:left-1/2 md:block md:-translate-x-1/2">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-primary via-green-500 to-lime-400"
              style={{ scaleY: lineScale }}
            />
          </div>

          <div className="space-y-10 md:space-y-16">
            {STEPS.map((step, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={step.en}
                  initial={{ opacity: 0, x: isEven ? -40 : 40, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 80,
                  }}
                  className={`relative flex flex-col gap-6 md:flex-row md:items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="hidden md:absolute md:left-1/2 md:top-1/2 md:z-10 md:flex md:h-14 md:w-14 md:-translate-x-1/2 md:-translate-y-1/2 md:items-center md:justify-center md:rounded-full md:border-4 md:border-white md:bg-gradient-to-br md:shadow-lg md:shadow-primary/20">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className={`md:w-1/2 ${isEven ? 'md:pr-16' : 'md:pl-16'}`}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/80 p-8 shadow-xl shadow-gray-200/40 backdrop-blur-sm"
                    >
                      <div
                        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${step.color} opacity-10 blur-2xl transition group-hover:opacity-20`}
                      />
                      <div
                        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${step.color} opacity-80`}
                      />
                      <div className="mb-4 flex items-center gap-4 md:hidden">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
                        >
                          <step.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {language === 'am' ? `ደረጃ ${index + 1}` : `Step ${index + 1}`}
                        </span>
                      </div>
                      <span className="mb-2 hidden text-sm font-bold text-primary md:block">
                        {language === 'am' ? `ደረጃ ${index + 1}` : `Step ${index + 1}`}
                      </span>
                      <h3 className="mb-3 text-2xl font-bold text-gray-900">
                        {language === 'am' ? step.am : step.en}
                      </h3>
                      <p className="leading-relaxed text-gray-600">
                        {language === 'am' ? step.descAm : step.descEn}
                      </p>
                    </motion.div>
                  </div>

                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <Button asChild size="lg" className="px-8 shadow-lg shadow-primary/25">
            <Link href="/booking">
              {language === 'am' ? 'አሁን ያስያዙ' : 'Book Your Move'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
