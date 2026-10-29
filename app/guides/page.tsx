import { Metadata } from 'next'
import { GuideList } from '@/components/pages/guide-list'
import { getPublishedGuides } from '@/lib/guide-data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Moving Guides - Active Movers & Packers',
  description:
    'Evergreen moving guides for Addis Ababa: neighborhood relocations, condo rules, pricing, commercial moves, and checklists from Active Movers.',
  keywords:
    'moving guides Addis Ababa, relocation guide Ethiopia, condo moving Addis, movers pricing Addis Ababa',
  openGraph: {
    title: 'Moving Guides - Active Movers & Packers',
    description: 'In-depth moving guides for Addis Ababa and Ethiopia.',
    type: 'website',
    url: 'https://www.activemoverset.com/guides',
    siteName: 'Active Movers & Packers',
    images: [
      {
        url: 'https://www.activemoverset.com/images/gallary/qua1.png',
        width: 1200,
        height: 630,
        alt: 'Active Movers Moving Guides',
      },
    ],
  },
}

export default function GuidesPage() {
  const posts = getPublishedGuides()
  return (
    <div className="pt-16">
      <GuideList posts={posts} />
    </div>
  )
}
