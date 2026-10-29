import type { Metadata, Viewport } from 'next'
import { inter } from './fonts/inter'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Active Movers & Packers | Movers and Packers in Addis Ababa',
    template: '%s | Active Movers & Packers',
  },
  description:
    'Professional moving and packing services in Addis Ababa, Ethiopia. Local moving, packaging, storage solutions, and office relocation services.',
  keywords: [
    'moving services',
    'packing services',
    'storage solutions',
    'office relocation',
    'Addis Ababa',
    'Ethiopia',
    'professional movers',
    'local moving',
    'residential moving',
    'commercial moving',
    'furniture moving',
    'safe moving',
    'reliable movers',
    'moving company',
    'packaging services',
    'home relocation',
    'office moving',
    'Ethiopian moving services',
    'Addis Ababa movers',
    'moving and packing',
  ],
  authors: [{ name: 'Active Movers & Packers' }],
  creator: 'Active Movers & Packers',
  publisher: 'Active Movers & Packers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.activemoverset.com'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/logotr.png', sizes: 'any' },
      { url: '/images/logotr.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/logotr.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/images/logotr.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/images/logotr.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Active Movers & Packers | Movers and Packers in Addis Ababa',
    description:
      'Professional moving and packing services in Addis Ababa, Ethiopia. Local moving, packaging, storage solutions, and office relocation services.',
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
    title: 'Active Movers & Packers | Movers and Packers in Addis Ababa',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="describedby" href="https://www.activemoverset.com/llms.txt" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
