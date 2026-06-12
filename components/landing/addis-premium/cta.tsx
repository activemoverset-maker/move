'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Phone, MessageCircle, Send, ShieldAlert } from 'lucide-react'
import { ADDIS_PREMIUM_IMAGES } from '@/lib/addis-premium-data'
import { ADDIS_PREMIUM_CONTACT, ADDIS_PREMIUM_WHATSAPP_MESSAGES } from '@/lib/addis-premium-config'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useToast } from '@/hooks/use-toast'
import { Reveal, GlassPanel } from './ui'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone is required'),
  message: z.string().min(10, 'Tell us about your move'),
})

type FormData = z.infer<typeof schema>

export function AddisPremiumCta() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subject: 'Moving quote request — Addis Ababa premium landing page',
        }),
      })
      if (!res.ok) throw new Error('failed')
      reset()
      toast({ title: 'Request received', description: 'Our team will contact you shortly.' })
      trackEvent({ action: 'premium_landing_form', category: 'lead', label: 'Quote submitted' })
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again or reach us by phone or WhatsApp.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="addis-contact"
      className="scroll-mt-[5.5rem] relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="addis-cta-heading"
    >
      <div className="absolute inset-0">
        <Image
          src={ADDIS_PREMIUM_IMAGES.cta}
          alt="Large warehouse interior with high shelving and logistics storage"
          fill
          className="object-cover object-center"
          sizes="100vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030712]/96 via-[#0a1628]/94 to-[#1a0a04]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(59,130,246,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_80%,rgba(234,88,12,0.18),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-400">Book your move</p>
            <h2
              id="addis-cta-heading"
              className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.25rem]"
            >
              Move with clarity —{' '}
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                stress minimized, standards maximized
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300">
              Emergency relocations, executive transfers, and last-mile installs — coordinated from Megenagna with the
              urgency your timeline deserves.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={generateWhatsAppLink(ADDIS_PREMIUM_CONTACT.whatsapp, ADDIS_PREMIUM_WHATSAPP_MESSAGES.urgent)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400"
                onClick={() => trackEvent({ action: 'premium_landing_cta', category: 'cta', label: 'WhatsApp urgent' })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp — priority line
              </a>
              <a
                href={generateCallLink(ADDIS_PREMIUM_CONTACT.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.07] px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/12"
                onClick={() => trackEvent({ action: 'premium_landing_cta', category: 'cta', label: 'Call CTA' })}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call dispatch
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-400/45 bg-orange-500/15 px-7 py-4 text-sm font-semibold text-orange-50 backdrop-blur-md transition hover:bg-orange-500/25"
                onClick={() => trackEvent({ action: 'premium_landing_cta', category: 'cta', label: 'Booking' })}
              >
                Schedule online
              </Link>
            </div>
            <div className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-50/95">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
              <p>
                <span className="font-semibold text-white">Emergency moving</span> is subject to crew availability.
                Share access constraints, elevator hours, and inventory photos for the fastest confirmation.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <GlassPanel className="rounded-[1.5rem] border-white/20 bg-black/55 p-8 shadow-[0_32px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 sm:p-10">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">Quick quote request</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                We reply with scope, recommended crew size, vehicle class, and transparent pricing bands.
              </p>
              <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="addis-q-name" className="text-slate-200">
                    Full name
                  </Label>
                  <Input
                    id="addis-q-name"
                    className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-slate-500"
                    placeholder="Your name"
                    {...register('name')}
                  />
                  {errors.name ? <p className="text-xs text-red-300">{errors.name.message}</p> : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="addis-q-email" className="text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="addis-q-email"
                      type="email"
                      className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="you@company.com"
                      {...register('email')}
                    />
                    {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addis-q-phone" className="text-slate-200">
                      Phone
                    </Label>
                    <Input
                      id="addis-q-phone"
                      className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="+251 …"
                      {...register('phone')}
                    />
                    {errors.phone ? <p className="text-xs text-red-300">{errors.phone.message}</p> : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addis-q-msg" className="text-slate-200">
                    Move details
                  </Label>
                  <Textarea
                    id="addis-q-msg"
                    rows={4}
                    className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-slate-500"
                    placeholder="Pickup / drop-off, dates, floors, heavy items…"
                    {...register('message')}
                  />
                  {errors.message ? <p className="text-xs text-red-300">{errors.message.message}</p> : null}
                </div>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f59e0b] py-4 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  {submitting ? 'Sending…' : 'Submit request'}
                </motion.button>
              </form>
            </GlassPanel>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
