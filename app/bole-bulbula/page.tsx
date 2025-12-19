import { Metadata } from 'next'
import { BoleBulbulaPage } from '../../components/pages/bole-bulbula-page'
import { BoleBulbulaFooter } from '../../components/bole-bulbula-footer'

export const metadata: Metadata = {
  title: 'Active Movers Bole Bulbula - Bole Bulbula Moving Services | Professional Bole Bulbula Movers',
  description: 'Your trusted moving partner in Bole Bulbula, Addis Ababa. Specialized moving and packing services for Bole Bulbula residents. Local expertise, fast response, and reliable service in Bole Bulbula area.',
  keywords: [
    'Bole Bulbula moving services', 'Bole Bulbula movers', 'moving company Bole Bulbula', 'professional movers Bole Bulbula',
    'packing services Bole Bulbula', 'office relocation Bole Bulbula', 'residential moving Bole Bulbula',
    'furniture moving Bole Bulbula', 'storage solutions Bole Bulbula', 'local moving Bole Bulbula',
    'home relocation Bole Bulbula', 'commercial moving Bole Bulbula', 'Addis Ababa Bole Bulbula movers'
  ],
  openGraph: {
    title: 'Active Movers Bole Bulbula - Bole Bulbula Moving Services | Professional Bole Bulbula Movers',
    description: 'Trusted moving services in Bole Bulbula, Addis Ababa with professional Ethiopian staff. Safe, efficient, and affordable home and office relocations.',
    type: 'website',
    url: 'https://www.activemoverset.com/bole-bulbula',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Active Movers Bole Bulbula Branch - Professional Moving Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Active Movers Bole Bulbula - Bole Bulbula Moving Services | Professional Bole Bulbula Movers',
    description: 'Professional moving and packing services in Bole Bulbula, Addis Ababa.',
    images: ['/og-image.jpg'],
    creator: '@activemoverset',
    site: '@activemoverset',
  },
  alternates: {
    canonical: 'https://www.activemoverset.com/bole-bulbula',
  },
}

export default function BoleBulbulaBranchPage() {
  return <BoleBulbulaPage />
}
