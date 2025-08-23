import { Metadata } from 'next'
import { ServicesOverview } from '@/components/pages/services-overview'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Our Services | Professional Moving & Packing in Addis Ababa',
  description: 'Comprehensive moving services in Addis Ababa: local moving, office relocation, packaging, storage solutions. Professional, reliable, and affordable moving services.',
  openGraph: {
    title: 'Active Movers & Packers - Our Services | Professional Moving & Packing in Addis Ababa',
    description: 'Comprehensive moving and packing services in Addis Ababa. Local moving, packaging, storage solutions, and office relocation services.',
  },
}

export default function ServicesPage() {
  return (
    <div className="pt-16">
      <ServicesOverview />
    </div>
  )
} 
 
 
 