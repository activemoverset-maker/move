import fs from 'fs'
import path from 'path'

const OUT = path.join(process.cwd(), 'data', 'guides')
const IMG = [
  'https://www.activemoverset.com/images/gallary/qua703.jpeg',
  'https://www.activemoverset.com/images/gallary/qua704.jpeg',
  'https://www.activemoverset.com/images/gallary/qua705.jpeg',
]

const guides = [
  { slug: 'kotebe-yeka-moving-guide-addis', cat: 'area-guide', title: 'Kotebe & Yeka Moving Guide: Hills, Schools & Family Relocations', excerpt: 'Kotebe and upper Yeka moves: steep access, family housing, school corridors, and truck timing on eastern Addis roads.', tags: ['Kotebe', 'Yeka', 'family move'] },
  { slug: 'gullele-entoto-moving-guide', cat: 'area-guide', title: 'Gullele & Entoto Area Moving Guide: Slopes, Views & Access Planning', excerpt: 'Moving in Gullele and Entoto foothills: slope access, narrow lanes, and coordinating crew size for hillside homes.', tags: ['Gullele', 'Entoto', 'hillside'] },
  { slug: 'kality-industrial-residential-moving-guide', cat: 'area-guide', title: 'Kality Moving Guide: Industrial Belt, Port Proximity & Residential Compounds', excerpt: 'Kality sub-city moves near freight patterns, mixed industrial-residential zones, and port-adjacent logistics.', tags: ['Kality', 'industrial', 'residential'] },
  { slug: 'akaki-kality-corridor-moving-guide', cat: 'area-guide', title: 'Akaki–Kality Corridor Moving Guide: Southern Gateway Routes', excerpt: 'Southern Addis moves along Akaki–Kality: distance, truck permits, and compound access south of the ring.', tags: ['Akaki', 'Kality', 'corridor'] },
  { slug: 'sarbet-moving-guide-addis-ababa', cat: 'area-guide', title: 'Sarbet Moving Guide: Central Living & Tight Street Logistics', excerpt: 'Sarbet relocations: central Addis access, parking, and apartment moves near Mexico and Lideta corridors.', tags: ['Sarbet', 'central Addis'] },
  { slug: 'summit-fiyel-bet-moving-guide', cat: 'area-guide', title: 'Summit & Fiyel Bet Moving Guide: East Addis Residential Moves', excerpt: 'Summit area condo and villa moves: gated communities, lift rules, and Bole-bound traffic.', tags: ['Summit', 'Fiyel Bet', 'Bole'] },
  { slug: 'gotera-interchange-moving-guide', cat: 'area-guide', title: 'Gotera & Interchange Moving Guide: Ring-Road Traffic Planning', excerpt: 'Gotera moves near the interchange: peak-hour avoidance, condo blocks, and cross-city routes.', tags: ['Gotera', 'ring road', 'traffic'] },
  { slug: 'lideta-moving-guide-addis', cat: 'area-guide', title: 'Lideta Moving Guide: Dense District & Condo Relocations', excerpt: 'Lideta sub-city moving: high density, building permissions, and links to Piassa and Merkato corridors.', tags: ['Lideta', 'condo'] },
  { slug: 'old-airport-laphto-moving-guide', cat: 'area-guide', title: 'Old Airport & Laphto Moving Guide: Expat & Premium Residential', excerpt: 'Old Airport Laphto moves: diplomatic-adjacent streets, premium apartments, and security coordination.', tags: ['Old Airport', 'Laphto', 'expat'] },
  { slug: 'shola-megenagna-corridor-moving-guide', cat: 'area-guide', title: 'Shola to Megenagna Corridor Moving Guide', excerpt: 'Moves along the Shola–Megenagna axis: Yeka traffic, school zones, and condo handovers.', tags: ['Shola', 'Megenagna', 'Yeka'] },
  { slug: 'ferensay-legasion-moving-guide', cat: 'area-guide', title: 'Ferensay Legasion Moving Guide: Quiet Hills & Residential Streets', excerpt: 'Ferensay Legasion relocations: hilly streets, family homes, and festival road awareness near north corridors.', tags: ['Ferensay', 'Legasion'] },
  { slug: 'merkato-shop-inventory-move-guide', cat: 'commercial-guide', title: 'Merkato Shop & Inventory Move Guide: Retail Relocation in Busy Markets', excerpt: 'Moving Mercato-area shops: inventory counts, early-morning loading, and securing goods in dense markets.', tags: ['Merkato', 'retail', 'inventory'] },
  { slug: 'saris-abo-border-moving-guide', cat: 'area-guide', title: 'Saris Abo & Industrial Border Moving Guide', excerpt: 'Saris Abo hybrid industrial-residential moves: truck size, timing, and compound rules.', tags: ['Saris Abo', 'industrial border'] },
  { slug: 'asko-wingate-western-gateway-moving-guide', cat: 'area-guide', title: 'Asko, Wingate & Western Gateway Moving Guide', excerpt: 'Western Addis moves via Asko and Wingate: university area traffic and long cross-town legs.', tags: ['Asko', 'Wingate', 'west Addis'] },
  { slug: 'tulu-dimtu-apartment-moving-guide', cat: 'area-guide', title: 'Tulu Dimtu Apartment Moving Guide: New Blocks & Lift Booking', excerpt: 'Tulu Dimtu condo moves: new developments, management permits, and eastern Addis dispatch.', tags: ['Tulu Dimtu', 'apartment'] },
  { slug: 'bole-arabsa-condo-moving-guide', cat: 'area-guide', title: 'Bole Arabsa Condo Moving Guide: Fast-Growth District Logistics', excerpt: 'Bole Arabsa condominium moves: infrastructure timing, lift slots, and corridor relocation context.', tags: ['Bole Arabsa', 'condo'] },
  { slug: 'mexico-square-churchill-office-corridor-guide', cat: 'commercial-guide', title: 'Mexico Square & Churchill Office Corridor Relocation Guide', excerpt: 'Office moves near Mexico Square and Churchill: downtime windows, parking, and phased desk moves.', tags: ['Mexico Square', 'Churchill', 'office'] },
  { slug: 'sengatera-financial-district-moving-guide', cat: 'commercial-guide', title: 'Sengatera & Financial District Office Moving Guide', excerpt: 'Sengatera corporate relocations: high-rise access, IT floors, and after-hours scheduling.', tags: ['Sengatera', 'financial district'] },
  { slug: 'kolfe-keranio-moving-guide', cat: 'area-guide', title: 'Kolfe & Keranio Moving Guide: Western Sub-City Routes', excerpt: 'Kolfe Keranio residential moves: western Addis access and distance pricing from inner sub-cities.', tags: ['Kolfe', 'Keranio'] },
  { slug: 'addis-ketema-moving-guide', cat: 'area-guide', title: 'Addis Ketema Moving Guide: Central-West Dense Housing', excerpt: 'Addis Ketema moves: older housing stock, stair carries, and Mercato-adjacent traffic.', tags: ['Addis Ketema'] },
  { slug: 'sidist-kilo-student-moving-guide', cat: 'area-guide', title: 'Sidist Kilo Student & Faculty Moving Guide', excerpt: 'Sidist Kilo moves for students and faculty: small apartments, term timing, and budget packing.', tags: ['Sidist Kilo', 'student move'] },
  { slug: 'arat-kilo-6-kilo-moving-guide', cat: 'area-guide', title: 'Arat Kilo & 6 Kilo Moving Guide: Historic Campus Area Logistics', excerpt: 'Moves near Arat Kilo and 6 Kilo: narrow access, institutional neighborhoods, and careful stair work.', tags: ['Arat Kilo', '6 Kilo'] },
  { slug: 'local-moving-addis-ababa-complete-guide', cat: 'service-guide', title: 'Local Moving in Addis Ababa: Complete Service Guide', excerpt: 'What professional local moving includes in Addis: survey, crew, truck, packing options, and same-day rules.', tags: ['local moving', 'Addis Ababa', 'service'] },
  { slug: 'villa-compound-moving-guide-addis', cat: 'service-guide', title: 'Villa & Compound Moving Guide for Large Homes in Addis', excerpt: 'Villa moves: multi-room inventory, outdoor items, safes, and crew sizing for compounds.', tags: ['villa', 'compound', 'large home'] },
  { slug: 'professional-packing-services-addis-guide', cat: 'service-guide', title: 'Professional Packing Services in Addis Ababa: Materials & Process', excerpt: 'Full and partial packing: materials, fragile handling, labeling, and unpack at destination.', tags: ['packing', 'fragile', 'materials'] },
  { slug: 'moving-storage-between-homes-addis-guide', cat: 'service-guide', title: 'Storage Between Moves in Addis Ababa: Gap Weeks & Inventory', excerpt: 'When closing and opening dates do not align: short-term storage, inventory lists, and delivery timing.', tags: ['storage', 'gap move'] },
  { slug: 'same-day-emergency-moving-addis-guide', cat: 'service-guide', title: 'Same-Day & Emergency Moving in Addis Ababa: When It Works', excerpt: 'Eviction deadlines and urgent moves: realistic same-day capacity, pricing, and what to prep first.', tags: ['same day', 'emergency move'] },
  { slug: 'piano-heavy-safe-moving-addis-guide', cat: 'service-guide', title: 'Piano, Safe & Heavy Item Moving Guide in Addis Ababa', excerpt: 'Specialty heavy moves: extra crew, equipment, stair planning, and insurance declarations.', tags: ['piano', 'safe', 'heavy items'] },
  { slug: 'long-distance-moving-ethiopia-cities-guide', cat: 'service-guide', title: 'Long-Distance Moving from Addis to Ethiopian Cities', excerpt: 'Inter-city moves from Addis: Dire Dawa, Hawassa, Bahir Dar routes, timing, and consolidated loads.', tags: ['long distance', 'Ethiopia', 'inter-city'] },
  { slug: 'expat-household-relocation-addis-guide', cat: 'service-guide', title: 'Expat Household Relocation in Addis Ababa: English Service & Coordination', excerpt: 'Expat moves: inventory for customs awareness, property manager coordination, and bilingual crews.', tags: ['expat', 'relocation', 'English'] },
  { slug: 'international-move-local-leg-addis-guide', cat: 'service-guide', title: 'International Move Local Leg in Ethiopia: Forwarder Handoff Guide', excerpt: 'Local packing and transport to forwarder warehouses: documentation, timing gaps, and storage.', tags: ['international', 'forwarder', 'local leg'] },
  { slug: 'furniture-only-delivery-move-guide', cat: 'service-guide', title: 'Furniture-Only & Single-Item Delivery Moves in Addis', excerpt: 'When you only move beds, sofas, or appliances: small truck dispatch and assembly at destination.', tags: ['furniture only', 'single item'] },
  { slug: 'hourly-vs-fixed-moving-pricing-addis-guide', cat: 'pricing-guide', title: 'Hourly vs Fixed Moving Pricing in Addis Ababa', excerpt: 'Compare hourly and fixed quotes: when each protects you, and red flags on open-ended hourly jobs.', tags: ['hourly', 'fixed price', 'quote'] },
  { slug: 'moving-contract-red-flags-addis-guide', cat: 'pricing-guide', title: 'Moving Contract Red Flags & Hidden Fees in Addis Ababa', excerpt: 'Audit quotes before signing: standby charges, stairs, materials, and verbal-only promises.', tags: ['contract', 'hidden fees', 'scam'] },
  { slug: 'moving-insurance-declared-value-ethiopia-guide', cat: 'pricing-guide', title: 'Moving Insurance & Declared Value Guide for Ethiopia Moves', excerpt: 'High-value items: declared value, basic liability vs optional coverage, and photo inventory.', tags: ['insurance', 'declared value'] },
  { slug: 'diy-vs-professional-movers-addis-true-cost-guide', cat: 'pricing-guide', title: 'DIY Truck Rental vs Professional Movers: True Cost in Addis', excerpt: 'Hidden DIY costs: fuel, helpers, damage, delays at condo gates, and uninsured breakage.', tags: ['DIY', 'professional', 'true cost'] },
  { slug: 'group-neighbor-moving-discount-guide-addis', cat: 'pricing-guide', title: 'Group & Neighbor Moving Discounts in Addis Condos', excerpt: 'Two units same compound: shared mobilization, sequential elevator booking, and split pricing.', tags: ['group discount', 'neighbors', 'condo'] },
  { slug: 'woreda-address-change-after-move-guide', cat: 'checklist-guide', title: 'Woreda Address Change After Moving in Addis Ababa', excerpt: 'Update kebele and woreda records after relocation: documents, timing, and proof of residence.', tags: ['woreda', 'address change', 'kebele'] },
  { slug: 'first-night-essentials-box-moving-guide', cat: 'checklist-guide', title: 'First-Night Essentials Box: What to Pack Last in Addis Moves', excerpt: 'Kitchen, bedding, chargers, and toiletries in one labeled box for night one in a new home.', tags: ['first night', 'essentials box', 'packing'] },
  { slug: 'declutter-before-moving-truck-arrives-guide', cat: 'checklist-guide', title: 'Declutter Before the Moving Truck Arrives: Addis Checklist', excerpt: 'Reduce volume before quote day: sell, donate, and discard to lower cost and crew time.', tags: ['declutter', 'checklist'] },
  { slug: 'enkutatash-new-year-moving-guide-addis', cat: 'checklist-guide', title: 'Moving During Enkutatash (Ethiopian New Year) in Addis', excerpt: 'September New Year demand: book early, festival traffic, and compound blackout dates.', tags: ['Enkutatash', 'New Year', 'seasonal'] },
  { slug: 'end-of-month-moving-rush-addis-guide', cat: 'checklist-guide', title: 'End-of-Month Moving Rush in Addis: How to Beat the Queue', excerpt: 'Why month-end fills lifts and trucks—and mid-month or early booking tactics that save stress.', tags: ['end of month', 'rush', 'booking'] },
  { slug: 'restaurant-kitchen-relocation-addis-guide', cat: 'commercial-guide', title: 'Restaurant & Kitchen Relocation Guide in Addis Ababa', excerpt: 'Commercial kitchen moves: equipment disconnect, grease-free transport, and reopen timing.', tags: ['restaurant', 'kitchen', 'commercial'] },
  { slug: 'retail-boutique-shop-relocation-addis-guide', cat: 'commercial-guide', title: 'Retail Boutique & Shop Relocation in Addis Ababa', excerpt: 'Boutique moves in Bole and stadium malls: fixtures, inventory, and after-hours load-out.', tags: ['retail', 'boutique', 'shop'] },
  { slug: 'warehouse-kality-port-migration-guide', cat: 'commercial-guide', title: 'Warehouse & Kality Port Area Migration Guide', excerpt: 'Warehouse moves: pallet inventory, forklift coordination, and industrial access permits.', tags: ['warehouse', 'Kality port', 'B2B'] },
  { slug: 'medical-clinic-relocation-addis-guide', cat: 'commercial-guide', title: 'Medical Clinic Relocation Guide: Records & Equipment in Addis', excerpt: 'Clinic moves: cold chain awareness, records confidentiality, and exam room sequencing.', tags: ['clinic', 'medical', 'compliance'] },
  { slug: 'school-campus-summer-move-addis-guide', cat: 'commercial-guide', title: 'Private School & Campus Summer Move Guide in Addis', excerpt: 'School furniture and lab moves during break weeks: phased rooms and minimal term disruption.', tags: ['school', 'campus', 'summer'] },
  { slug: 'embassy-diplomatic-relocation-addis-guide', cat: 'commercial-guide', title: 'Embassy & Diplomatic Residence Moving Guide in Addis Ababa', excerpt: 'High-security moves: advance clearance, ID lists, escort protocols, and discreet scheduling.', tags: ['embassy', 'diplomatic', 'security'] },
  { slug: 'ngo-office-relocation-addis-guide', cat: 'commercial-guide', title: 'NGO & Nonprofit Office Relocation Guide in Addis', excerpt: 'NGO moves near Old Airport and Kazanchis: donor files, IT, and volunteer coordination.', tags: ['NGO', 'nonprofit', 'office'] },
  { slug: 'law-firm-records-relocation-addis-guide', cat: 'commercial-guide', title: 'Law Firm & Records Relocation Guide in Addis Ababa', excerpt: 'Legal office moves: sealed file boxes, chain of custody, and weekend cutover.', tags: ['law firm', 'records', 'office'] },
]

