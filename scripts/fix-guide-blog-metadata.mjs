/**
 * W0 metadata fixes: readTime, future dates, broken featured images, index holds for very thin posts.
 * Usage:
 *   node scripts/fix-guide-blog-metadata.mjs           # dry run summary
 *   node scripts/fix-guide-blog-metadata.mjs --write   # apply
 */
import fs from 'fs'
import path from 'path'

const WRITE = process.argv.includes('--write')
const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'data', 'blogs')
const GUIDE_DIR = path.join(ROOT, 'data', 'guides')

const SAFE_FEATURED =
  'https://www.activemoverset.com/images/gallary/qua704.jpeg'
const BAD_IMAGE = /qua703\.jpeg|qua705\.jpeg/i
const NOW = Date.now()
const FALLBACK_PUBLISH = '2026-09-20T09:00:00.000Z'

/** P1 area / pricing guides — stay indexable and featured when content is adequate */
const FLAGSHIP_SLUGS = new Set([
  'how-much-do-movers-cost-addis-ababa-2026-guide',
  'bole-moving-guide-addis-ababa-2026',
  'cmc-mikael-moving-guide-addis-ababa',
  'movers-megenagna-complete-guide-2026',
  'ayat-lemi-kura-condo-moving-guide',
  'piassa-arada-historic-core-moving-guide',
  'condo-high-rise-moving-checklist-addis-ababa',
  'gerji-moving-guide-addis-ababa',
  'jemo-lebu-lafto-moving-guide-addis-ababa',
  'office-relocation-kazanchis-guide',
  'gelan-gura-corridor-relocation-moving-guide',
  'moving-truck-timing-freight-rules-addis-ababa',
  'gotera-interchange-moving-guide',
  'summit-fiyel-bet-moving-guide',
  'kotebe-yeka-moving-guide-addis',
  'ferensay-legasion-moving-guide',
  'diy-vs-professional-movers-addis-true-cost-guide',
  'local-moving-addis-ababa-complete-guide',
  'kirkos-subcity-moving-overview-guide',
  'gullele-entoto-moving-guide',
  'hourly-vs-fixed-moving-pricing-addis-guide',
  'moving-contract-red-flags-addis-guide',
  'nifas-silk-lafto-overview-moving-guide',
  'shola-megenagna-corridor-moving-guide',
  'yeka-subcity-moving-overview-guide',
])

/** Secondary guides: index when published and ≥400w (not full flagships) */
const SECONDARY_INDEX_SLUGS = new Set([
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

const BLOG_INDEX_SLUGS = new Set([
  'group-moving-discounts-neighbors-same-condo-active-movers',
  'same-day-movers-addis-ababa-worth-it',
  'active-movers-prevents-price-creep-written-contract-addis',
  'why-hiring-movers-better-than-diy-moving',
  'what-makes-moving-company-reliable-addis-ababa',
  'why-active-movers-highest-rated-addis-ababa',
])

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function wordCount(html) {
  const t = stripHtml(html)
  return t ? t.split(/\s+/).length : 0
}

function sanitizeImageUrl(url) {
  if (!url || BAD_IMAGE.test(url)) return SAFE_FEATURED
  return url
}

function processFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const before = JSON.stringify(raw)
  const isBlog = filePath.includes(`${path.sep}blogs${path.sep}`)
  const words = wordCount(raw.content)
  const expectedRead = Math.max(1, Math.round(words / 200))

  if (raw.readTime !== expectedRead) {
    raw.readTime = expectedRead
  }

  if (raw.publishedAt && new Date(raw.publishedAt).getTime() > NOW + 86400000) {
    raw.publishedAt = FALLBACK_PUBLISH
  }

  if (raw.featuredImage) {
    raw.featuredImage = sanitizeImageUrl(raw.featuredImage)
  }
  if (Array.isArray(raw.images)) {
    raw.images = raw.images.map(sanitizeImageUrl).filter(Boolean)
  }

  if (words < 400) {
    raw.quality =
      raw.quality === 'flagship' ? 'flagship' : raw.quality || 'needs-enrichment'
    if (raw.quality !== 'flagship') raw.index = false
  } else if (!raw.quality || raw.quality === 'needs-enrichment') {
    raw.quality = 'enriched'
  }

  if (FLAGSHIP_SLUGS.has(raw.slug)) {
    raw.quality = 'flagship'
    raw.index = true
  } else if (isBlog) {
    raw.index = BLOG_INDEX_SLUGS.has(raw.slug)
  } else if (SECONDARY_INDEX_SLUGS.has(raw.slug) && words >= 400) {
    raw.index = true
    if (raw.quality !== 'flagship') raw.quality = 'enriched'
  } else {
    raw.index = false
  }

  const after = JSON.stringify(raw)
  if (after !== before) {
    if (WRITE) {
      raw.updatedAt = new Date().toISOString()
      fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + '\n', 'utf8')
    }
    return true
  }
  return false
}

function scan(dir) {
  if (!fs.existsSync(dir)) return { changed: 0, total: 0 }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
  let changed = 0
  for (const f of files) {
    if (processFile(path.join(dir, f))) changed++
  }
  return { changed, total: files.length }
}

const blogs = scan(BLOG_DIR)
const guides = scan(GUIDE_DIR)

console.log(WRITE ? 'APPLIED' : 'DRY RUN (pass --write to save)')
console.log('blogs', blogs.changed, '/', blogs.total, 'files updated')
console.log('guides', guides.changed, '/', guides.total, 'files updated')
