"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Quote, Star, User, ThumbsUp, Award, Users, Truck, Clock } from 'lucide-react'
import { TESTIMONIALS } from '@/constants/site'
import { trackEvent } from '@/lib/analytics'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

export function TestimonialsSection() {
  const { t, language } = useLanguage()

  const handleCTAClick = () => {
    trackEvent({ 
      action: 'testimonials_cta_click', 
      category: 'cta', 
      label: 'Testimonials Book Now' 
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

  const stats = [
    { icon: Users, value: "500+", label: "Happy Customers" },
    { icon: ThumbsUp, value: "98%", label: "Satisfaction Rate" },
    { icon: Award, value: "5★", label: "Average Rating" },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-3 sm:mb-4"
          >
            <Badge variant="secondary" className="text-xs px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
              {t('testimonials.badge')}
            </Badge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            {t('testimonials.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">500+</div>
            <div className="text-sm text-gray-600">{t('testimonials.stats.customers')}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">1000+</div>
            <div className="text-sm text-gray-600">{t('testimonials.stats.moves')}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">4.9</div>
            <div className="text-sm text-gray-600">{t('testimonials.stats.rating')}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-gray-600">{t('testimonials.stats.support')}</div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                                     <p className="text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed italic">
                     "{language === 'am' ? testimonial.contentAm : testimonial.content}"
                   </p>
                   <div className="flex items-center justify-between">
                     <div>
                       <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{language === 'am' ? testimonial.nameAm : testimonial.name}</h4>
                       <p className="text-xs text-gray-500">{language === 'am' ? testimonial.serviceAm : testimonial.service}</p>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-green-700 text-white" onClick={() => trackEvent({ action: 'start_move_click', category: 'cta', label: 'Testimonials CTA' })}>
            <Link href="/booking">
              <Truck className="w-4 h-4 mr-2" />
              {t('testimonials.cta')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 
 
 
 