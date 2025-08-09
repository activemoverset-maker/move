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
  User
} from 'lucide-react'
import { SITE_CONFIG } from '@/constants/site'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import Link from 'next/link'

export function AboutPage() {
  const { t, language } = useLanguage()

  const handleContactClick = (method: string) => {
    trackEvent({ 
      action: 'contact_click', 
      category: 'about', 
      label: `About ${method}` 
    })
  }

  const handleServiceClick = (service: string) => {
    trackEvent({ 
      action: 'service_click', 
      category: 'about', 
      label: `About ${service}` 
    })
  }

  const services = [
    {
      icon: Home,
      title: 'Home & Office Moves',
      titleAm: 'የቤት እና ቢሮ መጓጓዣ',
      description: 'Complete moving service for homes and offices',
      descriptionAm: 'የቤት እና ቢሮ ሙሉ መጓጓዣ አገልግሎት'
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
      description: 'Service throughout Addis Ababa and surrounding areas',
      descriptionAm: 'በአዲስ አበባ ውስጥ ያለው ሁሉ አካባቢ አገልግሎት'
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
    { icon: Users, value: '500+', label: language === 'am' ? 'ደስ ያለው ደንበኛ' : 'Happy Customers' },
    { icon: Star, value: '5.0', label: language === 'am' ? 'ደረጃ' : 'Rating' },
    { icon: Clock, value: '24/7', label: language === 'am' ? 'ድጋፍ' : 'Support' },
    { icon: Award, value: '10+', label: language === 'am' ? 'የስራ ዓመት' : 'Years Experience' }
  ]

  const values = [
    {
      icon: Home,
      title: 'Moving Excellence',
      titleAm: 'የመጓጓዣ መርሆ',
      description: 'Excellence in moving and customer satisfaction as our top priorities.',
      descriptionAm: 'የመጓጓዣ መርሆ እና መመለስ እንደሚመራ መርሆዎች።'
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      titleAm: 'ደህንነቱ የተጣራ',
      description: 'Safety and security as our core values, ensuring peace of mind for all our customers.',
      descriptionAm: 'ደህንነቱ የተጣራ እና የተጣራ መጓጓዣ እንደሚመራ መርሆዎች።'
    },
    {
      icon: Truck,
      title: 'Careful Handling',
      titleAm: 'የቤት እቃዎች መሰባሰብ',
      description: 'Careful handling and disassembly/reassembly of furniture to ensure its safety and longevity.',
      descriptionAm: 'የቤት እቃዎች መሰባሰብ እና መገጣጠም እንደሚመራ መርሆዎች።'
    }
  ]

  const team = [
    {
      name: 'Melese Taddese',
      nameAm: 'መልክት መረርት',
      role: 'Ethiopian Staff',
      roleAm: 'የሙያ ሰራተኛ',
      description: 'Experienced and friendly Ethiopian staff.',
      descriptionAm: 'የሙያ ሰራተኛ እና የተሞክሮ ሰራተኞች።'
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
          <motion.img src="/images/logo.jpg" alt="Active Movers Logo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-2xl mx-auto mb-4 bg-white/10 backdrop-blur-lg" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} />
          <motion.h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-white via-green-200 to-primary bg-clip-text text-transparent drop-shadow-xl animate-gradient-x" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {language === 'am' ? 'አክቲቭ ሞቨርስ' : 'Active Movers'}
          </motion.h1>
          <motion.p className="text-2xl sm:text-3xl font-semibold text-white max-w-2xl mx-auto mb-2" style={{ textShadow: '0 2px 8px #000, 0 0px 2px #000' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {language === 'am' ? 'በአዲስ አበባ ውስጥ ያለው የተማፀነ የመጓጓዣ አገልግሎት' : 'Reliable Moving Services in Addis Ababa'}
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Button asChild size="lg" variant="secondary" className="shadow-xl text-lg px-8 py-4 animate-glow" onClick={() => handleContactClick('phone')}>
              <a href={generateCallLink(SITE_CONFIG.links.phone)} className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {t('cta.callNow')}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="shadow-xl text-lg px-8 py-4 animate-glow" onClick={() => handleContactClick('whatsapp')}>
              <a href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, 'Hello! I would like to know more about your services.')} className="flex items-center gap-2">
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

      {/* Company Story */}
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
                {language === 'am' ? 'የኩባንያችን ታሪክ' : 'Our Story'}
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  {language === 'am' 
                    ? 'አክቲቭ ሞቨርስ በአዲስ አበባ፣ ኢትዮጵያ ውስጥ የሚገኝ የተማፀነ የአካባቢ የመጓጓዣ ኩባንያ ነው፣ ደህንነቱ የተጣራ፣ ውጤታማ እና ርካሽ የቤት እና ቢሮ መጓጓዣ ስፔሻሊዝ ነው። በከተማ ውስጥ ወይም ወደ አዲስ ሰፈር እያሰወጡ ወይም እያሰወጡ፣ የሙያ የኢትዮጵያ ቡድናችን ዕቃዎችዎን በጥንቃቄ እና በትክክለኛነት እንዲያስተናግድ ቁርጠኝ ነው።'
                    : 'Active Movers is a trusted local moving company based in Addis Ababa, Ethiopia, specializing in safe, efficient, and affordable home and office relocations. Whether you\'re moving across town or into a new neighborhood, our professional Ethiopian team is committed to handling your belongings with care and precision.'
                  }
                </p>
                <p className="text-lg">
                  {language === 'am'
                    ? 'ሙሉ የመጓጓዣ መፍትሄዎችን እንሰጣለን እንደ መጠን፣ መጫን፣ መጓጓዣ እና መፍታት - ሁሉም ንጹህ፣ በደንብ የተዘጋጁ እና በአረንጓዴ እና ጥቁር የተለዩ ጥርሶች። የተሞክሮ ሰራተኞቻችን መጓጓዣዎ ለስላሳ፣ ያለ ጫና እና ሁልጊዜ በጊዜ እንዲሆን ያረጋግጣሉ።'
                    : 'We offer full-service moving solutions including packing, loading, transportation, and unpacking — all with clean, well-equipped trucks proudly branded in green and black. Our experienced staff ensures your move is smooth, stress-free, and always on time.'
                  }
                </p>
                <p className="text-lg">
                  {language === 'am'
                    ? 'በሙያ እና የደንበኛ እርካታ ላይ ጠንካራ ዝና ያለው፣ አክቲቭ ሞቨርስ በአዲስ አበባ ውስጥ ያለው ያለ ጫና መጓጓዣ ለማግኘት የሚያገለግል አጋር ነው።'
                    : 'With a strong reputation for professionalism and customer satisfaction, Active Movers is your go-to partner for a hassle-free move in Addis Ababa.'
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
                    {language === 'am' ? 'የእኛ ተስፋፍቶ' : 'Our Mission'}
                  </h3>
                  <p className="text-lg leading-relaxed">
                    {language === 'am'
                      ? 'እኛ ሳጥኖችን ብቻ አንዛውርም - ቤቶችን፣ ቤተሰቦችን እና የአእምሮ ሰላምን እንዛውራለን።'
                      : 'We don\'t just move boxes — we move homes, families, and peace of mind.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
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

      {/* Values */}
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
              {language === 'am' ? 'የእኛ እሴቶች' : 'Our Values'}
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              {language === 'am'
                ? 'የእኛን ስራ የሚመራ መርሆዎች'
                : 'The principles that guide our work'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {language === 'am' ? value.titleAm : value.title}
                </h3>
                <p className="text-green-100 leading-relaxed">
                  {language === 'am' ? value.descriptionAm : value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === 'am' ? 'የእኛ ቡድን' : 'Our Team'}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {language === 'am'
                ? 'የሙያ እና የተሞክሮ ሰራተኞች'
                : 'Professional and experienced staff'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {language === 'am' ? member.nameAm : member.name}
                </h3>
                <p className="text-gray-300 mb-4">
                  {language === 'am' ? member.roleAm : member.role}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {language === 'am' ? member.descriptionAm : member.description}
                </p>
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
              {language === 'am' ? 'የእኛ ስኬቶች' : 'Our Success'}
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              {language === 'am'
                ? 'በዓመታት ውስጥ የተገኘ ስኬት'
                : 'Years of proven success'
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
              {language === 'am' ? 'ዛሬ ይጀምሩ' : 'Get Started Today'}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {language === 'am'
                ? 'የእርስዎን መጓጓዣ ለማዘጋጀት አሁን ያግኙን'
                : 'Contact us now to plan your move'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => handleContactClick('phone')}
              >
                <a href={generateCallLink(SITE_CONFIG.links.phone)} className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t('cta.callNow')}
                </a>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                onClick={() => handleContactClick('whatsapp')}
              >
                <a href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, 'Hello! I would like to get a quote for moving services.')} className="flex items-center gap-2">
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
    </>
  )
} 