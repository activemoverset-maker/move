"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Truck,
  Shield,
  Star,
  Users
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { SITE_CONFIG } from '@/constants/site'
import { generateCallLink, generateWhatsAppLink, generateTelegramLink } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useToast } from '@/hooks/use-toast'

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export function ContactPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSubmitted(true)
        reset()
        toast({
          title: language === 'am' ? 'እንኳን ደስ አለዎት!' : 'Success!',
          description: language === 'am' 
            ? 'መልእክትዎ በተሳካተ ላከ። በቅርቡ እንገኝለን።' 
            : 'Your message has been sent successfully. We will get back to you soon.',
          variant: 'default',
        })
        
        trackEvent({
          action: 'contact_form_submitted',
          category: 'contact',
          label: 'Contact Form Submission'
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: language === 'am' ? 'ስህተት!' : 'Error!',
        description: language === 'am' 
          ? 'መልእክትዎ ሊላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።' 
          : 'Failed to send your message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactClick = (method: string) => {
    trackEvent({
      action: 'contact_method_clicked',
      category: 'contact',
      label: method
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            {t('contact.badge')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary to-green-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Send className="w-6 h-6" />
                  {t('contact.form.title')}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {t('contact.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {t('contact.form.name')} *
                      </label>
                      <Input
                        {...register('name')}
                        placeholder={language === 'am' ? 'የእርስዎ ስም' : 'Your name'}
                        className={`h-12 text-base ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {t('contact.form.phone')} *
                      </label>
                      <Input
                        {...register('phone')}
                        placeholder={language === 'am' ? 'የእርስዎ ስልክ' : 'Your phone number'}
                        className={`h-12 text-base ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('contact.form.email')} *
                    </label>
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder={language === 'am' ? 'የእርስዎ ኢሜይል' : 'Your email address'}
                      className={`h-12 text-base ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('contact.form.subject')} *
                    </label>
                    <Input
                      {...register('subject')}
                      placeholder={language === 'am' ? 'የመልእክት ርዕስ' : 'Message subject'}
                      className={`h-12 text-base ${errors.subject ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('contact.form.message')} *
                    </label>
                    <Textarea
                      {...register('message')}
                      placeholder={language === 'am' ? 'መልእክትዎን ያስገቡ...' : 'Enter your message...'}
                      rows={6}
                      className={`text-base resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {language === 'am' ? 'ይላካል...' : 'Sending...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        {t('contact.form.submit')}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info.title')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Phone
                    </h4>
                    <p className="text-gray-600 mb-2">{SITE_CONFIG.links.phone}</p>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        onClick={() => handleContactClick('phone')}
                        className="bg-primary hover:bg-green-700 text-white"
                      >
                        <a href={generateCallLink(SITE_CONFIG.links.phone)}>
                          {t('contact.info.call')}
                        </a>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactClick('whatsapp')}
                      >
                        <a href={generateWhatsAppLink(SITE_CONFIG.links.whatsapp, 'Hello! I need information about your services.')}>
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Email
                    </h4>
                    <p className="text-gray-600 mb-2">{SITE_CONFIG.links.email}</p>
                    <Button
                      asChild
                      size="sm"
                      onClick={() => handleContactClick('email')}
                      className="bg-primary hover:bg-green-700 text-white"
                    >
                      <a href={`mailto:${SITE_CONFIG.links.email}`}>
                        {t('contact.info.sendEmail')}
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h4>
                    <p className="text-gray-600 mb-2">{SITE_CONFIG.links.address}</p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      onClick={() => handleContactClick('map')}
                    >
                      <a href={SITE_CONFIG.links.map} target="_blank" rel="noopener noreferrer">
                        {t('contact.info.viewMap')}
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('contact.info.hours')}
                    </h4>
                    <p className="text-gray-600">
                      {t('contact.info.weekdays')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                {t('contact.trust.title')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold">{t('contact.trust.rating')}</span>
                  </div>
                  <p className="text-sm text-green-100">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="font-bold">{t('contact.trust.customers')}</span>
                  </div>
                  <p className="text-sm text-green-100">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Truck className="w-5 h-5" />
                    <span className="font-bold">{t('contact.trust.support')}</span>
                  </div>
                  <p className="text-sm text-green-100">Support</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-bold">{t('contact.trust.insured')}</span>
                  </div>
                  <p className="text-sm text-green-100">Insured</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 