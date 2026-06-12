import { SITE_CONFIG } from '@/constants/site'

/**
 * Contact channels for the Addis Active Movers premium landing only (phone / WhatsApp / email).
 * Values follow the same operational lines as the main site configuration.
 */
export const ADDIS_PREMIUM_CONTACT = {
  phone: SITE_CONFIG.links.phone,
  whatsapp: SITE_CONFIG.links.whatsapp,
  email: SITE_CONFIG.links.email,
} as const

export const ADDIS_PREMIUM_WHATSAPP_MESSAGES = {
  quote: encodeURIComponent(
    'Hello — I would like a moving and relocation quote in Addis Ababa.',
  ),
  urgent: encodeURIComponent(
    'Hello — I need to discuss an urgent or premium move in Addis Ababa. Please advise availability.',
  ),
  sticky: encodeURIComponent('Hello — I need a moving quote in Addis Ababa.'),
} as const
