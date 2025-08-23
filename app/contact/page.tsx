import { Metadata } from 'next'
import { ContactPage } from '@/components/pages/contact-page'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Contact Us | Get Free Quote for Moving Services in Addis Ababa',
  description: 'Contact Active Movers & Packers for professional moving services in Addis Ababa. Get free quotes, schedule consultations, and book your stress-free move today.',
  openGraph: {
    title: 'Active Movers & Packers - Contact Us | Get Free Quote for Moving Services in Addis Ababa',
    description: 'Get in touch with Active Movers & Packers for professional moving services.',
  },
}

export default function ContactPageRoute() {
  return (
    <div className="pt-16">
      <ContactPage />
    </div>
  )
} 
 
 
 