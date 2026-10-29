/** Shared labels & colors for moving guides (not blog categories). */

export const GUIDE_CATEGORIES = [
  { id: 'all', name: 'All guides', nameAm: 'ሁሉም መመሪያዎች' },
  { id: 'area-guide', name: 'Area guides', nameAm: 'የአካባቢ መመሪያ' },
  { id: 'service-guide', name: 'Service guides', nameAm: 'የአገልግሎት መመሪያ' },
  { id: 'pricing-guide', name: 'Pricing & planning', nameAm: 'ዋጋ እና Planning' },
  { id: 'commercial-guide', name: 'Commercial', nameAm: 'ንግድ / መስሪያ ቤት' },
  { id: 'checklist-guide', name: 'Checklists', nameAm: 'የማጣራት ዝርዝር' },
] as const

export const GUIDE_CATEGORY_META: Record<
  string,
  { en: string; am: string; accent: string; border: string; bg: string }
> = {
  'area-guide': {
    en: 'Area guide',
    am: 'የአካባቢ መመሪያ',
    accent: 'text-emerald-700',
    border: 'border-emerald-500',
    bg: 'bg-emerald-50',
  },
  'service-guide': {
    en: 'Service guide',
    am: 'የአገልግሎት መመሪያ',
    accent: 'text-teal-700',
    border: 'border-teal-500',
    bg: 'bg-teal-50',
  },
  'pricing-guide': {
    en: 'Pricing guide',
    am: 'ዋጋ መመሪያ',
    accent: 'text-amber-800',
    border: 'border-amber-500',
    bg: 'bg-amber-50',
  },
  'commercial-guide': {
    en: 'Commercial guide',
    am: 'ንግድ መመሪያ',
    accent: 'text-indigo-700',
    border: 'border-indigo-500',
    bg: 'bg-indigo-50',
  },
  'checklist-guide': {
    en: 'Checklist',
    am: 'የማጣራት ዝርዝር',
    accent: 'text-sky-800',
    border: 'border-sky-500',
    bg: 'bg-sky-50',
  },
}

export function getGuideCategoryLabel(id: string, language: 'en' | 'am') {
  const meta = GUIDE_CATEGORY_META[id]
  if (meta) return language === 'am' ? meta.am : meta.en
  const cat = GUIDE_CATEGORIES.find((c) => c.id === id)
  if (cat) return language === 'am' ? cat.nameAm : cat.name
  return id
}