if (guides.length !== 50) {
  console.error('Expected 50 guides, got', guides.length)
  process.exit(1)
}

function body(g) {
  const area = g.cat === 'area-guide'
  const intro = area
    ? `<p><strong>${g.title.split(':')[0]}</strong> is a common search for families and businesses relocating within Addis Ababa. Active Movers plans access, traffic, and building rules before trucks roll.</p>`
    : `<p>This guide explains how professional movers handle ${g.tags[0] || 'your move'} in Addis Ababa—with clear quotes and trained crews, not day-labor surprises.</p>`

  return (
    intro +
    `\n\n<h2>What makes this move different</h2>\n<p>${g.excerpt}</p>` +
    `\n\n<h2>Before moving day</h2>\n<ul>\n<li>Book a site survey or detailed inventory call for an accurate fixed quote.</li>\n<li>Confirm compound or landlord move rules, lift booking, and security IDs for crew.</li>\n<li>Declutter and label rooms to reduce volume and speed unloading.</li>\n<li>Check traffic, freight time windows, and holiday road closures for your date.</li>\n</ul>` +
    `\n\n<h2>On moving day</h2>\n<p>Our team protects floors and lifts, disassembles large furniture when needed, and loads for stable transit on Addis roads. Point-of-contact stays with the crew lead for gate and elevator coordination.</p>` +
    `\n\n<h2>Pricing and booking</h2>\n<p>Price depends on volume, access, distance, packing level, and timing. See our <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 pricing guide</a> and <a href="/services/local-moving">local moving services</a>.</p>` +
    `\n\n<h2>Related resources</h2>\n<p><a href="/guides/condo-high-rise-moving-checklist-addis-ababa">Condo checklist</a> · <a href="/guides/moving-truck-timing-freight-rules-addis-ababa">Truck timing</a> · <a href="/blog">Moving tips blog</a></p>` +
    `\n\n<h2>Book Active Movers</h2>\n<p><a href="/booking">Request a free quote</a> or call our Lemi Kura team for dispatch across all 11 sub-cities.</p>`
  )
}

const baseDate = new Date('2026-09-21T12:00:00.000Z')
fs.mkdirSync(OUT, { recursive: true })

guides.forEach((g, i) => {
  const file = path.join(OUT, `${g.slug}.json`)
  if (fs.existsSync(file)) {
    console.warn('Skip existing', g.slug)
    return
  }
  const publishedAt = new Date(baseDate.getTime() - i * 3600000).toISOString()
  const doc = {
    id: `guide-${g.slug}`.slice(0, 90),
    title: g.title,
    titleAm: '',
    excerpt: g.excerpt,
    excerptAm: '',
    content: body(g),
    contentAm: '',
    author: 'Active Movers Team',
    category: g.cat,
    tags: g.tags,
    tagsAm: [],
    readTime: 7 + (i % 5),
    featuredImage: IMG[i % IMG.length],
    images: [],
    status: 'published',
    publishedAt,
    updatedAt: publishedAt,
    slug: g.slug,
  }
  fs.writeFileSync(file, JSON.stringify(doc, null, 2) + '\n', 'utf8')
  console.log('Wrote', g.slug)
})

console.log('Done.')
