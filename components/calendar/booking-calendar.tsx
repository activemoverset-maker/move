"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

interface CalendarSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  maxBookings: number
  currentBookings: number
  notes?: string
}

interface CalendarSettings {
  workingHoursStart: string
  workingHoursEnd: string
  slotDuration: number
  maxBookingsPerSlot: number
  advanceBookingDays: number
  weekendBookings: boolean
  holidayBookings: boolean
  maintenanceMode: boolean
}

interface BookingCalendarProps {
  onSlotSelect: (slot: CalendarSlot) => void
  selectedSlot?: CalendarSlot | null
}

export function BookingCalendar({ onSlotSelect, selectedSlot }: BookingCalendarProps) {
  const { t, language } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [slots, setSlots] = useState<CalendarSlot[]>([])
  const [settings, setSettings] = useState<CalendarSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [localSelectedSlot, setLocalSelectedSlot] = useState<CalendarSlot | null>(selectedSlot || null)

  useEffect(() => {
    fetchCalendarData()
  }, [currentDate])

  useEffect(() => {
    setLocalSelectedSlot(selectedSlot || null)
  }, [selectedSlot])

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      console.log('Fetching calendar data for:', startOfMonth.toDateString(), 'to', endOfMonth.toDateString())
      
      const [slotsResponse, settingsResponse] = await Promise.all([
        fetch(`/api/calendar/slots?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}&availableOnly=true`),
        fetch('/api/calendar/settings')
      ])
      
      if (slotsResponse.ok && settingsResponse.ok) {
        const slotsData = await slotsResponse.json()
        const settingsData = await settingsResponse.json()
        
        console.log('Slots loaded:', slotsData.length)
        console.log('Sample slots:', slotsData.slice(0, 3))
        
        setSlots(slotsData)
        setSettings(settingsData)
      } else {
        console.error('Failed to fetch calendar data:', slotsResponse.status, settingsResponse.status)
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const days: Date[] = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return slots.filter(slot => slot.date === dateStr)
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleSlotClick = (slot: CalendarSlot) => {
    setLocalSelectedSlot(slot)
    onSlotSelect(slot)
  }

  const handleDayClick = (day: Date) => {
    if (isPastDate(day)) return
    
    const slotsForDay = getSlotsForDate(day)
    console.log('Day clicked:', day.toDateString(), 'Slots found:', slotsForDay.length)
    
    if (slotsForDay.length > 0) {
      handleSlotClick(slotsForDay[0])
    } else {
      // Even if no slots, allow selecting the day to show empty state
      const emptySlot: CalendarSlot = {
        id: 'temp',
        date: day.toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: false,
        maxBookings: 0,
        currentBookings: 0
      }
      handleSlotClick(emptySlot)
    }
  }

  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-10 w-10">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-base md:text-lg font-semibold text-gray-900 px-2 text-center">
          {currentDate.toLocaleString(language === 'am' ? 'am-ET' : 'en-US', { month: 'long', year: 'numeric' })}
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-10 w-10">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-4">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
          <div key={i} className="text-xs md:text-sm font-semibold text-gray-500 text-center py-2">{d}</div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {getDaysInMonth(currentDate).map((day, i) => {
          const slotsForDay = getSlotsForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()
          const isSelected = localSelectedSlot && localSelectedSlot.date === day.toISOString().split('T')[0]
          const isPast = isPastDate(day)
          const hasSlots = slotsForDay.length > 0
          
          return (
            <div 
              key={i} 
              className={`rounded-lg p-1 md:p-2 text-center transition-all duration-200 border-2 min-h-[60px] md:min-h-[80px] flex flex-col justify-center ${
                isPast 
                  ? 'text-gray-400 cursor-not-allowed border-gray-200' 
                  : hasSlots 
                    ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-md' 
                    : 'cursor-pointer hover:bg-gray-50 hover:border-gray-300'
              } ${
                isSelected ? 'bg-primary/10 border-primary shadow-md' : 
                isToday ? 'bg-green-50 border-green-300' : 
                'border-gray-200'
              }`}
              onClick={() => handleDayClick(day)}
            >
              <div className={`font-semibold text-sm md:text-base ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
              <div className="text-xs text-gray-500 mt-1 hidden md:block">
                {hasSlots ? `${slotsForDay.length} slots` : isPast ? '' : 'No slots'}
              </div>
              <div className="text-xs text-gray-500 mt-1 md:hidden">
                {hasSlots ? `${slotsForDay.length}` : isPast ? '' : '-'}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Time slots for selected day */}
      {localSelectedSlot && (
        <div className="mt-4 md:mt-6">
          <div className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm md:text-base">{localSelectedSlot.date}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {getSlotsForDate(new Date(localSelectedSlot.date)).map(slot => (
              <Button
                key={slot.id}
                variant={localSelectedSlot.id === slot.id ? 'default' : 'outline'}
                className="text-xs md:text-sm h-8 md:h-10 px-2 md:px-3"
                onClick={() => handleSlotClick(slot)}
              >
                <Clock className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{slot.startTime} - {slot.endTime}</span>
                <span className="sm:hidden">{slot.startTime}</span>
                <span className="ml-1 md:ml-2 text-gray-500 text-xs">
                  ({slot.maxBookings - slot.currentBookings} left)
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 
 
 