import Link from 'next/link'
import { MALED_SITE } from '@/lib/maledactive-config'
import { MaledLogo } from '@/components/maledactive/layout/maled-logo'
import { generateCallLink, generateWhatsAppLink } from '@/lib/utils'
import { MALED_WHATSAPP_MESSAGES } from '@/lib/maledactive-config'

const FOOTER_LINKS = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
  ],
} as const

function maledPath(href: string) {
  if (href === '/') return '/sites/maledactive'
  return `/sites/maledactive${href}`
}

export function MaledFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-[#060a12]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <MaledLogo className="mb-4" />
            <p className="max-w-md text-sm leading-relaxed text-slate-400">{MALED_SITE.description}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-400/90">Company</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={maledPath(link.href)} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-400/90">Contact</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href={generateCallLink(MALED_SITE.contact.phone)} className="transition hover:text-white">
                  {MALED_SITE.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={generateWhatsAppLink(MALED_SITE.contact.whatsapp, decodeURIComponent(MALED_WHATSAPP_MESSAGES.contact))}
                  className="transition hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${MALED_SITE.contact.email}`} className="transition hover:text-white">
                  {MALED_SITE.contact.email}
                </a>
              </li>
              <li>{MALED_SITE.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {MALED_SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {FOOTER_LINKS.legal.map((link) => (
              <Link key={link.href} href={maledPath(link.href)} className="text-xs text-slate-500 hover:text-slate-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
