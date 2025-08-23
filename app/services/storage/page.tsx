import { Metadata } from 'next'
import { ServiceDetail } from '@/components/pages/service-detail'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Storage Solutions | Secure Storage Services in Addis Ababa',
  description: 'Secure storage solutions in Addis Ababa by Active Movers & Packers. Climate-controlled storage, short-term and long-term options for household and business items.',
  openGraph: {
    title: 'Active Movers & Packers - Storage Solutions | Secure Storage Services in Addis Ababa',
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
 
 
 