"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Truck, 
  Package, 
  Warehouse, 
  Building,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Users,
  Calendar,
  Award,
  Zap
} from 'lucide-react'
import { SERVICES } from '@/constants/site'
import { SITE_CONFIG } from '@/constants/site'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'

interface ServiceDetailProps {
  serviceId: string
}

export function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const { t, language } = useLanguage()
  
  const service = SERVICES.find(s => s.id === serviceId)
  
  if (!service) {
    return (
      <div className="container-max py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
        <Button asChild>
          <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    )
  }

  const handleContactClick = (method: string) => {
    trackEvent({ 
      action: 'contact_click', 
      category: 'contact', 
      label: `${service.title} ${method}` 
    })
  }

  const handleBookingClick = () => {
    trackEvent({ 
      action: 'booking_click', 
      category: 'booking', 
      label: service.title 
    })
  }

  const benefits = [
    { icon: Shield, text: t('cta.benefits.licensed'), color: "text-green-500" },
    { icon: Clock, text: t('cta.benefits.sameDay'), color: "text-blue-500" },
    { icon: Star, text: t('cta.benefits.rated'), color: "text-yellow-500" },
    { icon: Users, text: t('cta.benefits.professional'), color: "text-purple-500" },
    { icon: Award, text: t('cta.benefits.fullyLicensed'), color: "text-indigo-500" },
    { icon: Zap, text: t('cta.benefits.competitive'), color: "text-orange-500" },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-green-600 to-green-700 text-white py-16 sm:py-20">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2 bg-white/20 text-white border-white/30">
              {t('services.badge')}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {language === 'am' ? service.titleAm : service.title}
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              {language === 'am' ? service.descriptionAm : service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8">
              <Button 
                asChild 
                variant="secondary" 
                size="lg" 
                className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary hover:bg-gray-100"
                onClick={handleBookingClick}
              >
                <Link href="/booking">
                  <Truck className="w-4 h-4 mr-2" />
                  {t('hero.bookMove')}
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-green-700 hover:bg-green-800 text-white"
                onClick={() => handleContactClick('phone')}
              >
                <a href={generateCallLink(SITE_CONFIG.links.phone)}>
                  <Phone className="w-4 h-4 mr-2" />
                  {t('cta.callNow')}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  {language === 'am' ? 'አገልግሎታችን ስለ ምን እንደሆነ' : 'About This Service'}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-lg mb-6">
                    {language === 'am' ? service.descriptionAm : service.description}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'am' ? 'የአገልግሎቱ ባህሪያት' : 'Service Features'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {(language === 'am' ? service.featuresAm : service.features).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'am' ? 'የአገልግሎቱ ሂደት' : 'Service Process'}
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {language === 'am' ? 'የመጀመሪያ ያሻሽ' : 'Initial Consultation'}
                        </h4>
                        <p className="text-gray-600">
                          {language === 'am' 
                            ? 'የመጓጓዣ ፍላጎትዎን እንደምንረዳ እና የሚያሻዎትን አገልግሎት እንደምንወስን' 
                            : 'We assess your moving needs and determine the best service for you'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {language === 'am' ? 'የዋጋ ግምት' : 'Price Quote'}
                        </h4>
                        <p className="text-gray-600">
                          {language === 'am' 
                            ? 'የተሻለ እና ትክክለኛ ዋጋ እንደምንሰጥ' 
                            : 'We provide a fair and accurate price quote'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {language === 'am' ? 'የአገልግሎት ስጦታ' : 'Service Delivery'}
                        </h4>
                        <p className="text-gray-600">
                          {language === 'am' 
                            ? 'አገልግሎቱን በጥንቃቄ እና በውጤታማነት እንደምንሰጥ' 
                            : 'We deliver the service with care and efficiency'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Pricing Card */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {language === 'am' ? 'ዋጋ' : 'Pricing'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-primary">{service.price}</span>
                      <p className="text-sm text-gray-600 mt-1">
                        {language === 'am' ? 'የመጀመሪያ ዋጋ' : 'Starting Price'}
                      </p>
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-primary hover:bg-green-700 text-white"
                      onClick={handleBookingClick}
                    >
                      <Link href="/booking">
                        {t('hero.bookMove')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Benefits Card */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {t('cta.whyChooseUs')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {benefits.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                          <span className="text-sm text-gray-700">{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-green-600 text-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-white">
                      {language === 'am' ? 'አሁን ያግኙን' : 'Get In Touch'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <Button 
                        asChild 
                        variant="secondary" 
                        className="w-full bg-white text-primary hover:bg-gray-100"
                        onClick={() => handleContactClick('phone')}
                      >
                        <a href={generateCallLink(SITE_CONFIG.links.phone)}>
                          <Phone className="w-4 h-4 mr-2" />
                          {t('cta.callNow')}
                        </a>
                      </Button>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full border-white text-white hover:bg-white/10"
                        onClick={() => handleContactClick('whatsapp')}
                      >
                        <a href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, `Hello! I'm interested in your ${service.title} service.`)}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="text-base px-8 py-4 bg-primary hover:bg-green-700 text-white"
                onClick={handleBookingClick}
              >
                <Link href="/booking">
                  <Truck className="w-5 h-5 mr-2" />
                  {t('cta.getFreeQuote')}
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-4 border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => handleContactClick('phone')}
              >
                <a href={generateCallLink(SITE_CONFIG.links.phone)}>
                  <Phone className="w-5 h-5 mr-2" />
                  {t('cta.callNow')}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 