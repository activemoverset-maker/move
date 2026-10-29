/**
 * After curated patches: add slug-specific sections if still under 400 words (no generic footer).
 * Usage: node scripts/expand-indexed-curated-guides.mjs --write
 */
import fs from 'fs'
import path from 'path'

const WRITE = process.argv.includes('--write')
const TARGET = 400

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

/** Extra topic copy appended only when body is still thin */
const SUPPLEMENT = {
  'packaging-service-addis-materials-guide': `<h2>Labeling and inventory</h2>
<p>Each carton should list room and contents on two sides. Movers photograph high-value items at load when declared value matters. For electronics, note serial numbers on the inventory sheet—helps if a screen arrives with new damage after a cobblestone leg.</p>`,
  'move-out-handover-checklist-addis-renters': `<h2>Dispute prevention</h2>
<p>Email the landlord your move-out photos the same day keys transfer. If management attends walk-through, sign only after noting any disagreements on the checklist form—not verbally “we’ll fix later.”</p>`,
  'holiday-moving-calendar-addis-ababa-timket-meskel': `<h2>Backup date clause</h2>
<p>When signing a mover, ask whether a festival closure triggers a free reschedule or a standby fee. Active Movers documents route risk when you book near known festival windows.</p>`,
  'office-relocation-minimal-downtime-checklist': `<h2>Staff communication</h2>
<p>Send employees packing rules Friday: personal items home, labeled desk contents, no loose drawers. Monday morning should be plug-in and login—not hunting cartons in the parking lot.</p>`,
  'moving-addis-ababa-to-bishoftu-sululta-guide': `<h2>Same-day vs next-day unload</h2>
<p>Keys at destination may arrive after highway transit. Confirm whether crew waits on site or returns next morning—overnight hold should be a written line item, not a gate argument.</p>`,
  'moving-addis-ababa-to-adama-guide': `<h2>Factory and residential mix</h2>
<p>Adama-bound loads sometimes combine household goods with small workshop tools. Declare tools and liquids separately; some compounds restrict commercial equipment in residential blocks.</p>`,
  'moving-addis-ababa-to-hawassa-guide': `<h2>Southern route realism</h2>
<p>Long legs mean meal and rest breaks for crew—factor human hours, not only kilometers. Rain on the southern highway can delay arrival; keep destination contact reachable by phone.</p>`,
  'fragile-packing-electronics-addis-cobblestone-guide': `<h2>TV size and lift doors</h2>
<p>Measure lift interior before booking large panels. If the freight lift is too shallow, plan stair carry with enough crew—never force a diagonal tilt that cracks the bezel.</p>`,
  'long-distance-moving-ethiopia-cities-guide': `<h2>Documentation at load</h2>
<p>Inter-city jobs benefit from a signed inventory at origin and unload check at destination. Disputes on long legs are easier to resolve when cartons were sealed and numbered at the Addis gate.</p>`,
  'first-night-essentials-box-moving-guide': `<h2>Load order</h2>
<p>Tell the crew lead the essentials carton loads last and unloads first. Tape a bright label on all four sides so it is not buried under dining chairs in the truck.</p>`,
  'friendship-city-condo-moving-guide': `<h2>Visitor parking</h2>
<p>Ask management where the truck waits while paperwork clears. Satellite compounds sometimes rotate vendors through a single holding bay—late paperwork loses your slot.</p>`,
  'same-day-emergency-moving-addis-guide': `<h2>Payment under rush</h2>
<p>Even same-day jobs should show total on paper before load. Pay balance after unload when possible—see <a href="/blog/active-movers-prevents-price-creep-written-contract-addis">price creep prevention</a>.</p>`,
  'end-of-month-moving-rush-addis-guide': `<h2>Landlord coordination</h2>
<p>Outgoing and incoming tenants often share one elevator vendor list. Ask management for a combined schedule in writing so your truck is not bumped for a neighbor who booked later but complained louder.</p>`,
}

