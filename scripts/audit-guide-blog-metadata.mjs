/**
 * Read-only audit of blog/guide JSON metadata (W0).
 * Usage: node scripts/audit-guide-blog-metadata.mjs
 */
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'data', 'blogs')
const GUIDE_DIR = path.join(ROOT, 'data', 'guides')

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function wordCount(html) {
  const t = stripHtml(html)
  return t ? t.split(/\s+/).length : 0
}

function auditFile(type, filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const words = wordCount(raw.content || '')
  const expectedRead = Math.max(1, Math.round(words / 200))
  const readOff = raw.readTime && Math.abs(raw.readTime - expectedRead) > 5
  const future =
    raw.publishedAt && new Date(raw.publishedAt).getTime() > Date.now() + 86400000
  const excerptBad =
    raw.excerpt &&
    (raw.excerpt.split(':').length > 2 ||
      raw.excerpt.length < 40 ||
      /^[a-z].*active movers.*addis/i.test(raw.excerpt) && !raw.excerpt.includes('.'))
  const img = raw.featuredImage || ''
  const imgSuspect = /qua703|qua705/.test(img)

  const flags = []
  if (readOff) flags.push('readTime')
  if (future) flags.push('futureDate')
  if (excerptBad) flags.push('excerpt')
  if (imgSuspect) flags.push('featuredImage')
  if (words < 400) flags.push('thinBody')

  return {
    type,
    slug: raw.slug,
    flags: flags.join('|') || 'ok',
    words,
    readTime: raw.readTime,
    expectedRead,
    quality: raw.quality || '',
    index: raw.index,
  }
}

function scan(dir, type) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => auditFile(type, path.join(dir, f)))
}

const rows = [...scan(BLOG_DIR, 'blog'), ...scan(GUIDE_DIR, 'guide')]
const problems = rows.filter((r) => r.flags !== 'ok')

console.log('Total', rows.length, '| Issues', problems.length)
console.log('slug,type,flags,words,readTime,expectedRead,quality,index')
for (const r of problems.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(
    [r.slug, r.type, r.flags, r.words, r.readTime, r.expectedRead, r.quality, r.index].join(',')
  )
}
