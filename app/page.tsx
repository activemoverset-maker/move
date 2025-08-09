import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ImageShowcase } from '@/components/sections/image-showcase'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { TikTokSection } from '@/components/sections/tiktok-section'
import { CTASection } from '@/components/sections/cta-section'
import { CalendarSection } from '@/components/sections/calendar-section'
import { GallerySection } from '@/components/sections/gallery-section'

export const metadata: Metadata = {
  title: 'Professional Moving Services in Addis Ababa',
  description: 'Active Movers & Packers provides professional moving, packaging, and storage services in Addis Ababa, Ethiopia. Book your stress-free move today!',
  openGraph: {
    title: 'Professional Moving Services in Addis Ababa',
    description: 'Active Movers & Packers provides professional moving, packaging, and storage services in Addis Ababa, Ethiopia.',
  },
}

export default function HomePage() {
  return (
    <div className="pt-16">
      <HeroSection />
      <div className="section-spacing">
        <ServicesSection />
      </div>
      <div className="section-spacing">
        <ImageShowcase />
      </div>
      <div className="section-spacing">
        <CalendarSection />
      </div>
      <div className="section-spacing">
        <TestimonialsSection />
      </div>
      <div className="section-spacing">
        <TikTokSection />
      </div>
      <div className="section-spacing">
        <GallerySection />
      </div>
      <CTASection />
    </div>
  )
} 
 
 