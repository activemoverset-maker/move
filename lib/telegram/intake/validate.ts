import type { IntakeData } from '@/lib/telegram/intake/types'

export function parsePhone(text: string): string | null {
  const digits = text.replace(/[^\d+]/g, '')
  if (/^(\+251|251|0)?9\d{8}$/.test(digits.replace(/^\+/, ''))) {
    let n = digits
    if (n.startsWith('0')) n = '+251' + n.slice(1)
    else if (n.startsWith('251')) n = '+' + n
    else if (!n.startsWith('+')) n = '+251' + n
    return n
  }
  return null
}

export function intakeMeetsReportMinimum(
  data: IntakeData,
  phone: string | null | undefined,
  mediaCount: number
): boolean {
  if (!phone) return false
  if (!data.fromLocation?.trim() || !data.toLocation?.trim()) return false
  if (!data.moveDate?.trim()) return false
  const hasInventory = (data.inventory?.length ?? 0) > 0
  const hasOffice = Boolean(data.officeDetails?.trim())
  return hasInventory || mediaCount > 0 || hasOffice
}
