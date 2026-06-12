import type { Metadata } from 'next'
import { AddisPremiumLanding } from '@/components/landing/addis-premium/landing'
import { SITE_CONFIG } from '@/constants/site'

const site = SITE_CONFIG.url.replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Addis Active Movers — Premium Moving & Relocation in Addis Ababa',
  description:
    'Luxury-grade home and office relocation in Addis Ababa. Packing, loading, insured transport, and citywide coverage — hubbed in Megenagna (መገናኛ).',
  keywords: [
    'Addis Active Movers',
    'movers Addis Ababa',
    'office relocation Ethiopia',
    'premium moving company',
    'Megenagna movers',
    'furniture moving Addis',
    'packing services Addis Ababa',
  ],
  openGraph: {
    title: 'Addis Active Movers — Premium Moving & Relocation',
    description:
      'Trust, safety, and logistics-grade execution for residential and commercial moves across Addis Ababa.',
    type: 'website',
    url: `${site}/addis-active-movers`,
    siteName: 'Addis Active Movers',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Addis Active Movers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Addis Active Movers — Premium Moving & Relocation',
    description: 'Premium moving and relocation services in Addis Ababa, Ethiopia.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${site}/addis-active-movers`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: 'Addis Active Movers',
  description:
    'Professional moving, packing, and office relocation services in Addis Ababa, Ethiopia.',
  url: `${site}/addis-active-movers`,
  telephone: SITE_CONFIG.links.phone,
  email: SITE_CONFIG.links.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Addis Ababa',
    addressRegion: 'Addis Ababa',
    streetAddress: 'Megenagna',
    addressCountry: 'ET',
  },
  areaServed: [
    'Megenagna',
    'Bole',
    'CMC',
    'Piassa',
    'Kazanchis',
    'Gerji',
    'Ayat',
    'Lideta',
    'Jemo',
    'Summit',
    'Sarbet',
  ],
  priceRange: '$$',
}

export default function AddisActiveMoversPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AddisPremiumLanding />
    </>
  )
}
