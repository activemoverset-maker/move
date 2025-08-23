import { Metadata } from 'next'
import { ServiceDetail } from '@/components/pages/service-detail'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Office Relocation | Professional Business Moving Services in Addis Ababa',
  description: 'Professional office relocation services in Addis Ababa by Active Movers & Packers. Complete business moving solutions with minimal downtime and expert handling.',
  openGraph: {
    title: 'Active Movers & Packers - Office Relocation | Professional Business Moving Services in Addis Ababa',
    description: 'Professional office relocation services in Addis Ababa. Business moving, equipment handling, and minimal downtime solutions.',
  },
}

export default function OfficeRelocationPage() {
  return (
    <div className="pt-16">
      <ServiceDetail serviceId="office-relocation" />
    </div>
  )
} 
 
 
 