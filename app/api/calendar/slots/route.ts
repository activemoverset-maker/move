import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const availableOnly = searchParams.get('availableOnly') === 'true'

    let where: any = {}

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (availableOnly) {
      where.isAvailable = true
      where.currentBookings = {
        lt: where.maxBookings || 3
      }
    }

    const slots = await prisma.calendarSlot.findMany({
      where,
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Error fetching calendar slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar slots' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, startTime, endTime, isAvailable, maxBookings, notes } = body

    // Validate required fields
    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Date, start time, and end time are required' },
        { status: 400 }
      )
    }

    // Check if slot already exists
    const existingSlot = await prisma.calendarSlot.findUnique({
      where: {
        date_startTime: {
          date: new Date(date),
          startTime
        }
      }
    })

    if (existingSlot) {
      return NextResponse.json(
        { error: 'Slot already exists for this date and time' },
        { status: 409 }
      )
    }

    const slot = await prisma.calendarSlot.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: isAvailable ?? true,
        maxBookings: maxBookings ?? 3,
        notes
      }
    })

    return NextResponse.json(slot, { status: 201 })
  } catch (error) {
    console.error('Error creating calendar slot:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar slot' },
      { status: 500 }
    )
  }
} 
 
 
 