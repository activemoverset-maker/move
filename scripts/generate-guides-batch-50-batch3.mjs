/**
 * Batch 3: 50 NEW detailed moving guides (skips existing slugs).
 * Run: node scripts/generate-guides-batch-50-batch3.mjs
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

function enrichBlock(g) {
  const tag = g.tags?.[0] || 'your move'
  return `
<h2>Step-by-step planning in Addis Ababa</h2>
<p>For <strong>${esc(g.title.replace(/ Guide.*/i, ''))}</strong>, start with a walkthrough or video survey so truck size, crew count, and hours reflect real access—not guesses. Mention ${esc(tag)} specifics, floor level, and whether management requires written move permits.</p>
<ul>
<li>Confirm move date with building management and reserve freight or service elevator slots in writing.</li>
<li>Declutter and sell items that will not fit the new layout to reduce volume and cost.</li>
<li>Label boxes by room; mark FRAGILE and THIS SIDE UP on electronics and glass.</li>
<li>Photograph meter readings and wall condition at origin; repeat at destination before furniture covers walls.</li>
<li>Align utility and address updates after keys handover (see <a href="/guides/utility-transfer-ethio-telecom-electric-move-guide">utility transfer guide</a>).</li>
</ul>

<h2>Moving day execution</h2>
<p>Active Movers assigns a crew lead who coordinates with security and elevator time windows. Heavy items are blanket-wrapped; floors and lift cab protection is used where compounds require it. We load heaviest pieces first for stable transit on Addis streets.</p>
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

