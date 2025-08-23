import { Metadata } from 'next'
import { AdminBookings } from '@/components/admin/admin-bookings'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Bookings Management | Admin Portal',
  description: 'Manage customer bookings and appointments for Active Movers & Packers. View, edit, and organize all moving service bookings.',
}

export default function AdminBookingsPage() {
  return (
    <div className="pt-16">
      <AdminBookings />
    </div>
  )
} 