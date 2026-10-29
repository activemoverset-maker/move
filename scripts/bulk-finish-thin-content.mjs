/**
 * Remove duplicate scaffold blocks and expand thin guides/blogs toward 400+ words.
 * Long-tail stays noindex unless already index:true or in OPTIONAL_INDEX_SLUGS.
 *
 *   node scripts/bulk-finish-thin-content.mjs
 *   node scripts/bulk-finish-thin-content.mjs --write
 */
import fs from 'fs'
import path from 'path'

const WRITE = process.argv.includes('--write')
const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'data', 'blogs')
const GUIDE_DIR = path.join(ROOT, 'data', 'guides')
const TARGET_WORDS = 400

const OPTIONAL_INDEX_SLUGS = new Set([
  'friendship-city-condo-moving-guide',
  'end-of-month-moving-rush-addis-guide',
  'same-day-emergency-moving-addis-guide',
  'long-distance-moving-ethiopia-cities-guide',
  'move-out-handover-checklist-addis-renters',
  'holiday-moving-calendar-addis-ababa-timket-meskel',
  'packaging-service-addis-materials-guide',
  'office-relocation-minimal-downtime-checklist',
  'end-of-month-moving-rush-addis-guide',
  'moving-addis-ababa-to-bishoftu-sululta-guide',
  'moving-addis-ababa-to-adama-guide',
  'moving-addis-ababa-to-hawassa-guide',
  'fragile-packing-electronics-addis-cobblestone-guide',
  'first-night-essentials-box-moving-guide',
])

