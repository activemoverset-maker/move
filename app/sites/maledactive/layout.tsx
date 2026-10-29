import type { Metadata } from 'next'
import { plusJakartaSans } from '@/app/fonts/plus-jakarta'
import { MaledAmbientLayer } from '@/components/maledactive/motion/maled-ambient-layer'
import { MaledFooter } from '@/components/maledactive/layout/maled-footer'
import { MaledHeader } from '@/components/maledactive/layout/maled-header'
import { MaledStickyCta } from '@/components/maledactive/layout/maled-sticky-cta'
import { MALED_ASSETS, MALED_SITE } from '@/lib/maledactive-config'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    default: `${MALED_SITE.name} — Professional Moving Services in Addis Ababa`,
    template: `%s | ${MALED_SITE.shortName}`,
  },
  description: MALED_SITE.description,
  metadataBase: new URL(MALED_SITE.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: MALED_SITE.name,
    title: MALED_SITE.name,
    description: MALED_SITE.description,
    images: [{ url: MALED_ASSETS.ogImage, width: 1200, height: 630, alt: MALED_SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: MALED_SITE.name,
    description: MALED_SITE.description,
    images: [MALED_ASSETS.ogImage],
  },
  icons: {
    icon: MALED_ASSETS.logo,
    apple: MALED_ASSETS.logo,
  },
  robots: { index: true, follow: true },
}

export default function MaledActiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} maledactive-site relative isolate min-h-screen bg-[#0a0f1a] text-white antialiased`}
    >
      <MaledAmbientLayer />
      <div className="maledactive-noise pointer-events-none fixed inset-0 z-[2]" aria-hidden />
      <MaledHeader />
      <div className="relative z-10">{children}</div>
      <MaledFooter />
      <MaledStickyCta />
      <Toaster />
      <Analytics />
    </div>
  )
}
