import { Metadata } from 'next'
import { ContactPage } from '@/components/pages/contact-page'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Active Movers & Packers for professional moving services in Addis Ababa. Call, WhatsApp, or fill out our contact form.',
  openGraph: {
    title: 'Contact Us',
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
 
 
 