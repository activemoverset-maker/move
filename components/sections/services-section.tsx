"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Truck, 
  Package, 
  Warehouse, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Clock,
  Star,
  DollarSign
} from 'lucide-react'
import { SERVICES } from '@/constants/site'
import { trackEvent } from '@/lib/analytics'
import { useLanguage } from '@/contexts/language-context'

// Icon mapping
const iconMap = {
  Truck,
  Package,
  Warehouse,
  Building: Building2,
} as const

export function ServicesSection() {
  const { t, language } = useLanguage()

  const handleServiceClick = (serviceName: string) => {
    trackEvent({ 
      action: 'service_card_click', 
      category: 'services', 
      label: serviceName 
    })
  }

  const handleLearnMoreClick = () => {
    trackEvent({ 
      action: 'learn_more_click', 
      category: 'cta', 
      label: 'Services Learn More' 
    })
  }

  const handleBookNowClick = () => {
    trackEvent({ 
      action: 'services_book_now_click', 
      category: 'cta', 
      label: 'Services Book Now' 
    })
  }

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
  }

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-3 sm:mb-4"
          >
            <Badge variant="secondary" className="text-xs px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
              {t('services.badge')}
            </Badge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            {t('services.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-md bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                      {language === 'am' ? service.titleAm : service.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'am' ? service.descriptionAm : service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        {service.price}
                      </span>
                      <Button 
                        asChild
                        variant="outline" 
                        size="sm" 
                        className="text-xs sm:text-sm border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => handleServiceClick(service.title)}
                      >
                        <Link href={`/services/${service.id}`}>
                          {t('services.learnMore')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-sm sm:text-base font-medium text-gray-700">{t('services.trustIndicators.licensed')}</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-sm sm:text-base font-medium text-gray-700">{t('services.trustIndicators.support')}</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-sm sm:text-base font-medium text-gray-700">{t('services.trustIndicators.quotes')}</span>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 sm:p-8 text-center text-white"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            {t('services.bottomCTA.title')}
          </h3>
          <p className="text-sm sm:text-base text-green-100 mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            {t('services.bottomCTA.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild variant="secondary" size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary hover:bg-gray-100" onClick={() => trackEvent({ action: 'learn_more_click', category: 'cta', label: 'Services Learn More' })}>
              <Link href="/services">
                <Package className="w-4 h-4 mr-2" />
                {t('services.bottomCTA.learnMore')}
              </Link>
            </Button>
            <Button asChild size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-green-700 hover:bg-green-800 text-white" onClick={() => trackEvent({ action: 'book_now_click', category: 'cta', label: 'Services Book Now' })}>
              <Link href="/booking">
                <Truck className="w-4 h-4 mr-2" />
                {t('services.bottomCTA.bookNow')}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
 
 
 