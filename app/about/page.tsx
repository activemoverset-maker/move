import { Metadata } from 'next'
import { AboutPage } from '../../components/pages/about-page'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - About Us | Professional Moving Company in Addis Ababa',
  description: 'Learn about Active Movers & Packers, the leading moving company in Addis Ababa. Our experienced team provides reliable, safe, and professional moving services.',
  openGraph: {
    title: 'Active Movers & Packers - About Us | Professional Moving Company in Addis Ababa',
    description: 'Trusted moving services in Addis Ababa with professional Ethiopian staff. Safe, efficient, and affordable home and office relocations.',
    type: 'website',
  },
}

export default function AboutPageRoute() {
  return (
    <div className="pt-16">
      <AboutPage />
    </div>
  )
} 
 