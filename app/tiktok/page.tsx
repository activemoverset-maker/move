import { Metadata } from 'next'
import { Suspense } from 'react'
import { TikTokPage } from '@/components/pages/tiktok-page'

export const metadata: Metadata = {
  title: 'Watch Active Movers ET on TikTok | Movers in Addis Ababa',
  description:
    'Watch @activemoverset on TikTok — real moves, packing tips, and our crew in action across Addis Ababa.',
  alternates: {
    canonical: 'https://www.activemoverset.com/tiktok',
  },
  openGraph: {
    title: 'Watch Active Movers ET on TikTok',
    description: 'See our professional moving team in action on TikTok.',
    url: 'https://www.activemoverset.com/tiktok',
    type: 'website',
  },
}

export default function TikTokRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#030712] pt-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <div className="pt-16">
        <TikTokPage />
      </div>
    </Suspense>
  )
}
