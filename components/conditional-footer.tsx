"use client"

import { usePathname } from 'next/navigation'
import { Footer } from './footer'

export function ConditionalFooter() {
  const pathname = usePathname()

  // Don't render Footer on Bole Bulbula branch pages
  if (pathname.startsWith('/bole-bulbula')) {
    return null
  }

  return <Footer />
}
