/**
 * Metadata hygiene plus indexing.
 * Published posts of at least 400 words are indexable.
 * Drafts, short posts, and NOINDEX_SLUGS stay noindex.
 * FLAGSHIP_SLUGS always win over the denylist.
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

/**
 * Blogs that repeat a stronger guide. Flagship guides are never listed here.
 * The 2026 pricing guide is the canonical cost URL.
 */
const NOINDEX_SLUGS = new Set([
  'how-much-do-movers-cost-addis-ababa-2026-pricing-guide',
  'moving-costs-addis-ababa-2025',
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

  if (raw.status !== 'published') {
    raw.index = false
  } else if (FLAGSHIP_SLUGS.has(raw.slug)) {
    raw.quality = 'flagship'
    raw.index = true
  } else if (words < 400 || NOINDEX_SLUGS.has(raw.slug)) {
    raw.index = false
  } else {
    raw.index = true
    if (!raw.quality || raw.quality === 'needs-enrichment') {
      raw.quality = 'enriched'
    }
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
