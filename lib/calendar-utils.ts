export function getDaysInMonth(date: Date): (Date | null)[] {
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

export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDate(date: Date, language: string = 'en'): string {
  return date.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString()
}

export function isPast(date: Date): boolean {
  return date < new Date()
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getMonthName(date: Date, language: string = 'en'): string {
  return date.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { 
    month: 'long', 
    year: 'numeric' 
  })
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number
): { startTime: string; endTime: string }[] {
  const slots = []
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  
  while (start < end) {
    const slotEnd = new Date(start.getTime() + duration * 60000)
    
    if (slotEnd <= end) {
      slots.push({
        startTime: start.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5)
      })
    }
    
    start.setTime(start.getTime() + duration * 60000)
  }
  
  return slots
} 
 
 
 