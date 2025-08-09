import { Metadata } from 'next'
import { ServiceDetail } from '@/components/pages/service-detail'

export const metadata: Metadata = {
  title: 'Packaging Services - Professional Packing Solutions in Addis Ababa',
  description: 'Professional packaging and packing services in Addis Ababa. Expert packing, fragile item protection, and secure packaging solutions.',
  openGraph: {
    title: 'Packaging Services - Professional Packing Solutions in Addis Ababa',
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
 
 
 