/** Hand-written indexed guides: never append full “Professional planning” block */
const NO_BULK_APPEND = new Set([
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

const NO_BULK_BLOG = new Set([
  'group-moving-discounts-neighbors-same-condo-active-movers',
  'same-day-movers-addis-ababa-worth-it',
  'active-movers-prevents-price-creep-written-contract-addis',
  'why-hiring-movers-better-than-diy-moving',
  'what-makes-moving-company-reliable-addis-ababa',
  'why-active-movers-highest-rated-addis-ababa',
])

const BOILERPLATE_RE =
  /<h2>Step-by-step planning in Addis Ababa<\/h2>[\s\S]*?(?=<h2>(?:Book with Active Movers|More FAQs|Frequently asked questions)<\/h2>)/i

const GENERIC_SERVICE_RE =
  /<p>This guide explains how professional movers handle[\s\S]*?<h2>Book Active Movers<\/h2>\s*<p>[\s\S]*?<\/p>/i

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function wordCount(html) {
  const t = stripHtml(html)
  return t ? t.split(/\s+/).length : 0
}

function cleanContent(html) {
  let c = html || ''
  c = c.replace(BOILERPLATE_RE, '')
  c = c.replace(GENERIC_SERVICE_RE, '')
  c = c.replace(/\n{3,}/g, '\n\n')
  return c.trim()
}

function slugContext(slug) {
  if (/moving-addis-ababa-to-/.test(slug)) {
    const dest = slug
      .replace(/^moving-addis-ababa-to-/, '')
      .replace(/-guide$/, '')
      .replace(/-/g, ' ')
    return { type: 'intercity', dest }
  }
  if (/office|bpo|ngo|clinic|law-firm|call-center|commercial|shop|retail|hotel|dental|pharmacy|accounting/.test(slug))
    return { type: 'commercial' }
  if (/checklist|handover|timing|calendar|rush|contract|pricing|hourly|diy|insurance|utility|deposit|woreda/.test(slug))
    return { type: 'checklist' }
  if (/packing|packaging|fragile|disassembly|wardrobe|box-label|inventory/.test(slug))
    return { type: 'packing' }
  if (/area|moving-guide|subcity|corridor|condo|bole|jemo|ayat|kirkos|yeka|gerji|gotera|summit|piassa|kazanchis|cmc|lebu|kotebe|ferensay|gullele|nifas|gelan|friendship|olympia|sandafa|welo|tor-hailoch|kara|goro|bambis|kera|addis-ketema|lideta|kolfe|merkato|bisrate|eagle|phison|penthouse|airbnb|tenant|gated|sheger|light-rail|stadium|industrial|kality|kilinto|modjo|cross-border|debre|adama|aware|aseb|eastern-industrial|gotera-to-kality/.test(slug))
    return { type: 'area' }
  return { type: 'general' }
}

function expansionHtml(raw, kind) {
  const title = (raw.title || raw.slug).replace(/\.$/, '')
  const excerpt = raw.excerpt || title
  const tags = (raw.tags || []).slice(0, 4).join(', ') || 'Addis Ababa'
  const ctx = slugContext(raw.slug)

  let focus = ''
  if (ctx.type === 'intercity') {
    focus = `<p>Inter-city legs from Addis Ababa to <strong>${ctx.dest}</strong> need route planning, fuel time, and sometimes overnight staging. Your quote should separate city load/unload from highway hours. Confirm truck class for road condition and whether you need same-day unload at destination or next-morning delivery.</p>`
  } else if (ctx.type === 'commercial') {
    focus = `<p>Commercial moves need labeled inventory, after-hours freight when buildings require it, and a written scope tied to downtime cost. Office floors often start from <strong>45,000 ETB</strong> after survey—see <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 cost guide</a> and <a href="/services/office-relocation">office relocation</a>.</p>`
  } else if (ctx.type === 'checklist') {
    focus = `<p>Checklist guides prevent day-of failures at condo gates and during handover. Pair this page with <a href="/guides/condo-high-rise-moving-checklist-addis-ababa">condo checklist</a>, <a href="/guides/moving-truck-timing-freight-rules-addis-ababa">truck timing</a>, and a surveyed quote before you pay a deposit.</p>`
  } else if (ctx.type === 'packing') {
    focus = `<p>Packing discipline protects goods on cobblestone and tight turns. Ask about materials and labor separately—<a href="/services/packaging">packaging service</a> · <a href="/guides/packaging-service-addis-materials-guide">materials guide</a>.</p>`
  } else if (ctx.type === 'area') {
    focus = `<p>Area moves in Addis Ababa differ by gate rules, elevator slots, and traffic—not bedroom count alone. Mention exact compound name, floor, and carry distance at survey. Compare <a href="/guides/bole-moving-guide-addis-ababa-2026">Bole</a>, <a href="/guides/local-moving-addis-ababa-complete-guide">local moving service</a>, and <a href="/guides/moving-truck-timing-freight-rules-addis-ababa">freight timing</a> when planning cross-town legs.</p>`
  } else {
    focus = `<p>Every move in Addis Ababa should start with inventory and access photos—not a broker phone quote. Fixed or capped pricing beats open hourly meters at busy gates.</p>`
  }

  return `
<h2>Professional planning for ${title.replace(/:.*$/, '')}</h2>
<p>${excerpt} Active Movers & Packers serves all 11 sub-cities from Lemi Kura dispatch with written quotes after walkthrough or video survey.</p>
${focus}

<h2>Before moving day</h2>
<ul>
<li>Confirm management move rules, freight lift booking, and security ID lists for truck plate and crew.</li>
<li>Declutter to reduce volume; label rooms and mark FRAGILE on electronics and glass.</li>
<li>Photograph meters and wall condition at origin; repeat at destination before furniture covers walls.</li>
<li>Check <a href="/guides/holiday-moving-calendar-addis-ababa-timket-meskel">holiday traffic</a> and <a href="/guides/end-of-month-moving-rush-addis-guide">end-of-month rush</a> when picking dates.</li>
</ul>

<h2>Quote and contract discipline</h2>
<p>Starting local tiers—from about <strong>17,000 ETB</strong> for small apartments—appear on <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 cost guide</a> and <a href="/#pricing">homepage pricing</a>. Your final number follows stairs, packing, and distance. Avoid delala surprises—<a href="/guides/broker-delala-vs-professional-movers-addis-guide">broker vs professional</a> · <a href="/guides/moving-contract-red-flags-addis-guide">contract red flags</a> · <a href="/blog/active-movers-prevents-price-creep-written-contract-addis">price creep</a>.</p>

<h2>Moving day</h2>
<p>A crew lead coordinates with security and lift windows. Blankets and disassembly are standard for furniture; heavy items load against stable cab walls for Addis streets. Neighbors in the same tower can share mobilization—<a href="/blog/group-moving-discounts-neighbors-same-condo-active-movers">group move tips</a>.</p>

<h2>Related topics</h2>
<p>Tags: ${tags}. Browse more <a href="/guides">moving guides</a> or <a href="/blog">moving tips</a>.</p>

<h2>Book Active Movers</h2>
<p><a href="/booking">Request a free quote</a> · <a href="tel:+251982260000">+251982260000</a> · <a href="/services/local-moving">Local moving</a></p>

<h2>Frequently asked questions</h2>
<p><strong>How far ahead should I book?</strong> Condo and office moves in Bole, Ayat, Kazanchis, or Jemo: 1–2 weeks when possible; inter-city or large commercial jobs often need 2–4 weeks.</p>
<p><strong>Are stairs and elevators included?</strong> Survey notes freight lifts, stair carries, and long gate pushes—those lines belong in the written quote, not on moving day surprises.</p>`
}

function blogExpansion(raw) {
  const title = raw.title.replace(/\.$/, '')
  return `
<h2>Book professional help in Addis Ababa</h2>
<p>${raw.excerpt || title} For a surveyed quote with truck class and crew size on paper, see <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 pricing</a>, <a href="/guides/local-moving-addis-ababa-complete-guide">local moving</a>, and <a href="/guides/broker-delala-vs-professional-movers-addis-guide">why to avoid delala brokers</a>.</p>
<p>Compare <a href="/guides/diy-vs-professional-movers-addis-true-cost-guide">DIY true cost</a> and <a href="/blog/why-hiring-movers-better-than-diy-moving">hiring vs DIY</a> before booking informal trucks.</p>
<p><a href="/booking">Book online</a> · <a href="tel:+251982260000">+251982260000</a> · <a href="/blog/what-makes-moving-company-reliable-addis-ababa">reliable mover checklist</a> · <a href="/guides/condo-high-rise-moving-checklist-addis-ababa">condo checklist</a>.</p>
<h2>Written scope matters</h2>
<p>Insist on line items before deposit—<a href="/guides/moving-contract-red-flags-addis-guide">contract red flags</a> · <a href="/blog/active-movers-prevents-price-creep-written-contract-addis">price creep prevention</a>. Active Movers confirms truck plate before load.</p>`
}

function wordTopUp(raw, kind) {
  const area =
    /bole|jemo|ayat|kazanchis|gerji|bole|summit|cmc|kirkos|yeka|lideta|kolfe|merkato|piassa|gotera|lebu|kotebe|ferensay|gelan|friendship|addis-ketema|nifas|gullele|sheger|kality|tor-hailoch|kara|goro|bambis|kera|bisrate|eagle|phison|welo|sandafa|olympia|arada|bambis/.test(
      raw.slug
    )
  const placeNote = area
    ? 'Name your sub-city, compound, and floor at survey so gate lists and lift bookings match the truck that arrives.'
    : 'Share origin and destination addresses, stair count, and elevator rules when you request a quote.'
  return `
<h2>Extra planning notes</h2>
<p>${placeNote} Keep passports, leases, and small electronics off the truck until the final walk-through. If management requires deposits for lifts or gates, pay only after you have a confirmed move window in writing.</p>
<p>Weather and holidays can shift traffic—buffer half a day on long cross-town legs. For inter-city or storage legs, confirm whether overnight hold or next-day unload is included in your quote line items.</p>
<p>Questions before booking: <a href="/guides/moving-contract-red-flags-addis-guide">contract red flags</a> · <a href="/guides/diy-vs-professional-movers-addis-true-cost-guide">DIY true cost</a> · <a href="/blog/what-makes-moving-company-reliable-addis-ababa">reliable mover traits</a>.</p>`
}

function appendUntilTarget(content, block, target, raw, kind) {
  let c = content
  if (wordCount(c) >= target) return c
  c = `${c}\n${block}`
  if (wordCount(c) < target) {
    c = `${c}\n${wordTopUp(raw, kind)}`
  }
  return c
}

function processFile(filePath, kind) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  if (raw.status !== 'published') return { changed: false, words: wordCount(raw.content) }

  let content = cleanContent(raw.content)
  let words = wordCount(content)

  if (words < TARGET_WORDS) {
    if (NO_BULK_APPEND.has(raw.slug) || NO_BULK_BLOG.has(raw.slug)) {
      // Curated index URLs: do not inject generic bulk blocks or “Extra planning notes”
    } else {
      const block = kind === 'blog' ? blogExpansion(raw) : expansionHtml(raw, kind)
      content = appendUntilTarget(content, block, TARGET_WORDS, raw, kind)
    }
    words = wordCount(content)
  }

  const wasIndex = raw.index === true
  const flagship = raw.quality === 'flagship'
  let quality = raw.quality
  let index = raw.index

  if (words >= TARGET_WORDS) {
    if (flagship) {
      quality = 'flagship'
      index = true
    } else if (wasIndex && (OPTIONAL_INDEX_SLUGS.has(raw.slug) || kind === 'blog')) {
      quality = 'enriched'
      index = true
    } else {
      quality = quality === 'scaffold' ? 'scaffold' : 'enriched'
      index = false
    }
    raw.enrichedAt = raw.enrichedAt || new Date().toISOString()
  } else {
    quality = quality || 'needs-enrichment'
    if (!flagship) index = false
  }

  raw.readTime = Math.max(1, Math.round(words / 200))

  if (WRITE) {
    raw.content = content
    raw.quality = quality
    raw.index = index
    raw.updatedAt = new Date().toISOString()
    raw.featuredImage =
      raw.featuredImage && !/qua703|qua705/i.test(raw.featuredImage)
        ? raw.featuredImage
        : 'https://www.activemoverset.com/images/gallary/qua704.jpeg'
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + '\n', 'utf8')
    return { changed: true, words }
  }

  return { changed: false, words }
}

function scan(dir, kind) {
  let changed = 0
  let stillThin = 0
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const r = processFile(path.join(dir, f), kind)
    if (r.changed) changed++
    if (r.words < TARGET_WORDS) stillThin++
  }
  return { changed, stillThin, total: fs.readdirSync(dir).filter((x) => x.endsWith('.json')).length }
}

const guides = scan(GUIDE_DIR, 'guide')
const blogs = scan(BLOG_DIR, 'blog')

console.log(WRITE ? 'APPLIED' : 'DRY RUN (pass --write)')
console.log('guides', guides.changed, 'updated,', guides.stillThin, 'still under', TARGET_WORDS, 'of', guides.total)
console.log('blogs', blogs.changed, 'updated,', blogs.stillThin, 'still under', TARGET_WORDS, 'of', blogs.total)
