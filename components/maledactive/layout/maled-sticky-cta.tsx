'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, Phone, FileText } from 'lucide-react'
import { MALED_SITE, MALED_WHATSAPP_MESSAGES } from '@/lib/maledactive-config'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'

function maledPath(href: string) {
  return `/sites/maledactive${href}`
}

export function MaledStickyCta() {
  const reduce = useReducedMotion()

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#0a0f1a]/95 p-1.5 shadow-[0_-8px_40px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="flex gap-1.5">
          <motion.div className="flex-1" whileTap={reduce ? undefined : { scale: 0.97 }}>
            <Link
              href={generateCallLink(MALED_SITE.contact.phone)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3 text-xs font-semibold text-white"
            >
              <Phone className="h-4 w-4 text-amber-400" />
              Call
            </Link>
          </motion.div>
          <motion.div className="flex-1" whileTap={reduce ? undefined : { scale: 0.97 }}>
            <a
              href={generateWhatsAppLink(
                MALED_SITE.contact.whatsapp,
                decodeURIComponent(MALED_WHATSAPP_MESSAGES.quote),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600/90 py-3 text-xs font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </motion.div>
          <motion.div className="flex-1" whileTap={reduce ? undefined : { scale: 0.97 }}>
            <Link
              href={maledPath('/contact')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-semibold text-[#0a0f1a]"
            >
              <FileText className="h-4 w-4" />
              Quote
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
