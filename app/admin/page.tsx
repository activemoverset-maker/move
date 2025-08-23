import { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Admin Dashboard | Management Portal',
  description: 'Admin dashboard for Active Movers & Packers. Manage bookings, calendar, blog posts, gallery, and website analytics.',
}

export default function AdminPage() {
  return (
    <div className="pt-16">
      <AdminDashboard />
    </div>
  )
} 