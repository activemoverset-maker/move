import Link from 'next/link'

import {
  COST_GUIDE_SLUG,
  formatEtb,
  LOCAL_MOVING_PRICE_TIERS,
  OFFICE_RELOCATION_FROM_ETB,
  STAIR_CARRY_SURCHARGE_ETB,
} from '@/constants/pricing'
import { cn } from '@/lib/utils'

type MovingPriceTableProps = {
  className?: string
  showOfficeRow?: boolean
  showGuideLink?: boolean
}

export function MovingPriceTable({
  className,
  showOfficeRow = true,
  showGuideLink = true,
}: MovingPriceTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[320px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 font-semibold text-slate-900">Home size</th>
            <th className="px-4 py-3 font-semibold text-slate-900">From</th>
            <th className="hidden px-4 py-3 font-semibold text-slate-900 sm:table-cell">Notes</th>
          </tr>
        </thead>
        <tbody>
          {LOCAL_MOVING_PRICE_TIERS.map((row) => (
            <tr key={row.homeType} className="border-b border-slate-100">
              <td className="px-4 py-3 text-slate-800">{row.homeType}</td>
              <td className="px-4 py-3 font-medium text-primary">{formatEtb(row.fromEtb)}</td>
              <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{row.notes}</td>
            </tr>
          ))}
          <tr className="border-b border-slate-100">
            <td className="px-4 py-3 text-slate-800">Stairs / no service lift</td>
            <td className="px-4 py-3 font-medium text-slate-800">
              {formatEtb(STAIR_CARRY_SURCHARGE_ETB.min)}–{formatEtb(STAIR_CARRY_SURCHARGE_ETB.max)}
            </td>
            <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">Per move, when crew carries without freight lift</td>
          </tr>
          {showOfficeRow ? (
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="px-4 py-3 text-slate-800">Office relocation</td>
              <td className="px-4 py-3 font-medium text-primary">{formatEtb(OFFICE_RELOCATION_FROM_ETB)}</td>
              <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                Workstations, IT, after-hours options — see{' '}
                <Link href="/services/office-relocation" className="text-primary underline-offset-2 hover:underline">
                  office service
                </Link>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {showGuideLink ? (
        <p className="mt-4 text-sm text-slate-600">
          Full breakdown:{' '}
          <Link
            href={`/guides/${COST_GUIDE_SLUG}`}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            2026 moving cost guide
          </Link>
        </p>
      ) : null}
    </div>
  )
}
