/**
 * Generates 50 NEW detailed moving guides (skips existing slugs).
 * Run: node scripts/generate-guides-batch-50-detailed.mjs
 */
import fs from 'fs'
import path from 'path'

const OUT = path.join(process.cwd(), 'data', 'guides')
const IMG = [
  'https://www.activemoverset.com/images/gallary/qua703.jpeg',
  'https://www.activemoverset.com/images/gallary/qua704.jpeg',
  'https://www.activemoverset.com/images/gallary/qua705.jpeg',
]

const existing = new Set(
  fs.readdirSync(OUT).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
)

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderContent(g) {
  let html = `<h2>${esc(g.overviewTitle || 'Overview')}</h2>\n<p>${g.overview}</p>\n`
  for (const sec of g.sections) {
    html += `\n<h2>${esc(sec.h)}</h2>\n`
    if (sec.p) html += `<p>${sec.p}</p>\n`
    if (sec.ps) sec.ps.forEach((p) => (html += `<p>${p}</p>\n`))
    if (sec.ul?.length) {
      html += '<ul>\n' + sec.ul.map((li) => `<li>${li}</li>`).join('\n') + '\n</ul>\n'
    }
  }
  if (g.faq?.length) {
    html += `\n<h2>Frequently asked questions</h2>\n`
    for (const f of g.faq) {
      html += `<p><strong>${esc(f.q)}</strong> ${f.a}</p>\n`
    }
  }
  html += `\n<h2>Book with Active Movers</h2>\n<p>${g.cta || 'Get a written quote after a quick survey. <a href="/booking">Book online</a> or explore <a href="/services/local-moving">local moving</a> and <a href="/guides">all guides</a>.'}</p>`
  return html
}

