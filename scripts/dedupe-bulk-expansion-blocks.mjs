/**
 * Remove duplicated bulk expansion blocks (2–3x append artifact) and internal noindex FAQ line.
 * Recommended pipeline after bulk expansion:
 *   bulk-finish --write → dedupe --write → bulk-finish --write → fix-guide-blog-metadata --write
 * Curated indexed guides: patch-curated-secondary-guides.mjs + NO_BULK_APPEND in bulk-finish.
 */
import fs from 'fs'
import path from 'path'

const WRITE = process.argv.includes('--write')
const ROOT = process.cwd()

const BULK_START = /<h2>Professional planning for[\s\S]*?(?=<h2>Professional planning for|$)/i
const BLOG_START = /<h2>Book professional help in Addis Ababa<\/h2>[\s\S]*?(?=<h2>Book professional help in Addis Ababa|$)/i
const NOINDEX_FAQ =
  /<p><strong>Can I stay noindex until ready\?<\/strong>[\s\S]*?<\/p>\s*/gi

function dedupeContent(html) {
  let c = html || ''
  // Remove all bulk guide blocks; keep content before first block
  const idx = c.search(/<h2>Professional planning for/i)
  if (idx !== -1) {
    c = c.slice(0, idx).trim()
  }
  // Remove all blog bulk append blocks
  const bidx = c.search(/<h2>Book professional help in Addis Ababa/i)
  if (bidx !== -1) {
    c = c.slice(0, bidx).trim()
  }
  c = c.replace(NOINDEX_FAQ, '')
  c = c.replace(/\n{3,}/g, '\n\n')
  return c.trim()
}

function wordCount(html) {
  const t = (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t.split(/\s+/).length : 0
}

function processDir(dir) {
  let changed = 0
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const fp = path.join(dir, f)
    const raw = JSON.parse(fs.readFileSync(fp, 'utf8'))
    const cleaned = dedupeContent(raw.content)
    if (cleaned === raw.content) continue
    changed++
    if (WRITE) {
      raw.content = cleaned
      raw.readTime = Math.max(1, Math.round(wordCount(cleaned) / 200))
      raw.updatedAt = new Date().toISOString()
      fs.writeFileSync(fp, JSON.stringify(raw, null, 2) + '\n', 'utf8')
    }
  }
  return changed
}

const guides = processDir(path.join(ROOT, 'data', 'guides'))
const blogs = processDir(path.join(ROOT, 'data', 'blogs'))
console.log(WRITE ? 'APPLIED' : 'DRY RUN', 'guides', guides, 'blogs', blogs)
