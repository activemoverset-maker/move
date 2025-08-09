import { Metadata } from 'next'
import { ServiceDetail } from '@/components/pages/service-detail'

export const metadata: Metadata = {
  title: 'Storage Solutions - Secure Storage Services in Addis Ababa',
  description: 'Secure storage solutions in Addis Ababa. Climate-controlled storage, short-term and long-term storage options for your belongings.',
  openGraph: {
    title: 'Storage Solutions - Secure Storage Services in Addis Ababa',
    description: 'Secure storage solutions in Addis Ababa. Climate-controlled storage, short-term and long-term storage options for your belongings.',
  },
}

export default function StoragePage() {
  return (
    <div className="pt-16">
      <ServiceDetail serviceId="storage" />
    </div>
  )
} 
 
 
 