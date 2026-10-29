/**
 * @deprecated Prefer scripts/bulk-finish-thin-content.mjs (de-scaffold + 400w expansion).
 * Enriches batch-2 detailed guides that have minimal body HTML.
 */
import fs from 'fs'
import path from 'path'

const DIR = path.join(process.cwd(), 'data', 'guides')

const SLUGS = [
  'bisrate-gabriel-diplomatic-moving-guide',
  'african-union-area-high-security-moving-guide',
  'moving-addis-ababa-to-adama-guide',
  'moving-addis-ababa-to-hawassa-guide',
  'moving-addis-ababa-to-dire-dawa-guide',
  'pet-friendly-moving-high-rise-addis-guide',
  'moving-with-elders-mamoch-baboch-addis-guide',
  'rainy-season-kremt-moving-addis-guide',
  'meskel-season-moving-road-closures-guide',
  'timket-week-moving-survival-guide-addis',
  'fasika-easter-move-planning-addis-guide',
  'pagumen-new-year-move-fresh-start-guide',
  'mid-week-tuesday-wednesday-moving-advantage-addis',
  'broker-delala-vs-professional-movers-addis-guide',
  'reclaim-security-deposit-after-move-addis-guide',
  'fragile-packing-electronics-addis-cobblestone-guide',
  'packing-traditional-mesob-injera-gear-guide',
  'orthodox-icons-religious-items-moving-guide',
  'imported-wardrobe-disassembly-cam-lock-guide',
  'crane-balcony-furniture-delivery-addis-guide',
  'multi-stop-move-home-office-storage-addis',
  'home-office-split-move-addis-guide',
  'coworking-space-transition-moving-addis',
  'hotel-serviced-apartment-bole-move-guide',
  'eagle-hills-la-gare-premium-move-guide',
  'phison-luxury-compound-villa-move-guide',
  'lebu-mebrat-hail-developments-moving-guide',
  'ayat-vs-summit-neighborhood-move-comparison',
  'cmc-vs-jemo-move-comparison-guide',
  'sheger-park-walkable-neighborhoods-move-guide',
  'light-rail-proximity-moving-addis-guide',
  'utility-transfer-ethio-telecom-electric-move-guide',
  'post-move-cleaning-handover-addis-guide',
  'housewarming-kitet-mebte-after-move-guide',
  'gated-community-first-time-buyer-move-guide',
  'nursery-daycare-relocation-addis-guide',
  'pharmacy-relocation-addis-guide',
  'print-shop-flatbed-printer-move-guide',
  'gym-fitness-center-equipment-move-addis',
  'modjo-port-diaspora-container-coordination-guide',
  'cross-border-regional-move-addis-nairobi-guide',
  'nifas-silk-lafto-overview-moving-guide',
  'yeka-subcity-moving-overview-guide',
  'kirkos-subcity-moving-overview-guide',
  'bole-subcity-complete-moving-overview-2026',
  'storage-service-addis-active-movers-guide',
  'packaging-service-addis-materials-guide',
  'office-relocation-minimal-downtime-checklist',
  'tenant-kebele-to-modern-condo-move-guide',
  'iddir-community-move-notification-addis-guide',
]

function enrichBlock(g) {
  const tag = g.tags?.[0] || 'your move'
  return `
<h2>Step-by-step planning in Addis Ababa</h2>
<p>For <strong>${g.title.replace(/ Guide.*/i, '')}</strong>, start with a walkthrough or video call survey so truck size, crew count, and hours reflect real access—not guesses. Mention ${tag} specifics, floor level, and whether management requires written move permits.</p>
<ul>
<li>Confirm move date with building management and reserve freight or service elevator slots in writing.</li>
<li>Declutter and sell items that will not fit the new layout to reduce volume and cost.</li>
<li>Label boxes by room; mark FRAGILE and THIS SIDE UP on electronics and glass.</li>
<li>Photograph meter readings and wall condition at origin; repeat at destination before furniture covers walls.</li>
<li>Align utility and address updates after keys handover (see <a href="/guides/utility-transfer-ethio-telecom-electric-move-guide">utility transfer guide</a>).</li>
</ul>

<h2>Moving day execution</h2>
<p>Active Movers assigns a crew lead who coordinates with security and elevator time windows. Heavy items are blanket-wrapped; floors and lift cab protection is used where compounds require it. We load heaviest pieces first against cab wall principles for stable transit on Addis streets.</p>
<p>If traffic or festival closures affect your corridor, we reroute or adjust start time when agreed in advance—see <a href="/guides/moving-truck-timing-freight-rules-addis-ababa">truck timing</a> and <a href="/guides/holiday-moving-calendar-addis-ababa-timket-meskel">holiday calendar</a>.</p>

<h2>What affects your quote</h2>
<ul>
<li>Volume (bedrooms, office desks, shop inventory) and packing level (owner-packed vs full service).</li>
<li>Distance within Addis or inter-city legs such as <a href="/guides/long-distance-moving-ethiopia-cities-guide">long-distance routes</a>.</li>
<li>Stairs, long carry from gate, disassembly, and specialty items (safes, cranes, gym machines).</li>
<li>Timing: end-of-month, holiday weeks, and same-day emergency slots.</li>
</ul>

<h2>Common mistakes to avoid</h2>
<ul>
<li>Booking informal brokers who omit condo gate fees and then charge on moving day.</li>
<li>Assuming passenger elevators can move wardrobes during peak resident hours.</li>
<li>Skipping written inventory for offices and shops—items get lost in multi-stop chaos.</li>
</ul>

<h2>Frequently asked questions</h2>
<p><strong>How far in advance should I book?</strong> For condos in Bole, Ayat, or Kazanchis, book 1–2 weeks ahead; inter-city and large office moves need 2–4 weeks.</p>
<p><strong>Do you provide packing materials?</strong> Yes—see <a href="/guides/packaging-service-addis-materials-guide">packaging materials guide</a> and <a href="/services/packaging">packaging service</a>.</p>
`
}

for (const slug of SLUGS) {
  const fp = path.join(DIR, `${slug}.json`)
  if (!fs.existsSync(fp)) {
    console.warn('Missing', slug)
    continue
  }
  const g = JSON.parse(fs.readFileSync(fp, 'utf8'))
  if (g.content.length > 2200) {
    console.log('Skip rich', slug)
    continue
  }
  const marker = '<h2>Book with Active Movers</h2>'
  const insert = enrichBlock(g)
  if (g.content.includes(marker)) {
    g.content = g.content.replace(marker, insert + '\n' + marker)
  } else {
    g.content += insert + '\n' + marker + '\n<p><a href="/booking">Request a quote</a></p>'
  }
  g.readTime = Math.max(g.readTime || 9, 11)
  g.updatedAt = new Date().toISOString()
  fs.writeFileSync(fp, JSON.stringify(g, null, 2) + '\n', 'utf8')
  console.log('Enriched', slug)
}

console.log('Enrichment done.')