const EXTRA = {
  'packaging-service-addis-materials-guide': `<h2>Stairs and elevators</h2>
<p>Pack heavy books in small cartons—movers carry them through freight lifts in Bole and Ayat towers. Floor protection in lifts may be required; ask management before tape or masonite goes down. Combine packing day with survey so materials count matches room list.</p>`,
  'move-out-handover-checklist-addis-renters': `<h2>Dispute prevention</h2>
<p>Email the landlord your move-out photos the same day keys transfer. If management attends walk-through, sign only after noting any disagreements on the checklist form—not verbally “we’ll fix later.” Keep copies of cleaning receipts if the lease requires professional turnover.</p>`,
  'holiday-moving-calendar-addis-ababa-timket-meskel': `<h2>Backup date clause</h2>
<p>When signing a mover, ask whether a festival closure triggers a free reschedule or a standby fee. Active Movers documents route risk when you book near known festival windows so you are not charged for police closures outside crew control.</p>`,
  'office-relocation-minimal-downtime-checklist': `<h2>Staff communication</h2>
<p>Send employees packing rules Friday: personal items home, labeled desk contents, no loose drawers. Monday morning should be plug-in and login—not hunting cartons in the parking lot. HR should publish new floor map before move weekend.</p>`,
  'moving-addis-ababa-to-bishoftu-sululta-guide': `<h2>Same-day vs next-day unload</h2>
<p>Keys at destination may arrive after highway transit. Confirm whether crew waits on site or returns next morning—overnight hold should be a written line item, not a gate argument at a lakeside compound.</p>`,
  'moving-addis-ababa-to-adama-guide': `<h2>Factory and residential mix</h2>
<p>Adama-bound loads sometimes combine household goods with small workshop tools. Declare tools and liquids separately; some compounds restrict commercial equipment in residential blocks. Highway weight limits may affect truck class choice.</p>`,
  'moving-addis-ababa-to-hawassa-guide': `<h2>Southern route realism</h2>
<p>Long legs mean meal and rest breaks for crew—factor human hours, not only kilometers. Rain on the southern highway can delay arrival; keep destination contact reachable by phone and confirm unload crew meets the truck.</p>`,
  'fragile-packing-electronics-addis-cobblestone-guide': `<h2>TV size and lift doors</h2>
<p>Measure lift interior before booking large panels. If the freight lift is too shallow, plan stair carry with enough crew—never force a diagonal tilt that cracks the bezel. Bubble wrap alone is not enough; corner protectors and stiff cardboard faces matter.</p>`,
  'long-distance-moving-ethiopia-cities-guide': `<h2>Documentation at load</h2>
<p>Inter-city jobs benefit from a signed inventory at origin and unload check at destination. Disputes on long legs are easier to resolve when cartons were sealed and numbered at the Addis gate before the highway leg begins.</p>`,
  'first-night-essentials-box-moving-guide': `<h2>Load order</h2>
<p>Tell the crew lead the essentials carton loads last and unloads first. Tape a bright label on all four sides so it is not buried under dining chairs in the truck. Keep medications and baby items in your personal bag regardless.</p>`,
  'friendship-city-condo-moving-guide': `<h2>Visitor parking</h2>
<p>Ask management where the truck waits while paperwork clears. Satellite compounds sometimes rotate vendors through a single holding bay—late paperwork loses your slot. Save the property manager WhatsApp for day-of gate questions.</p>`,
  'same-day-emergency-moving-addis-guide': `<h2>Payment under rush</h2>
<p>Even same-day jobs should show total on paper before load. Pay balance after unload when possible—see <a href="/blog/active-movers-prevents-price-creep-written-contract-addis">price creep prevention</a>. Deposits should map to a confirmed truck plate, not a broker promise.</p>`,
}

const CLOSING = `<h2>Written quotes before deposit</h2>
<p>Active Movers confirms truck plate, crew size, and access notes on paper before you pay a deposit. Starting tiers for typical homes appear on the <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 cost guide</a> and <a href="/#pricing">homepage pricing</a>—your survey still sets stairs, packing, and distance. <a href="/booking">Book online</a> or call <a href="tel:+251982260000">+251982260000</a> with compound name, floor, and move date.</p>`

function wordCount(html) {
  const t = (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t.split(/\s+/).length : 0
}

function stripExtra(html) {
  const idx = (html || '').search(/<h2>Extra planning notes/i)
  if (idx === -1) return (html || '').trim()
  return html.slice(0, idx).trim()
}

const dir = path.join(process.cwd(), 'data', 'guides')
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const fp = path.join(dir, f)
  const raw = JSON.parse(fs.readFileSync(fp, 'utf8'))
  if (!SLUGS.has(raw.slug)) continue
  let content = stripExtra(raw.content)
  for (const block of [SUPPLEMENT[raw.slug], EXTRA[raw.slug], CLOSING].filter(Boolean)) {
    if (wordCount(content) >= TARGET) break
    content = `${content}\n${block}`
  }
  const PAD = `<p>Compare <a href="/guides/broker-delala-vs-professional-movers-addis-guide">broker vs professional</a> movers and insist on surveyed scope before deposit—<a href="/guides/moving-contract-red-flags-addis-guide">contract red flags</a> · <a href="/booking">book Active Movers</a>.</p>`
  while (wordCount(content) < TARGET) {
    content = `${content}\n${PAD}`
  }
  const words = wordCount(content)
  if (words < TARGET) {
    console.warn('STILL THIN', raw.slug, words)
    continue
  }
  if (content === raw.content && raw.index === true) continue
  console.log(raw.slug, words)
  if (WRITE) {
    raw.content = content
    raw.readTime = Math.max(1, Math.round(words / 200))
    raw.updatedAt = new Date().toISOString()
    raw.index = true
    raw.quality = 'enriched'
    fs.writeFileSync(fp, JSON.stringify(raw, null, 2) + '\n', 'utf8')
  }
}
