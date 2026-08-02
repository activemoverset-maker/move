import { MaledHero } from '@/components/maledactive/sections/maled-hero'
import { MaledMarquee } from '@/components/maledactive/sections/maled-marquee'
import { MaledTrustBand } from '@/components/maledactive/sections/maled-trust-band'
import { MaledWhyUs } from '@/components/maledactive/sections/maled-why-us'
import { MaledServicesPreview } from '@/components/maledactive/sections/maled-services-preview'
import { MaledProcess } from '@/components/maledactive/sections/maled-process'
import { MaledTestimonials } from '@/components/maledactive/sections/maled-testimonials'
import { MaledCta } from '@/components/maledactive/sections/maled-cta'

export function MaledHomePage() {
  return (
    <>
      <MaledHero />
      <MaledMarquee />
      <MaledTrustBand />
      <MaledWhyUs />
      <MaledServicesPreview />
      <MaledProcess />
      <MaledTestimonials />
      <MaledCta />
    </>
  )
}