/** @type {Array<any>} */
const GUIDES = [
  {
    slug: 'bisrate-gabriel-diplomatic-moving-guide',
    cat: 'area-guide',
    title: 'Bisrate Gabriel Moving Guide: Diplomatic Streets & Gated Access',
    excerpt: 'Bisrate Gabriel relocations: embassy-adjacent traffic, gate protocols, villa and apartment moves in Kirkos with security clearance planning.',
    tags: ['Bisrate Gabriel', 'Kirkos', 'diplomatic'],
    readTime: 11,
    overviewTitle: 'Moving in Bisrate Gabriel',
    overview:
      'Bisrate Gabriel combines diplomatic residences, upscale apartments, and tight security expectations. Trucks do not enter without prior clearance; crews need ID lists and appointment windows aligned with compound rules.',
    sections: [
      {
        h: 'Security and paperwork',
        p: 'Start clearance 48–72 hours before move day when possible.',
        ul: [
          'Submit mover company name, truck plate, and crew ID copies to compound or embassy liaison.',
          'Confirm whether multiple trips require re-entry authorization each time.',
          'Photograph condition of common areas before wheeling heavy items through lobbies.',
        ],
      },
      {
        h: 'Traffic and staging',
        p: 'Meskel Square and Mexico corridor congestion affects approach routes. Schedule loads mid-morning on weekdays when security offices are staffed.',
      },
      {
        h: 'What to tell your surveyor',
        ul: [
          'Floor level and elevator dimensions (many buildings restrict freight lifts to fixed hours).',
          'Long carry from gate to building if trucks must park on main road.',
          'High-value art, safes, or oversized sofas needing disassembly.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can one truck finish a 3-bedroom move here?',
        a: 'Often yes with a full crew, but narrow gates may require a smaller truck plus shuttle—confirm at survey.',
      },
    ],
  },
  {
    slug: 'african-union-area-high-security-moving-guide',
    cat: 'area-guide',
    title: 'Moving Near the African Union & ECA Zone: High-Security Logistics',
    excerpt: 'Relocations near AU and ECA: checkpoint awareness, credential lists, and timing moves around diplomatic traffic in Old Airport and Kazanchis edges.',
    tags: ['African Union', 'ECA', 'security'],
    readTime: 10,
    overview:
      'Areas around the African Union and Economic Commission for Africa involve heightened security. Even residential moves may pass checkpoints where IDs and vehicle papers are inspected.',
    sections: [
      {
        h: 'Checkpoint planning',
        ul: [
          'Carry government ID for every adult and work ID if entering institutional compounds.',
          'Avoid move days coinciding with major summits or heads-of-state visits when roads tighten.',
          'Keep inventory list available if security asks what is in sealed boxes.',
        ],
      },
      {
        h: 'Building coordination',
        p: 'Property managers often cap concurrent moves. Book lift and loading bay before confirming truck dispatch.',
      },
      {
        h: 'Active Movers approach',
        p: 'We document crew and vehicle details early so your coordinator can submit to management without last-minute delays.',
      },
    ],
  },
  {
    slug: 'moving-addis-ababa-to-adama-guide',
    cat: 'service-guide',
    title: 'Moving from Addis Ababa to Adama (Nazret): Distance & Route Guide',
    excerpt: 'Addis to Adama moves (~100 km): highway timing, two-home handoffs, industrial relocations, and how distance pricing differs from in-city Bole jobs.',
    tags: ['Adama', 'Nazret', 'long distance'],
    readTime: 10,
    overview:
      'Adama (Nazret) is one of the most common inter-city legs from Addis for families and factories. Price reflects fuel, crew hours on road, and access at both origin condo and destination compound.',
    sections: [
      {
        h: 'Route and timing',
        ul: [
          'Leave Addis early to clear outbound congestion toward Bishoftu–Adama corridor.',
          'Confirm destination gate hours—some industrial sites accept trucks only mornings.',
          'Rainy season can slow highway legs; build buffer for handover same day.',
        ],
      },
      {
        h: 'Packing for highway transit',
        p: 'Use blankets and stretch wrap on upholstered items; secure loads against shifting on longer drives than cross-town hops.',
      },
      {
        h: 'Pricing drivers',
        p: 'Compare to <a href="/guides/moving-addis-ababa-to-bishoftu-sululta-guide">Bishoftu/Sululta guide</a>—Adama is farther; single consolidated truck beats partial shuttles.',
      },
    ],
  },
  {
    slug: 'moving-addis-ababa-to-hawassa-guide',
    cat: 'service-guide',
    title: 'Moving from Addis Ababa to Hawassa: Southern City Relocation',
    excerpt: 'Inter-city move to Hawassa: multi-day planning, inventory lists, overnight crew options, and protecting furniture on long southern routes.',
    tags: ['Hawassa', 'inter-city', 'long distance'],
    readTime: 11,
    overview:
      'Hawassa moves from Addis are true long-distance jobs—not suburban Bishoftu legs. Survey must capture volume for correct truck class and whether you need overnight transit or split loads.',
    sections: [
      {
        h: 'When to start planning',
        p: 'Book at least 2–3 weeks ahead for large homes; confirm Hawassa-side access and unloading point (street width, stairs, compound rules).',
      },
      {
        h: 'Inventory discipline',
        ul: [
          'Room-by-room list with fragile flag for electronics and glass.',
          'Separate personal documents and jewelry for hand carry—not truck.',
          'Label boxes by room to speed Hawassa unload when crew is on clock.',
        ],
      },
    ],
  },
  {
    slug: 'moving-addis-ababa-to-dire-dawa-guide',
    cat: 'service-guide',
    title: 'Moving from Addis Ababa to Dire Dawa: Eastern Corridor Planning',
    excerpt: 'Eastern Ethiopia relocations from Addis to Dire Dawa: logistics coordination, road time, and commercial vs household move scopes.',
    tags: ['Dire Dawa', 'eastern Ethiopia', 'long distance'],
    readTime: 11,
    overview:
      'Dire Dawa moves require explicit truck planning and often phased packing. Office and household clients should align building access at both ends before signing fixed quotes.',
    sections: [
      {
        h: 'Commercial vs home',
        p: 'Retail inventory and office files need sealed cartons and numbered manifests; homes need furniture disassembly plan for narrow entries in older districts.',
      },
      {
        h: 'Quote transparency',
        p: 'Insist on all-in pricing for crew travel time, not just kilometers—idle waiting at checkpoints adds cost if undisclosed.',
      },
    ],
  },
  {
    slug: 'pet-friendly-moving-high-rise-addis-guide',
    cat: 'checklist-guide',
    title: 'Pet-Friendly Moving in Addis High-Rises: Dogs, Cats & Building Rules',
    excerpt: 'Move with pets in Addis condos: association pet policies, calm crating, elevator etiquette, and vet access after move-in.',
    tags: ['pets', 'condo', 'high-rise'],
    readTime: 9,
    overview:
      'Pets stress during noise and open doors. High-rise buildings may restrict pets by size or require registration—verify before booking lift slots.',
    sections: [
      {
        h: 'Before move day',
        ul: [
          'Update microchip and vet records with new address when available.',
          'Keep pets in one closed room with water until loaders finish that zone.',
          'Walk dogs early—moving day is not the time for off-leash exploration near trucks.',
        ],
      },
      {
        h: 'Elevator and neighbors',
        p: 'Use service lift when allowed; avoid peak resident hours. Inform neighbors if hallway noise is unavoidable for 30 minutes.',
      },
    ],
  },
  {
    slug: 'moving-with-elders-mamoch-baboch-addis-guide',
    cat: 'checklist-guide',
    title: 'Moving with Elders in Addis: Respectful, Paced Relocation',
    excerpt: 'Relocate parents and grandparents with dignity: medication boxes, ground-floor priority, rest breaks, and cultural sensitivity on moving day.',
    tags: ['elders', 'family', 'multi-generational'],
    readTime: 10,
    overview:
      'Multi-generational moves fail when pace ignores elders. Plan shorter active hours, chair rest in shade, and a family member not lifting but coordinating.',
    sections: [
      {
        h: 'Health essentials',
        ul: [
          'Hand-carry medications, glasses, and medical files—never truck.',
          'Reserve ground-floor or elevator-confirmed unit before move week.',
          'Identify nearest clinic or pharmacy at new neighborhood in advance.',
        ],
      },
      {
        h: 'Cultural note',
        p: 'Many families bless the new home before furniture enters—coordinate crew pause without penalty if discussed at booking.',
      },
    ],
  },
  {
    slug: 'rainy-season-kremt-moving-addis-guide',
    cat: 'checklist-guide',
    title: 'Moving During Kremt Rainy Season in Addis Ababa',
    excerpt: 'Wet-season moves: shrink-wrap mattresses, covered loading, mud at compounds, and rescheduling when roads flood near river corridors.',
    tags: ['rainy season', 'Kremt', 'weather'],
    readTime: 9,
    overview:
      'Kremt rains soak cardboard and muddy compound paths. Professional crews use wrap, mats, and covered truck bays—DIY moves suffer mold and slip injuries.',
    sections: [
      {
        h: 'Material protection',
        ul: [
          'Shrink-wrap upholstered furniture even for short carries.',
          'Double-bag textiles; elevate boxes on pallets inside truck when possible.',
          'Wipe wheels before entering new apartment to protect floors.',
        ],
      },
      {
        h: 'Scheduling',
        p: 'Watch daily forecasts; embassy and river-adjacent neighborhoods flood faster. Reschedule early rather than forcing trucks through unsafe mud slopes.',
      },
    ],
  },
  {
    slug: 'meskel-season-moving-road-closures-guide',
    cat: 'checklist-guide',
    title: 'Moving Around Meskel Season: Demera & Meskel Square Closures',
    excerpt: 'Plan Addis moves when Meskel Demera closes Meskel Square radiating routes—alternate staging and avoid central cross-city truck legs that day.',
    tags: ['Meskel', 'road closure', 'seasonal'],
    readTime: 8,
    overview:
      'Meskel celebrations concentrate traffic controls around Meskel Square and feeder roads. Cross-town moves that normally cut through center need rerouting or new date.',
    sections: [
      {
        h: 'Typical impact',
        ul: [
          'Closures from mid-morning through program end on Demera day.',
          'Detours add 30–90 minutes to legs involving Bole–Meskel–Mexico triangle.',
          'Compound management may ban moves on holy days entirely.',
        ],
      },
      {
        h: 'See also',
        p: 'Full calendar: <a href="/guides/holiday-moving-calendar-addis-ababa-timket-meskel">holiday moving calendar</a>.',
      },
    ],
  },
  {
    slug: 'timket-week-moving-survival-guide-addis',
    cat: 'checklist-guide',
    title: 'Timket Week Moving Survival Guide for Addis Ababa',
    excerpt: 'Ketera through Timket: Jan Meda, Tirunesh Beijing, and Arabsa celebration zones—when to postpone loads and how police closures affect trucks.',
    tags: ['Timket', 'Ketera', 'closures'],
    readTime: 9,
    overview:
      'Timket is not a single afternoon—it spans Ketera preparation and multi-site processions. Treat the whole window as restricted for moves near celebration anchors.',
    sections: [
      {
        h: 'Hot zones to avoid loading',
        ul: [
          'Jan Meda and approaches from 6 Kilo / St. Mary routes.',
          'Tirunesh Beijing and Kality–Alem Bank corridors when announced.',
          'Lemi Kura Arabsa and Hachalu Hundessa Square vicinities.',
        ],
      },
    ],
  },
  {
    slug: 'fasika-easter-move-planning-addis-guide',
    cat: 'checklist-guide',
    title: 'Moving Before or After Fasika (Easter) in Addis Ababa',
    excerpt: 'Fasika travel surge: book movers before holiday week, expect family visits at both addresses, and respect fasting-period pacing if applicable.',
    tags: ['Fasika', 'Easter', 'holiday'],
    readTime: 8,
    overview:
      'Families travel and host during Fasika. Moving the same week as heavy guest traffic doubles chaos—shift date or pack guest room last.',
    sections: [
      {
        h: 'Booking tip',
        p: 'Reserve 3–4 weeks ahead; many crews take reduced schedules on peak holy days.',
      },
    ],
  },
  {
    slug: 'pagumen-new-year-move-fresh-start-guide',
    cat: 'checklist-guide',
    title: 'Pagumen & Ethiopian New Year Move: Fresh Start Planning',
    excerpt: 'Enkutatash and Pagumen moves: peak demand, price pressure, and starting the new year in a new home without lift double-booking.',
    tags: ['Pagumen', 'Enkutatash', 'New Year'],
    readTime: 8,
    overview:
      'Pagumen and September New Year align with lease cycles. Condos double-book lifts—confirm slot in writing before paying deposit to movers.',
    sections: [
      {
        h: 'See also',
        p: '<a href="/guides/enkutatash-new-year-moving-guide-addis">Enkutatash moving guide</a> and <a href="/guides/end-of-month-moving-rush-addis-guide">end-of-month rush</a>.',
      },
    ],
  },
  {
    slug: 'mid-week-tuesday-wednesday-moving-advantage-addis',
    cat: 'pricing-guide',
    title: 'Mid-Week Moving Advantage: Tuesday & Wednesday in Addis',
    excerpt: 'Why Tuesday–Wednesday moves often beat Saturday congestion: lift availability, traffic, and sometimes better crew scheduling in Addis Ababa.',
    tags: ['mid-week', 'scheduling', 'savings'],
    readTime: 7,
    overview:
      'Saturday is popular but crowded. Mid-week moves can finish faster when buildings allow weekday windows and roads are lighter.',
    sections: [
      {
        h: 'When mid-week fails',
        p: 'Office workers need time off; some compounds only allow weekends—verify management rules first.',
      },
    ],
  },
  {
    slug: 'broker-delala-vs-professional-movers-addis-guide',
    cat: 'pricing-guide',
    title: 'Broker (Delala) vs Professional Movers in Addis Ababa',
    excerpt: 'Why informal brokers misquote parking and lift access—and how fixed professional quotes protect condo moves from gate surprises.',
    tags: ['delala', 'broker', 'scam prevention'],
    readTime: 10,
    overview:
      'Delalas often promise cheap trucks but omit condo permits, stair carries, and standby fees. Professional movers survey access and put price in writing.',
    sections: [
      {
        h: 'Red flags',
        ul: [
          'Quote by phone only with no site visit for high-rise.',
          'No company name or receipt; cash only on day.',
          'Truck arrives smaller than promised—price jumps mid-load.',
        ],
      },
      {
        h: 'Protect yourself',
        p: 'Use <a href="/guides/moving-contract-red-flags-addis-guide">contract red flags guide</a> before signing.',
      },
    ],
  },
  {
    slug: 'reclaim-security-deposit-after-move-addis-guide',
    cat: 'checklist-guide',
    title: 'Reclaiming Your Security Deposit After Moving in Addis',
    excerpt: 'Document condition, cleaning standards, and handover timing so landlords release deposits after professional move-out in Addis rentals.',
    tags: ['deposit', 'renters', 'handover'],
    readTime: 9,
    overview:
      'Deposit disputes follow poor documentation. Photograph walls and meters; use move-out checklist before landlord walk-through.',
    sections: [
      {
        h: 'Pair with move-out',
        p: '<a href="/guides/move-out-handover-checklist-addis-renters">Move-out handover checklist</a> aligns movers leaving empty unit with photo evidence.',
      },
    ],
  },
  {
    slug: 'fragile-packing-electronics-addis-cobblestone-guide',
    cat: 'service-guide',
    title: 'Fragile Packing for Electronics on Addis Cobblestone Routes',
    excerpt: 'Protect TVs, monitors, and glass on rough streets: double box, corner protectors, upright transport, and climate considerations.',
    tags: ['fragile', 'electronics', 'packing'],
    readTime: 10,
    overview:
      'Cobblestone and speed bumps shock poorly packed screens. Original boxes are best; otherwise use double-walled cartons and marked FRAGILE faces.',
    sections: [
      {
        h: 'Loading orientation',
        ul: [
          'Keep TVs upright; never lay unboxed panels flat under weight.',
          'Secure PCs with internal padding; remove loose hard drives if advised by IT.',
          'Wrap glass table tops vertically with edge guards.',
        ],
      },
    ],
  },
  {
    slug: 'packing-traditional-mesob-injera-gear-guide',
    cat: 'service-guide',
    title: 'Packing Mesob, Mitad & Traditional Kitchen Gear for Moves',
    excerpt: 'Move injera mitads, mesob sets, and clay serveware without chips: padding, separate tiers, and kitchen box labeling in Addis homes.',
    tags: ['mesob', 'mitad', 'traditional kitchen'],
    readTime: 9,
    overview:
      'Traditional kitchen items are heavy and brittle. Separate clay from stacked metal; never nest glass inside mitad without wrap.',
    sections: [
      {
        h: 'Mitad and electric grills',
        p: 'Cool completely; wrap cords; transport mitad flat with cardboard between surfaces.',
      },
    ],
  },
  {
    slug: 'orthodox-icons-religious-items-moving-guide',
    cat: 'checklist-guide',
    title: 'Moving Orthodox Icons & Religious Items with Respect',
    excerpt: 'Handle crosses, icons, and church garments with clean hands, separate boxes, and family-led placement—not tossed in generic load.',
    tags: ['Orthodox', 'icons', 'cultural'],
    readTime: 8,
    overview:
      'Families often want religious items moved first or separately. Communicate this to crew lead; assign family member to carry sacred pieces in private vehicle if preferred.',
    sections: [
      {
        h: 'Practical packing',
        p: 'Wrap icons in soft cloth; mark box clearly; avoid placing heavy furniture on top.',
      },
    ],
  },
  {
    slug: 'imported-wardrobe-disassembly-cam-lock-guide',
    cat: 'service-guide',
    title: 'Disassembling Imported Wardrobes & Cam-Lock Furniture in Addis',
    excerpt: 'IKEA-style and imported cam-lock wardrobes: bag hardware by unit, photograph steps, and reassemble without missing screws after move.',
    tags: ['wardrobe', 'disassembly', 'imported furniture'],
    readTime: 9,
    overview:
      'Cam-lock furniture fails when screws mix between rooms. Label Ziploc bags by room and drawer; tape small parts inside wardrobe carcass.',
    sections: [
      {
        h: 'Crew skill',
        p: 'Active Movers crews photograph complex units before teardown for accurate rebuild at destination.',
      },
    ],
  },
  {
    slug: 'crane-balcony-furniture-delivery-addis-guide',
    cat: 'service-guide',
    title: 'Crane & Balcony Furniture Delivery for High-Rise Addis',
    excerpt: 'When sofas do not fit elevators: crane lift, balcony hoist, and building approval for oversized items in Bole and Kazanchis towers.',
    tags: ['crane', 'balcony', 'hoist'],
    readTime: 10,
    overview:
      'Oversized sectionals may require external hoist. Building must approve; street closure sometimes needed—plan 1–2 weeks ahead.',
    sections: [
      {
        h: 'Cost drivers',
        ul: [
          'Third-party crane rental separate from standard move quote.',
          'Insurance for lift over public space.',
          'Night or weekend premium for traffic control.',
        ],
      },
    ],
  },
  {
    slug: 'multi-stop-move-home-office-storage-addis',
    cat: 'service-guide',
    title: 'Multi-Stop Moves: Home, Office & Storage in One Day',
    excerpt: 'Coordinate pickup from old home, branch office, and storage locker with labeled load order and single manifest in Addis.',
    tags: ['multi-stop', 'office', 'storage'],
    readTime: 10,
    overview:
      'Multi-stop jobs fail without load sequence plan. Load storage last if unloading home first—or reverse based on final destination priority.',
    sections: [
      {
        h: 'Manifest',
        p: 'Number stops A/B/C on contract; crew signs each departure time to avoid disputes on overtime.',
      },
    ],
  },
  {
    slug: 'home-office-split-move-addis-guide',
    cat: 'commercial-guide',
    title: 'Splitting Home & Home-Office Moves in Addis Ababa',
    excerpt: 'Relocate desk, servers, and household in one coordinated day: cable labeling, confidential files, and separate unload rooms.',
    tags: ['home office', 'hybrid', 'IT'],
    readTime: 10,
    overview:
      'Hybrid workers need desk and filing moved without mixing with kitchen boxes. Color code BLUE office, GREEN home.',
    sections: [
      {
        h: 'IT',
        p: 'Backup before disconnect; label cables; transport router and modem in hand carry.',
      },
    ],
  },
  {
    slug: 'coworking-space-transition-moving-addis',
    cat: 'commercial-guide',
    title: 'Coworking & Startup Office Transition Moves in Addis',
    excerpt: 'Move between Bole Atlas coworking spaces: hot-desk assets, monitor arms, and after-hours elevator booking for small teams.',
    tags: ['coworking', 'startup', 'Bole Atlas'],
    readTime: 9,
    overview:
      'Coworking moves are smaller but time-boxed. Many spaces allow moves only Sunday evenings—confirm with community manager.',
    sections: [],
  },
  {
    slug: 'hotel-serviced-apartment-bole-move-guide',
    cat: 'service-guide',
    title: 'Moving from Hotel & Serviced Apartments in Bole',
    excerpt: 'Coordination with hotel front desk, freight elevators, and minimal guest disruption for corporate suites near airport corridor.',
    tags: ['hotel', 'serviced apartment', 'Bole'],
    readTime: 9,
    overview:
      'Hotels require discretion and timing. Load through service corridors; avoid lobby peak check-in hours.',
    sections: [],
  },
  {
    slug: 'eagle-hills-la-gare-premium-move-guide',
    cat: 'area-guide',
    title: 'Eagle Hills & La Gare Premium Compound Moving Guide',
    excerpt: 'Luxury compound moves: property management rules, marble protection, and white-glove packing expectations in new Bole developments.',
    tags: ['Eagle Hills', 'La Gare', 'luxury'],
    readTime: 10,
    overview:
      'Premium compounds inspect floors and lifts after moves. Use floor runners and lift padding; expect management walk-through same day.',
    sections: [],
  },
  {
    slug: 'phison-luxury-compound-villa-move-guide',
    cat: 'area-guide',
    title: 'Phison & Luxury Gated Compound Villa Moves in Addis',
    excerpt: 'Large villa moves in gated communities: multi-truck logistics, garden items, generators, and long internal drives from gate to villa.',
    tags: ['Phison', 'gated community', 'villa'],
    readTime: 11,
    overview:
      'Gate-to-door distances inflate carry time. Survey must walk full path and note low branches blocking tall trucks.',
    sections: [],
  },
  {
    slug: 'lebu-mebrat-hail-developments-moving-guide',
    cat: 'area-guide',
    title: 'Lebu Mebrat Hail & New South Developments Moving Guide',
    excerpt: 'Young professional moves into Lebu Mebrat Hail: new roads, dust during construction, and condo management onboarding.',
    tags: ['Lebu', 'Mebrat Hail', 'development'],
    readTime: 9,
    overview:
      'Active construction means mud and dust—wrap furniture early; confirm truck can reach phase of site you occupy.',
    sections: [],
  },
  {
    slug: 'ayat-vs-summit-neighborhood-move-comparison',
    cat: 'area-guide',
    title: 'Ayat vs Summit: Which Move Is Harder? Comparison for Movers',
    excerpt: 'Compare Ayat Lemi Kura condo density vs Summit gated traffic for families choosing where to relocate within east Addis.',
    tags: ['Ayat', 'Summit', 'comparison'],
    readTime: 9,
    overview:
      'Ayat moves are lift-heavy condo logistics; Summit often adds gate distance and villa volume. Price follows access, not prestige of name.',
    sections: [],
  },
  {
    slug: 'cmc-vs-jemo-move-comparison-guide',
    cat: 'area-guide',
    title: 'CMC vs Jemo: Moving Cost & Access Comparison',
    excerpt: 'Upscale CMC Mikael lifts vs budget Jemo government condos—how access and volume change your moving quote in south/west Addis.',
    tags: ['CMC', 'Jemo', 'comparison'],
    readTime: 8,
    overview:
      'CMC often has stricter management and tighter lifts; Jemo may have longer carries from parking but simpler rules. Survey both if deciding where to lease.',
    sections: [],
  },
  {
    slug: 'sheger-park-walkable-neighborhoods-move-guide',
    cat: 'area-guide',
    title: 'Moving Near Sheger Park & Walkable River Corridors',
    excerpt: 'Relocations near Sheger Park redevelopment: pedestrian zones, limited truck staging, and family-friendly post-move settling.',
    tags: ['Sheger Park', 'walkability', 'greenery'],
    readTime: 9,
    overview:
      'River corridor projects improve walkability but restrict vehicle access during construction—check staging point weekly before move.',
    sections: [],
  },
  {
    slug: 'light-rail-proximity-moving-addis-guide',
    cat: 'area-guide',
    title: 'Moving Near Light Rail Lines in Addis Ababa',
    excerpt: 'Homes near LRT: street closures during maintenance, pedestrian crossings, and parking trucks away from rail gates.',
    tags: ['light rail', 'LRT', 'transit'],
    readTime: 8,
    overview:
      'LRT-adjacent streets have periodic closures. Movers may stage one block away—budget carry time in quote.',
    sections: [],
  },
  {
    slug: 'utility-transfer-ethio-telecom-electric-move-guide',
    cat: 'checklist-guide',
    title: 'Utility Transfer After Moving: Ethio Telecom & Electric in Addis',
    excerpt: 'After movers leave: meter readings, telecom line transfer, and avoiding overlap bills at old and new addresses.',
    tags: ['utilities', 'Ethio telecom', 'electric'],
    readTime: 9,
    overview:
      'Photograph meter numbers at both homes on move day. Start telecom transfer early—technician appointments lag in peak months.',
    sections: [],
  },
  {
    slug: 'post-move-cleaning-handover-addis-guide',
    cat: 'checklist-guide',
    title: 'Post-Move Cleaning & Handover Standards in Addis Ababa',
    excerpt: 'Deep clean empty old unit and new home before furniture: what landlords expect and how to schedule cleaners around truck timing.',
    tags: ['cleaning', 'handover', 'move-out'],
    readTime: 8,
    overview:
      'Clean old apartment after truck empties it—easier than before. New home quick clean before mattress unload prevents dragging dust into bedrooms.',
    sections: [],
  },
  {
    slug: 'housewarming-kitet-mebte-after-move-guide',
    cat: 'checklist-guide',
    title: 'Housewarming (Kitet Mebte) After Your Move in Addis',
    excerpt: 'Host neighbors after relocation: iddir introduction, coffee ceremony setup order, and when to schedule party vs finish unpacking.',
    tags: ['housewarming', 'kitet', 'community'],
    readTime: 7,
    overview:
      'Many families host after partial unpack—keep one room guest-ready and defer heavy decoration until truck debris is gone.',
    sections: [],
  },
  {
    slug: 'gated-community-first-time-buyer-move-guide',
    cat: 'area-guide',
    title: 'First Move into a Gated Community: Buyer Checklist Addis',
    excerpt: 'New buyers in gated compounds: management move fees, contractor IDs, and landscaping items moved with villa loads.',
    tags: ['gated community', 'first-time buyer', 'villa'],
    readTime: 10,
    overview:
      'Gated communities charge move deposits and inspect trucks at gate. Pay fees before booking date to avoid day-of refusal.',
    sections: [],
  },
  {
    slug: 'nursery-daycare-relocation-addis-guide',
    cat: 'commercial-guide',
    title: 'Nursery & Daycare Relocation: Soft Play & Equipment Moves',
    excerpt: 'Move cribs, soft play, and outdoor toys with sanitation and reassembly for preschools in Addis neighborhoods.',
    tags: ['daycare', 'nursery', 'school'],
    readTime: 9,
    overview:
      'Sanitize soft items after transport; disassemble play structures with labeled hardware bags for weekend reopen.',
    sections: [],
  },
  {
    slug: 'pharmacy-relocation-addis-guide',
    cat: 'commercial-guide',
    title: 'Pharmacy Relocation Guide: Shelving, Cold Chain & Inventory',
    excerpt: 'Relocate pharmacies in Addis: secure controlled inventory lists, fridge units upright, and after-hours shelf install.',
    tags: ['pharmacy', 'retail', 'medical'],
    readTime: 10,
    overview:
      'Temperature-sensitive stock may need hand transport in cooled boxes—plan with pharmacist before movers arrive.',
    sections: [],
  },
  {
    slug: 'print-shop-flatbed-printer-move-guide',
    cat: 'commercial-guide',
    title: 'Print Shop & Flatbed Printer Relocation in Addis',
    excerpt: 'Heavy flatbed printers and cutters: rigging, floor load limits, and IT network reconnect after commercial move.',
    tags: ['print shop', 'flatbed', 'commercial'],
    readTime: 10,
    overview:
      'Verify floor capacity in new shop before moving ton-class equipment; use rigging crew for tilt and skid.',
    sections: [],
  },
  {
    slug: 'gym-fitness-center-equipment-move-addis',
    cat: 'commercial-guide',
    title: 'Gym & Fitness Center Equipment Relocation in Addis',
    excerpt: 'Treadmills, racks, and mirrors: disassembly, bolt bags, and floor protection for Sengatera and Bole fitness boutiques.',
    tags: ['gym', 'fitness', 'heavy equipment'],
    readTime: 10,
    overview:
      'Treadmills are heavy—use appliance dolly and strap to wall in truck. Mirrors crated vertically with X-tape on glass.',
    sections: [],
  },
  {
    slug: 'modjo-port-diaspora-container-coordination-guide',
    cat: 'service-guide',
    title: 'Modjo Port & Diaspora Container Coordination with Local Moves',
    excerpt: 'When sea freight lands at Modjo: align local Addis delivery with container devanning and customs-ready inventory lists.',
    tags: ['Modjo', 'diaspora', 'container'],
    readTime: 11,
    overview:
      'Diaspora returns often pair port release with home delivery. Local leg needs exact volume after container open—avoid quoting from guesswork.',
    sections: [],
  },
  {
    slug: 'cross-border-regional-move-addis-nairobi-guide',
    cat: 'service-guide',
    title: 'Regional Cross-Border Moves from Addis: Planning & Local Leg',
    excerpt: 'High-level planning for household moves toward Nairobi or Djibouti corridors—local packing in Addis before international forwarder pickup.',
    tags: ['cross-border', 'Nairobi', 'Djibouti'],
    readTime: 11,
    overview:
      'Active Movers focuses on Ethiopian local packing and transport to forwarder warehouse—cross-border customs is forwarder-led; coordinate dates tightly.',
    sections: [],
  },
  {
    slug: 'nifas-silk-lafto-overview-moving-guide',
    cat: 'area-guide',
    title: 'Nifas Silk-Lafto Sub-City Moving Overview',
    excerpt: 'Southwest Addis from Jemo to Lebu: sub-city-wide moving patterns, ring-road access, and condo-heavy routes.',
    tags: ['Nifas Silk-Lafto', 'sub-city', 'southwest'],
    readTime: 9,
    overview:
      'Nifas Silk-Lafto spans Jemo, Lebu, Saris edges—long north-south internal distances. Origin and destination sub-areas both affect quote.',
    sections: [],
  },
  {
    slug: 'yeka-subcity-moving-overview-guide',
    cat: 'area-guide',
    title: 'Yeka Sub-City Moving Overview: Megenagna to Meri',
    excerpt: 'Whole Yeka moves: eastern hills, school corridors, and links to Kotebe and Shola neighborhoods.',
    tags: ['Yeka', 'sub-city', 'Megenagna'],
    readTime: 9,
    overview:
      'Yeka combines busy junctions and quiet hillside streets—survey must capture both traffic and slope access.',
    sections: [],
  },
  {
    slug: 'kirkos-subcity-moving-overview-guide',
    cat: 'area-guide',
    title: 'Kirkos Sub-City Moving Overview: Kazanchis to Meskel Square',
    excerpt: 'Central business district density, embassy edges, and office-heavy demand in Kirkos sub-city relocations.',
    tags: ['Kirkos', 'sub-city', 'CBD'],
    readTime: 9,
    overview:
      'Kirkos is office-dominant; residential moves near Kazanchis still face parking and elevator competition with commercial tenants.',
    sections: [],
  },
  {
    slug: 'bole-subcity-complete-moving-overview-2026',
    cat: 'area-guide',
    title: 'Bole Sub-City Complete Moving Overview (2026)',
    excerpt: 'Atlas to Bulbula: map of Bole micro-areas, traffic nodes, and links to detailed Bole and Arabsa guides.',
    tags: ['Bole', 'sub-city', '2026'],
    readTime: 10,
    overview:
      'Bole is not one neighborhood—see <a href="/guides/bole-moving-guide-addis-ababa-2026">Bole guide</a> and <a href="/guides/bole-arabsa-condo-moving-guide">Bole Arabsa guide</a> for depth.',
    sections: [],
  },
  {
    slug: 'storage-service-addis-active-movers-guide',
    cat: 'service-guide',
    title: 'Storage Solutions Between Moves: Addis Ababa Guide',
    excerpt: 'Short and medium storage when handover dates misalign: inventory, access hours, and delivery back to new home.',
    tags: ['storage', 'Active Movers', 'gap move'],
    readTime: 9,
    overview:
      'See <a href="/services/storage">storage services</a>. Label stored items for partial retrieval if you need winter clothes before full delivery.',
    sections: [],
  },
  {
    slug: 'packaging-service-addis-materials-guide',
    cat: 'service-guide',
    title: 'Packaging Service Materials & Methods Used in Addis Moves',
    excerpt: 'Blankets, stretch wrap, dish packs, and wardrobe boxes—what full pack includes vs owner-packed fragile risk.',
    tags: ['packaging', 'materials', 'full pack'],
    readTime: 9,
    overview:
      '<a href="/services/packaging">Packaging service page</a> · partial pack for kitchen-only or fragile-only saves cost vs full home.',
    sections: [],
  },
  {
    slug: 'office-relocation-minimal-downtime-checklist',
    cat: 'commercial-guide',
    title: 'Office Relocation Minimal Downtime Checklist for Addis Firms',
    excerpt: 'Friday load Sunday open playbook: IT cutover, phone forwarding, and staff seating plan at new Kazanchis or Sengatera floor.',
    tags: ['office', 'downtime', 'checklist'],
    readTime: 11,
    overview:
      'Assign runbook owner from IT and HR. Movers follow floor plan numbers on desks and cartons.',
    sections: [
      {
        h: '48 hours before',
        ul: [
          'Forward phones; print seating chart.',
          'Backup servers; label patch cables.',
          'Notify building of freight elevator reservation both sides.',
        ],
      },
      {
        h: 'Move weekend',
        ul: [
          'Load in reverse unpack order—IT room last in, first out at new site.',
          'Test internet before announcing Monday open.',
        ],
      },
    ],
  },
  {
    slug: 'tenant-kebele-to-modern-condo-move-guide',
    cat: 'checklist-guide',
    title: 'Tenant Move from Kebele House to Modern Condo in Addis',
    excerpt: 'Upgrade from kebele rental to condo: bigger volume surprises, lift booking, and selling or donating legacy furniture.',
    tags: ['kebele', 'condo upgrade', 'tenant'],
    readTime: 10,
    overview:
      'Kebele homes often accumulate built-ins and custom shelves that do not fit new condo layouts—declutter before truck size is set.',
    sections: [],
  },
  {
    slug: 'iddir-community-move-notification-addis-guide',
    cat: 'checklist-guide',
    title: 'Iddir & Community Notification When Moving in Addis',
    excerpt: 'Courtesy notice to neighbors and iddir when truck blocks shared gate—reduces conflict on moving day in dense compounds.',
    tags: ['iddir', 'community', 'etiquette'],
    readTime: 7,
    overview:
      'Inform security and nearby iddir leaders; short coffee or notice prevents disputes over blocked shared driveways.',
    sections: [],
  },
  {
    slug: 'student-dormitory-end-semester-move-addis-guide',
    cat: 'checklist-guide',
    title: 'End-of-Semester Student Moves in Addis Ababa',
    excerpt: 'Small loads, shared taxis vs micro-truck, and storage over break for Sidist Kilo and Arat Kilo area students.',
    tags: ['student', 'dormitory', 'semester'],
    readTime: 8,
    overview:
      'Book early end of semester week; combine with roommates for shared truck to split cost legally with written split receipt.',
    sections: [],
  },
]

// Pad to exactly 50 if short — count GUIDES
const TARGET = 50
if (GUIDES.length < TARGET) {
  console.error('Need', TARGET, 'guide defs, have', GUIDES.length)
  process.exit(1)
}
if (GUIDES.length > TARGET) {
  GUIDES.length = TARGET
}

const slugs = new Set(GUIDES.map((g) => g.slug))
if (slugs.size !== TARGET) {
  console.error('Duplicate slugs in batch')
  process.exit(1)
}

for (const g of GUIDES) {
  if (existing.has(g.slug)) {
    console.error('Slug already exists:', g.slug)
    process.exit(1)
  }
}

const baseDate = new Date('2026-09-22T08:00:00.000Z')
fs.mkdirSync(OUT, { recursive: true })

GUIDES.forEach((g, i) => {
  const publishedAt = new Date(baseDate.getTime() - i * 1800000).toISOString()
  const content = renderContent(g)
  const doc = {
    id: `guide-${g.slug}`.slice(0, 90),
    title: g.title,
    titleAm: '',
    excerpt: g.excerpt,
    excerptAm: '',
    content,
    contentAm: '',
    author: 'Active Movers Team',
    category: g.cat,
    tags: g.tags,
    tagsAm: [],
    readTime: g.readTime || 9,
    featuredImage: IMG[i % IMG.length],
    images: [],
    status: 'published',
    publishedAt,
    updatedAt: publishedAt,
    slug: g.slug,
  }
  fs.writeFileSync(path.join(OUT, `${g.slug}.json`), JSON.stringify(doc, null, 2) + '\n', 'utf8')
  console.log('Wrote', g.slug)
})

console.log('Done. Total new:', TARGET)
