import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ImageShowcase } from '@/components/sections/image-showcase'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { TikTokSection } from '@/components/sections/tiktok-section'
import { CTASection } from '@/components/sections/cta-section'
import { CalendarSection } from '@/components/sections/calendar-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { HomepageSEO } from '@/components/seo/homepage-seo'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Professional Moving Services in Addis Ababa, Ethiopia',
  description: 'Professional moving and packing services in Addis Ababa. Local moving, office relocation, packaging, and storage solutions. Trusted by thousands of customers.',
  keywords: [
    'moving services Addis Ababa', 'professional movers Ethiopia', 'packing services',
    'office relocation Addis Ababa', 'residential moving', 'furniture moving',
    'storage solutions Ethiopia', 'local moving company', 'reliable movers',
    'home relocation services', 'commercial moving', 'Ethiopian moving company'
  ],
  openGraph: {
    title: 'Active Movers & Packers - Professional Moving Services in Addis Ababa, Ethiopia',
    description: 'Active Movers & Packers provides professional moving, packaging, and storage services in Addis Ababa, Ethiopia.',
    type: 'website',
    url: 'https://www.activemoverset.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Active Movers & Packers - Professional Moving Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Active Movers & Packers - Professional Moving Services in Addis Ababa',
    description: 'Professional moving and packing services in Addis Ababa, Ethiopia.',
    images: ['/og-image.jpg'],
    creator: '@activemoverset',
    site: '@activemoverset',
  },
  alternates: {
    canonical: 'https://www.activemoverset.com',
  },
}

export default function HomePage() {
  return (
    <>
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
      <HomepageSEO />
    </>
  )
} 
 
 