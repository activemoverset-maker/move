'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { MALED_SITE, MALED_WHATSAPP_MESSAGES } from '@/lib/maledactive-config'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { MaledGlassPanel } from '@/components/maledactive/motion/maled-ui'
import { MaledReveal } from '@/components/maledactive/motion/maled-reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function MaledContactForm() {
  const reduce = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Moving Quote Request',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, site: 'maledactive' }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: 'Moving Quote Request', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-[#0a0f1a] py-20 sm:py-28" aria-labelledby="maled-contact-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MaledReveal className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Contact</p>
          <h1 id="maled-contact-heading" className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 text-slate-400">
            Tell us about your move and we&apos;ll respond with a quote as soon as possible.
          </p>
        </MaledReveal>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {[
              {
                icon: Phone,
                label: 'Phone',
                value: MALED_SITE.contact.phoneDisplay,
                href: generateCallLink(MALED_SITE.contact.phone),
              },
              {
                icon: MessageCircle,
                label: 'WhatsApp',
                value: 'Chat with us',
                href: generateWhatsAppLink(
                  MALED_SITE.contact.whatsapp,
                  decodeURIComponent(MALED_WHATSAPP_MESSAGES.quote),
                ),
                external: true,
              },
              {
                icon: Mail,
                label: 'Email',
                value: MALED_SITE.contact.email,
                href: `mailto:${MALED_SITE.contact.email}`,
              },
              {
                icon: MapPin,
                label: 'Location',
                value: MALED_SITE.contact.address,
                href: MALED_SITE.contact.mapUrl,
                external: true,
              },
            ].map((item, i) => (
              <MaledReveal key={item.label} delay={i * 0.08}>
                <MaledGlassPanel className="p-5">
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4"
                  >
                    <span className="rounded-lg bg-amber-500/15 p-2.5 text-amber-400">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-medium uppercase tracking-wider text-slate-500">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm font-medium text-white">{item.value}</span>
                    </span>
                  </a>
                </MaledGlassPanel>
              </MaledReveal>
            ))}
          </div>

          <MaledReveal className="lg:col-span-3" delay={0.15}>
            <MaledGlassPanel className="p-6 sm:p-8">
              {status === 'success' ? (
                <motion.div
                  className="flex flex-col items-center py-12 text-center"
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-400" />
                  <h2 className="text-xl font-semibold text-white">Message sent!</h2>
                  <p className="mt-2 text-sm text-slate-400">We&apos;ll get back to you shortly.</p>
                  <Button className="mt-6" variant="outline" onClick={() => setStatus('idle')}>
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="maled-name" className="text-slate-300">
                        Name
                      </Label>
                      <Input
                        id="maled-name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maled-phone" className="text-slate-300">
                        Phone
                      </Label>
                      <Input
                        id="maled-phone"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maled-email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="maled-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maled-subject" className="text-slate-300">
                      Subject
                    </Label>
                    <Input
                      id="maled-subject"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maled-message" className="text-slate-300">
                      Message
                    </Label>
                    <Textarea
                      id="maled-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                      placeholder="Tell us about your move — from/to addresses, date, and any special requirements."
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-sm text-red-400">Something went wrong. Please try again or call us directly.</p>
                  )}
                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0f1a] hover:brightness-110"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              )}
            </MaledGlassPanel>
          </MaledReveal>
        </div>
      </div>
    </section>
  )
}
