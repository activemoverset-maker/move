import { Metadata } from 'next'
import { Suspense } from 'react'
import { BookingPage } from '../../components/pages/booking-page'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Book Moving Service | Online Booking for Addis Ababa',
  description: 'Book your professional moving service online with Active Movers & Packers in Addis Ababa. Easy scheduling, instant quotes, and secure booking for local and office moves.',
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