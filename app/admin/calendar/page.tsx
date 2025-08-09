import { Metadata } from 'next'
import { CalendarManagement } from '@/components/admin/calendar-management'

export const metadata: Metadata = {
  title: 'Calendar Management - Active Movers & Packers',
  description: 'Admin calendar management for Active Movers & Packers.',
}

export default function AdminCalendarPage() {
  return (
    <div className="pt-16">
      <CalendarManagement />
    </div>
  )
} 
 
 
 