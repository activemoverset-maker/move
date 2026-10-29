/** Published starting prices (ETB) — update here and sync cost guide + schema copy. */
export const LOCAL_MOVING_PRICE_TIERS = [
  {
    homeType: 'Studio / small apartment',
    fromEtb: 17_000,
    notes: 'Typical in-city move; customer-packed',
  },
  {
    homeType: '2-bedroom condo',
    fromEtb: 22_000,
    notes: 'Standard crew, truck, and loading',
  },
  {
    homeType: '3-bedroom home',
    fromEtb: 28_000,
    notes: 'More volume; lift or stair access affects final quote',
  },
  {
    homeType: 'Villa / large compound',
    fromEtb: 38_000,
    notes: 'Multi-room, outdoor items, or long carry from gate',
  },
] as const

export const STAIR_CARRY_SURCHARGE_ETB = { min: 2_000, max: 5_000 } as const

export const OFFICE_RELOCATION_FROM_ETB = 45_000

export const COST_GUIDE_SLUG = 'how-much-do-movers-cost-addis-ababa-2026-guide'

export function formatEtb(amount: number): string {
  return `${amount.toLocaleString('en-US')} ETB`
}

/** Visible homepage FAQ + JSON-LD (keep in sync). */
export const HOME_PRICING_FAQ = {
  question: 'How much does a move cost in Addis Ababa in 2026?',
  answer:
    'Local moves start from about 17,000 ETB for a studio, 22,000 ETB for a typical 2-bedroom condo, 28,000 ETB for a 3-bedroom home, and 38,000 ETB for a villa. Stair carry or no service lift often adds 2,000–5,000 ETB. Office relocations start from 45,000 ETB. Your quote depends on access, packing level, and distance—book a free assessment for a written price.',
}

export const HOME_PRICING_DISCLAIMER =
  'Starting prices for typical Addis Ababa moves. Final quotes follow a site visit or inventory call.'
