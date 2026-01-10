"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Truck,
  Package,
  Users,
  Shield,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Award,
  CheckCircle,
  Heart,
  Home,
  Building,
  User,
  Target,
  Zap
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import Link from 'next/link'
import { BoleBulbulaFooter } from '../bole-bulbula-footer'

export function BoleBulbulaPage() {
  const { t, language } = useLanguage()

  const handleContactClick = (method: string) => {
    trackEvent({
      action: 'contact_click',
      category: 'bole-bulbula',
      label: `Bole Bulbula ${method}`
    })
  }

  const handleServiceClick = (service: string) => {
    trackEvent({
      action: 'service_click',
      category: 'bole-bulbula',
      label: `Bole Bulbula ${service}`
    })
  }

  const services = [
    {
      icon: Home,
      title: 'Home & Office Moves',
      titleAm: 'የቤት እና ቢሮ መጓጓዣ',
      description: 'Complete Bole Bulbula moving service for Bole Bulbula homes and Bole Bulbula offices',
      descriptionAm: 'ቦሌ ቡልቡላ መጓጓዣ አገልግሎት ቦሌ ቡልቡላ ቤቶች እና ቦሌ ቡልቡላ ቢሮዎች ለሆኑ'
    },
    {
      icon: Package,
      title: 'Expert Packing & Unpacking',
      titleAm: 'የሙያ መጠን እና መፍታት',
      description: 'Professional packing and unpacking services',
      descriptionAm: 'የሙያ መጠን እና መፍታት አገልግሎት'
    },
    {
      icon: Truck,
      title: 'Furniture Disassembly & Reassembly',
      titleAm: 'የቤት እቃዎች መሰባሰብ እና መገጣጠም',
      description: 'Careful disassembly and reassembly of furniture',
      descriptionAm: 'የቤት እቃዎች መሰባሰብ እና መገጣጠም'
    },
    {
      icon: MapPin,
      title: 'Local and Citywide Service',
      titleAm: 'የአካባቢ እና የከተማ አገልግሎት',
      description: 'Bole Bulbula first - service throughout Bole Bulbula and Addis Ababa',
      descriptionAm: 'ቦሌ ቡልቡላ በመጀመሪያ - ቦሌ ቡልቡላ እና አዲስ አበባ ሁሉ አካባቢ አገልግሎት'
    },
    {
      icon: Users,
      title: 'Friendly, Trained Ethiopian Staff',
      titleAm: 'ደጋፊ፣ የተሰለጠነ የኢትዮጵያ ሰራተኛ',
      description: 'Professional and friendly Ethiopian team',
      descriptionAm: 'ደጋፊ እና የተሰለጠነ የኢትዮጵያ ሰራተኞች'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      titleAm: 'ደህንነቱ የተጣራ እና የተጣራ',
      description: 'Safe and secure moving with insurance coverage',
      descriptionAm: 'ደህንነቱ የተጣራ እና የተጣራ መጓጓዣ'
    }
  ]

  const stats = [
    { icon: Users, value: '200+', label: language === 'am' ? 'ደስ ያለው ደንበኛ' : 'Happy Customers' },
    { icon: Star, value: '5.0', label: language === 'am' ? 'ደረጃ' : 'Rating' },
    { icon: Clock, value: '24/7', label: language === 'am' ? 'ድጋፍ' : 'Support' },
    { icon: Award, value: '3+', label: language === 'am' ? 'የስራ ዓመት' : 'Years Experience' }
  ]

  const features = [
    {
      icon: Target,
      title: 'Bole Bulbula Expertise',
      titleAm: 'ቦሌ ቡልቡላ ሙያ',
      description: 'Born and raised in Bole Bulbula - we know every street, every corner, every community',
      descriptionAm: 'ቦሌ ቡልቡላ የሆነ ሰው ነን - ቦሌ ቡልቡላ መንገዶችን፣ ቦሌ ቡልቡላ አካባቢዎችን እና ቦሌ ቡልቡላ ማህበረሰብን ሁሉ እናውቃለን'
    },
    {
      icon: Zap,
      title: 'Fastest Bole Bulbula Response',
      titleAm: 'ቦሌ ቡልቡላ ፈጣን ምላሽ',
      description: 'Located in Bole Bulbula for Bole Bulbula - arrive in minutes, not hours',
      descriptionAm: 'ቦሌ ቡልቡላ ለቦሌ ቡልቡላ ቦሌ ቡልቡላ ውስጥ ነን - በደቂቃ እንደምንደርስ፣ በሰዓት አይደለም'
    },
    {
      icon: MapPin,
      title: 'Bole Bulbula Heart',
      titleAm: 'ቦሌ ቡልቡላ ልብ',
      description: 'At the heart of Bole Bulbula, serving Bole Bulbula with Bole Bulbula pride',
      descriptionAm: 'ቦሌ ቡልቡላ ልብ ላይ ነን፣ ቦሌ ቡልቡላ ለቦሌ ቡልቡላ ከቦሌ ቡልቡላ ትዕቢት እንሰራለን'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Teshome',
      nameAm: 'ሳራ ተስኖም',
      content: 'Excellent service! The Bole Bulbula branch team made our move smooth and stress-free. Highly recommend!',
      contentAm: 'በጣም ጥሩ አገልግሎት! የቦሌ ቡልቡላ ቡድኑ መጓጓዣችንን ለስላሳ እና ያለ ግፍ አደረጉ። በጣም ይመከራል!',
      rating: 5,
      service: 'Local Moving',
      serviceAm: 'አካባቢያዊ መጓጓዣ',
      location: 'Bole Bulbula, Addis Ababa',
      locationAm: 'ቦሌ ቡልቡላ፣ አዲስ አበባ'
    },
    {
      name: 'Ahmed Mohammed',
      nameAm: 'አህመድ መሐመድ',
      content: 'Professional and reliable. They handled our office relocation in Bole Bulbula perfectly.',
      contentAm: 'የሙያ እና አስተማማኝ። የቢሮ መጓጓዣችንን በቦሌ ቡልቡላ በተሟላ አደረጉ።',
      rating: 5,
      service: 'Office Relocation',
      serviceAm: 'የቢሮ መጓጓዣ',
      location: 'Bole Bulbula, Addis Ababa',
      locationAm: 'ቦሌ ቡልቡላ፣ አዲስ አበባ'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-green-800 to-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/logo.jpg" alt="Active Movers Logo" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 opacity-10 blur-3xl select-none pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-green-900/40 to-primary/30" />
        </div>
        <div className="container-max relative z-10 flex flex-col items-center justify-center text-center gap-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4"
          >
            <Badge variant="secondary" className="text-lg px-4 py-2 text-white">
              Bole Bulbula Branch
            </Badge>
          </motion.div>

          <motion.img src="/images/logo.jpg" alt="Active Movers Logo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-2xl mx-auto mb-4 bg-white/10 backdrop-blur-lg" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} />
          <motion.h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-green-200 to-primary bg-clip-text text-transparent drop-shadow-xl animate-gradient-x" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {language === 'am' ? 'አክቲቭ ሞቨርስ' : 'Active Movers'}
          </motion.h1>
          <motion.h2 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ textShadow: '0 2px 8px #000, 0 0px 2px #000' }}>
            Bole Bulbula Branch
          </motion.h2>
          <motion.p className="text-lg sm:text-xl font-semibold text-white max-w-2xl mx-auto mb-2" style={{ textShadow: '0 2px 8px #000, 0 0px 2px #000' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {language === 'am' ? 'ቦሌ ቡልቡላ አካባቢ ለሁሉም መጓጓዣ ፍላጎቶች የሆነ የመጓጓዣ አገልግሎት' : 'Your Moving Partner in Bole Bulbula'}
          </motion.p>
          <motion.p className="text-base sm:text-lg text-green-200 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            {language === 'am' ? 'ቦሌ ቡልቡላ አካባቢ ለሚሰጡ ልዩ እና የሙያ የመጓጓዣ አገልግሎቶች - ፈጣን ምላሽ፣ አስተማማኝ አገልግሎት፣ እና ለቦሌ ቡልቡላ ሰዎች ልዩ ስራ' : 'Specialized moving services for Bole Bulbula residents - Fast response, reliable service, and local expertise for Bole Bulbula community'}
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Button asChild size="lg" variant="secondary" className="shadow-xl text-lg px-8 py-4 animate-glow" onClick={() => handleContactClick('phone')}>
              <a href={generateCallLink("+251982260000")} className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
Call Now
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="shadow-xl text-lg px-8 py-4 animate-glow" onClick={() => handleContactClick('whatsapp')}>
              <a href={generateWhatsAppLink("+251982260000", 'Hello! I would like to know more about your Bole Bulbula branch services.')} className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </Button>
          </motion.div>
          <motion.div className="mt-10 animate-bounce text-white/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Bole Bulbula Branch */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {language === 'am' ? 'ለምን ቦሌ ቡልቡላ ቡድኑን መምረጥ አለብዎት?' : 'Why Choose Bole Bulbula Branch?'}
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  {language === 'am'
                    ? 'አክቲቭ ሞቨርስ ቦሌ ቡልቡላ ቡድኑ አክቲቭ ሞቨርስ አክቲቭ ሞቨርስ የሆነ አክቲቭ ሞቨርስ አክቲቭ ሞቨርስ ነው። ከ10 ዓመታት በላይ በአዲስ አበባ ውስጥ ያለ ሙያ እና የሆነ የመጓጓዣ አገልግሎት እንሰጣለን፣ ከ500 በላይ ደስ ያለው ደንበኛዎች እና 5.0 ደረጃ እንዳለን በሆነ አገልግሎት የሚተማመን ኩባንያ ነው።'
                    : 'Active Movers Bole Bulbula Branch brings the trusted Active Movers legacy directly to Bole Bulbula. With over 10 years of professional moving experience in Addis Ababa, we\'ve served more than 500 happy customers with a perfect 5.0-star rating, earning a reputation for safe, efficient, and affordable relocations.'
                  }
                </p>
                <p className="text-lg">
                  {language === 'am'
                    ? 'ቦሌ ቡልቡላ ቡድኑ ቦሌ ቡልቡላ አካባቢ ለተለየ የተሰማራ አገልግሎት የሆነ ነው። ቦሌ ቡልቡላ መንገዶችን፣ ቦሌ ቡልቡላ ትራፊክ እና ቦሌ ቡልቡላ ሰዎች ፍላጎቶችን ከማወቅ በተጨማሪ ፈጣን ምላሽ ጊዜዎች እና ቦሌ ቡልቡላ ለሚሰጡ ልዩ አገልግሎቶች እንሰጣለን። ቦሌ ቡልቡላ ሰዎች ቦሌ ቡልቡላ ሰዎች ለቦሌ ቡልቡላ ሰዎች የተሰማሩ አገልግሎቶች እንሰጣለን።'
                    : 'Our Bole Bulbula Branch is specifically tailored for the Bole Bulbula community. We combine deep local knowledge of Bole Bulbula streets and traffic patterns with Active Movers\' proven track record of excellence. Whether you\'re moving within Bole Bulbula or throughout Addis Ababa, our experienced Ethiopian team delivers the same professional service that has made Active Movers Addis Ababa\'s most trusted moving company.'
                  }
                </p>
                <p className="text-lg">
                  {language === 'am'
                    ? 'አክቲቭ ሞቨርስ ቦሌ ቡልቡላ ቡድኑ ሙሉ የመጓጓዣ መፍትሄዎችን የሚሰጥ ነው - ከመጠን እስከ መፍታት ሁሉንም በጥንቃቄ እና በትክክለኛነት እንሰጣለን። ንጹህ፣ በደንብ የተዘጋጁ እና አረንጓዴ እና ጥቁር የተለዩ ጥርሶች እንጠቀማለን። ቦሌ ቡልቡላ ሰዎች ቦሌ ቡልቡላ አካባቢ ለሚሰጡ ፈጣን እና አስተማማኝ አገልግሎቶች የሚያስብ ነው።'
                    : 'Active Movers Bole Bulbula Branch offers complete moving solutions - from professional packing to careful unpacking, all handled with the precision and care that has earned Active Movers its stellar reputation. We use clean, well-equipped trucks proudly branded in green and black, ensuring your Bole Bulbula move is as smooth and stress-free as possible.'
                  }
                </p>
                <p className="text-lg font-semibold text-primary">
                  {language === 'am'
                    ? 'ቦሌ ቡልቡላ መጓጓዣ ፍላጎቶች ካሉብዎት፣ አክቲቭ ሞቨርስ ቦሌ ቡልቡላ ቡድኑ ተስፋ የሆነ እና አስተማማኝ አገልግሎት ነው። አክቲቭ ሞቨርስ ቦሌ ቡልቡላ ለቦሌ ቡልቡላ ሰዎች የሆነ አገልግሎት ነው።'
                    : 'When you choose Active Movers Bole Bulbula Branch, you\'re choosing the proven excellence of Active Movers with the convenience of local Bole Bulbula service. Trust your move to Addis Ababa\'s most reliable moving company - now serving Bole Bulbula with the same commitment to quality that has made us the city\'s top choice.'
                  }
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <Heart className="w-16 h-16 mx-auto mb-6 text-white/80" />
                  <h3 className="text-2xl font-bold mb-4">
                    {language === 'am' ? 'ቦሌ ቡልቡላ ተስፋፍቶ' : 'Bole Bulbula Mission'}
                  </h3>
                  <p className="text-lg leading-relaxed">
                    {language === 'am'
                      ? 'እኛ ቦሌ ቡልቡላ አካባቢን እንዛውራለን - ቦሌ ቡልቡላ ቤቶችን፣ ቦሌ ቡልቡላ ቤተሰቦችን እና ቦሌ ቡልቡላ ሰዎች ሰላምን እንሰጣለን። ቦሌ ቡልቡላ መጓጓዣ ፍላጎቶች ለሁሉም ቦሌ ቡልቡላ ሰዎች እንሰራለን።'
                      : 'We move Bole Bulbula — Bole Bulbula homes, Bole Bulbula families, and bring peace of mind to Bole Bulbula residents. Every move we handle in Bole Bulbula strengthens our Bole Bulbula community.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'am' ? 'የእኛ ለየብነት' : 'What Makes Us Special'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'am'
                ? 'በቦሌ ቡልቡላ አካባቢ ለሚሰጡ ልዩ አገልግሎቶች'
                : 'Specialized services for the Bole Bulbula community'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {language === 'am' ? feature.titleAm : feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'am' ? feature.descriptionAm : feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'am' ? 'የእኛ አገልግሎቶች' : 'Our Services'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'am'
                ? 'ሙሉ የመጓጓዣ መፍትሄዎች እንሰጣለን'
                : 'We provide comprehensive moving solutions'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {language === 'am' ? service.titleAm : service.title}
                        </h3>
                        <p className="text-gray-600">
                          {language === 'am' ? service.descriptionAm : service.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        {language === 'am' ? 'ይገኛል' : 'Available'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'am' ? 'የደንበኞች ምስክሮች' : 'What Our Customers Say'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'am'
                ? 'ቦሌ ቡልቡላ ደንበኞች ስለ ቦሌ ቡልቡላ ቡድን አገልግሎት ያሉት አስተያየቶች'
                : 'What Bole Bulbula residents say about Bole Bulbula Branch services'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      "{language === 'am' ? testimonial.contentAm : testimonial.content}"
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">
                        {language === 'am' ? testimonial.nameAm : testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'am' ? testimonial.serviceAm : testimonial.service}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'am' ? testimonial.locationAm : testimonial.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === 'am' ? 'ቦሌ ቡልቡላ ስኬቶች' : 'Bole Bulbula Success Stories'}
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              {language === 'am'
                ? 'ቦሌ ቡልቡላ ማህበረሰብን ለማገልገል የተገኘ ቦሌ ቡልቡላ ስኬት'
                : 'Proud Bole Bulbula achievements serving our Bole Bulbula community'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {language === 'am' ? 'ቦሌ ቡልቡላ መጓጓዣ ይጀምሩ' : 'Start Your Bole Bulbula Move'}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {language === 'am'
                ? 'ቦሌ ቡልቡላ መጓጓዣ ለማዘጋጀት አሁን ያግኙን - ቦሌ ቡልቡላ ቡድኑ ቦሌ ቡልቡላ ሰዎች ለቦሌ ቡልቡላ ሰዎች'
                : 'Contact Bole Bulbula Branch now - Bole Bulbula movers for Bole Bulbula residents'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => handleContactClick('phone')}
              >
                <a href={generateCallLink("+251982260000")} className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
  Call Now
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                onClick={() => handleContactClick('whatsapp')}
              >
                <a href={generateWhatsAppLink("+251982260000", 'Hello! I would like to get a quote for moving services in Bole Bulbula.')} className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                onClick={() => handleServiceClick('booking')}
              >
                <Link href="/booking" className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {language === 'am' ? 'ቀጠሮ ያድርጉ' : 'Book Now'}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bole Bulbula Footer */}
      <BoleBulbulaFooter />
    </>
  )
}
