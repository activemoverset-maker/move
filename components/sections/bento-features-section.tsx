'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Box,
  Headphones,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/language-context'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 14 },
  },
}

export function BentoFeaturesSection() {
  const { language } = useLanguage()
  const isAm = language === 'am'

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(22,163,74,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(22,163,74,0.06),transparent_40%)]" />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {isAm ? 'ለምን እኛ?' : 'Why Active Movers'}
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            {isAm ? (
              'የተሻለ መጓጓዣ ተሞክሮ'
            ) : (
              <>
                Built for a{' '}
                <span className="bg-gradient-to-r from-primary to-lime-500 bg-clip-text text-transparent">
                  Better Move
                </span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {isAm
              ? 'ዘመናዊ ዲዛይን፣ የሙያ ቡድን እና ደህንነት በእያንዳንዱ ደረጃ።'
              : 'Modern service, pro crew, and safety at every step.'}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-4 md:grid-cols-4 md:gap-5"
        >
          {/* Hero image card */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="group relative col-span-1 row-span-2 min-h-[320px] overflow-hidden rounded-3xl ring-1 ring-black/5 md:col-span-2"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-emerald-400/30 opacity-0 transition group-hover:opacity-100" />
            <Image
              src="/images/qua1.png"
              alt="Active Movers fleet"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <Badge className="mb-3 w-fit bg-white/20 text-white backdrop-blur-sm">
                {isAm ? 'የእኛ ተሽከርካሪዎች' : 'Our Fleet'}
              </Badge>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                {isAm ? 'ንጹህ፣ የተዘጋጁ ትራኮች' : 'Clean, Ready Trucks'}
              </h3>
              <p className="mt-2 max-w-sm text-green-100">
                {isAm
                  ? 'በአዲስ አበባ ውስጥ ደህንነቱ የተጠበቀ መጓጓዣ።'
                  : 'Safe transport across Addis Ababa.'}
              </p>
            </div>
          </motion.div>

          {/* Packing */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-6 shadow-lg shadow-green-900/5 md:col-span-1"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
              <Box className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {isAm ? 'የሙያ መጠን' : 'Pro Packing'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {isAm
                ? 'ለተሻለ እቃዎች ልዩ እንክብካቤ።'
                : 'Special care for fragile items.'}
            </p>
            <Link
              href="/services/packaging"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              {isAm ? 'የመጠን አገልግሎቶች' : 'Learn about packaging'}
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          {/* Same day */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-green-600 p-6 text-white shadow-xl shadow-primary/25 md:col-span-1"
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20"
            >
              <Zap className="h-6 w-6" />
            </motion.div>
            <h3 className="text-xl font-bold">
              {isAm ? 'በተመሳሳይ ቀን' : 'Same-Day Moves'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-green-100">
              {isAm ? 'አስቸኳይ መጓጓዣ? እንደሚችል እንረዳለን።' : 'Urgent move? We can help.'}
            </p>
          </motion.div>

          {/* Insurance wide */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            className="group relative col-span-1 overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-lg md:col-span-2"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isAm ? 'ደህንነቱ የተጠበቀ አያያዝ' : 'Fully Protected'}
                </h3>
                <p className="mt-2 max-w-md text-sm text-gray-600">
                  {isAm
                    ? 'እቃዎችዎ በጥንቃቄ ይጠበቃሉ — ከመጠን እስከ መጫን።'
                    : 'Your belongings guarded — from packing to loading.'}
                </p>
              </div>
              <div className="flex gap-3">
                {['100%', '24/7', '5★'].map((label) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-gray-50 px-4 py-3 text-center"
                  >
                    <div className="text-lg font-bold text-primary">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            className="group relative col-span-1 overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-lg md:col-span-2"
          >
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isAm ? 'ሁልጊዜ እንገኛለን' : 'Always Here for You'}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {isAm
                    ? 'በስልክ፣ በዋትስአፕ ወይም በቀጠሮ — ፈጣን መልስ።'
                    : 'Phone, WhatsApp, or booking — fast replies.'}
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 rounded-full border border-primary/20 bg-primary/5 p-3 text-primary transition hover:bg-primary hover:text-white"
                aria-label={isAm ? 'አግኙን' : 'Contact us'}
              >
                <span className="sr-only">{isAm ? 'አግኙን' : 'Contact us'}</span>
                <ArrowUpRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
