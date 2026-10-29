/**
 * Strip bulk expansion from specific slugs (indexed secondary guides with hand copy).
 * Usage: node scripts/strip-bulk-from-slugs.mjs --write
 */
import fs from 'fs'
import path from 'path'

const WRITE = process.argv.includes('--write')
const SLUGS = new Set([
  'end-of-month-moving-rush-addis-guide',
  'same-day-emergency-moving-addis-guide',
  'friendship-city-condo-moving-guide',
])

function dedupeContent(html) {
  let c = html || ''
  const idx = c.search(/<h2>Professional planning for/i)
  if (idx !== -1) c = c.slice(0, idx).trim()
  return c.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

function wordCount(html) {
  const t = (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t.split(/\s+/).length : 0
}

const dir = path.join(process.cwd(), 'data', 'guides')
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const fp = path.join(dir, f)
  const raw = JSON.parse(fs.readFileSync(fp, 'utf8'))
  if (!SLUGS.has(raw.slug)) continue
  const cleaned = dedupeContent(raw.content)
  console.log(raw.slug, 'words', wordCount(cleaned))
  if (WRITE) {
    raw.content = cleaned
    raw.readTime = Math.max(1, Math.round(wordCount(cleaned) / 200))
    raw.updatedAt = new Date().toISOString()
    fs.writeFileSync(fp, JSON.stringify(raw, null, 2) + '\n', 'utf8')
  }
}
