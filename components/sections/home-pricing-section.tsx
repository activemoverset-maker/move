import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

import { MovingPriceTable } from '@/components/pricing/moving-price-table'
import { buttonVariants } from '@/components/ui/button-variants'
import { SITE_CONFIG } from '@/constants/site'
import { HOME_PRICING_DISCLAIMER, HOME_PRICING_FAQ } from '@/constants/pricing'
import { cn, generateCallLink } from '@/lib/utils'

export function HomePricingSection() {
  return (
    <section id="pricing" className="section-padding border-y border-slate-200 bg-white">
      <div className="container-max">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Moving prices in Addis Ababa (2026)
          </h2>
          <p className="mt-4 text-lg text-slate-600">{HOME_PRICING_DISCLAIMER}</p>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6">
          <MovingPriceTable />
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold text-slate-900">{HOME_PRICING_FAQ.question}</h3>
          <p className="mt-3 leading-relaxed text-slate-700">{HOME_PRICING_FAQ.answer}</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/booking" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
            Get a free quote
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={generateCallLink(SITE_CONFIG.links.phone)}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2')}
          >
            <Phone className="h-4 w-4" />
            {SITE_CONFIG.links.phone.replace('+251', '0')}
          </a>
        </div>
      </div>
    </section>
  )
}
