import { Metadata } from 'next'
import { AboutPage } from '../../components/pages/about-page'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Active Movers, a trusted local moving company in Addis Ababa, Ethiopia. Professional, reliable, and affordable moving services with experienced Ethiopian staff.',
  openGraph: {
    title: 'About Us',
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
 