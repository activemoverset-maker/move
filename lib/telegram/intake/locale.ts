import type { IntakeLocale } from '@/lib/telegram/intake/types'

export function detectIntakeLocale(text: string): IntakeLocale {
  if (/[\u1200-\u137F]/.test(text)) return 'am'
  if (/[A-Za-z]/.test(text)) return 'en'
  return 'am'
}

export function parsePreferredLocale(value: string | null | undefined): IntakeLocale {
  return value === 'en' ? 'en' : 'am'
}
