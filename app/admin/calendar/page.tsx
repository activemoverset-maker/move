import { Metadata } from 'next'
import { CalendarManagement } from '@/components/admin/calendar-management'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Calendar Management | Schedule & Availability',
  description: 'Manage calendar and availability for Active Movers & Packers. Set business hours, holidays, and appointment scheduling.',
}

export default function AdminCalendarPage() {
  return (
    <div className="pt-16">
      <CalendarManagement />
    </div>
  )
} 
 
 
 