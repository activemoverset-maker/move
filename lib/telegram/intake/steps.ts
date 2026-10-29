import type { DwellingType, IntakeData, IntakeStep } from '@/lib/telegram/intake/types'

export function nextStepAfter(current: IntakeStep, data: IntakeData): IntakeStep | null {
  switch (current) {
    case 'move_date':
      return 'from_location'
    case 'from_location':
      return 'to_location'
    case 'to_location':
      return 'dwelling_type'
    case 'dwelling_type':
      if (data.dwellingType === 'office') return 'office_details'
      return 'floor'
    case 'floor':
      if (data.dwellingType === 'house') return 'inventory'
      return 'elevator'
    case 'elevator':
      return 'inventory'
    case 'office_details':
      return 'phone'
    case 'inventory':
      return 'inventory_photos'
    case 'inventory_photos':
      return 'phone'
    case 'phone':
      return 'review'
    case 'review':
      return null
    default:
      return null
  }
}

export function stepExpectsText(step: IntakeStep | null | undefined): boolean {
  return (
    step === 'move_date' ||
    step === 'from_location' ||
    step === 'to_location' ||
    step === 'office_details' ||
    step === 'phone' ||
    step === 'floor'
  )
}

export function dwellingLabel(type: DwellingType, locale: 'am' | 'en'): string {
  const map: Record<DwellingType, { en: string; am: string }> = {
    condo: { en: 'Condominium', am: 'ኮንዶሚኒየም' },
    apartment: { en: 'Apartment', am: 'አፓርትመንት' },
    house: { en: 'House', am: 'ቤት' },
    office: { en: 'Office', am: 'ቢሮ' },
  }
  return map[type][locale]
}
