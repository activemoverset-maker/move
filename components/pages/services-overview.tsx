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
  MessageCircle
} from 'lucide-react'
import { SERVICES } from '@/constants/site'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { SITE_CONFIG } from '@/constants/site'

export function ServicesOverview() {
  const { t, language } = useLanguage()

  const handleServiceClick = (serviceName: string) => {
    trackEvent({ 
      action: 'service_page_click', 
      category: 'services', 
      label: serviceName 
    })
  }

  const handleContactClick = (method: string) => {
    trackEvent({ 
      action: 'contact_click', 
      category: 'contact', 
      label: `Services ${method}` 
    })
  }

  const trustIndicators = [
    { icon: Shield, text: t('services.trustIndicators.licensed'), color: "text-green-500" },
    { icon: Clock, text: t('services.trustIndicators.support'), color: "text-blue-500" },
    { icon: Star, text: t('services.trustIndicators.quotes'), color: "text-yellow-500" },
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
              {t('services.title')}
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-md bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                          {language === 'am' ? service.titleAm : service.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {language === 'am' ? service.descriptionAm : service.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-4">
                      {(language === 'am' ? service.featuresAm : service.features).slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {service.price}
                      </span>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleServiceClick(service.title)}
                      >
                        <Link href={`/services/${service.id}`} className="flex items-center gap-1">
                          {t('services.learnMore')}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12"
          >
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <indicator.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${indicator.color}`} />
                <span className="text-sm sm:text-base font-medium text-gray-700">{indicator.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 sm:p-8 text-center text-white"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              {t('services.bottomCTA.title')}
            </h3>
            <p className="text-sm sm:text-base text-green-100 mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
              {t('services.bottomCTA.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild variant="secondary" size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary hover:bg-gray-100">
                <Link href="/booking">
                  <Truck className="w-4 h-4 mr-2" />
                  {t('services.bottomCTA.bookNow')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 border-white text-white hover:bg-white hover:text-primary">
                <Link href="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  {t('services.bottomCTA.contactUs')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 
