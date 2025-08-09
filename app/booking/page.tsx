import { Metadata } from 'next'
import { Suspense } from 'react'
import { BookingPage } from '../../components/pages/booking-page'

export const metadata: Metadata = {
  title: 'Book Moving Service',
  description: 'Book your professional moving service with Active Movers & Packers. Choose your preferred date and time for a stress-free move.',
}

export default function BookingPageRoute() {
  return (
    <div className="pt-16">
      <Suspense fallback={null}>
        <BookingPage />
      </Suspense>
    </div>
  )
} 