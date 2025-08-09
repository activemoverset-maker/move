"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Check, X, ChevronLeft, ChevronRight, Truck, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'

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

export function AvailabilityCalendar() {
  const { t, language } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<CalendarSlot[]>([])
  const [settings, setSettings] = useState<CalendarSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null)

  useEffect(() => {
    fetchCalendarData()
  }, [currentDate])

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      
      // Get start and end of current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const [slotsResponse, settingsResponse] = await Promise.all([
        fetch(`/api/calendar/slots?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}&availableOnly=true`),
        fetch('/api/calendar/settings')
      ])

      if (slotsResponse.ok && settingsResponse.ok) {
        const slotsData = await slotsResponse.json()
        const settingsData = await settingsResponse.json()
        
        setSlots(slotsData)
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSlotClick = (slot: CalendarSlot) => {
    setSelectedSlot(slot)
    trackEvent({
      action: 'calendar_slot_selected',
      category: 'calendar',
      label: `Slot ${slot.date} ${slot.startTime}`
    })
  }

  const handleBooking = () => {
    if (selectedSlot) {
      trackEvent({
        action: 'calendar_booking_initiated',
        category: 'calendar',
        label: `Book ${selectedSlot.date} ${selectedSlot.startTime}`
      })
      // Redirect to booking page with pre-filled date and time
      window.location.href = `/booking?date=${selectedSlot.date}&time=${selectedSlot.startTime}`
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const getSlotsForDate = (date: Date) => {
    if (!date) return []
    
    const dateStr = date.toISOString().split('T')[0]
    return slots.filter(slot => slot.date.startsWith(dateStr))
  }

  const getAvailabilityStatus = (date: Date) => {
    const dateSlots = getSlotsForDate(date)
    if (dateSlots.length === 0) return 'no-slots'
    
    const availableSlots = dateSlots.filter(slot => 
      slot.isAvailable && slot.currentBookings < slot.maxBookings
    )
    
    if (availableSlots.length === 0) return 'full'
    if (availableSlots.length < dateSlots.length) return 'partial'
    return 'available'
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-800'
      case 'partial': return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800'
      case 'full': return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-800'
      default: return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-800'
    }
  }

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return language === 'am' ? 'ይገኛል' : 'Available'
      case 'partial': return language === 'am' ? 'ከፊል' : 'Limited'
      case 'full': return language === 'am' ? 'ሙሉ' : 'Full'
      default: return language === 'am' ? 'የለም' : 'No Slots'
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { 
    month: 'long', 
    year: 'numeric' 
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'am' ? 'የቀጠሮ መረጃ እያገኘ ነው...' : 'Loading availability...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-3 sm:px-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 px-2">
          {language === 'am' ? 'የመጓጓዣ ሰዓቶች ያግኙ' : 'Find Your Moving Time'}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-3">
          {language === 'am' 
            ? 'የሚገኙ ሰዓቶችን ይመልከቱ እና የተሻለ ቀጠሮ ያድርጉ' 
            : 'Check available slots and book your preferred moving time'
          }
        </p>
      </motion.div>

      {/* Calendar Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-primary to-green-600 text-white p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              <div>
                <h3 className="text-base sm:text-lg md:text-2xl font-bold">{monthName}</h3>
                <p className="text-green-100 text-xs sm:text-sm md:text-base">
                  {language === 'am' ? 'የመጓጓዣ ሰዓቶች' : 'Moving Schedule'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevMonth}
                className="text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextMonth}
                className="text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 sm:p-3 md:p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 sm:mb-3 md:mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs md:text-sm font-semibold text-gray-600 py-1 sm:py-2 md:py-3">
                {language === 'am' ? 
                  (day === 'Sun' ? 'እሁድ' : 
                   day === 'Mon' ? 'ሰኞ' : 
                   day === 'Tue' ? 'ማክሰኞ' : 
                   day === 'Wed' ? 'ረቡዕ' : 
                   day === 'Thu' ? 'ሐሙስ' : 
                   day === 'Fri' ? 'ዓርብ' : 'ቅዳ') : day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-14 sm:h-16 md:h-20"></div>
              }

              const availabilityStatus = getAvailabilityStatus(day)
              const isToday = day.toDateString() === new Date().toDateString()
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
              const isPast = isPastDate(day)

              return (
                <motion.div
                  key={index}
                  className={`h-14 sm:h-16 md:h-20 border-2 rounded-md sm:rounded-lg md:rounded-xl p-1 md:p-2 transition-all duration-300 overflow-hidden flex flex-col items-center justify-between ${
                    isPast 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:border-primary/50'
                  } ${
                    isToday ? 'ring-2 ring-primary ring-offset-1 md:ring-offset-2' : ''
                  } ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  } ${getAvailabilityColor(availabilityStatus)}`}
                  onClick={() => !isPast && setSelectedDate(day)}
                  whileHover={!isPast ? { scale: 1.02 } : {}}
                  whileTap={!isPast ? { scale: 0.98 } : {}}
                >
                  <div className={`text-xs md:text-sm font-semibold mb-1 ${
                    isPast ? 'text-gray-400' : 
                    availabilityStatus === 'no-slots' ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] leading-3 px-1.5 py-0.5 sm:text-xs sm:leading-4 sm:px-2.5 sm:py-0.5 font-medium max-w-full truncate ${
                      isPast
                        ? 'bg-gray-200 text-gray-400 border-gray-300'
                        : availabilityStatus === 'no-slots' 
                        ? 'bg-gray-300 text-gray-900 border-gray-400 shadow-sm' 
                        : availabilityStatus === 'available'
                        ? 'bg-green-200 text-green-900 border-green-300'
                        : availabilityStatus === 'partial'
                        ? 'bg-yellow-200 text-yellow-900 border-yellow-300'
                        : 'bg-red-200 text-red-900 border-red-300'
                    }`}
                  >
                    {isPast 
                      ? (language === 'am' ? 'ያለፈ' : 'Past') 
                      : (
                        <>
                          <span className="sm:hidden">
                            {availabilityStatus === 'available' && (language === 'am' ? '✓' : '✓')}
                            {availabilityStatus === 'partial' && (language === 'am' ? '±' : '±')}
                            {availabilityStatus === 'full' && (language === 'am' ? '×' : '×')}
                            {availabilityStatus === 'no-slots' && (language === 'am' ? '-' : '-')}
                          </span>
                          <span className="hidden sm:inline">
                            {getAvailabilityText(availabilityStatus)}
                          </span>
                        </>
                      )
                    }
                  </Badge>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Selected Date Slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {formatDate(selectedDate)}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {language === 'am' ? 'የሚገኙ ሰዓቶች' : 'Available Slots'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {getSlotsForDate(selectedDate).map((slot, index) => {
              const isAvailable = slot.isAvailable && slot.currentBookings < slot.maxBookings
              const remainingSlots = slot.maxBookings - slot.currentBookings
              
              return (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    isAvailable 
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:border-green-300 hover:shadow-lg' 
                      : 'border-red-200 bg-gradient-to-br from-red-50 to-red-100'
                  }`}
                  onClick={() => isAvailable && handleSlotClick(slot)}
                  whileHover={isAvailable ? { scale: 1.02, y: -2 } : {}}
                  whileTap={isAvailable ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
                      <span className="font-bold text-sm sm:text-base md:text-lg text-gray-900">
                        <span className="hidden sm:inline">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                        <span className="sm:hidden">{formatTime(slot.startTime)}</span>
                      </span>
                    </div>
                    {isAvailable ? (
                      <div className="p-1 sm:p-1.5 md:p-2 bg-green-500 rounded-full">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    ) : (
                      <div className="p-1 sm:p-1.5 md:p-2 bg-red-500 rounded-full">
                        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">
                        {language === 'am' ? 'የተረፉ ቦታዎች' : 'Remaining slots'}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {remainingSlots}/{slot.maxBookings}
                      </span>
                    </div>
                    
                    {slot.notes && (
                      <div className="text-xs text-gray-500 bg-white/50 rounded p-1.5 sm:p-2">
                        {slot.notes}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {getSlotsForDate(selectedDate).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 sm:py-6 md:py-8"
            >
              <p className="text-sm sm:text-base text-gray-600">
                {language === 'am' 
                  ? 'ምንም ሰዓቶች የሉም' 
                  : 'No slots available'
                }
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Selected Slot Details Modal */}
      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSlot(null)}
        >
          <Card 
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="bg-gradient-to-r from-primary to-green-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-6 h-6" />
                {language === 'am' ? 'የተመረጠ ሰዓት' : 'Selected Time Slot'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {formatDate(new Date(selectedSlot.date))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedSlot.maxBookings - selectedSlot.currentBookings}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'am' ? 'የተረፉ ቦታዎች' : 'Available'}
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedSlot.maxBookings}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'am' ? 'ጠቅላላ' : 'Total'}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleBooking}
                  className="flex-1 bg-primary hover:bg-green-700 text-base md:text-lg py-2 md:py-3 h-12 md:h-auto"
                >
                  <Truck className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {language === 'am' ? 'ያስያዙ' : 'Book Now'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedSlot(null)}
                  className="border-primary text-primary hover:bg-primary hover:text-white h-12 md:h-auto"
                >
                  {language === 'am' ? 'ያዘዝ' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      >
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {language === 'am' ? 'ፈጣን ቀጠሮ' : 'Quick Booking'}
          </h4>
          <p className="text-sm text-gray-600">
            {language === 'am' 
              ? 'በጥቂት ጊዜ ውስጥ ቀጠሮ ያድርጉ' 
              : 'Book your slot in minutes'
            }
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {language === 'am' ? 'ተስማሚ ሰዓት' : 'Flexible Times'}
          </h4>
          <p className="text-sm text-gray-600">
            {language === 'am' 
              ? 'የሚገባዎትን ሰዓት ይምረጡ' 
              : 'Choose the time that works for you'
            }
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {language === 'am' ? 'የተረጋገጠ አገልግሎት' : 'Reliable Service'}
          </h4>
          <p className="text-sm text-gray-600">
            {language === 'am' 
              ? 'የተረጋገጠ እና ፈጣን አገልግሎት' 
              : 'Trusted and fast moving service'
            }
          </p>
        </div>
      </motion.div>
    </div>
  )
} 
 
 