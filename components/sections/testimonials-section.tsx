"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Quote, Star, User, ThumbsUp, Award, Users, Truck, Clock, MapPin, Calendar, CheckCircle, Phone } from 'lucide-react'
import { TESTIMONIALS } from '@/constants/site'
import { trackEvent } from '@/lib/analytics'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'

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
      y: -8,
      scale: 1.02,
      rotateX: 2,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotate: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const starVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180,
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: 0.3 + (i * 0.1),
        ease: "easeOut",
        type: "spring",
        stiffness: 200,
      },
    }),
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

  const trustSectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
      },
    },
  }

  const ctaVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
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
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
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
            className="mb-4"
          >
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-primary/10 text-primary border-primary/20 font-medium cursor-pointer">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star className="w-4 h-4 mr-2 fill-current" />
              </motion.div>
              {t('testimonials.badge')}
            </Badge>
          </motion.div>
          
          <motion.h2
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
          >
            {t('testimonials.title')}
          </motion.h2>
          
          <motion.p
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16"
        >
          <motion.div 
            variants={statsVariants}
            custom={0}
            whileHover="hover"
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <motion.div 
              className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Users className="w-6 h-6 text-primary" />
            </motion.div>
            <motion.div 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              500+
            </motion.div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.customers')}</div>
          </motion.div>
          
          <motion.div 
            variants={statsVariants}
            custom={1}
            whileHover="hover"
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <motion.div 
              className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Truck className="w-6 h-6 text-green-600" />
            </motion.div>
            <motion.div 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              1000+
            </motion.div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.moves')}</div>
          </motion.div>
          
          <motion.div 
            variants={statsVariants}
            custom={2}
            whileHover="hover"
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <motion.div 
              className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Star className="w-6 h-6 text-yellow-600 fill-current" />
            </motion.div>
            <motion.div 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            >
              4.9
            </motion.div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.rating')}</div>
          </motion.div>
          
          <motion.div 
            variants={statsVariants}
            custom={3}
            whileHover="hover"
            className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <motion.div 
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Clock className="w-6 h-6 text-blue-600" />
            </motion.div>
            <motion.div 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              24/7
            </motion.div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.support')}</div>
          </motion.div>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover="hover"
              className="group"
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white rounded-2xl overflow-hidden group-hover:-translate-y-2">
                <CardContent className="p-0">
                  {/* Testimonial Header */}
                  <div className="p-8 pb-6">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            custom={i}
                            variants={starVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                          >
                            <Star className={`w-6 h-6 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} />
                          </motion.div>
                      ))}
                    </div>
                                              <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Quote className="w-10 h-10 text-gray-300 group-hover:text-primary transition-colors duration-300" />
                        </motion.div>
                  </div>
                    
                    <motion.p 
                      variants={textVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="text-gray-700 mb-8 leading-relaxed text-lg italic"
                    >
                     "{language === 'am' ? testimonial.contentAm : testimonial.content}"
                    </motion.p>
                  </div>

                  {/* Testimonial Footer */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 pt-6">
                    <div className="flex items-center space-x-4">
                      {/* Profile Image */}
                      <motion.div 
                        className="relative"
                        variants={imageVariants}
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true }}
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                          <Image
                            src={testimonial.image}
                            alt={language === 'am' ? testimonial.nameAm : testimonial.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                            priority={index < 4} // Prioritize loading first 4 images
                            onError={(e) => {
                              // Fallback to a placeholder if image fails to load
                              e.currentTarget.src = '/images/logotr.png'
                            }}
                          />
                        </div>
                        <motion.div 
                          className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                        >
                          <CheckCircle className="w-4 h-4 text-white fill-current" />
                        </motion.div>
                      </motion.div>

                      {/* Customer Info */}
                      <motion.div 
                        className="flex-1 min-w-0"
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <h4 className="font-bold text-gray-900 text-xl truncate">
                          {language === 'am' ? testimonial.nameAm : testimonial.name}
                        </h4>
                        <p className="text-base text-gray-600 font-medium mb-2">
                          {language === 'am' ? testimonial.serviceAm : testimonial.service}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <motion.div 
                            className="flex items-center"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{language === 'am' ? testimonial.locationAm : testimonial.location}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                          </motion.div>
                        </div>
                      </motion.div>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={trustSectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-green-600 rounded-3xl p-8 sm:p-12 text-white text-center mb-12 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h3 
              className="text-2xl sm:text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Trusted by Hundreds of Families in Addis Ababa
            </motion.h3>
            <motion.p 
              className="text-lg text-green-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Join our growing community of satisfied customers who trust us with their most valuable possessions
            </motion.p>
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { value: "100%", label: "Insured Moves" },
                { value: "24/7", label: "Support Available" },
                { value: "0", label: "Damaged Items" },
                { value: "15+", label: "Years Experience" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  variants={statsVariants}
                  custom={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="text-3xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ 
                      delay: 0.6 + (index * 0.1), 
                      type: "spring", 
                      stiffness: 200 
                    }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-green-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
        </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            
            <div className="relative z-10">
              <motion.h3 
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Ready to Experience the Best Moving Service?
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Join hundreds of satisfied customers who have trusted us with their moves
              </motion.p>
        <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    asChild 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-primary hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleCTAClick}
                  >
            <Link href="/booking">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Truck className="w-5 h-5 mr-2" />
                      </motion.div>
                      Book Your Move Now
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    <Link href="/contact">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Phone className="w-5 h-5 mr-2" />
                      </motion.div>
                      Get Free Quote
            </Link>
          </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
 
 
 