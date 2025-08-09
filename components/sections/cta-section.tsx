"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Truck, Phone, Clock, Shield, ArrowRight, Star, CheckCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/constants/site'
import { generateCallLink } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { t } = useLanguage()

  const benefits = [
    { icon: Shield, text: t('cta.benefits.licensed'), color: "text-green-400" },
    { icon: Clock, text: t('cta.benefits.sameDay'), color: "text-blue-400" },
    { icon: Star, text: t('cta.benefits.rated'), color: "text-yellow-400" },
    { icon: CheckCircle, text: t('cta.benefits.freeEstimates'), color: "text-green-400" },
  ]

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-primary via-green-600 to-green-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"
        />
      </div>

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2 bg-white/20 text-white border-white/30">
              <Truck className="w-4 h-4 mr-2" />
              {t('cta.badge')}
            </Badge>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              {t('cta.title')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl mb-8 max-w-2xl mx-auto lg:mx-0 opacity-90"
            >
              {t('cta.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Link href="/booking" className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  {t('cta.getFreeQuote')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 group">
                <a href={generateCallLink(SITE_CONFIG.links.phone)} className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {t('cta.callNow')}
                </a>
              </Button>
            </motion.div>

            <Separator className="my-8 bg-white/20" />

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 ${benefit.color} rounded-full flex items-center justify-center bg-white/10`}>
                    <benefit.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium opacity-90">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Truck className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4">{t('cta.whyChooseUs')}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm">{t('cta.benefits.professional')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm">{t('cta.benefits.fullyLicensed')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm">{t('cta.benefits.competitive')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm">{t('cta.benefits.support')}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-xs opacity-75">{t('cta.stats.customers')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">5★</div>
                      <div className="text-xs opacity-75">{t('cta.stats.rating')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [-20, 20, -20],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [20, -20, 20],
                rotate: [360, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-12"
        >
          <Separator className="mb-8 bg-white/20" />
          <div className="text-sm opacity-75">
            <p>{t('cta.bottomText')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
 