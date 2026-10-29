import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/hero-section'
import { HeroLcpBackground } from '@/components/sections/hero-lcp-background'
import { MovingGuidesSection } from '@/components/sections/moving-guides-section'
import { HomePricingSection } from '@/components/sections/home-pricing-section'
import { HomepageSEO } from '@/components/seo/homepage-seo'

const MarqueeTrustBar = dynamic(() =>
  import('@/components/sections/marquee-trust-bar').then((m) => m.MarqueeTrustBar)
)
const ServicesSection = dynamic(() =>
  import('@/components/sections/services-section').then((m) => m.ServicesSection)
)
const HowItWorksSection = dynamic(() =>
  import('@/components/sections/how-it-works-section').then((m) => m.HowItWorksSection)
)
const BentoFeaturesSection = dynamic(() =>
  import('@/components/sections/bento-features-section').then((m) => m.BentoFeaturesSection)
)
const ServiceAreasSection = dynamic(() =>
  import('@/components/sections/service-areas-section').then((m) => m.ServiceAreasSection)
)
const DeferredHomeMiddle = dynamic(() =>
  import('@/components/sections/deferred-home-sections').then((m) => m.DeferredHomeMiddle)
)
const DeferredHomeBottom = dynamic(() =>
  import('@/components/sections/deferred-home-sections').then((m) => m.DeferredHomeBottom)
)

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
