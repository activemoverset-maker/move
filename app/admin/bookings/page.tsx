import { Metadata } from 'next'
import { AdminBookings } from '@/components/admin/admin-bookings'

export const metadata: Metadata = {
  title: 'Bookings Management - Active Movers & Packers',
  description: 'Admin bookings management for Active Movers & Packers.',
}

export default function AdminBookingsPage() {
  return (
    <div className="pt-16">
      <AdminBookings />
    </div>
  )
} 