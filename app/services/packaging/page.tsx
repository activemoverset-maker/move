import { Metadata } from 'next'
import { ServiceDetail } from '@/components/pages/service-detail'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Packaging Services | Professional Packing Solutions in Addis Ababa',
  description: 'Professional packaging and packing services in Addis Ababa by Active Movers & Packers. Expert packing for fragile items, furniture, and complete household moves.',
  openGraph: {
    title: 'Active Movers & Packers - Packaging Services | Professional Packing Solutions in Addis Ababa',
    description: 'Professional packaging and packing services in Addis Ababa. Expert packing, fragile item protection, and secure packaging solutions.',
  },
}

export default function PackagingPage() {
  return (
    <div className="pt-16">
      <ServiceDetail serviceId="packaging" />
    </div>
  )
} 
 
 
 