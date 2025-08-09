"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  MapPin,
  Truck,
  Package,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Star,
  Building2,
  Warehouse
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { BookingCalendar } from '@/components/calendar/booking-calendar'

// Form validation schema
const bookingFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  fromAddress: z.string().min(10, 'From address must be at least 10 characters'),
  toAddress: z.string().min(10, 'To address must be at least 10 characters'),
  serviceType: z.string().min(1, 'Please select a service type'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  message: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingFormSchema>

interface CalendarSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  maxBookings: number
  currentBookings: number
}

const SERVICE_TYPES = [
  {
    id: 'local-moving',
    title: 'Local Moving',
    titleAm: 'አካባቢያዊ መጓጓዣ',
    description: 'Professional local moving services within Addis Ababa and surrounding areas.',
    descriptionAm: 'አዲስ አበባ እና አካባቢዎች ውስጥ የሙያ አካባቢያዊ መጓጓዣ አገልግሎቶች።',
    price: 'From 17,000 ETB',
    priceAm: 'ከ 17,000 ብር ጀምሮ',
    icon: Truck,
    features: ['Professional packing', 'Furniture assembly', 'Same-day delivery', 'Fully insured']
  },
  {
    id: 'packaging',
    title: 'Packaging Services',
    titleAm: 'የመጠን አገልግሎቶች',
    description: 'Complete packaging solutions with high-quality materials and expert handling.',
    descriptionAm: 'ከፍተኛ ጥራት ያላቸው ቁሳቁሶች እና የሙያ አያያዝ ያላቸው ሁለገብ የመጠን መፍትሄዎች።',
    price: 'From 12,000 ETB',
    priceAm: 'ከ 12,000 ብር ጀምሮ',
    icon: Package,
    features: ['High-quality materials', 'Fragile protection', 'Custom crating', 'Professional labeling']
  },
  {
    id: 'storage',
    title: 'Storage Solutions',
    titleAm: 'የመጠን መፍትሄዎች',
    description: 'Secure and climate-controlled storage facilities for short and long-term needs.',
    descriptionAm: 'ለአጭር እና ረጅም ጊዜ ፍላጎቶች ደህንነቱ የተጣራ እና የሙቀት ቁጥጥር ያለው መጠን ተቋማት።',
    price: 'Contact for pricing',
    priceAm: 'ዋጋ ለማወቅ ያግኙን',
    icon: Warehouse,
    features: ['Climate-controlled', '24/7 security', 'Flexible options', 'Insurance coverage']
  },
  {
    id: 'office-relocation',
    title: 'Office Relocation',
    titleAm: 'የቢሮ መጓጓዣ',
    description: 'Complete office relocation services with minimal business disruption.',
    descriptionAm: 'የንግድ ስራ ጥፋት ሳያደርግ ሁለገብ የቢሮ መጓጓዣ አገልግሎቶች።',
    price: 'From 45,000 ETB',
    priceAm: 'ከ 45,000 ብር ጀምሮ',
    icon: Building2,
    features: ['Minimal disruption', 'IT handling', 'Furniture assembly', 'Project management']
  }
]

