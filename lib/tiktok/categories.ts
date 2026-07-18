import type { TikTokCategory } from '@/lib/tiktok/types'

export const TIKTOK_CATEGORIES: {
  id: TikTokCategory
  labelEn: string
  labelAm: string
}[] = [
  { id: 'moves', labelEn: 'Moves', labelAm: 'መጓጓዣ' },
  { id: 'packing', labelEn: 'Packing', labelAm: 'መጠን' },
  { id: 'office', labelEn: 'Office', labelAm: 'ቢሮ' },
  { id: 'tips', labelEn: 'Tips', labelAm: 'ምክሮች' },
  { id: 'reviews', labelEn: 'Reviews', labelAm: 'ግምገማዎች' },
  { id: 'behind_scenes', labelEn: 'Behind the scenes', labelAm: 'ከስራ በስተጀርባ' },
]

const VALID = new Set(TIKTOK_CATEGORIES.map((c) => c.id))

export function isValidTikTokCategory(value: string): value is TikTokCategory {
  return VALID.has(value as TikTokCategory)
}

export function getCategoryLabel(
  category: TikTokCategory,
  language: 'en' | 'am'
): string {
  const found = TIKTOK_CATEGORIES.find((c) => c.id === category)
  if (!found) return category
  return language === 'am' ? found.labelAm : found.labelEn
}
