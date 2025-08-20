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
  DollarSign,
  Sparkles,
  Zap,
  Heart,
  Award,
  Users,
  MapPin
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

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.85,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -12,
      scale: 1.03,
      rotateX: 2,
      transition: {
        duration: 0.3,
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
        duration: 0.6,
        ease: "backOut",
        type: "spring",
        stiffness: 200,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: "easeOut",
      },
    },
  }

  const badgeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        type: "spring",
        stiffness: 150,
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  const statsVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2 + (i * 0.1),
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    }),
    hover: {
      y: -5,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="services" className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container-max relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            className="mb-6"
          >
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-gradient-to-r from-primary/10 to-green-500/10 text-primary border-primary/20 font-medium cursor-pointer">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4 mr-2 fill-current" />
              </motion.div>
              {t('services.badge')}
            </Badge>
          </motion.div>
          
          <motion.h2
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8"
          >
            {t('services.title')}
          </motion.h2>
          
          <motion.p
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover="hover"
            >
              <Card className="h-full group cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-green-500 to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg" />
                
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div>
                    {/* Icon with enhanced animation */}
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      className="w-16 h-16 bg-gradient-to-br from-primary/10 to-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-green-500 transition-all duration-500 group-hover:shadow-lg"
                    >
                      <service.icon className="w-8 h-8 text-primary group-hover:text-white transition-all duration-500" />
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                      {language === 'am' ? service.titleAm : service.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {language === 'am' ? service.descriptionAm : service.description}
                    </p>
                    
                    {/* Features preview */}
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {language === 'am' ? service.featuresAm[idx] : feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Enhanced Price and CTA Section */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      {/* Pricing Section */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500 font-medium">
                            {language === 'am' ? 'ዋጋ' : 'Starting Price'}
                          </span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">ETB</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {service.price.includes('From') 
                              ? service.price.replace('From ', '').replace(' ETB', '')
                              : service.price.includes('Contact') 
                                ? 'Custom'
                                : service.price
                            }
                      </span>
                          {!service.price.includes('Contact') && (
                            <span className="text-sm text-gray-500">ETB</span>
                          )}
                        </div>
                        {service.price.includes('Contact') && (
                          <p className="text-sm text-gray-500 mt-1">Contact us for pricing</p>
                        )}
                      </div>

                      {/* Enhanced CTA Button */}
                      <Button 
                        asChild
                        className="w-full group/btn bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleServiceClick(service.title)}
                      >
                        <Link href={`/services/${service.id}`} className="flex items-center justify-center gap-3 py-3">
                          <span className="font-semibold">{t('services.learnMore')}</span>
                          <div className="flex items-center gap-1">
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            <div className="w-2 h-2 bg-white rounded-full group-hover/btn:scale-150 transition-transform duration-300" />
                          </div>
                        </Link>
                      </Button>

                      {/* Quick Action */}
                      <div className="mt-3 text-center">
                        <Button 
                          asChild
                          variant="ghost" 
                          size="sm" 
                          className="text-xs text-gray-500 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                        >
                          <Link href="/booking" className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {language === 'am' ? 'ቀጠሮ ያድርጉ' : 'Book Now'}
                        </Link>
                      </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Trust Indicators */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          {/* Section Header */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {language === 'am' ? 'ለምን እንደምንመርጥ?' : 'Why Choose Us?'}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'am' 
                ? 'የእኛን አገልግሎት ለማግኘት የሚያደርጉ ምክንያቶች'
                : 'The reasons why customers trust us with their moves'
              }
            </p>
          </motion.div>

          {/* Trust Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: Shield, 
                text: t('services.trustIndicators.licensed'), 
                description: language === 'am' ? 'ሙሉ የተፈቀደ እና የተጣራ አገልግሎት' : 'Fully licensed and insured service',
                color: 'from-blue-500 to-blue-600',
                bgGradient: 'from-blue-50 to-blue-100/50',
                borderColor: 'border-blue-200',
                shadowColor: 'shadow-blue-500/20'
              },
              { 
                icon: Clock, 
                text: t('services.trustIndicators.support'), 
                description: language === 'am' ? '24/7 የደንበኛ ድጋፍ እና አገልግሎት' : '24/7 customer support and service',
                color: 'from-green-500 to-green-600',
                bgGradient: 'from-green-50 to-green-100/50',
                borderColor: 'border-green-200',
                shadowColor: 'shadow-green-500/20'
              },
              { 
                icon: DollarSign, 
                text: t('services.trustIndicators.quotes'), 
                description: language === 'am' ? 'ነፃ ዋጋ እና ተጣራ ዋጋዎች' : 'Free quotes and transparent pricing',
                color: 'from-purple-500 to-purple-600',
                bgGradient: 'from-purple-50 to-purple-100/50',
                borderColor: 'border-purple-200',
                shadowColor: 'shadow-purple-500/20'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                custom={index}
                whileHover="hover"
                className="group cursor-pointer"
              >
                <div className={`relative overflow-hidden bg-gradient-to-br ${item.bgGradient} rounded-3xl p-8 shadow-lg border ${item.borderColor} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group-hover:shadow-${item.shadowColor}`}>
                  
                  {/* Animated background elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700 delay-100" />
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Animated ring effect */}
                    <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl opacity-20 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700`} />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                      {item.text}
                    </h4>
                                         <p className="text-gray-600 leading-relaxed">
                       {item.description}
                     </p>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                </div>
            </motion.div>
          ))}
        </div>

          {/* Additional Trust Stats */}
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          viewport={{ once: true }}
            className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Users, value: '500+', label: language === 'am' ? 'ደስ ያለው ደንበኛ' : 'Happy Customers', color: 'text-blue-600' },
              { icon: Star, value: '5.0', label: language === 'am' ? 'ደረጃ' : 'Rating', color: 'text-yellow-600' },
              { icon: Award, value: '10+', label: language === 'am' ? 'የስራ ዓመት' : 'Years Experience', color: 'text-green-600' },
              { icon: MapPin, value: '100%', label: language === 'am' ? 'አካባቢ ሽፋን' : 'Area Coverage', color: 'text-purple-600' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                custom={index}
                whileHover="hover"
                className="text-center group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-green-600 to-primary opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 animate-pulse delay-1000" />
          
          <div className="relative z-10 p-8 sm:p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
          </div>
        </motion.div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {t('services.bottomCTA.title')}
          </h3>
            <p className="text-lg sm:text-xl text-green-100 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('services.bottomCTA.subtitle')}
          </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button 
                asChild 
                variant="secondary" 
                size="lg" 
                className="text-lg px-8 py-4 bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleLearnMoreClick}
              >
                <Link href="/services" className="flex items-center gap-3">
                  <Package className="w-5 h-5" />
                {t('services.bottomCTA.learnMore')}
              </Link>
            </Button>
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-4 bg-green-700 hover:bg-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleBookNowClick}
              >
                <Link href="/booking" className="flex items-center gap-3">
                  <Truck className="w-5 h-5" />
                {t('services.bottomCTA.bookNow')}
              </Link>
            </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
 
 
 