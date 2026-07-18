'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, MapPin, Star, Truck } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'
import { useLanguage } from '@/contexts/language-context'

const STATS = [
  {
    icon: Truck,
    value: 1200,
    suffix: '+',
    en: 'Successful Moves',
    am: 'የተሳካ መጓጓዣ',
  },
  {
    icon: Star,
    value: 5,
    suffix: '.0',
    en: 'Average Rating',
    am: 'አማካይ ደረጃ',
  },
  {
    icon: Award,
    value: 10,
    suffix: '+',
    en: 'Years Experience',
    am: 'ዓመት ልምድ',
  },
  {
    icon: MapPin,
    value: 100,
    suffix: '%',
    en: 'Addis Coverage',
    am: 'የአዲስ አበባ ሽፋን',
  },
]

export function AnimatedStatsBand() {
  const { language } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-[#0a1f14] to-gray-950 py-20 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/logo.jpg')] bg-center opacity-[0.02]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-green-500/15 blur-3xl"
        />
        <div className="absolute inset-0 bg-[url('/images/logo.jpg')] bg-center opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-green-400">
            {language === 'am' ? 'በቁጥር' : 'By the Numbers'}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-4xl">
            {language === 'am'
              ? 'የተረጋገጠ ውጤት'
              : 'Proven Results You Can Trust'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.en}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition hover:border-primary/30 hover:bg-white/10"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary transition group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-white md:text-4xl">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                  duration={2200}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-400">
                {language === 'am' ? stat.am : stat.en}
              </p>
              <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
