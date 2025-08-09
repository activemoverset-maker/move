"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MapPin,
  MessageSquare,
  RefreshCw
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'

interface Booking {
  id: string
  customerName: string
  serviceType: string
  date: string
  time: string
  status: string
  amount: number
  phone: string
  fromAddress: string
  toAddress: string
  message: string | null
  createdAt: string
}

export function AdminBookings() {
  const { language } = useLanguage()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/booking?status=all')
      const data = await response.json()
      
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchBookings()
        trackEvent({
          action: 'booking_status_updated',
          category: 'admin',
          label: newStatus
        })
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm(language === 'am' ? 'ይህን ቀጠሮ መሰረዝ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this booking?')) {
      return
    }

    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBookings()
        trackEvent({
          action: 'booking_deleted',
          category: 'admin',
          label: 'delete'
        })
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return language === 'am' ? 'የተረጋገጠ' : 'Confirmed'
      case 'pending': return language === 'am' ? 'በመጠበቅ ላይ' : 'Pending'
      case 'completed': return language === 'am' ? 'የተጠናቀቀ' : 'Completed'
      case 'cancelled': return language === 'am' ? 'የተሰረዘ' : 'Cancelled'
      default: return status
    }
  }

  const getServiceText = (serviceType: string) => {
    switch (serviceType) {
      case 'local-moving': return language === 'am' ? 'የቤት መጓጓዣ' : 'Home Moving'
      case 'office-relocation': return language === 'am' ? 'የቢሮ መጓጓዣ' : 'Office Relocation'
      case 'packaging': return language === 'am' ? 'የመጠን አገልግሎት' : 'Packaging Service'
      case 'storage': return language === 'am' ? 'የመጠን መፍትሄዎች' : 'Storage Solutions'
      default: return serviceType
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.phone.includes(searchTerm) ||
                         getServiceText(booking.serviceType).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {language === 'am' ? 'የቀጠሮ አያያዝ' : 'Bookings Management'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {language === 'am' 
              ? 'ሁሉንም የደንበኛ ቀጠሮዎች ያስተዳድሩ' 
              : 'Manage all customer bookings'
            }
          </p>
        </div>
        <Button
          onClick={fetchBookings}
          className="bg-primary hover:bg-green-700 w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {language === 'am' ? 'ያደምሩ' : 'Refresh'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={language === 'am' ? 'የደንበኛ ስም, ስልክ ወይም አገልግሎት ይፈልጉ...' : 'Search by customer name, phone, or service...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="all">{language === 'am' ? 'ሁሉም ሁኔታዎች' : 'All Statuses'}</option>
                <option value="pending">{language === 'am' ? 'በመጠበቅ ላይ' : 'Pending'}</option>
                <option value="confirmed">{language === 'am' ? 'የተረጋገጠ' : 'Confirmed'}</option>
                <option value="completed">{language === 'am' ? 'የተጠናቀቀ' : 'Completed'}</option>
                <option value="cancelled">{language === 'am' ? 'የተሰረዘ' : 'Cancelled'}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="w-5 h-5 text-primary" />
              {language === 'am' ? 'ቀጠሮዎች' : 'Bookings'} ({filteredBookings.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                              {booking.customerName}
                            </h3>
                            <Badge className={`${getStatusColor(booking.status)} text-xs w-fit`}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{booking.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{getServiceText(booking.serviceType)}</span>
                            </div>
                            {booking.message && (
                              <div className="flex items-start gap-2 sm:col-span-2">
                                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2 text-xs sm:text-sm">{booking.message}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            {language === 'am' ? 'የተፈጠረ' : 'Created'}: {new Date(booking.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(booking)}
                          className="text-xs px-2 py-1 h-8"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          disabled={booking.status === 'confirmed'}
                          className="text-xs px-2 py-1 h-8"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          disabled={booking.status === 'completed'}
                          className="text-xs px-2 py-1 h-8"
                        >
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          disabled={booking.status === 'cancelled'}
                          className="text-xs px-2 py-1 h-8"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-700 text-xs px-2 py-1 h-8"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'am' ? 'ምንም ቀጠሮዎች አልተገኙም' : 'No bookings found'}
                </h3>
                <p className="text-sm">
                  {language === 'am' 
                    ? 'የፍለጋ መስፈርቶችዎን ይለውጡ' 
                    : 'Try adjusting your search criteria'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {language === 'am' ? 'የቀጠሮ ዝርዝሮች' : 'Booking Details'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 text-base sm:text-lg">{selectedBooking.customerName}</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      {language === 'am' ? 'አገልግሎት' : 'Service'}
                    </h4>
                    <p className="text-sm text-gray-600">{getServiceText(selectedBooking.serviceType)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      {language === 'am' ? 'ቀን እና ሰዓት' : 'Date & Time'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      {language === 'am' ? 'ከየት' : 'From'}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedBooking.fromAddress}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      {language === 'am' ? 'ወደ የት' : 'To'}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedBooking.toAddress}</p>
                  </div>
                </div>
                
                {selectedBooking.message && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      {language === 'am' ? 'መልእክት' : 'Message'}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedBooking.message}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {getStatusText(selectedBooking.status)}
                  </Badge>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {language === 'am' ? 'የተፈጠረ' : 'Created'}: {new Date(selectedBooking.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 