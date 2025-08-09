"use client"

import { AvailabilityCalendar } from '@/components/calendar/availability-calendar'

export function CalendarSection() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <AvailabilityCalendar />
      </div>
    </section>
  )
} 
 
 