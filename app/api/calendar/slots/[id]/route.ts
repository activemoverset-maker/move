import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slot = await prisma.calendarSlot.findUnique({
      where: { id: params.id }
    })

    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(slot)
  } catch (error) {
    console.error('Error fetching slot:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slot' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { date, startTime, endTime, isAvailable, maxBookings, notes } = body

    const slot = await prisma.calendarSlot.update({
      where: { id: params.id },
      data: {
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        isAvailable,
        maxBookings,
        notes
      }
    })

    return NextResponse.json(slot)
  } catch (error) {
    console.error('Error updating slot:', error)
    return NextResponse.json(
      { error: 'Failed to update slot' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.calendarSlot.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slot:', error)
    return NextResponse.json(
      { error: 'Failed to delete slot' },
      { status: 500 }
    )
  }
} 
 
 
 