"use client"

import { usePathname } from 'next/navigation'
import { Footer } from './footer'

export function ConditionalFooter() {
  const pathname = usePathname()

  // Don't render Footer on Bole Bulbula branch pages
  if (pathname.startsWith('/bole-bulbula')) {
    return null
  }

  // Premium landing includes its own footer
  if (pathname.startsWith('/addis-active-movers')) {
    return null
  }

  return <Footer />
}


