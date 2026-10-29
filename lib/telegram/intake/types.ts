export const INTAKE_STEPS = [
  'move_date',
  'from_location',
  'to_location',
  'dwelling_type',
  'floor',
  'elevator',
  'office_details',
  'inventory',
  'inventory_photos',
  'phone',
  'review',
] as const

export type IntakeStep = (typeof INTAKE_STEPS)[number]

export type DwellingType = 'condo' | 'apartment' | 'house' | 'office'

export type IntakeData = {
  v: 1
  dwellingType?: DwellingType
  floor?: string
  hasElevator?: boolean | 'unknown'
  moveDate?: string
  fromLocation?: string
  toLocation?: string
  officeDetails?: string
  inventory?: string[]
  hasMedia?: boolean
  locale?: 'am' | 'en'
}

export type IntakeLocale = 'am' | 'en'

export function emptyIntakeData(locale: IntakeLocale = 'am'): IntakeData {
  return { v: 1, inventory: [], locale }
}

export function parseIntakeData(raw: unknown): IntakeData {
  if (!raw || typeof raw !== 'object') return emptyIntakeData()
  const o = raw as Record<string, unknown>
  return {
    v: 1,
    dwellingType: o.dwellingType as DwellingType | undefined,
    floor: typeof o.floor === 'string' ? o.floor : undefined,
    hasElevator:
      o.hasElevator === true || o.hasElevator === false || o.hasElevator === 'unknown'
        ? (o.hasElevator as boolean | 'unknown')
        : undefined,
    moveDate: typeof o.moveDate === 'string' ? o.moveDate : undefined,
    fromLocation: typeof o.fromLocation === 'string' ? o.fromLocation : undefined,
    toLocation: typeof o.toLocation === 'string' ? o.toLocation : undefined,
    officeDetails: typeof o.officeDetails === 'string' ? o.officeDetails : undefined,
    inventory: Array.isArray(o.inventory) ? o.inventory.map(String) : [],
    hasMedia: o.hasMedia === true,
    locale: o.locale === 'en' ? 'en' : 'am',
  }
}
