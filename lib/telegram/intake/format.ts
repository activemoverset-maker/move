import inventory from '@/data/telegram/intake-inventory.json'
import type { IntakeData } from '@/lib/telegram/intake/types'
import { dwellingLabel } from '@/lib/telegram/intake/steps'

export function formatIntakeBlock(data: IntakeData, phone: string | null): string {
  const locale = data.locale ?? 'am'
  const lines = ['--- Quote intake ---']
  if (data.moveDate) lines.push(`Move date: ${data.moveDate}`)
  if (data.fromLocation) lines.push(`From: ${data.fromLocation}`)
  if (data.toLocation) lines.push(`To: ${data.toLocation}`)
  if (data.dwellingType) {
    let dwell = dwellingLabel(data.dwellingType, locale)
    if (data.floor) dwell += `, floor ${data.floor}`
    if (data.hasElevator !== undefined) {
      const el =
        data.hasElevator === 'unknown'
          ? 'unknown'
          : data.hasElevator
            ? 'yes'
            : 'no'
      dwell += `, elevator: ${el}`
    }
    lines.push(`Dwelling: ${dwell}`)
  }
  if (data.officeDetails) lines.push(`Office: ${data.officeDetails}`)
  const invLabels = (data.inventory ?? [])
    .map((id) => inventory.find((i) => i.id === id))
    .filter(Boolean)
    .map((i) => (locale === 'en' ? i!.labelEn : i!.labelAm))
  if (invLabels.length) lines.push(`Inventory: ${invLabels.join(', ')}`)
  if (data.hasMedia) lines.push('Photos: yes')
  if (phone) lines.push(`Phone: ${phone}`)
  return lines.join('\n')
}

export function formatReviewSummary(data: IntakeData, phone: string | null): string {
  return formatIntakeBlock(data, phone).replace('--- Quote intake ---', 'Summary:')
}
