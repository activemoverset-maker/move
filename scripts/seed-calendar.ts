import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCalendar() {
  try {
    console.log('🌱 Seeding calendar data...')

    // Create default calendar settings
    const settings = await prisma.calendarSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        workingHoursStart: '08:00',
        workingHoursEnd: '18:00',
        slotDuration: 60,
        maxBookingsPerSlot: 3,
        advanceBookingDays: 30,
        weekendBookings: false,
        holidayBookings: false,
        maintenanceMode: false
      }
    })

    console.log('✅ Calendar settings created')

    // Generate slots for the next 30 days
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    const slots = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      
      // Skip weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Generate slots for this day (8 AM to 6 PM, 1-hour slots)
        for (let hour = 8; hour < 18; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00`
          const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
          
          slots.push({
            date: new Date(currentDate),
            startTime,
            endTime,
            isAvailable: true,
            maxBookings: 3,
            currentBookings: 0,
            notes: ''
          })
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Create slots in batches
    for (const slot of slots) {
      await prisma.calendarSlot.upsert({
        where: {
          date_startTime: {
            date: slot.date,
            startTime: slot.startTime
          }
        },
        update: {},
        create: slot
      })
    }

    console.log(`✅ Created ${slots.length} calendar slots`)

    // Create some sample holidays
    const holidays = [
      {
        name: 'New Year',
        date: new Date(new Date().getFullYear(), 0, 1),
        isRecurring: true
      },
      {
        name: 'Ethiopian New Year',
        date: new Date(new Date().getFullYear(), 8, 11), // September 11
        isRecurring: true
      }
    ]

    for (const holiday of holidays) {
      await prisma.holiday.upsert({
        where: {
          id: `holiday-${holiday.name.toLowerCase().replace(/\s+/g, '-')}`
        },
        update: {},
        create: {
          id: `holiday-${holiday.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: holiday.name,
          date: holiday.date,
          isRecurring: holiday.isRecurring
        }
      })
    }

    console.log('✅ Holidays created')

    console.log('🎉 Calendar seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding calendar:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCalendar() 
 
 
 