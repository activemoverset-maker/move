import type { IntakeLocale, IntakeStep } from '@/lib/telegram/intake/types'

const prompts: Record<IntakeStep, { en: string; am: string }> = {
  move_date: {
    en: 'When do you want to move? (e.g. 2026-11-05 or “next week”)',
    am: 'መቼ መጓጓዣ ይፈልጋሉ? (ለምሳሌ 2026-11-05 ወይም “ቀጣይ ሳምንት”)',
  },
  from_location: {
    en: 'Where are you moving FROM? (area, building, or address)',
    am: 'ከየት ነው የሚነሱ? (አካባቢ፣ ሕንጻ ወይም አድራሻ)',
  },
  to_location: {
    en: 'Where are you moving TO?',
    am: 'ወደ የት ነው የሚሄዱ?',
  },
  dwelling_type: {
    en: 'What type of home?',
    am: 'የቤት አይነት?',
  },
  floor: {
    en: 'Which floor? (0 = ground)',
    am: 'የትኛው ፎር? (0 = መሬት)',
  },
  elevator: {
    en: 'Is there a working elevator?',
    am: 'ሊፍት አለ?',
  },
  office_details: {
    en: 'Tell us about the office move (company name, size, special items):',
    am: 'ስለ ቢሮ መጓጓዣ ይንገሩን (ኩባንያ፣ መጠን፣ ልዩ እቃዎች):',
  },
  inventory: {
    en: 'Tap items you are moving, then tap Done. You can also send photos anytime.',
    am: 'የሚያመጡ እቃዎችን ይምረጡ፣ ከዚያ Done። ስዕሎችም ማስላክ ይችላሉ።',
  },
  inventory_photos: {
    en: 'Send photos/videos of rooms & large items (optional), or tap Skip.',
    am: 'የክፍል/እቃ ስዕሎች ላኩ (አማራጭ)፣ ወይም Skip።',
  },
  phone: {
    en: 'Share your phone number for a callback (+2519… or use the button below).',
    am: 'ስልክ ቁጥርዎን ያጋሩ (+2519… ወይም ከታች ያለውን ቁልፍ ይጠቀሙ)።',
  },
  review: {
    en: 'Please review and submit to our team:',
    am: 'እባክዎ ይመልከቱና ለቡድናችን ይላኩ:',
  },
}

export function promptForStep(step: IntakeStep, locale: IntakeLocale): string {
  const p = prompts[step]
  return locale === 'en' ? p.en : p.am
}

export function helpText(locale: IntakeLocale): string {
  if (locale === 'en') {
    return (
      'Active Movers bot help:\n' +
      '• /quote or Get a quote — guided questions for staff pricing\n' +
      '• Ask a question — AI answers from our playbook (20/day limit)\n' +
      '• Human team: @activemovers\n' +
      'Messages may be reviewed by staff for quotes.'
    )
  }
  return (
    'እገዛ:\n' +
    '• /quote ወይም ዋጋ — ጥያቄዎች ለቡድናችን\n' +
    '• ጥያቄ — ከመመሪያ (በቀን 20)\n' +
    '• @activemovers\n' +
    'ለዋጋ መልዕክቶች ተመልከት ሊቻል ይሆናል።'
  )
}

export function menuPrompt(locale: IntakeLocale): string {
  return locale === 'en'
    ? 'What would you like to do?'
    : 'ምን እንድረዳዎ ይፈልጋሉ?'
}