export function BookingPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [availableSlots, setAvailableSlots] = useState<CalendarSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  })

  // Pre-fill date and time from URL params
  useEffect(() => {
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    
    if (dateParam) {
      setSelectedDate(dateParam)
      setValue('date', dateParam)
    }
    if (timeParam) {
      setSelectedTime(timeParam)
      setValue('time', timeParam)
    }
  }, [searchParams, setValue])

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true)
    try {
      const response = await fetch(`/api/calendar/slots?startDate=${date}&endDate=${date}&availableOnly=true`)
      if (response.ok) {
        const slots = await response.json()
        setAvailableSlots(slots)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: language === 'am' ? 'እንኳን ደስ አለዎት!' : 'Booking Successful!',
          description: language === 'am' 
            ? 'ቀጠሮዎ በተሳካተ ተዘጋጅቷል። በቅርቡ እንገኝለን።' 
            : 'Your booking has been confirmed successfully. We will contact you soon.',
          variant: 'default',
        })
        
        trackEvent({
          action: 'booking_submitted',
          category: 'booking',
          label: `Service: ${data.serviceType}`
        })
      } else {
        throw new Error('Failed to submit booking')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast({
        title: language === 'am' ? 'ስህተት!' : 'Error!',
        description: language === 'am' 
          ? 'ቀጠሮዎ ሊዘጋጅ አልተቻለም። እባክዎ እንደገና ይሞክሩ።' 
          : 'Failed to submit your booking. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Truck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            {language === 'am' ? 'ቀጠሮ ያድርጉ' : 'Book Now'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {language === 'am' ? 'መጓጓዣ አገልግሎት ያስያዙ' : 'Book Your Moving Service'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'am' 
              ? 'የሚገባዎትን አገልግሎት ይምረጡ እና ቀጠሮ ያድርጉ' 
              : 'Choose your preferred service and book your appointment'
            }
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Service Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary to-green-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Package className="w-6 h-6" />
                  {language === 'am' ? 'የአገልግሎት አይነት' : 'Service Type'}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {language === 'am' 
                    ? 'የሚገባዎትን አገልግሎት ይምረጡ' 
                    : 'Select the service you need'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {SERVICE_TYPES.map((service) => {
                    const IconComponent = service.icon
                    return (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedService === service.id
                            ? 'border-primary bg-primary/5 shadow-lg'
                            : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                        }`}
                        onClick={() => {
                          setSelectedService(service.id)
                          setValue('serviceType', service.id)
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {language === 'am' ? service.titleAm : service.title}
                              </h3>
                              <span className="font-bold text-primary text-lg ml-4">
                                {language === 'am' ? service.priceAm : service.price}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                              {language === 'am' ? service.descriptionAm : service.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendar System Integration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  {language === 'am' ? 'ቀን እና ሰዓት' : 'Date & Time'}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {language === 'am' 
                    ? 'የሚገባዎትን ቀን እና ሰዓት ይምረጡ' 
                    : 'Choose your preferred date and time'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <BookingCalendar
                  onSlotSelect={(slot) => {
                    setSelectedSlot(slot)
                    setSelectedDate(slot.date)
                    setSelectedTime(slot.startTime)
                    setValue('date', slot.date)
                    setValue('time', slot.startTime)
                  }}
                  selectedSlot={selectedSlot}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date.message}
                  </p>
                )}
                {errors.time && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.time.message}
                  </p>
                )}
                {/* Selected Date/Time Display */}
                {selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">
                        {language === 'am' ? 'የተመረጠ ቀጠሮ' : 'Selected Appointment'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-green-700">
                      {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.startTime)}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm max-w-4xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Users className="w-6 h-6" />
                {language === 'am' ? 'የግል መረጃ' : 'Personal Information'}
              </CardTitle>
              <CardDescription className="text-green-100">
                {language === 'am' 
                  ? 'የግል መረጃዎን ያስገቡ' 
                  : 'Please provide your contact information'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {language === 'am' ? 'ሙሉ ስም' : 'Full Name'} *
                    </label>
                    <Input
                      {...register('fullName')}
                      placeholder={language === 'am' ? 'የእርስዎ ሙሉ ስም' : 'Your full name'}
                      className="h-12 text-base"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {language === 'am' ? 'ስልክ' : 'Phone'} *
                    </label>
                    <Input
                      {...register('phone')}
                      placeholder={language === 'am' ? 'የእርስዎ ስልክ' : 'Your phone number'}
                      className="h-12 text-base"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {language === 'am' ? 'ኢሜይል' : 'Email'} *
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder={language === 'am' ? 'የእርስዎ ኢሜይል' : 'Your email address'}
                    className="h-12 text-base"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {language === 'am' ? 'ከየት' : 'From Address'} *
                    </label>
                    <Input
                      {...register('fromAddress')}
                      placeholder={language === 'am' ? 'የመነሻ አድራሻ' : 'Pickup address'}
                      className="h-12 text-base"
                    />
                    {errors.fromAddress && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fromAddress.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {language === 'am' ? 'ወደ የት' : 'To Address'} *
                    </label>
                    <Input
                      {...register('toAddress')}
                      placeholder={language === 'am' ? 'የመድረሻ አድራሻ' : 'Delivery address'}
                      className="h-12 text-base"
                    />
                    {errors.toAddress && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.toAddress.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {language === 'am' ? 'ተጨማሪ መልእክት' : 'Additional Message'}
                  </label>
                  <Textarea
                    {...register('message')}
                    placeholder={language === 'am' ? 'ተጨማሪ መረጃ ያስገቡ...' : 'Add any additional information...'}
                    rows={4}
                    className="text-base resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="border-primary text-primary hover:bg-primary hover:text-white h-12 md:h-auto"
                  >
                    <Link href="/" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      {language === 'am' ? 'ወደ ኋላ' : 'Go Back'}
                    </Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 md:h-14 text-base md:text-lg font-semibold bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm md:text-base">{language === 'am' ? 'ይላካል...' : 'Submitting...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">{language === 'am' ? 'ቀጠሮ ያድርጉ' : 'Book Appointment'}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'am' ? 'የተረጋገጠ አገልግሎት' : 'Secure Booking'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'am' 
                ? 'የጥብቅ ደህንነት እና የተረጋገጠ አገልግሎት' 
                : 'Secure and reliable service'
              }
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'am' ? 'የተሻለ ጥራት' : 'Best Quality'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'am' 
                ? 'የጥራት አገልግሎት እና የተሰማራ ቡድን' 
                : 'Quality service and professional team'
              }
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'am' ? 'ፈጣን አገልግሎት' : 'Fast Service'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'am' 
                ? 'ፈጣን እና ውጤታማ መጓጓዣ አገልግሎት' 
                : 'Quick and efficient moving service'
              }
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 