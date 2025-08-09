import { Metadata } from 'next'
import { BookingPage } from '../../components/pages/booking-page'

export const metadata: Metadata = {
  title: 'Book Moving Service',
  description: 'Book your professional moving service with Active Movers & Packers. Choose your preferred date and time for a stress-free move.',
}

export default function BookingPageRoute() {
  return (
    <div className="pt-16">
      <BookingPage />
    </div>
  )
} 