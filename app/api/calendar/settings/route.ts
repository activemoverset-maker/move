import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.calendarSettings.findFirst()
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.calendarSettings.create({
        data: {
          workingHoursStart: "08:00",
          workingHoursEnd: "18:00",
          slotDuration: 60,
          maxBookingsPerSlot: 3,
          advanceBookingDays: 30,
          weekendBookings: false,
          holidayBookings: false,
          maintenanceMode: false
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching calendar settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      workingHoursStart,
      workingHoursEnd,
      slotDuration,
      maxBookingsPerSlot,
      advanceBookingDays,
      weekendBookings,
      holidayBookings,
      maintenanceMode
    } = body

    let settings = await prisma.calendarSettings.findFirst()
    
    if (settings) {
      settings = await prisma.calendarSettings.update({
        where: { id: settings.id },
        data: {
          workingHoursStart,
          workingHoursEnd,
          slotDuration,
          maxBookingsPerSlot,
          advanceBookingDays,
          weekendBookings,
          holidayBookings,
          maintenanceMode
        }
      })
    } else {
      settings = await prisma.calendarSettings.create({
        data: {
          workingHoursStart,
          workingHoursEnd,
          slotDuration,
          maxBookingsPerSlot,
          advanceBookingDays,
          weekendBookings,
          holidayBookings,
          maintenanceMode
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating calendar settings:', error)
    return NextResponse.json(
      { error: 'Failed to update calendar settings' },
      { status: 500 }
    )
  }
} 
 
 
 