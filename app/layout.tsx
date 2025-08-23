import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Suspense } from 'react'
import { FloatingButtons } from '@/components/floating-buttons'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@/components/google-analytics'
import { LanguageProvider } from '@/contexts/language-context'
import { LoadingProvider } from '@/contexts/loading-context'
import { GlobalLoadingScreen } from '@/components/global-loading-screen'
import { GlobalSEO } from '@/components/seo/global-seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Active Movers & Packers - Professional Moving Services in Addis Ababa',
    template: '%s | Active Movers & Packers'
  },
  description: 'Professional moving and packing services in Addis Ababa, Ethiopia. Local moving, packaging, storage solutions, and office relocation services.',
  keywords: [
    'moving services', 'packing services', 'storage solutions', 'office relocation', 
    'Addis Ababa', 'Ethiopia', 'professional movers', 'local moving', 'residential moving',
    'commercial moving', 'furniture moving', 'safe moving', 'reliable movers', 
    'moving company', 'packaging services', 'home relocation', 'office moving',
    'Ethiopian moving services', 'Addis Ababa movers', 'moving and packing'
  ],
  authors: [{ name: 'Active Movers & Packers' }],
  creator: 'Active Movers & Packers',
  publisher: 'Active Movers & Packers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://activemoverset.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'am': '/?lang=am',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/logotr.png', sizes: 'any' },
      { url: '/images/logotr.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/logotr.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logotr.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/logotr.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Active Movers & Packers - Professional Moving Services in Addis Ababa',
    description: 'Professional moving and packing services in Addis Ababa, Ethiopia. Local moving, packaging, storage solutions, and office relocation services.',
    siteName: 'Active Movers & Packers',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Active Movers & Packers',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || '',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <LoadingProvider>
          <Suspense fallback={null}>
            <LanguageProvider>
              <Suspense fallback={null}>
                <GlobalLoadingScreen />
              </Suspense>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <FloatingButtons />
              <Toaster />
              <GoogleAnalytics />
              <Analytics />
              <GlobalSEO />
            </LanguageProvider>
          </Suspense>
        </LoadingProvider>
      </body>
    </html>
  )
} 