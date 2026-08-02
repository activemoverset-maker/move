import { MaledHomePage } from '@/components/maledactive/pages/maled-home-page'
import { MALED_SITE } from '@/lib/maledactive-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${MALED_SITE.shortName} — Professional Moving in Addis Ababa`,
  alternates: { canonical: '/' },
}

export default function Page() {
  return <MaledHomePage />
}
