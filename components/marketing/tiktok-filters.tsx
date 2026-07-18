'use client'

import { motion } from 'framer-motion'
import type { TikTokCategory } from '@/lib/tiktok/types'
import { TIKTOK_CATEGORIES } from '@/lib/tiktok/categories'
import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

interface TikTokFiltersProps {
  value: TikTokCategory | 'all'
  onChange: (value: TikTokCategory | 'all') => void
  className?: string
  theme?: 'light' | 'dark'
}

export function TikTokFilters({
  value,
  onChange,
  className,
  theme = 'light',
}: TikTokFiltersProps) {
  const { language } = useLanguage()
  const isDark = theme === 'dark'

  const chips: { id: TikTokCategory | 'all'; label: string }[] = [
    { id: 'all', label: language === 'am' ? 'ሁሉም' : 'All' },
    ...TIKTOK_CATEGORIES.map((c) => ({
      id: c.id,
      label: language === 'am' ? c.labelAm : c.labelEn,
    })),
  ]

  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 rounded-2xl p-1.5',
        isDark
          ? 'bg-white/5 ring-1 ring-white/10 backdrop-blur-md'
          : 'bg-gray-100/80 ring-1 ring-gray-200/80',
        className
      )}
    >
      {chips.map((chip) => {
        const active = value === chip.id
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChange(chip.id)}
            className={cn(
              'relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
              active
                ? 'text-white'
                : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {active && (
              <motion.span
                layoutId="tiktok-filter-pill"
                className={cn(
                  'absolute inset-0 rounded-xl shadow-lg',
                  isDark
                    ? 'bg-gradient-to-r from-primary via-emerald-500 to-cyan-500'
                    : 'bg-gradient-to-r from-primary to-green-600'
                )}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{chip.label}</span>
          </button>
        )
      })}
    </div>
  )
}
