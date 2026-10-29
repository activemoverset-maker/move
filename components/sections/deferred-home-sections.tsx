'use client'

import dynamic from 'next/dynamic'
import { LazyOnView } from '@/components/lazy-on-view'

const ImageShowcase = dynamic(
  () => import('@/components/sections/image-showcase').then((m) => m.ImageShowcase),
  { loading: () => <div className="min-h-[28rem]" aria-hidden /> }
)

const AnimatedStatsBand = dynamic(
  () => import('@/components/sections/animated-stats-band').then((m) => m.AnimatedStatsBand),
  { loading: () => <div className="min-h-[12rem]" aria-hidden /> }
)

const CalendarSection = dynamic(
  () => import('@/components/sections/calendar-section').then((m) => m.CalendarSection),
  { ssr: false, loading: () => <div className="min-h-[32rem]" aria-hidden /> }
)

const TestimonialsSection = dynamic(
  () => import('@/components/sections/testimonials-section').then((m) => m.TestimonialsSection),
  { loading: () => <div className="min-h-[24rem]" aria-hidden /> }
)

const TikTokSection = dynamic(
  () => import('@/components/sections/tiktok-section').then((m) => m.TikTokSection),
  { ssr: false, loading: () => <div className="min-h-[28rem]" aria-hidden /> }
)

const GallerySection = dynamic(
  () => import('@/components/sections/gallery-section').then((m) => m.GallerySection),
  { ssr: false, loading: () => <div className="min-h-[40rem]" aria-hidden /> }
)

const CTASection = dynamic(
  () => import('@/components/sections/cta-section').then((m) => m.CTASection),
  { loading: () => <div className="min-h-[20rem]" aria-hidden /> }
)

export function DeferredHomeMiddle() {
  return (
    <>
      <div className="section-spacing">
        <LazyOnView minHeight="28rem">
          <ImageShowcase />
        </LazyOnView>
      </div>
      <LazyOnView minHeight="12rem">
        <AnimatedStatsBand />
      </LazyOnView>
      <div className="section-spacing">
        <LazyOnView minHeight="32rem">
          <CalendarSection />
        </LazyOnView>
      </div>
    </>
  )
}

export function DeferredHomeBottom() {
  return (
    <>
      <div className="section-spacing">
        <LazyOnView minHeight="24rem">
          <TestimonialsSection />
        </LazyOnView>
      </div>
      <div className="section-spacing">
        <LazyOnView minHeight="28rem">
          <TikTokSection />
        </LazyOnView>
      </div>
      <div className="section-spacing">
        <LazyOnView minHeight="40rem">
          <GallerySection />
        </LazyOnView>
      </div>
      <LazyOnView minHeight="20rem">
        <CTASection />
      </LazyOnView>
    </>
  )
}
