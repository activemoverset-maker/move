import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      booking
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update booking' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await prisma.booking.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete booking' 
      },
      { status: 500 }
    )
  }
} 