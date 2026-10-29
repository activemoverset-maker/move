import assert from 'node:assert/strict'
import { test } from 'node:test'
import { looksLikeFaqQuestion } from '@/lib/telegram/intake/faq-heuristic'
import { nextStepAfter } from '@/lib/telegram/intake/steps'
import type { IntakeData } from '@/lib/telegram/intake/types'
import { intakeMeetsReportMinimum } from '@/lib/telegram/intake/validate'

const base: IntakeData = {
  locale: 'en',
  fromLocation: 'Bole',
  toLocation: 'CMC',
  moveDate: '2026-11-01',
}

test('nextStepAfter skips elevator for house', () => {
  const data = { ...base, dwellingType: 'house' as const, floor: '2' }
  assert.equal(nextStepAfter('floor', data), 'inventory')
})

test('nextStepAfter office branch goes to office_details', () => {
  const data = { ...base, dwellingType: 'office' as const }
  assert.equal(nextStepAfter('dwelling_type', data), 'office_details')
})

test('intakeMeetsReportMinimum requires phone and route', () => {
  assert.equal(intakeMeetsReportMinimum(base, '+251911234567', 0), false)
  assert.equal(
    intakeMeetsReportMinimum({ ...base, inventory: ['bed'] }, '+251911234567', 0),
    true
  )
})

test('looksLikeFaqQuestion detects questions not addresses', () => {
  assert.equal(looksLikeFaqQuestion('Bole Atlas'), false)
  assert.equal(looksLikeFaqQuestion('How much does packing cost?'), true)
})
