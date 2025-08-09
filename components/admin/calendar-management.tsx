"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Check,
  AlertCircle,
  Users,
  CalendarDays,
  Filter,
  Search,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
  id: string
  workingHoursStart: string
  workingHoursEnd: string
  slotDuration: number
  maxBookingsPerSlot: number
  advanceBookingDays: number
  weekendBookings: boolean
  holidayBookings: boolean
  maintenanceMode: boolean
}

export function CalendarManagement() {
  const { t, language } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [slots, setSlots] = useState<CalendarSlot[]>([])
  const [settings, setSettings] = useState<CalendarSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showSlotForm, setShowSlotForm] = useState(false)
  const [editingSlot, setEditingSlot] = useState<CalendarSlot | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [bulkActions, setBulkActions] = useState<string[]>([])
  
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    isAvailable: true,
    maxBookings: 3,
    notes: ''
  })

  useEffect(() => {
    fetchCalendarData()
  }, [currentDate])

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const [slotsResponse, settingsResponse] = await Promise.all([
        fetch(`/api/calendar/slots?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`),
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

  const handleCreateSlot = async () => {
    try {
      const response = await fetch('/api/calendar/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSlot),
      })

      if (response.ok) {
        setShowSlotForm(false)
        setNewSlot({
          date: '',
          startTime: '09:00',
          endTime: '10:00',
          isAvailable: true,
          maxBookings: 3,
          notes: ''
        })
        fetchCalendarData()
        
        trackEvent({
          action: 'slot_created',
          category: 'admin',
          label: 'Calendar Slot Created'
        })
      }
    } catch (error) {
      console.error('Error creating slot:', error)
    }
  }

  const handleUpdateSlot = async (slotId: string, updates: Partial<CalendarSlot>) => {
    try {
      const response = await fetch(`/api/calendar/slots/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setEditingSlot(null)
        fetchCalendarData()
        
        trackEvent({
          action: 'slot_updated',
          category: 'admin',
          label: 'Calendar Slot Updated'
        })
      }
    } catch (error) {
      console.error('Error updating slot:', error)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm(language === 'am' ? 'ይህን ሰዓት መሰረዝ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this slot?')) {
      return
    }

    try {
      const response = await fetch(`/api/calendar/slots/${slotId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCalendarData()
        
        trackEvent({
          action: 'slot_deleted',
          category: 'admin',
          label: 'Calendar Slot Deleted'
        })
      }
    } catch (error) {
      console.error('Error deleting slot:', error)
    }
  }

  const handleUpdateSettings = async (updates: Partial<CalendarSettings>) => {
    if (!settings) return

    try {
      const response = await fetch('/api/calendar/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...settings, ...updates }),
      })

      if (response.ok) {
        setSettings({ ...settings, ...updates })
        
        trackEvent({
          action: 'settings_updated',
          category: 'admin',
          label: 'Calendar Settings Updated'
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const generateSlotsForMonth = async () => {
    if (!settings) return

    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const slots: any[] = []
      let currentDay = new Date(startOfMonth)
      
      while (currentDay <= endOfMonth) {
        const dayOfWeek = currentDay.getDay()
        
        // Skip weekends if weekend bookings are disabled
        if (!settings.weekendBookings && (dayOfWeek === 0 || dayOfWeek === 6)) {
          currentDay.setDate(currentDay.getDate() + 1)
          continue
        }
        
        // Generate slots for this day
        const startTime = new Date(`2000-01-01T${settings.workingHoursStart}`)
        const endTime = new Date(`2000-01-01T${settings.workingHoursEnd}`)
        
        while (startTime < endTime) {
          const slotEndTime = new Date(startTime.getTime() + settings.slotDuration * 60000)
          
          if (slotEndTime <= endTime) {
            slots.push({
              date: currentDay.toISOString().split('T')[0],
              startTime: startTime.toTimeString().slice(0, 5),
              endTime: slotEndTime.toTimeString().slice(0, 5),
              isAvailable: true,
              maxBookings: settings.maxBookingsPerSlot,
              notes: ''
            })
          }
          
          startTime.setTime(startTime.getTime() + settings.slotDuration * 60000)
        }
        
        currentDay.setDate(currentDay.getDate() + 1)
      }

      // Create all slots
      for (const slot of slots) {
        await fetch('/api/calendar/slots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slot),
        })
      }

      fetchCalendarData()
      
      trackEvent({
        action: 'month_slots_generated',
        category: 'admin',
        label: 'Month Slots Generated'
      })
    } catch (error) {
      console.error('Error generating slots:', error)
    }
  }

  const getFilteredSlots = () => {
    let filtered = slots

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(slot => {
        if (filterStatus === 'available') return slot.isAvailable && slot.currentBookings < slot.maxBookings
        if (filterStatus === 'full') return slot.currentBookings >= slot.maxBookings
        if (filterStatus === 'unavailable') return !slot.isAvailable
        if (filterStatus === 'booked') return slot.currentBookings > 0
        return true
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(slot => 
        slot.date.includes(searchTerm) ||
        slot.startTime.includes(searchTerm) ||
        slot.endTime.includes(searchTerm) ||
        slot.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by selected date
    if (selectedDate && selectedDate !== 'all') {
      filtered = filtered.filter(slot => slot.date === selectedDate)
    }

    return filtered
  }

  const handleBulkAction = async (action: string) => {
    if (bulkActions.length === 0) return

    try {
      for (const slotId of bulkActions) {
        if (action === 'delete') {
          await handleDeleteSlot(slotId)
        } else if (action === 'toggle') {
          const slot = slots.find(s => s.id === slotId)
          if (slot) {
            await handleUpdateSlot(slotId, { isAvailable: !slot.isAvailable })
          }
        }
      }
      setBulkActions([])
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getSlotsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return slots.filter(slot => slot.date === dateString)
  }

  const getAvailabilityStatus = (date: Date) => {
    const dateSlots = getSlotsForDate(date)
    if (dateSlots.length === 0) return 'no-slots'
    
    const availableSlots = dateSlots.filter(slot => 
      slot.isAvailable && slot.currentBookings < slot.maxBookings
    )
    
    if (availableSlots.length === 0) return 'full'
    if (availableSlots.length === dateSlots.length) return 'available'
    return 'partial'
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'border-green-200 bg-green-50'
      case 'partial': return 'border-yellow-200 bg-yellow-50'
      case 'full': return 'border-red-200 bg-red-50'
      case 'no-slots': return 'border-gray-200 bg-gray-50'
      default: return 'border-gray-200 bg-white'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const filteredSlots = getFilteredSlots()
  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleString(language === 'am' ? 'am-ET' : 'en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {language === 'am' ? 'የቀጠሮ ሰሌዳ አያያዝ' : 'Calendar Management'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {language === 'am' 
              ? 'የቀጠሮ ሰዓቶችን እና የሰሌዳ ቅንብሮችን ያስተዳድሩ' 
              : 'Manage booking time slots and calendar settings'
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={fetchCalendarData}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'am' ? 'ያደምሩ' : 'Refresh'}
          </Button>
          <Button
            onClick={() => setShowSettings(true)}
            className="bg-primary hover:bg-green-700 w-full sm:w-auto"
          >
            <Settings className="w-4 h-4 mr-2" />
            {language === 'am' ? 'ቅንብሮች' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={language === 'am' ? 'የቀጠሮ ሰዓቶችን ይፈልጉ...' : 'Search time slots...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={language === 'am' ? 'ሁኔታ' : 'Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'am' ? 'ሁሉም' : 'All'}</SelectItem>
                  <SelectItem value="available">{language === 'am' ? 'የሚገኝ' : 'Available'}</SelectItem>
                  <SelectItem value="unavailable">{language === 'am' ? 'የማይገኝ' : 'Unavailable'}</SelectItem>
                  <SelectItem value="booked">{language === 'am' ? 'የተያዘ' : 'Booked'}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={language === 'am' ? 'ቀን' : 'Date'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'am' ? 'ሁሉም ቀናት' : 'All dates'}</SelectItem>
                  {Array.from({ length: 31 }, (_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
                    if (date.getMonth() === currentDate.getMonth()) {
                      return (
                        <SelectItem key={i + 1} value={date.toISOString().split('T')[0]}>
                          {date.toLocaleDateString()}
                        </SelectItem>
                      )
                    }
                    return null
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              {language === 'am' ? 'የወር እይታ' : 'Month View'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {monthName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {language === 'am' ? 
                  (day === 'Sun' ? 'እሁድ' : 
                   day === 'Mon' ? 'ሰኞ' : 
                   day === 'Tue' ? 'ማክሰኞ' : 
                   day === 'Wed' ? 'ረቡዕ' : 
                   day === 'Thu' ? 'ሐሙስ' : 
                   day === 'Fri' ? 'ዓርብ' : 'ቅዳ') : day
                }
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-20"></div>
              }

              const availabilityStatus = getAvailabilityStatus(day)
              const isToday = day.toDateString() === new Date().toDateString()
              const isSelected = selectedDate === day.toISOString().split('T')[0]
              const daySlots = getSlotsForDate(day)

              return (
                <motion.div
                  key={index}
                  className={`h-20 border-2 rounded-lg p-2 transition-all duration-300 cursor-pointer ${
                    isToday ? 'ring-2 ring-primary ring-offset-2' : ''
                  } ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  } ${getAvailabilityColor(availabilityStatus)}`}
                  onClick={() => setSelectedDate(day.toISOString().split('T')[0])}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {day.getDate()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {daySlots.length > 0 ? `${daySlots.length} slots` : 'No slots'}
                  </div>
                  {availabilityStatus === 'available' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Slots List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {language === 'am' ? 'የሰዓቶች ዝርዝር' : 'Slots List'}
              <Badge variant="secondary" className="ml-2">
                {filteredSlots.length} {language === 'am' ? 'ሰዓቶች' : 'slots'}
              </Badge>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSlots.map((slot) => (
              <motion.div
                key={slot.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bulkActions.includes(slot.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkActions([...bulkActions, slot.id])
                        } else {
                          setBulkActions(bulkActions.filter(id => id !== slot.id))
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <div className="font-semibold text-gray-900">
                      {new Date(slot.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={slot.isAvailable ? "default" : "secondary"}
                      className={slot.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {slot.isAvailable ? 
                        (language === 'am' ? 'ይገኛል' : 'Available') : 
                        (language === 'am' ? 'የለም' : 'Unavailable')
                      }
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{slot.currentBookings}/{slot.maxBookings}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingSlot(slot)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {filteredSlots.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'am' ? 'ምንም ሰዓቶች አልተገኙም' : 'No slots found'}
                </h3>
                <p className="text-gray-400">
                  {language === 'am' 
                    ? 'የፈለጉትን መፍትሄ ማግኘት አልተቻለም። እባክዎ ሌላ ፍለጋ ያድርጉ።' 
                    : 'No slots match your current filters. Try adjusting your search criteria.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {bulkActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {bulkActions.length} {language === 'am' ? 'ሰዓቶች ተመርጠዋል' : 'slots selected'}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('toggle')}
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {language === 'am' ? 'እንደ ይገኝ ያድርጉ' : 'Toggle Availability'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('delete')}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {language === 'am' ? 'ያስወግዱ' : 'Delete'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBulkActions([])}
                    className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {language === 'am' ? 'ያስወግዱ' : 'Clear'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && settings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <Card 
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  {language === 'am' ? 'የቀጠሮ ቅንብሮች' : 'Calendar Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'የስራ ሰዓት መጀመሪያ' : 'Working Hours Start'}
                    </label>
                    <Input
                      type="time"
                      value={settings.workingHoursStart}
                      onChange={(e) => handleUpdateSettings({ workingHoursStart: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'የስራ ሰዓት መጨረሻ' : 'Working Hours End'}
                    </label>
                    <Input
                      type="time"
                      value={settings.workingHoursEnd}
                      onChange={(e) => handleUpdateSettings({ workingHoursEnd: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'የሰዓት ቆይታ (ደቂቃ)' : 'Slot Duration (minutes)'}
                    </label>
                    <Input
                      type="number"
                      value={settings.slotDuration}
                      onChange={(e) => handleUpdateSettings({ slotDuration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'በሰዓት ከፍተኛ ቀጠሮዎች' : 'Max Bookings Per Slot'}
                    </label>
                    <Input
                      type="number"
                      value={settings.maxBookingsPerSlot}
                      onChange={(e) => handleUpdateSettings({ maxBookingsPerSlot: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'የቀጠሮ ቀኖች በፊት' : 'Advance Booking Days'}
                    </label>
                    <Input
                      type="number"
                      value={settings.advanceBookingDays}
                      onChange={(e) => handleUpdateSettings({ advanceBookingDays: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'am' ? 'የሳምንት ሰዓት ቀጠሮዎች' : 'Weekend Bookings'}
                      </label>
                      <p className="text-sm text-gray-500">
                        {language === 'am' ? 'በሳምንት ሰዓት ቀጠሮዎችን ያካትቱ' : 'Allow bookings on weekends'}
                      </p>
                    </div>
                    <Switch
                      checked={settings.weekendBookings}
                      onCheckedChange={(checked: boolean) => handleUpdateSettings({ weekendBookings: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'am' ? 'የበዓል ቀጠሮዎች' : 'Holiday Bookings'}
                      </label>
                      <p className="text-sm text-gray-500">
                        {language === 'am' ? 'በበዓል ቀጠሮዎችን ያካትቱ' : 'Allow bookings on holidays'}
                      </p>
                    </div>
                    <Switch
                      checked={settings.holidayBookings}
                      onCheckedChange={(checked: boolean) => handleUpdateSettings({ holidayBookings: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'am' ? 'የጥገና ሁኔታ' : 'Maintenance Mode'}
                      </label>
                      <p className="text-sm text-gray-500">
                        {language === 'am' ? 'የቀጠሮ ስርዓትን ያሳድጉ' : 'Disable booking system'}
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked: boolean) => handleUpdateSettings({ maintenanceMode: checked })}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => setShowSettings(false)}
                    className="bg-primary hover:bg-green-700"
                  >
                    {language === 'am' ? 'ያስቀምጡ' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(false)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {language === 'am' ? 'ያዘዝ' : 'Cancel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Slot Modal */}
      <AnimatePresence>
        {showSlotForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSlotForm(false)}
          >
            <Card 
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  {language === 'am' ? 'አዲስ ሰዓት ያክሉ' : 'Add New Slot'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'am' ? 'ቀን' : 'Date'}
                  </label>
                  <Input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'መጀመሪያ ሰዓት' : 'Start Time'}
                    </label>
                    <Input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'መጨረሻ ሰዓት' : 'End Time'}
                    </label>
                    <Input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'am' ? 'ከፍተኛ ቀጠሮዎች' : 'Max Bookings'}
                  </label>
                  <Input
                    type="number"
                    value={newSlot.maxBookings}
                    onChange={(e) => setNewSlot({ ...newSlot, maxBookings: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'am' ? 'ማስታወሻዎች' : 'Notes'}
                  </label>
                  <Textarea
                    value={newSlot.notes}
                    onChange={(e) => setNewSlot({ ...newSlot, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateSlot}
                    className="flex-1 bg-primary hover:bg-green-700"
                  >
                    {language === 'am' ? 'ያክሉ' : 'Add Slot'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSlotForm(false)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {language === 'am' ? 'ያዘዝ' : 'Cancel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Slot Modal */}
      <AnimatePresence>
        {editingSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingSlot(null)}
          >
            <Card 
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  {language === 'am' ? 'ሰዓት ያስተካክሉ' : 'Edit Slot'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'am' ? 'ቀን' : 'Date'}
                  </label>
                  <Input
                    type="date"
                    value={editingSlot.date}
                    onChange={(e) => setEditingSlot({ ...editingSlot, date: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'መጀመሪያ ሰዓት' : 'Start Time'}
                    </label>
                    <Input
                      type="time"
                      value={editingSlot.startTime}
                      onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'am' ? 'መጨረሻ ሰዓት' : 'End Time'}
                    </label>
                    <Input
                      type="time"
                      value={editingSlot.endTime}
                      onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'am' ? 'ከፍተኛ ቀጠሮዎች' : 'Max Bookings'}
                  </label>
                  <Input
                    type="number"
                    value={editingSlot.maxBookings}
                    onChange={(e) => setEditingSlot({ ...editingSlot, maxBookings: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'am' ? 'ማስታወሻዎች' : 'Notes'}
                  </label>
                  <Textarea
                    value={editingSlot.notes || ''}
                    onChange={(e) => setEditingSlot({ ...editingSlot, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateSlot(editingSlot.id, editingSlot)}
                    className="flex-1 bg-primary hover:bg-green-700"
                  >
                    {language === 'am' ? 'ያስቀምጡ' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingSlot(null)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {language === 'am' ? 'ያዘዝ' : 'Cancel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 