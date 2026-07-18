'use client'

import { motion } from 'framer-motion'
import {
  Award,
  Clock,
  MapPin,
  Shield,
  Star,
  Truck,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const ITEMS = [
  { icon: Shield, en: 'Licensed & Insured', am: 'የተፈቀደ እና የተጣመረ' },
  { icon: Star, en: '5-Star Rated', am: '5 ኮከብ ደረጃ' },
  { icon: Users, en: '500+ Happy Customers', am: '500+ ደስ ያለው ደንበኛ' },
  { icon: Truck, en: 'Professional Fleet', am: 'የሙያ ተሽከርካሪዎች' },
  { icon: Clock, en: '24/7 Support', am: '24/7 ድጋፍ' },
  { icon: MapPin, en: 'All Addis Ababa', am: 'በአዲስ አበባ ሁሉ' },
  { icon: Award, en: '10+ Years Experience', am: '10+ ዓመት ልምድ' },
]

export function MarqueeTrustBar() {
  const { language } = useLanguage()
  const items = [...ITEMS, ...ITEMS]

  return (
    <section className="relative overflow-hidden border-y border-primary/20 bg-gradient-to-r from-emerald-50 via-white to-green-50 py-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(22,163,74,0.04),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-emerald-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-green-50 to-transparent" />

      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {items.map((item, index) => (
          <motion.div
            key={`${item.en}-${index}`}
            whileHover={{ scale: 1.04, y: -2 }}
            className="group flex shrink-0 items-center gap-3 rounded-full border border-primary/20 bg-white/90 px-6 py-3 shadow-md shadow-primary/5 backdrop-blur-md transition-shadow hover:shadow-lg hover:shadow-primary/15"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-emerald-400/20 transition group-hover:from-primary group-hover:to-emerald-500">
              <item.icon className="h-4 w-4 text-primary transition group-hover:text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800">
              {language === 'am' ? item.am : item.en}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
