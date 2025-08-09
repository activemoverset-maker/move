"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  FileText, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Clock,
  MessageSquare,
  Shield,
  Activity,
  BarChart3,
  Database,
  Zap,
  Truck,
  Package,
  Home,
  Building,
  Star,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ImageIcon
} from 'lucide-react'
import { BLOG_POSTS } from '@/constants/site'
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
}

interface DashboardStats {
  todayBookings: number
  monthBookings: number
  completedBookings: number
  revenueEstimate: string
}

export function AdminDashboard() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    monthBookings: 0,
    completedBookings: 0,
    revenueEstimate: '0 ETB'
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...')
      
      // Fetch recent bookings
      const bookingsResponse = await fetch('/api/booking?status=all&limit=4')
      const bookingsData = await bookingsResponse.json()
      
      console.log('Bookings API response:', bookingsData)
      
      if (bookingsData.success) {
        const formattedBookings = bookingsData.bookings.map((booking: any) => ({
          id: booking.id,
          customerName: booking.customerName,
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          status: booking.status,
          amount: booking.amount || 0
        }))
        console.log('Formatted recent bookings:', formattedBookings)
        setRecentBookings(formattedBookings)
      } else {
        console.error('Bookings API error:', bookingsData.error)
      }

      // Calculate stats from bookings
      const allBookingsResponse = await fetch('/api/booking?status=all')
      const allBookingsData = await allBookingsResponse.json()
      
      console.log('All bookings API response:', allBookingsData)
      
      if (allBookingsData.success) {
        const bookings = allBookingsData.bookings
        const today = new Date().toISOString().split('T')[0]
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        console.log('Today:', today)
        console.log('Current month/year:', currentMonth, currentYear)

        const todayBookings = bookings.filter((b: any) => b.date === today).length
        const monthBookings = bookings.filter((b: any) => {
          const bookingDate = new Date(b.date)
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
        }).length
        const completedBookings = bookings.filter((b: any) => b.status === 'completed').length
        
        const totalRevenue = bookings
          .filter((b: any) => b.status === 'completed')
          .reduce((sum: number, b: any) => sum + (b.amount || 0), 0)
        
        const revenueEstimate = `${(totalRevenue / 1000).toFixed(1)}K ETB`

        console.log('Calculated stats:', {
          todayBookings,
          monthBookings,
          completedBookings,
          revenueEstimate
        })

        setStats({
          todayBookings,
          monthBookings,
          completedBookings,
          revenueEstimate
        })
      } else {
        console.error('All bookings API error:', allBookingsData.error)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (action: string) => {
    trackEvent({ 
      action: 'admin_action_click', 
      category: 'admin', 
      label: action 
    })
  }

  const calculateServiceRevenue = (serviceType: string) => {
    const serviceBookings = recentBookings.filter(b => b.serviceType === serviceType && b.status === 'completed')
    const totalRevenue = serviceBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)
    
    if (totalRevenue >= 1000000) {
      return `${(totalRevenue / 1000000).toFixed(1)}M ETB`
    } else if (totalRevenue >= 1000) {
      return `${(totalRevenue / 1000).toFixed(1)}K ETB`
    } else {
      return `${totalRevenue} ETB`
    }
  }

  const calculateServiceGrowth = (serviceType: string) => {
    // This is a simplified growth calculation
    // In a real app, you'd compare with previous periods
    const serviceBookings = recentBookings.filter(b => b.serviceType === serviceType)
    const completedBookings = serviceBookings.filter(b => b.status === 'completed').length
    
    if (serviceBookings.length === 0) return '+0%'
    
    const completionRate = (completedBookings / serviceBookings.length) * 100
    if (completionRate >= 80) return '+25%'
    if (completionRate >= 60) return '+15%'
    if (completionRate >= 40) return '+8%'
    return '+5%'
  }

  const dashboardStats = [
    {
      title: language === 'am' ? 'የዛሬ ቀጠሮዎች' : 'Today\'s Bookings',
      value: stats.todayBookings,
      change: '+25%',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'up'
    },
    {
      title: language === 'am' ? 'የወሩ ቀጠሮዎች' : 'This Month',
      value: stats.monthBookings,
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: 'up'
    },
    {
      title: language === 'am' ? 'የተሟሉ ቀጠሮዎች' : 'Completed',
      value: stats.completedBookings,
      change: '+8%',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: 'up'
    },
    {
      title: language === 'am' ? 'የገቢ ግምገማ' : 'Revenue Estimate',
      value: stats.revenueEstimate,
      change: '+18%',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      trend: 'up'
    }
  ]

  const quickActions = [
    {
      title: language === 'am' ? 'የቀጠሮ ሰሌዳ' : 'Calendar Management',
      description: language === 'am' ? 'የቀጠሮ ሰዓቶችን ያስተዳድሩ' : 'Manage booking time slots',
      icon: Calendar,
      href: '/admin/calendar',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: 'manage_calendar'
    },
    {
      title: language === 'am' ? 'አዲስ ብሎግ ፖስት' : 'New Blog Post',
      description: language === 'am' ? 'የድህረ ገጽ ይዘት ያክሉ' : 'Add website content',
      icon: Plus,
      href: '/admin/blog/add',
      color: 'bg-green-500 hover:bg-green-600',
      action: 'add_blog'
    },
    {
      title: language === 'am' ? 'የድህረ ገጽ ትንታኔ' : 'Website Analytics',
      description: language === 'am' ? 'የድህረ ገጽ እንቅስቃሴ ይመልከቱ' : 'View website activity',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: 'view_analytics'
    },
    {
      title: language === 'am' ? 'የደንበኛ ግምገማዎች' : 'Customer Reviews',
      description: language === 'am' ? 'የደንበኛ ግምገማዎችን ያስተዳድሩ' : 'Manage customer testimonials',
      icon: Star,
      href: '/admin/testimonials',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: 'manage_testimonials'
    },
    {
      title: language === 'am' ? 'የጋለሪ አያያዝ' : 'Gallery Management',
      description: language === 'am' ? 'የድህረ ገጽ ጋለሪ ምስሎችን ያስተዳድሩ' : 'Manage website gallery images',
      icon: ImageIcon,
      href: '/admin/gallery',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: 'manage_gallery'
    }
  ]

  const serviceStats = [
    {
      service: language === 'am' ? 'የቤት መጓጓዣ' : 'Home Moving',
      icon: Home,
      bookings: recentBookings.filter(b => b.serviceType === 'local-moving').length,
      revenue: calculateServiceRevenue('local-moving'),
      growth: calculateServiceGrowth('local-moving')
    },
    {
      service: language === 'am' ? 'የቢሮ መጓጓዣ' : 'Office Relocation',
      icon: Building,
      bookings: recentBookings.filter(b => b.serviceType === 'office-relocation').length,
      revenue: calculateServiceRevenue('office-relocation'),
      growth: calculateServiceGrowth('office-relocation')
    },
    {
      service: language === 'am' ? 'የመጠን አገልግሎት' : 'Packaging Service',
      icon: Package,
      bookings: recentBookings.filter(b => b.serviceType === 'packaging').length,
      revenue: calculateServiceRevenue('packaging'),
      growth: calculateServiceGrowth('packaging')
    },
    {
      service: language === 'am' ? 'የመጠን መፍትሄዎች' : 'Storage Solutions',
      icon: Database,
      bookings: recentBookings.filter(b => b.serviceType === 'storage').length,
      revenue: calculateServiceRevenue('storage'),
      growth: calculateServiceGrowth('storage')
    }
  ]

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {language === 'am' ? 'የአስተዳደር ዳሽቦርድ' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {language === 'am' 
              ? 'የኩባንያውን እንቅስቃሴ እና የቀጠሮ ስርዓት ያስተዳድሩ' 
              : 'Manage company activities and booking system'
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto"
            onClick={() => fetchDashboardData()}
          >
            <Activity className="w-4 h-4 mr-2" />
            {language === 'am' ? 'ያደምሩ' : 'Refresh'}
          </Button>
          <Button className="bg-primary hover:bg-green-700 w-full sm:w-auto">
            <Zap className="w-4 h-4 mr-2" />
            {language === 'am' ? 'ፈጣን እርምጃ' : 'Quick Action'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-xs sm:text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} ${stat.borderColor} border ml-3`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="w-5 h-5 text-primary" />
            {language === 'am' ? 'ፈጣን እርምጃዎች' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={action.href} onClick={() => handleActionClick(action.action)}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="w-5 h-5 text-primary" />
                {language === 'am' ? 'የቅርብ ጊዜ ቀጠሮዎች' : 'Recent Bookings'}
              </span>
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white text-xs sm:text-sm">
                  {language === 'am' ? 'ሁሉን ይመልከቱ' : 'View All'}
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <div className="space-y-3 sm:space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{booking.customerName}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{getServiceText(booking.serviceType)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                        {getStatusText(booking.status)}
                      </Badge>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1">
                        {booking.amount.toLocaleString()} ETB
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm sm:text-base">
                    {language === 'am' ? 'ምንም ቀጠሮዎች የሉም' : 'No bookings found'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BarChart3 className="w-5 h-5 text-primary" />
              {language === 'am' ? 'የአገልግሎት አካላት' : 'Service Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <div className="space-y-3 sm:space-y-4">
              {serviceStats.map((service, index) => (
                <motion.div
                  key={service.service}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{service.service}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {service.bookings} {language === 'am' ? 'ቀጠሮዎች' : 'bookings'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{service.revenue}</p>
                    <p className="text-xs text-green-600 font-medium">{service.growth}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Activity className="w-5 h-5 text-primary" />
            {language === 'am' ? 'የስርዓት ሁኔታ' : 'System Status'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-green-900 text-sm sm:text-base">
                  {language === 'am' ? 'የቀጠሮ ስርዓት' : 'Booking System'}
                </h4>
                <p className="text-xs sm:text-sm text-green-700">
                  {language === 'am' ? 'የሚሰራ ነው' : 'Operational'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-blue-900 text-sm sm:text-base">
                  {language === 'am' ? 'የውሂብ ቤት' : 'Database'}
                </h4>
                <p className="text-xs sm:text-sm text-blue-700">
                  {language === 'am' ? 'የሚሰራ ነው' : 'Operational'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200 sm:col-span-2 lg:col-span-1">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-yellow-900 text-sm sm:text-base">
                  {language === 'am' ? 'የድህረ ገጽ' : 'Website'}
                </h4>
                <p className="text-xs sm:text-sm text-yellow-700">
                  {language === 'am' ? 'የሚሰራ ነው' : 'Operational'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 