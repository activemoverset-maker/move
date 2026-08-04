import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function sendToTelegram(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  site?: string
}) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot token or chat ID not configured')
    return false
  }

  const siteLabel = data.site === 'maledactive' ? 'Maledactive' : 'Active Movers'

  try {
    const message = `
🆕 *New Contact Form Submission*
🏢 *Site:* ${siteLabel}

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone}
📋 *Subject:* ${data.subject}

💬 *Message:*
${data.message}

⏰ *Submitted:* ${new Date().toLocaleString()}
    `.trim()

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Error sending to Telegram:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, site } = body

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'new',
      },
    })

    // Send to Telegram
    const telegramSent = await sendToTelegram({
      name,
      email,
      phone,
      subject,
      message,
      site,
    })

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact,
      telegramSent,
    }, { status: 201 })

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
} 
 
 
 