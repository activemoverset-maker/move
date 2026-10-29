/**
 * Remove generic “Extra planning notes” footer from curated indexed guides.
 * Usage: node scripts/strip-extra-planning-indexed-guides.mjs --write
 */
import fs from 'fs'
import path from 'path'

const WRITE = process.argv.includes('--write')
const SLUGS = new Set([
  'addis-ketema-moving-guide',
  'broker-delala-vs-professional-movers-addis-guide',
  'bpo-call-center-office-relocation-addis-guide',
  'ngo-office-relocation-addis-guide',
  'friendship-city-condo-moving-guide',
  'end-of-month-moving-rush-addis-guide',
  'same-day-emergency-moving-addis-guide',
  'long-distance-moving-ethiopia-cities-guide',
  'move-out-handover-checklist-addis-renters',
  'holiday-moving-calendar-addis-ababa-timket-meskel',
  'packaging-service-addis-materials-guide',
  'office-relocation-minimal-downtime-checklist',
  'moving-addis-ababa-to-bishoftu-sululta-guide',
  'moving-addis-ababa-to-adama-guide',
  'moving-addis-ababa-to-hawassa-guide',
  'fragile-packing-electronics-addis-cobblestone-guide',
  'first-night-essentials-box-moving-guide',
])

function stripExtra(html) {
  const idx = (html || '').search(/<h2>Extra planning notes/i)
  if (idx === -1) return (html || '').trim()
  return html.slice(0, idx).trim()
}

function wordCount(html) {
  const t = (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t.split(/\s+/).length : 0
}

const dir = path.join(process.cwd(), 'data', 'guides')
let changed = 0
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const fp = path.join(dir, f)
  const raw = JSON.parse(fs.readFileSync(fp, 'utf8'))
  if (!SLUGS.has(raw.slug)) continue
  const cleaned = stripExtra(raw.content)
  if (cleaned === raw.content) continue
  changed++
  console.log(raw.slug, 'words', wordCount(cleaned))
  if (WRITE) {
    raw.content = cleaned
    raw.readTime = Math.max(1, Math.round(wordCount(cleaned) / 200))
    raw.updatedAt = new Date().toISOString()
    fs.writeFileSync(fp, JSON.stringify(raw, null, 2) + '\n', 'utf8')
  }
}
console.log(WRITE ? 'APPLIED' : 'DRY RUN', 'changed', changed)
