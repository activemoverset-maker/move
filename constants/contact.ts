/** Canonical NAP — single source for phone/WhatsApp (locked +251982260000). */
export const SITE_PHONE = '+251982260000'
export const SITE_WHATSAPP = '+251982260000'

export const BUSINESS_OPENING_HOURS = [
  {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const,
    opens: '08:00',
    closes: '18:00',
  },
]

export function openingHoursSpecificationForSchema() {
  return BUSINESS_OPENING_HOURS.map((block) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [...block.dayOfWeek],
    opens: block.opens,
    closes: block.closes,
  }))
}
