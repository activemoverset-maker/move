import { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing Active Movers & Packers website content.',
}

export default function AdminPage() {
  return (
    <div className="pt-16">
      <AdminDashboard />
    </div>
  )
} 