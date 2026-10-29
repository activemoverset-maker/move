import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { HeroLcpBackground } from '@/components/sections/hero-lcp-background'
import { MarqueeTrustBar } from '@/components/sections/marquee-trust-bar'
import { ServicesSection } from '@/components/sections/services-section'
import { HowItWorksSection } from '@/components/sections/how-it-works-section'
import { BentoFeaturesSection } from '@/components/sections/bento-features-section'
import { ServiceAreasSection } from '@/components/sections/service-areas-section'
import { MovingGuidesSection } from '@/components/sections/moving-guides-section'
import { HomePricingSection } from '@/components/sections/home-pricing-section'
import { DeferredHomeMiddle, DeferredHomeBottom } from '@/components/sections/deferred-home-sections'
import { HomepageSEO } from '@/components/seo/homepage-seo'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Movers and Packers in Addis Ababa | Active Movers & Packers',
  description: 'Professional movers and packers in Addis Ababa. Local moving, office relocation, packaging, and storage. Call +251982260000 or book online.',
  keywords: [
    'moving services Addis Ababa', 'professional movers Ethiopia', 'packing services',
    'office relocation Addis Ababa', 'residential moving', 'furniture moving',
    'storage solutions Ethiopia', 'local moving company', 'reliable movers',
    'home relocation services', 'commercial moving', 'Ethiopian moving company'
  ],
  openGraph: {
    title: 'Movers and Packers in Addis Ababa | Active Movers & Packers',
    description: 'Professional movers and packers in Addis Ababa. Local moving, office relocation, packaging, and storage.',
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
    title: 'Movers and Packers in Addis Ababa | Active Movers & Packers',
    description: 'Professional movers and packers in Addis Ababa. Local moving, office relocation, packaging, and storage.',
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
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-60"
            aria-hidden
          >
            <HeroLcpBackground />
          </div>
          <HeroSection />
        </div>
        <MarqueeTrustBar />
        <div className="section-spacing">
          <ServicesSection />
        </div>
        <HomePricingSection />
        <HowItWorksSection />
        <BentoFeaturesSection />
        <DeferredHomeMiddle />
        <ServiceAreasSection />
        <MovingGuidesSection />
        <DeferredHomeBottom />
      </div>
      <HomepageSEO />
    </>
  )
}
