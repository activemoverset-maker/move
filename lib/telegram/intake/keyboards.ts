import inventory from '@/data/telegram/intake-inventory.json'
import type { IntakeData, IntakeStep } from '@/lib/telegram/intake/types'

type InlineRow = { text: string; callback_data: string }[]

export function mainMenuKeyboard(): InlineRow[] {
  return [
    [
      { text: '📦 Get a quote', callback_data: 'intake:menu:quote' },
      { text: '💬 Ask a question', callback_data: 'intake:menu:faq' },
    ],
    [{ text: '❓ Help', callback_data: 'intake:menu:help' }],
    [
      { text: '🇪🇹 አማርኛ', callback_data: 'intake:menu:lang:am' },
      { text: '🇬🇧 English', callback_data: 'intake:menu:lang:en' },
    ],
  ]
}

export function keyboardForStep(step: IntakeStep, data: IntakeData): InlineRow[] {
  switch (step) {
    case 'move_date':
      return [[{ text: 'Not sure yet', callback_data: 'intake:date:unsure' }]]
    case 'dwelling_type':
      return [
        [
          { text: 'Condominium', callback_data: 'intake:dw:condo' },
          { text: 'Apartment', callback_data: 'intake:dw:apartment' },
        ],
        [
          { text: 'House', callback_data: 'intake:dw:house' },
          { text: 'Office', callback_data: 'intake:dw:office' },
        ],
      ]
    case 'floor':
      return [
        [
          { text: 'G', callback_data: 'intake:fl:g' },
          { text: '1', callback_data: 'intake:fl:1' },
          { text: '2', callback_data: 'intake:fl:2' },
          { text: '3', callback_data: 'intake:fl:3' },
        ],
        [
          { text: '4', callback_data: 'intake:fl:4' },
          { text: '5', callback_data: 'intake:fl:5' },
          { text: '6+', callback_data: 'intake:fl:6p' },
        ],
      ]
    case 'elevator':
      return [
        [
          { text: 'Yes', callback_data: 'intake:el:y' },
          { text: 'No', callback_data: 'intake:el:n' },
          { text: 'Not sure', callback_data: 'intake:el:u' },
        ],
      ]
    case 'inventory': {
      const selected = new Set(data.inventory ?? [])
      const rows: InlineRow[] = []
      for (const item of inventory) {
        const mark = selected.has(item.id) ? '✓ ' : ''
        const label = data.locale === 'en' ? item.labelEn : item.labelAm
        rows.push([{ text: `${mark}${label}`, callback_data: `intake:inv:${item.id}` }])
      }
      rows.push([{ text: 'Done', callback_data: 'intake:inv_done' }])
      return rows
    }
    case 'inventory_photos':
      return [[{ text: 'Skip', callback_data: 'intake:skip_photos' }]]
    case 'review':
      return [
        [{ text: 'Submit to team', callback_data: 'intake:submit' }],
        [{ text: 'Edit from start', callback_data: 'intake:edit:restart' }],
      ]
    default:
      return []
  }
}

export function intakeFaqChoiceKeyboard(locale: 'am' | 'en'): InlineRow[] {
  if (locale === 'en') {
    return [
      [
        { text: 'Continue quote', callback_data: 'intake:flow:continue' },
        { text: 'Switch to questions', callback_data: 'intake:flow:faq' },
      ],
    ]
  }
  return [
    [
      { text: 'ዋጋ ቀጥል', callback_data: 'intake:flow:continue' },
      { text: 'ወደ ጥያቄ', callback_data: 'intake:flow:faq' },
    ],
  ]
}

export function phoneReplyKeyboard() {
  return {
    keyboard: [[{ text: '📱 Share phone', request_contact: true }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  }
}
