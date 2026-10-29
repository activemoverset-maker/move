import { Metadata } from 'next'
import { ServicesOverview } from '@/components/pages/services-overview'
import { MovingPriceTable } from '@/components/pricing/moving-price-table'
import Link from 'next/link'
import { HOME_PRICING_DISCLAIMER } from '@/constants/pricing'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Our Services | Professional Moving & Packing in Addis Ababa',
  description: 'Comprehensive moving services in Addis Ababa: local moving, office relocation, packaging, storage solutions. Professional, reliable, and affordable moving services.',
  openGraph: {
    title: 'Active Movers & Packers - Our Services | Professional Moving & Packing in Addis Ababa',
    description: 'Comprehensive moving and packing services in Addis Ababa. Local moving, packaging, storage solutions, and office relocation services.',
  },
}

export default function ServicesPage() {
  return (
    <div className="pt-16">
      <ServicesOverview />
      <section className="section-padding border-t border-slate-200 bg-slate-50">
        <div className="container-max">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Starting prices for Addis Ababa moves
            </h2>
            <p className="mt-3 text-slate-600">{HOME_PRICING_DISCLAIMER}</p>
          </div>
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <MovingPriceTable />
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-600">
            <Link href="/#pricing" className="font-medium text-primary underline-offset-2 hover:underline">
              Full FAQ on homepage
            </Link>
            {' · '}
            <Link href="/booking" className="font-medium text-primary underline-offset-2 hover:underline">
              Book a free quote
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
} 
 
 
 