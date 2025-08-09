import { Metadata } from 'next'
import { ServicesOverview } from '@/components/pages/services-overview'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Comprehensive moving and packing services in Addis Ababa. Local moving, packaging, storage solutions, and office relocation services.',
  openGraph: {
    title: 'Our Services',
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
 
 
 