<h2>More FAQs</h2>
<p><strong>How far in advance should I book?</strong> For condos in Bole, Ayat, or Kazanchis, book 1–2 weeks ahead; inter-city and large office moves need 2–4 weeks.</p>
<p><strong>Do you provide packing materials?</strong> Yes—see <a href="/guides/packaging-service-addis-materials-guide">packaging materials guide</a> and <a href="/services/packaging">packaging service</a>.</p>
`
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
  html += enrichBlock(g)
  html += `\n<h2>Book with Active Movers</h2>\n<p>${g.cta || 'Get a written quote after a quick survey. <a href="/booking">Book online</a> or explore <a href="/services/local-moving">local moving</a> and <a href="/guides">all guides</a>.'}</p>`
  return html
}

function areaGuide(slug, title, excerpt, tags, overview, localBullets, extraSection) {
  return {
    slug,
    cat: 'area-guide',
    title,
    excerpt,
    tags,
    readTime: 10,
    overview,
    sections: [
      {
        h: 'Access, traffic, and staging',
        ul: localBullets,
      },
      {
        h: 'What to tell your surveyor',
        ul: [
          'Exact woreda address and gate name for truck authorization.',
          'Floor level, elevator size, and whether freight lift hours are limited.',
          'Items needing disassembly (imported kitchens, L-shaped sofas, king beds).',
        ],
      },
      extraSection || {
        h: 'Neighborhood note',
        p: 'Combine mid-week scheduling with written condo permits to avoid end-of-month elevator conflicts.',
      },
    ],
  }
}

function serviceGuide(slug, title, excerpt, tags, overview, sections, faq) {
  return {
    slug,
    cat: 'service-guide',
    title,
    excerpt,
    tags,
    readTime: 10,
    overview,
    sections,
    faq,
  }
}

/** @type {Array<any>} */
const GUIDES = [
  areaGuide(
    'moving-addis-ababa-to-bahir-dar-guide',
    'Moving from Addis Ababa to Bahir Dar: Lake Region Long-Distance Guide',
    'Addis to Bahir Dar (~550 km): overnight timing, highway rest stops, and protecting furniture on long hauls to Amhara lake cities.',
    ['Bahir Dar', 'long distance', 'Amhara'],
    'Bahir Dar moves are full-day or two-leg trips depending on truck size and load. Origin packing quality matters more than on short Bole relocations because vibration hours add up.',
    [
      'Confirm destination street access near lake-side condos vs older kebele lanes.',
      'Plan handoff keys so crew is not waiting at gated compounds without clearance.',
      'Use blankets and stretch wrap on all wood—highway dust is abrasive.',
    ],
    {
      h: 'Distance pricing',
      p: 'Quotes are volume- and distance-based, not hourly like inner-city jobs. See <a href="/guides/long-distance-moving-ethiopia-cities-guide">long-distance overview</a> for inventory lists.',
    }
  ),
  serviceGuide(
    'moving-addis-ababa-to-gondar-guide',
    'Moving from Addis Ababa to Gondar: Historic City Relocation Guide',
    'Inter-city move to Gondar: mountain route planning, UNESCO-area access, and coordinating unload in hilly old-town edges.',
    ['Gondar', 'long distance', 'historic city'],
    'Gondar deliveries may involve steep lanes and tight turns near the castle district. Survey photos of both ends prevent wrong truck class.',
    [
      {
        h: 'Route and timing',
        ul: [
          'Allow buffer for weather and road works on northern legs.',
          'Split load if a large villa cannot access narrow final streets—shuttle with smaller truck.',
          'Keep documents for checkpoint inventory if requested.',
        ],
      },
      {
        h: 'Packing for long transit',
        p: 'Double-box ceramics; pad mattress corners; drain water from any appliances.',
      },
    ]
  ),
  serviceGuide(
    'moving-addis-ababa-to-jimma-guide',
    'Moving from Addis Ababa to Jimma: Southwest Corridor Move Guide',
    'Addis–Jimma relocations for university, NGO, and coffee-sector families: distance quotes and multi-stop planning.',
    ['Jimma', 'long distance', 'southwest'],
    'Jimma-bound moves often include office files and household together—declare both at survey for accurate cube estimate.',
    [
      {
        h: 'Combined household + office',
        ul: [
          'Seal file boxes with tamper-evident tape and room labels.',
          'Load office cartons last for first-out at destination.',
          'Confirm Jimma compound gate hours before dispatch.',
        ],
      },
      {
        h: 'Cost drivers',
        p: 'Distance, volume, and packing tier dominate; hourly shortcuts from brokers rarely apply on this corridor.',
      },
    ]
  ),
  serviceGuide(
    'debre-birhan-from-addis-moving-guide',
    'Moving from Addis Ababa to Debre Birhan: Shoa Highlands Guide',
    'Shorter inter-city hop to Debre Birhan: same-day possibilities for partial loads and full-home relocations.',
    ['Debre Birhan', 'long distance', 'Shoa'],
    'Elevation and weather can affect afternoon departures—morning load is safer for same-day arrival planning.',
    [
      {
        h: 'Load sizing',
        ul: [
          'Studio and 1-bedroom often fit one truck; villas may need two trips or larger freight.',
          'Disassemble dining sets to protect legs on winding roads.',
        ],
      },
      {
        h: 'Handover',
        p: 'Photograph walls at both homes; align with <a href="/guides/move-out-handover-checklist-addis-renters">move-out handover checklist</a> if renting out your Addis unit.',
      },
    ]
  ),
  areaGuide(
    'welo-sefer-moving-guide-addis',
    'Welo Sefer Moving Guide: Dense Lanes & Mixed Housing',
    'Welo Sefer relocations in Addis Ketema: narrow streets, mixed commercial-residential access, and shuttle planning.',
    ['Welo Sefer', 'Addis Ketema', 'inner city'],
    'Welo Sefer combines tight alleys and active street trade. Trucks often stage on main roads with hand carts for final meters.',
    [
      'Book security or neighbor clearance if truck blocks shop fronts briefly.',
      'Morning moves beat afternoon market congestion.',
      'Protect electronics from dust during long carry.',
    ]
  ),
  areaGuide(
    'kera-inner-city-moving-guide',
    'Kera Moving Guide: Inner Ring Access & Market Proximity',
    'Kera area moves near inner ring: staging on feeder roads, apartment walk-ups, and noise-sensitive timing.',
    ['Kera', 'Kirkos', 'inner city'],
    'Kera moves frequently use walk-up floors without freight lifts—crew size and stair carries drive quotes more than distance.',
    [
      'Measure stair landings for fridge and wardrobe paths.',
      'Use floor runners where landlords require wall protection.',
      'Avoid peak commute on Mexico–Kera connectors when possible.',
    ]
  ),
  areaGuide(
    'tor-hailoch-moving-guide-addis',
    'Tor Hailoch Moving Guide: Hillside Apartments & Long Carry',
    'Tor Hailoch relocations: hillside parking limits, compound gates, and elevator booking in Nifas Silk–Lafto edges.',
    ['Tor Hailoch', 'Lafto', 'hillside'],
    'Parking distance can exceed 80 meters—declare at survey so crew size and time blocks are accurate.',
    [
      'Confirm whether trucks may enter compound or must shuttle from boulevard.',
      'Reserve elevator if building shares one lift with residents.',
      'Rainy season increases slip risk on outdoor stairs—pad paths.',
    ]
  ),
  areaGuide(
    'friendship-city-condo-moving-guide',
    'Friendship City Condo Moving Guide: Bole Satellite Town Access',
    'Friendship City condo moves: satellite-town gates, new tower freight rules, and Bole corridor traffic.',
    ['Friendship City', 'Bole', 'condo'],
    'Friendship City compounds enforce visitor lists and move windows similar to Ayat—start paperwork early.',
    [
      'Submit truck plate and crew IDs to management 48 hours ahead.',
      'Photograph lift interior before and after move.',
      'Plan approach via Bole road alternatives during rush hour.',
    ]
  ),
  areaGuide(
    'olympia-bole-corridor-moving-guide',
    'Olympia & Bole Medhanialem Corridor Moving Guide',
    'Moves along Olympia–Bole commercial strip: loading bay limits, retail ground floors, and evening noise rules.',
    ['Olympia', 'Bole', 'corridor'],
    'Mixed residential towers above retail need coordinated loading zones—management often assigns fixed hours.',
    [
      'Reserve service elevator separate from retail delivery docks if shared.',
      'Weekday mid-morning slots reduce conflict with café deliveries.',
      'Ground-floor shops need clear path from truck to stockroom.',
    ]
  ),
  areaGuide(
    'bole-22-stadium-corridor-moving-guide',
    'Bole 22 & Stadium Area Moving Guide: Event-Day Traffic',
    'Relocations near Bole 22 and stadium corridors: match move day to event calendar and security closures.',
    ['Bole 22', 'stadium', 'traffic'],
    'Major matches and concerts tighten parking—verify event schedule before locking truck dispatch.',
    [
      'Use side streets documented in survey, not ad-hoc blocking of through lanes.',
      'High-rise residents: confirm freight lift after security screening.',
      'Keep small essentials box out of truck for overnight if unload runs late.',
    ]
  ),
  areaGuide(
    'ayat-zone-8-lemi-kura-moving-guide',
    'Ayat Zone 8 (Lemi Kura) Moving Guide: New Tower Logistics',
    'Zone 8 Ayat moves: Lemi Kura expansion towers, dust on construction adjacency, and gate protocols.',
    ['Ayat Zone 8', 'Lemi Kura', 'condo'],
    'New towers may still share temporary access roads—confirm truck weight limits with site management.',
    [
      'Book move slot before paint cure deadlines if management restricts heavy wheels.',
      'Label boxes for room layout—open-plan condos hide clutter fast.',
      'Link timing with <a href="/guides/ayat-lemi-kura-condo-moving-guide">Ayat Lemi Kura guide</a> for regional context.',
    ]
  ),
  areaGuide(
    'goro-lemi-kura-apartment-moving-guide',
    'Goro (Lemi Kura) Apartment Moving Guide',
    'Goro Lemi Kura apartment relocations: family-sized volumes, school-year timing, and shared gate queues.',
    ['Goro', 'Lemi Kura', 'apartment'],
    'Family moves dominate Goro corridors—end-of-month stacks elevator bookings; prefer mid-month dates.',
    [
      'Combine declutter sale before survey to drop truck tier.',
      'Children’s rooms packed last, labeled first for unpack.',
      'Confirm school transport routes if move crosses Megenagna commute.',
    ]
  ),
  areaGuide(
    'kara-lemi-kura-moving-guide',
    'Kara Lemi Kura Moving Guide: Growing Residential Belt',
    'Kara area moves on Lemi Kura belt: distance from inner Bole affects pricing even within “Greater Addis.”',
    ['Kara', 'Lemi Kura', 'residential'],
    'Kara addresses still behave like corridor relocations—travel time to truck yard and return affects crew day planning.',
    [
      'Verify GPS pin with crew lead—multiple “Kara” landmarks confuse navigation.',
      'Dusty unpaved segments need wrapped upholstery.',
      'Storage leg optional via <a href="/guides/moving-storage-between-homes-addis-guide">between-homes storage</a>.',
    ]
  ),
  {
    slug: 'kilinto-industrial-park-relocation-guide',
    cat: 'commercial-guide',
    title: 'Kilinto Industrial Park Relocation Guide for Businesses',
    excerpt: 'Factory and warehouse moves involving Kilinto IP: heavy equipment, phased shutdown, and escort timing.',
    tags: ['Kilinto', 'industrial', 'commercial'],
    readTime: 11,
    overview:
      'Industrial park moves need machine lists, disconnect/reconnect vendors, and staged loading to minimize production loss.',
    sections: [
      {
        h: 'Phased move plan',
        ul: [
          'Tag production lines by priority: move non-critical first.',
          'Use certified riggers for presses and CNC—not household crews alone.',
          'Align with park management for oversize gate entry.',
        ],
      },
      {
        h: 'Documentation',
        p: 'Maintain asset photos and serial numbers for insurance and customs if equipment crossed borders.',
      },
    ],
  },
  {
    slug: 'eastern-industrial-zone-moving-addis-guide',
    cat: 'commercial-guide',
    title: 'Eastern Industrial Zone & Factory Moves in Addis',
    excerpt: 'Relocations near eastern industrial clusters: forklift windows, palletized loads, and staff commute continuity.',
    tags: ['industrial', 'factory', 'eastern Addis'],
    readTime: 10,
    overview:
      'Factory moves differ from office jobs—palletize stockrooms, shrink-wrap racking bolts, and schedule around shift changes.',
    sections: [
      {
        h: 'Operations continuity',
        ul: [
          'Keep one workstation online until network tested at new bay.',
          'Color-code pallets by department for faster unpack.',
          'Verify truck height clearance at warehouse doors.',
        ],
      },
    ],
  },
  areaGuide(
    'sandafa-corridor-moving-guide',
    'Sandafa Corridor Moving Guide: North Edge Commuter Belt',
    'Sandafa corridor relocations: longer in-city legs, villa compounds, and weekend traffic on northern exits.',
    ['Sandafa', 'corridor', 'Yeka edge'],
    'Sandafa moves price like hybrid local–distance jobs—survey both ends for accurate crew day.',
    [
      'Compound moves need gate lists like Bole condos.',
      'Villa garages often hold gym gear—declare at survey.',
      'Pair with <a href="/guides/kotebe-yeka-moving-guide-addis">Kotebe/Yeka guide</a> if crossing subcities.',
    ]
  ),
  serviceGuide(
    'adama-industrial-commuter-move-guide',
    'Adama Industrial Commuter Moves: Split Week Home & Plant',
    'Families working in Adama industrial zones while keeping Addis home—or the reverse: split scheduling and storage.',
    ['Adama', 'commuter', 'industrial'],
    'Split-location households may need multi-stop trucks or storage—plan which bedroom set lives where before load order is set.',
    [
      {
        h: 'Split scheduling',
        ul: [
          'Move weekday furniture when plant shifts allow supervision at Adama end.',
          'Keep document box with you, not on truck, for HR and lease paperwork.',
        ],
      },
      {
        h: 'Related routes',
        p: 'See <a href="/guides/moving-addis-ababa-to-adama-guide">Addis to Adama guide</a> for highway timing.',
      },
    ]
  ),
  {
    slug: 'saris-wholesale-market-move-guide',
    cat: 'commercial-guide',
    title: 'Saris Wholesale Market Inventory Moves',
    excerpt: 'Shop relocations tied to Saris wholesale flows: pallet counts, early-morning load, and cash-register chain of custody.',
    tags: ['Saris', 'wholesale', 'retail'],
    readTime: 10,
    overview:
      'Wholesale market moves start pre-dawn to clear before peak buyer traffic; inventory sheets prevent SKU loss.',
    sections: [
      {
        h: 'Inventory control',
        ul: [
          'Count cartons by category before seal.',
          'Assign one staff member to sign truck load list.',
          'Keep POS and cash drawer in private vehicle, not mixed cartons.',
        ],
      },
    ],
  },
  areaGuide(
    'bole-michael-inner-ring-moving-guide',
    'Bole Michael Inner Ring Moving Guide',
    'Bole Michael dense housing moves: ring-road noise windows, walk-ups, and taxi corridor staging.',
    ['Bole Michael', 'inner ring', 'Kirkos'],
    'Inner ring segments restrict double-parking—crews coordinate with traffic police when required.',
    [
      'Use blankets on corners in narrow stairwells.',
      'Confirm landlord move-out photos same day as truck.',
      'Mid-week beats Friday prayer traffic peaks nearby.',
    ]
  ),
  areaGuide(
    'aware-greater-corridor-moving-guide',
    'Aware & Greater Bole Corridor Moving Guide',
    'Aware area relocations: mixed old and new housing, embassy-adjacent traffic, and shuttle from main roads.',
    ['Aware', 'Bole', 'corridor'],
    'Aware combines diplomatic traffic patterns with residential side streets—IDs ready at checkpoints.',
    [
      'Embassy event days tighten lanes—check calendar.',
      'Gated villas: list all crew passports or national IDs.',
      'See <a href="/guides/old-airport-laphto-moving-guide">Old Airport/Laphto guide</a> for nearby patterns.',
    ]
  ),
  {
    slug: 'commercial-lease-relocation-deadline-addis-guide',
    cat: 'pricing-guide',
    title: 'Commercial Lease Relocation Deadlines in Addis Ababa',
    excerpt: 'Align office move with lease break, fit-out, and penalty dates—written timeline with landlord and mover.',
    tags: ['commercial lease', 'deadline', 'office'],
    readTime: 9,
    overview:
      'Missing lease handover dates costs penalties; work backward from keys return to truck day including cleaning and patch-paint.',
    sections: [
      {
        h: 'Backward timeline',
        ul: [
          'T-minus 4 weeks: survey and IT disconnect plan.',
          'T-minus 1 week: label workstations; notify clients of downtime.',
          'T-minus 1 day: patch walls, meter photos, key handover packet.',
        ],
      },
    ],
  },
  {
    slug: 'stadium-mall-retail-relocation-guide',
    cat: 'commercial-guide',
    title: 'Stadium & Mall Retail Relocation Guide',
    excerpt: 'Mall kiosk and stadium retail moves: after-hours loading docks, fixture disassembly, and mall management permits.',
    tags: ['mall', 'retail', 'stadium'],
    readTime: 10,
    overview:
      'Mall moves happen after customer hours—overtime crew rates may apply; permits name insurance certificates.',
    sections: [
      {
        h: 'Mall management checklist',
        ul: [
          'Book freight elevator slot and COI if required.',
          'Disassemble fixtures labeled by bay number.',
          'Dispose packaging off-site—malls forbid dumpster dumping.',
        ],
      },
    ],
  },
  {
    slug: 'penthouse-high-rise-bole-moving-guide',
    cat: 'service-guide',
    title: 'Penthouse & Top-Floor Moves in Bole Towers',
    excerpt: 'High-floor Bole relocations: elevator weight limits, crane alternatives, and wind-sensitive balcony items.',
    tags: ['penthouse', 'high-rise', 'Bole'],
    readTime: 11,
    overview:
      'Top floors stress elevator quotas—some buildings require item-by-item weigh-in or after-hours freight only.',
    sections: [
      {
        h: 'Elevator strategy',
        ul: [
          'Split oversized sofa if cab diagonal is tight.',
          'Schedule crane only when management approves street closure.',
          'Remove balcony planters first—water weight adds risk.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can cranes be used on Sundays?',
        a: 'Only with compound and city approval—plan weeks ahead, not days.',
      },
    ],
  },
  {
    slug: 'dental-clinic-relocation-addis-guide',
    cat: 'commercial-guide',
    title: 'Dental Clinic Relocation in Addis Ababa',
    excerpt: 'Move chairs, sterilizers, and patient files with minimal downtime—utility disconnect order matters.',
    tags: ['dental', 'clinic', 'healthcare'],
    readTime: 11,
    overview:
      'Dental moves need biomedical vendor disconnect, cabinet bolt-down, and sterile packing for instruments.',
    sections: [
      {
        h: 'Clinical sequence',
        ul: [
          'Last patient day → sterilize → pack instruments in sealed cases.',
          'Mark compressed air and suction lines for plumber at new site.',
          'Patient files: encrypted backup before physical move.',
        ],
      },
    ],
  },
  {
    slug: 'veterinary-clinic-moving-addis-guide',
    cat: 'commercial-guide',
    title: 'Veterinary Clinic & Pet Hospital Moves',
    excerpt: 'Relocate kennels, exam tables, and pharmacy cold chain with temperature-aware transport planning.',
    tags: ['veterinary', 'clinic', 'pets'],
    readTime: 10,
    overview:
      'Live animals should not ride in furniture trucks—move pets separately; focus truck on equipment and supplies.',
    sections: [
      {
        h: 'Cold chain and meds',
        ul: [
          'Use cooler boxes for vaccines during transit.',
          'Drain and sanitize kennel banks before load.',
          'Reinstall cages before reopening sign goes up.',
        ],
      },
    ],
  },
  {
    slug: 'architecture-design-studio-move-addis',
    cat: 'commercial-guide',
    title: 'Architecture & Design Studio Relocation',
    excerpt: 'Move plotters, material samples, and model archives without creasing or dust damage.',
    tags: ['architecture', 'design studio', 'office'],
    readTime: 10,
    overview:
      'Studios mix fragile models and heavy paper rolls—vertical tubes and flat files need dedicated padding.',
    sections: [
      {
        h: 'Asset protection',
        ul: [
          'Wrap models in bubble and rigid corners.',
          'Catalog sample boards by project code.',
          'IT: large files synced before disconnecting workstations.',
        ],
      },
    ],
  },
  {
    slug: 'coffee-exporter-office-relocation-guide',
    cat: 'commercial-guide',
    title: 'Coffee Exporter Office Relocation Guide',
    excerpt: 'Move sample rooms, cupping labs, and export documentation with chain-of-custody for sealed samples.',
    tags: ['coffee', 'export', 'office'],
    readTime: 10,
    overview:
      'Sample integrity and export files cannot mix with generic office cartons—separate labeled zones on truck.',
    sections: [
      {
        h: 'Compliance-minded packing',
        ul: [
          'Seal sample bags with batch IDs logged.',
          'Keep export licenses in hand-carried folder.',
          'Clean cupping equipment before pack to avoid mold in transit.',
        ],
      },
    ],
  },
  {
    slug: 'church-parish-hall-equipment-move-guide',
    cat: 'checklist-guide',
    title: 'Church Parish Hall Equipment Moves (Respectful Planning)',
    excerpt: 'Relocate chairs, sound systems, and kitchen gear for parish halls—community volunteers plus professional heavy lift.',
    tags: ['church', 'community', 'equipment'],
    readTime: 9,
    overview:
      'Combine volunteer labor for light boxes with insured movers for pianos, amplifiers, and refrigerator units.',
    sections: [
      {
        h: 'Coordination',
        ul: [
          'Schedule around services—never block worship hours without clergy approval.',
          'Blanket-wrap icons and liturgical items separately from generic cartons.',
          'See <a href="/guides/orthodox-icons-religious-items-moving-guide">religious items guide</a> for icon packing.',
        ],
      },
    ],
  },
  {
    slug: 'university-lab-equipment-moving-addis-guide',
    cat: 'commercial-guide',
    title: 'University Lab Equipment Moves in Addis',
    excerpt: 'Microscopes, centrifuges, and chemical stores: decontaminate, stabilize, and vendor crating where required.',
    tags: ['university', 'lab', 'equipment'],
    readTime: 11,
    overview:
      'Lab moves require department sign-off on hazardous material—nothing flammable or unknown should ride on household trucks.',
    sections: [
      {
        h: 'Safety first',
        ul: [
          'Empty and decontaminate benches per campus EHS rules.',
          'Use original crates for precision instruments when available.',
          'Calibrate after reinstall before teaching semester starts.',
        ],
      },
    ],
  },
  {
    slug: 'generator-backup-power-relocation-villa-guide',
    cat: 'service-guide',
    title: 'Generator & Backup Power Relocation for Villas',
    excerpt: 'Move standby generators and fuel lines only with licensed electricians—weight and tilt limits apply.',
    tags: ['generator', 'villa', 'utilities'],
    readTime: 10,
    overview:
      'Generators are heavy and top-heavy—use forklift or crane paths surveyed in advance; drain fuel before transit.',
    sections: [
      {
        h: 'Technical handoff',
        ul: [
          'Electrician disconnects before movers touch unit.',
          'Secure anti-vibration pads separately labeled.',
          'New pad placement must meet compound noise rules.',
        ],
      },
    ],
  },
  serviceGuide(
    'moving-with-toddlers-addis-guide',
    'Moving with Toddlers in Addis Ababa: Safety & Routine',
    'Keep toddlers safe during Addis moves: caregiver off-site, toy essentials box, and gate safety on moving day.',
    ['toddlers', 'family', 'checklist'],
    'Moving day chaos and open gates are hazardous for toddlers—assign one adult not on loading crew to watch children.',
    [
      {
        h: 'Essentials kit',
        ul: [
          'Snacks, diapers, change clothes, favorite toy in labeled box kept in car.',
          'Confirm new home window locks before explore phase.',
          'Keep medicine out of stacked cartons.',
        ],
      },
      {
        h: 'Timing',
        p: 'Align with nap schedule—start load after morning routine when possible.',
      },
    ]
  ),
  serviceGuide(
    'moving-with-teenagers-addis-guide',
    'Moving with Teenagers: School & Social Transition in Addis',
    'Teen moves across subcities: school transfer timing, friend goodbyes, and letting them pack personal items.',
    ['teenagers', 'family', 'school'],
    'Teens need predictability—share move date early so school and tutor schedules adjust.',
    [
      {
        h: 'Practical steps',
        ul: [
          'Let teens label their own boxes to reduce stress.',
          'Back up school projects before disconnecting home Wi-Fi.',
          'Visit new neighborhood before move day if possible.',
        ],
      },
    ]
  ),
  serviceGuide(
    'wheelchair-accessible-moving-addis-guide',
    'Wheelchair-Accessible Moving in Addis Ababa',
    'Plan moves around mobility equipment: ramp paths, elevator dimensions, and hospital bed disassembly.',
    ['accessibility', 'wheelchair', 'health'],
    'Measure ramps and door widths at both homes—power wheelchairs may not fit older elevator cabs.',
    [
      {
        h: 'Equipment priority',
        ul: [
          'Load wheelchair last / unload first at destination.',
          'Hospital beds need tool-labeled hardware bags taped to frame.',
          'Coordinate with <a href="/guides/moving-with-elders-mamoch-baboch-addis-guide">elders move guide</a> if multi-generational.',
        ],
      },
    ]
  ),
  {
    slug: 'pool-table-game-room-moving-addis-guide',
    cat: 'service-guide',
    title: 'Pool Table & Game Room Heavy Item Moves',
    excerpt: 'Slate pool tables need professional disassembly—never tilt uncapped legs on Addis cobblestones.',
    tags: ['pool table', 'heavy items', 'game room'],
    readTime: 10,
    overview:
      'Slate is brittle—use experienced riggers; felt and pockets bagged separately with labeled rails.',
    sections: [
      {
        h: 'Disassembly rules',
        ul: [
          'Mark slate pieces positionally (A/B/C).',
          'Move coin-op mechanisms in locked cash box separately.',
          'Level and re-felt at destination by specialist if required.',
        ],
      },
    ],
  },
  {
    slug: 'home-gym-garage-equipment-move-guide',
    cat: 'service-guide',
    title: 'Home Gym & Garage Fitness Equipment Moves',
    excerpt: 'Treadmills, racks, and rubber flooring: disassembly, bolt bags, and floor protection in villas.',
    tags: ['home gym', 'fitness', 'heavy items'],
    readTime: 10,
    overview:
      'Rubber flooring rolls are heavy and sticky—roll with core tubes; treadmill decks need locking pins.',
    sections: [
      {
        h: 'Machine prep',
        ul: [
          'Owner manuals for pin locations—or photos before disassembly.',
          'Remove weight plates into labeled bins, not loose on truck.',
          'See also <a href="/guides/gym-fitness-center-equipment-move-addis">commercial gym guide</a> for scale differences.',
        ],
      },
    ],
  },
  {
    slug: 'airbnb-furnished-rental-turnover-move-guide',
    cat: 'checklist-guide',
    title: 'Airbnb & Furnished Rental Turnover Moves',
    excerpt: 'Swap furniture between short-term rentals: inventory photos, linen separation, and fast reset timelines.',
    tags: ['Airbnb', 'furnished rental', 'turnover'],
    readTime: 9,
    overview:
      'Turnover moves are time-boxed—pre-label cartons by unit ID so cleaners and movers do not cross streams.',
    sections: [
      {
        h: 'Inventory discipline',
        ul: [
          'Photo each room before and after for platform disputes.',
          'Keep master key set with supervisor, not on truck.',
          'Linens in sealed bags labeled clean vs laundry.',
        ],
      },
    ],
  },
  {
    slug: 'hotel-ff-e-furniture-installation-move-guide',
    cat: 'commercial-guide',
    title: 'Hotel FF&E Moves & Furniture Installation',
    excerpt: 'Hotels relocating furniture, fixtures, and equipment: room-type batching and off-hours loading.',
    tags: ['hotel', 'FF&E', 'commercial'],
    readTime: 11,
    overview:
      'Batch by floor and room type; mattress stacks need plastic covers; minibars drained and defrosted.',
    sections: [
      {
        h: 'Guest impact',
        ul: [
          'Work floor-by-floor with noise curtains.',
          'Coordinate with <a href="/guides/hotel-serviced-apartment-bole-move-guide">serviced apartment guide</a> for overlap rules.',
          'Tag headboards with room numbers.',
        ],
      },
    ],
  },
  {
    slug: 'fire-flood-damage-recovery-move-addis',
    cat: 'service-guide',
    title: 'Fire & Water Damage Recovery Moves in Addis',
    excerpt:
      'Relocate salvageable items after fire or flood: document for insurance, dry textiles, discard compromised goods.',
    tags: ['recovery', 'insurance', 'emergency'],
    readTime: 10,
    overview:
      'Salvage moves need photo inventory before pack—insurers may require item lists per room.',
    sections: [
      {
        h: 'Salvage sorting',
        ul: [
          'Separate total loss from restorable before truck load.',
          'Do not pack moldy textiles—health risk and claim denial.',
          'Keep policy number in supervisor phone notes.',
        ],
      },
    ],
  },
  {
    slug: 'insurance-documented-move-claim-guide',
    cat: 'pricing-guide',
    title: 'Insurance-Documented Moves & Claim-Ready Inventory',
    excerpt: 'Declared value, photos, and serial numbers before truck seal—supports household and office claims.',
    tags: ['insurance', 'inventory', 'claims'],
    readTime: 9,
    overview:
      'Pair with <a href="/guides/moving-insurance-declared-value-ethiopia-guide">declared value guide</a>—same-day photo sweep beats memory after loss.',
    sections: [
      {
        h: 'Claim-ready habits',
        ul: [
          'Video walkthrough of high-value rooms before wrap.',
          'Serial numbers for electronics in shared spreadsheet.',
          'Signed load list at origin and destination.',
        ],
      },
    ],
  },
  {
    slug: 'color-coded-box-labeling-system-guide',
    cat: 'checklist-guide',
    title: 'Color-Coded Box Labeling System for Big Moves',
    excerpt: 'Room-color tape and numbered zones speed unpack in condos—crew and family read the same system.',
    tags: ['labeling', 'packing', 'checklist'],
    readTime: 8,
    overview:
      'Assign one color per room; add numbers for load order (kitchen 1–10 first out).',
    sections: [
      {
        h: 'System setup',
        ul: [
          'Print legend taped on fridge and crew lead clipboard.',
          'FRAGILE in red regardless of room color.',
          'Destination room at new home, not old—avoid relabel fatigue.',
        ],
      },
    ],
  },
  {
    slug: 'digital-inventory-spreadsheet-large-home-guide',
    cat: 'checklist-guide',
    title: 'Digital Inventory Spreadsheets for Large Homes',
    excerpt: 'Track hundreds of cartons with QR or numbered rows—essential for villas and multi-floor offices.',
    tags: ['inventory', 'spreadsheet', 'villa'],
    readTime: 9,
    overview:
      'Spreadsheet columns: room, contents summary, fragile Y/N, destination room, status loaded/unloaded.',
    sections: [
      {
        h: 'Scale tips',
        ul: [
          'One row per box, not per item, unless high value.',
          'Supervisor marks unloaded at destination against same sheet.',
          'Share read-only link with family abroad for diaspora moves.',
        ],
      },
    ],
  },
  {
    slug: 'balcony-garden-plant-moving-addis-guide',
    cat: 'checklist-guide',
    title: 'Balcony Garden & Plant Moves in Addis',
    excerpt: 'Move potted plants without soil spills: trim, dry pots, and elevator drip protection.',
    tags: ['plants', 'balcony', 'packing'],
    readTime: 8,
    overview:
      'Water-soaked soil doubles weight—dry out pots two days before; wrap pots in plastic and breathable outer layer.',
    sections: [
      {
        h: 'Plant care in transit',
        ul: [
          'Transport tender plants in cabin of car, not hot truck if possible.',
          'Label poison plants for crew safety.',
          'Re-pot shock: prioritize shade at new balcony first week.',
        ],
      },
    ],
  },
  {
    slug: 'rooftop-terrace-furniture-move-guide',
    cat: 'service-guide',
    title: 'Rooftop Terrace Furniture Moves',
    excerpt: 'Hoist or stair-carry outdoor sets from rooftops—wind and railing gaps need tie-down planning.',
    tags: ['rooftop', 'terrace', 'furniture'],
    readTime: 10,
    overview:
      'Rooftop access may be exterior stair only—measure corner landings before promising crane-free move.',
    sections: [
      {
        h: 'Safety',
        ul: [
          'Use harness policy where management requires for exterior stairs.',
          'Disassemble umbrellas and heavy bases.',
          'See <a href="/guides/crane-balcony-furniture-delivery-addis-guide">crane/balcony guide</a> for hoist options.',
        ],
      },
    ],
  },
  serviceGuide(
    'moving-during-exam-season-students-addis-guide',
    'Moving During Exam Season for Students in Addis',
    'Avoid move chaos during national exams: quiet hours, book storage, and minimal desk disruption.',
    ['students', 'exams', 'Sidist Kilo'],
    'Exam weeks need quiet—schedule truck away from study rooms or move to storage first.',
    [
      {
        h: 'Study-first plan',
        ul: [
          'Pack non-essential books early; keep one exam reference box accessible.',
          'Use <a href="/guides/sidist-kilo-student-moving-guide">Sidist Kilo student guide</a> for campus area tips.',
          'Storage leg if lease ends before results week.',
        ],
      },
    ]
  ),
  areaGuide(
    'aseb-gebeya-moving-guide-addis',
    'Aseb Gebeya Moving Guide: Market Edge & Walk-Ups',
    'Aseb Gebeya relocations near Addis Ketema trade: cart shuttles, theft-aware essentials handling, morning slots.',
    ['Aseb Gebeya', 'Addis Ketema', 'market'],
    'High foot traffic means keep wallets and phones on person—not on open truck tailgate.',
    [
      'Two-person watch rotation during load/unload.',
      'Seal boxes before street exposure.',
      'Coordinate with shopkeepers if truck blocks stall front briefly.',
    ]
  ),
  areaGuide(
    'kality-freight-district-resident-move-guide',
    'Kality Freight District Adjacent Residential Moves',
    'Living near Kality freight zones: truck noise windows, heavy vehicle coexistence, and port road dust.',
    ['Kality', 'freight', 'residential'],
    'Freight corridors add dust—wrap upholstery even for short carries; see <a href="/guides/warehouse-kality-port-migration-guide">warehouse port guide</a> for commercial overlap.',
    [
      'Confirm residential gate vs industrial gate on maps.',
      'Early morning load before port peak trucks.',
      'Rinse patio furniture after move day.',
    ]
  ),
  areaGuide(
    'bambis-crossroads-moving-guide',
    'Bambis Crossroads Moving Guide: Connector Traffic',
    'Moves around Bambis junction: choose approach road by time-of-day and avoid blocking minibus stops.',
    ['Bambis', 'crossroads', 'traffic'],
    'Minibus stops and retail fronts limit staging—survey picks primary and backup pull-over points.',
    [
      'Traffic police notice if double-lane block unavoidable.',
      'Use hand cart for last 50m when truck cannot turn.',
      'Link <a href="/guides/shola-megenagna-corridor-moving-guide">Shola–Megenagna corridor</a> for regional routing.',
    ]
  ),
  serviceGuide(
    'gotera-to-kality-corridor-move-planning',
    'Gotera to Kality Corridor Move Planning',
    'Single truck linking Gotera and Kality legs: multi-stop order, traffic under pass, and time buffers.',
    ['Gotera', 'Kality', 'multi-stop'],
    'Multi-stop within one day needs ordered loading—last stop items load first.',
    [
      {
        h: 'Stop sequencing',
        ul: [
          'Write stop order on crew lead sheet.',
          'Gotera interchange delays—pad 30 minutes between stops.',
          'See <a href="/guides/gotera-interchange-moving-guide">Gotera interchange guide</a>.',
        ],
      },
    ]
  ),
  {
    slug: 'spa-salon-beauty-relocation-addis-guide',
    cat: 'commercial-guide',
    title: 'Spa & Beauty Salon Relocation in Addis',
    excerpt: 'Move stations, back-bar chemicals, and washing sinks with licensed plumbing disconnect.',
    tags: ['spa', 'salon', 'beauty'],
    readTime: 10,
    overview:
      'Salon chemicals must be sealed and labeled—no loose pumps in generic cartons; mirrors crated vertically.',
    sections: [
      {
        h: 'Salon-specific',
        ul: [
          'Cap all color and treatment bottles; bag in secondary liner.',
          'Schedule client SMS before downtime dates.',
          'Reinstall mirrors before reopening booking links.',
        ],
      },
    ],
  },
  {
    slug: 'accounting-firm-server-room-move-addis',
    cat: 'commercial-guide',
    title: 'Accounting Firm & Server Room Moves',
    excerpt: 'Move racks, UPS units, and sealed file rooms with IT vendor lead and after-hours power-down.',
    tags: ['accounting', 'server', 'office'],
    readTime: 11,
    overview:
      'Server moves are IT-led; movers handle rack physical transport after proper shutdown and cable labeling.',
    sections: [
      {
        h: 'IT coordination',
        ul: [
          'Color-code cables before disconnect.',
          'UPS batteries may need separate hazmat handling.',
          'Tax season blackout dates—never move servers mid-filing without DR plan.',
        ],
      },
    ],
  },
  {
    slug: 'embassy-staff-housing-rotation-move-guide',
    cat: 'service-guide',
    title: 'Embassy Staff Housing Rotation Moves',
    excerpt: 'Diplomatic housing rotations: inventory for reimbursement, GSO timelines, and sealed personal effects.',
    tags: ['embassy', 'diplomatic', 'rotation'],
    readTime: 11,
    overview:
      'Embassy moves often require itemized inventory for allowance claims—match list to packed cartons.',
    sections: [
      {
        h: 'GSO alignment',
        ul: [
          'Confirm weight/volume limits before survey.',
          'Personal effects vs government property labeled separately.',
          'See <a href="/guides/embassy-diplomatic-relocation-addis-guide">embassy relocation guide</a>.',
        ],
      },
    ],
  },
  {
    slug: 'real-estate-show-home-staging-move-guide',
    cat: 'commercial-guide',
    title: 'Real Estate Show Home & Staging Moves',
    excerpt: 'Move staging furniture between listings: style tags, quick reset, and scratch-free wood floors.',
    tags: ['staging', 'real estate', 'furniture'],
    readTime: 9,
    overview:
      'Staging pieces rotate frequently—pad corners extra; photograph condition at each listing for agency billing.',
    sections: [
      {
        h: 'Agency workflow',
        ul: [
          'Tag pieces by collection ID.',
          'Use floor protection mandatory in luxury listings.',
          'Unload in reverse of room reveal priority.',
        ],
      },
    ],
  },
  {
    slug: 'construction-site-portacabin-office-move-guide',
    cat: 'commercial-guide',
    title: 'Construction Site Portacabin Office Moves',
    excerpt: 'Relocate site offices and tool containers: crane pick, permit paths, and dust sealing of IT.',
    tags: ['construction', 'portacabin', 'site office'],
    readTime: 10,
    overview:
      'Portacabins may need crane or forklift—survey ground slope and overhead wires before booking.',
    sections: [
      {
        h: 'Site safety',
        ul: [
          'Hard hats on site during load.',
          'Seal IT from construction dust with shrink wrap.',
          'Verify access road after rain—mud traps heavy trucks.',
        ],
      },
    ],
  },
  {
    slug: 'night-shift-restaurant-equipment-move-guide',
    cat: 'commercial-guide',
    title: 'Night-Shift Restaurant Equipment Moves',
    excerpt: 'After-close kitchen moves: grease trap coordination, hood disassembly, and health inspection timing.',
    tags: ['restaurant', 'night shift', 'kitchen'],
    readTime: 11,
    overview:
      'Night moves protect revenue—still need hood and gas licensed disconnect; see <a href="/guides/restaurant-kitchen-relocation-addis-guide">restaurant kitchen guide</a>.',
    sections: [
      {
        h: 'Close-to-open window',
        ul: [
          'Start after last service; target hood reinstall before health visit.',
          'Keep walk-in cooler running on temp log if possible.',
          'Grease on floors—slip mats for crew.',
        ],
      },
    ],
  },
  {
    slug: 'data-center-lite-rack-move-addis-guide',
    cat: 'commercial-guide',
    title: 'Small Data Center & Server Rack Moves',
    excerpt: 'BPO and bank branch server racks: anti-static, elevator weight, and bonded courier for drives if required.',
    tags: ['data center', 'server rack', 'BPO'],
    readTime: 11,
    overview:
      'Align with <a href="/guides/bpo-call-center-office-relocation-addis-guide">BPO relocation guide</a>—rack moves happen in maintenance windows only.',
    sections: [
      {
        h: 'Window planning',
        ul: [
          'Maintenance window signed by client IT head.',
          'Backup verified before wheels roll.',
          'Elevator weight certificate if building requires.',
        ],
      },
    ],
  },
  {
    slug: 'moving-sculpture-public-art-installation-guide',
    cat: 'service-guide',
    title: 'Sculpture & Public Art Installation Moves',
    excerpt: 'Crated art and monuments: vibration control, insurance riders, and municipal permit for street placement.',
    tags: ['sculpture', 'art', 'installation'],
    readTime: 10,
    overview:
      'Custom crating beats blankets for stone and bronze—use art handlers for pieces above household insurance limits.',
    sections: [
      {
        h: 'Handling',
        ul: [
          'Vibration monitors on fragile stone if road rough.',
          'Municipal permits for crane on boulevard.',
          'Climate: avoid sudden rain on porous stone without cover.',
        ],
      },
    ],
  },
  {
    slug: 'moving-with-nanny-live-in-staff-quarters-guide',
    cat: 'checklist-guide',
    title: 'Moving with Nanny or Live-In Staff Quarters',
    excerpt: 'Relocate employer-provided quarters: separate personal effects, clear contracts, and privacy-conscious packing.',
    tags: ['staff quarters', 'household', 'employer'],
    readTime: 9,
    overview:
      'Staff rooms packed with dignity—separate cartons labeled for personal items vs employer-provided furniture lists.',
    sections: [
      {
        h: 'Household HR',
        ul: [
          'Agree inventory of employer-owned vs personal before truck.',
          'Provide advance notice of new quarters layout.',
          'Keep passports and documents in personal hand carry.',
        ],
      },
    ],
  },
  {
    slug: 'compound-wall-gate-automation-relocation-guide',
    cat: 'service-guide',
    title: 'Compound Gate & Automation Relocation',
    excerpt: 'Move sliding gates, motors, and intercom posts with electrician disconnect—heavy steel needs rigging.',
    tags: ['gate', 'automation', 'villa'],
    readTime: 10,
    overview:
      'Gate panels bend if lifted wrong—use spreader bars; remotes and codes reprogrammed after reinstall.',
    sections: [
      {
        h: 'Sequence',
        ul: [
          'Electrician isolates power; movers handle steel.',
          'Bag screws by panel ID.',
          'Test safety reverse sensor before first vehicle entry.',
        ],
      },
    ],
  },
  {
    slug: 'moving-home-recording-studio-addis-guide',
    cat: 'service-guide',
    title: 'Home Recording Studio Moves in Addis',
    excerpt: 'Microphones, interfaces, and acoustic panels: anti-static packing and room-by-room cable maps.',
    tags: ['recording studio', 'audio', 'home office'],
    readTime: 10,
    overview:
      'Acoustic foam is fragile—flat pack or bag; keep preamp and interface in padded cases with desiccant.',
    sections: [
      {
        h: 'Studio reset',
        ul: [
          'Photo cable routing before disconnect.',
          'Avoid stacking monitors face-down.',
          'Quiet move day helps neighbor relations in apartments.',
        ],
      },
    ],
  },
  {
    slug: 'moving-craft-brewery-taproom-equipment-guide',
    cat: 'commercial-guide',
    title: 'Craft Brewery & Taproom Equipment Moves',
    excerpt: 'Kegs, taps, and glycol lines: food-grade cleaning, CO2 safety, and heavy keg dollies.',
    tags: ['brewery', 'taproom', 'commercial'],
    readTime: 11,
    overview:
      'Never move pressurized tanks without vendor depressurization—weight and hazard class require specialists.',
    sections: [
      {
        h: 'Safety',
        ul: [
          'Depressurize and purge lines.',
          'Kegs chained on truck to prevent roll.',
          'Health inspector timing for reopen.',
        ],
      },
    ],
  },
  {
    slug: 'moving-addis-ababa-to-harar-guide',
    cat: 'service-guide',
    title: 'Moving from Addis Ababa to Harar: Eastern Heritage City Guide',
    excerpt: 'Addis to Harar long-distance: walled-city access limits, cultural site proximity, and overnight legs.',
    tags: ['Harar', 'long distance', 'eastern Ethiopia'],
    readTime: 10,
    overview:
      'Harar old town lanes may require final shuttle from staging yard—declare narrow access at survey.',
    sections: [
      {
        h: 'Cultural city logistics',
        ul: [
          'Respect local norms for move timing near holy sites.',
          'Protect wood furniture from dry eastern heat with covers.',
          'Keep family essentials out of sealed truck for first night.',
        ],
      },
    ],
  },
  {
    slug: 'moving-addis-ababa-to-mekelle-guide',
    cat: 'service-guide',
    title: 'Moving from Addis Ababa to Mekelle: Northern City Relocation Guide',
    excerpt:
      'Inter-city relocation to Mekelle: long northern route, elevation changes, and compound handoffs.',
    tags: ['Mekelle', 'long distance', 'Tigray'],
    readTime: 10,
    overview:
      'Mekelle moves require realistic multi-day planning for full villas—crew rest and secure parking overnight.',
    sections: [
      {
        h: 'Route planning',
        ul: [
          'Confirm current route advisories with dispatch before date lock.',
          'Insurance photos before departure from Addis.',
          'Destination compound clearance before truck arrives.',
        ],
      },
    ],
  },
]

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
  console.error('Duplicate slugs in batch', slugs.size, TARGET)
  process.exit(1)
}

for (const g of GUIDES) {
  if (existing.has(g.slug)) {
    console.error('Slug already exists:', g.slug)
    process.exit(1)
  }
}

const baseDate = new Date('2026-09-25T08:00:00.000Z')
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
    readTime: g.readTime || 10,
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
