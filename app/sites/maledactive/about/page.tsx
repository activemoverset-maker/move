import { MaledAboutPage } from '@/components/maledactive/pages/maled-about-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Maledactive Movers — your trusted moving partner in Addis Ababa, Ethiopia.',
  alternates: { canonical: '/about' },
}

export default function Page() {
  return <MaledAboutPage />
}
