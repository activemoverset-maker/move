import { Metadata } from 'next'
import { ServiceDetail } from '@/components/pages/service-detail'

export const metadata: Metadata = {
  title: 'Local Moving Services - Professional Moving in Addis Ababa',
  description: 'Professional local moving services in Addis Ababa and surrounding areas. Same-day service, licensed & insured, experienced team.',
  openGraph: {
    title: 'Local Moving Services - Professional Moving in Addis Ababa',
    description: 'Professional local moving services in Addis Ababa and surrounding areas. Same-day service, licensed & insured, experienced team.',
  },
}

export default function LocalMovingPage() {
  return (
    <div className="pt-16">
      <ServiceDetail serviceId="local-moving" />
    </div>
  )
} 
 
 
 