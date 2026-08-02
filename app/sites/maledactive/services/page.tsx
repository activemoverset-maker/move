import { MaledServicesPage } from '@/components/maledactive/pages/maled-services-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Local moving, packing, office relocation, and storage services from Maled Active Movers.',
  alternates: { canonical: '/services' },
}

export default function Page() {
  return <MaledServicesPage />
}
