import { MaledContactForm } from '@/components/maledactive/sections/maled-contact-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Maled Active Movers for a moving quote. Call 0912 111 714 or send us a message.',
  alternates: { canonical: '/contact' },
}

export default function Page() {
  return <MaledContactForm />
}
