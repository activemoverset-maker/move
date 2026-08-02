export const MALED_SITE = {
  name: 'Maled Active Movers',
  shortName: 'Maled Active',
  tagline: 'Professional moving services you can trust',
  description:
    'Maled Active Movers delivers reliable residential and commercial moving, packing, and relocation services across Addis Ababa and Ethiopia.',
  url: process.env.NEXT_PUBLIC_MALEDACTIVE_URL || 'https://www.maledactive.homes',
  contact: {
    phone: process.env.MALED_PHONE_NUMBER || '+251912111714',
    phoneDisplay: '0912 111 714',
    whatsapp: process.env.MALED_WHATSAPP_NUMBER || '+251912111714',
    email: process.env.MALED_EMAIL || 'info@maledactive.homes',
    address: 'Addis Ababa, Ethiopia',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Addis+Ababa%2C+Ethiopia',
  },
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
  },
} as const

export const MALED_ASSETS = {
  logo: '/maledactive/logo.png',
  hero: '/maledactive/hero.png',
  ogImage: '/maledactive/hero.png',
} as const

export const MALED_WHATSAPP_MESSAGES = {
  quote: encodeURIComponent(
    'Hello — I would like a moving quote from Maled Active Movers.',
  ),
  contact: encodeURIComponent(
    'Hello — I have a question about your moving services.',
  ),
} as const
