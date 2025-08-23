import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification } from '../../../lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      fullName, 
      email, 
      phone, 
      fromAddress, 
      toAddress, 
      serviceType, 
      date, 
      time, 
      message 
    } = body

    // Validate required fields
    if (!fullName || !email || !phone || !fromAddress || !toAddress || !serviceType || !date || !time) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        fullName,
        phoneNumber: phone,
        fromAddress,
        toAddress,
        serviceType,
        date: new Date(date),
        message: message || null,
        status: 'pending'
      }
    })

    // Update calendar slot booking count
    const slotDate = new Date(date)
    const slot = await prisma.calendarSlot.findFirst({
      where: {
        date: slotDate,
        startTime: time
      }
    })

    if (slot) {
      await prisma.calendarSlot.update({
        where: { id: slot.id },
        data: {
          currentBookings: slot.currentBookings + 1
        }
      })
    }

    // Send Telegram notification
    const notificationMessage = `
🚚 *New Booking Received*

👤 *Customer:* ${fullName}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
📦 *Service:* ${serviceType}
📅 *Date:* ${new Date(date).toLocaleDateString()}
⏰ *Time:* ${time}
📍 *From:* ${fromAddress}
🎯 *To:* ${toAddress}
${message ? `💬 *Message:* ${message}` : ''}

🆔 *Booking ID:* ${booking.id}
    `.trim()

    await sendTelegramNotification(notificationMessage)

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    
    let where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    })

    // Format bookings for admin dashboard
    const formattedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      customerName: booking.fullName,
      serviceType: booking.serviceType,
      date: booking.date.toISOString().split('T')[0],
      time: 'N/A', // Time is not stored in the Booking model
      status: booking.status,
      amount: 0, // Amount is not stored in the Booking model
      phone: booking.phoneNumber,
      fromAddress: booking.fromAddress,
      toAddress: booking.toAddress,
      message: booking.message,
      createdAt: booking.createdAt
    }))

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      total: formattedBookings.length
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch bookings' 
      },
      { status: 500 }
    )
  }
} 
