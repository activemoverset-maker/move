/**
 * Unique body copy for indexed secondary guides (no bulk “Professional planning” block).
 * Usage: node scripts/patch-curated-indexed-secondary-batch2.mjs
 */
import fs from 'fs'
import path from 'path'

const GUIDE_DIR = path.join(process.cwd(), 'data', 'guides')

const files = {
  'packaging-service-addis-materials-guide': `<h2>What professional packing includes</h2>
<p>Active Movers <a href="/services/packaging">packaging service</a> separates <strong>materials</strong> from <strong>labor</strong> on your quote so you know what you are paying for. Full-home pack is common before long legs to Bishoftu, Adama, or Hawassa; partial pack (kitchen + fragile only) suits renters leaving a furnished condo.</p>

<h2>Materials we use on Addis streets</h2>
<ul>
<li><strong>Moving blankets</strong> — quilted wraps on sofas, tables, and headboards for cobblestone shock.</li>
<li><strong>Stretch wrap</strong> — secures drawers and keeps blanket bundles tight in the truck.</li>
<li><strong>Dish packs &amp; cell dividers</strong> — for glass, ceramics, and small appliances.</li>
<li><strong>Wardrobe boxes</strong> — hang clothes without re-folding; popular for Kazanchis and Bole professionals.</li>
<li><strong>Double-walled cartons</strong> — for books and electronics when original OEM boxes are missing.</li>
</ul>

<h2>Owner-packed vs mover-packed risk</h2>
<p>When you pack fragile items yourself, damage claims are harder to document. Mover-packed cartons are labeled, photographed at load, and tied to crew accountability—see <a href="/guides/fragile-packing-electronics-addis-cobblestone-guide">fragile electronics guide</a>. If you mix owner and pro pack, mark each box clearly on the inventory.</p>

<h2>Partial pack scenarios</h2>
<p>Kitchen-only packs before <a href="/guides/move-out-handover-checklist-addis-renters">move-out handover</a> save time on cleaning day. Office file packs use numbered cartons matched to desk plans—pair with <a href="/guides/office-relocation-minimal-downtime-checklist">office downtime checklist</a>.</p>

<h2>Pricing and booking</h2>
<p>Packing hours stack on top of baseline move tiers on the <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 cost guide</a> and <a href="/#pricing">homepage pricing</a>. Survey captures room count, fragile density, and whether management requires floor protection in lifts.</p>

<h2>Book packing with your move</h2>
<p><a href="/booking">Request quote</a> · <a href="tel:+251982260000">+251982260000</a> · <a href="/services/local-moving">Local moving</a></p>`,

  'move-out-handover-checklist-addis-renters': `<h2>Protect your deposit</h2>
<p>In Addis Ababa’s tight rental market, move-out disputes often come down to <strong>condition at handover</strong>—not whether you hired movers. Coordinate cleaning, truck timing, and the final walk-through in one plan.</p>

<h2>Two weeks before</h2>
<ul>
<li>Notify landlord or management of move-out date and key return process.</li>
<li>Photograph walls, fixtures, and meters with timestamps.</li>
<li>Schedule movers for the day <strong>before</strong> handover when possible—empty rooms photograph cleaner.</li>
<li>Confirm whether you must repaint or only patch nail holes per your lease.</li>
</ul>

<h2>Move day</h2>
<ul>
<li>Strip hooks, fill small nail holes if required by lease.</li>
<li>Remove all items from storage rooms and balconies.</li>
<li>Defrost fridge; run final trash down before truck leaves.</li>
<li>Keep one “handover kit”: keys, remote controls, spare bulbs, receipts.</li>
</ul>

<h2>After movers leave</h2>
<p>Professional cleaning (move-out standard) is often cheaper than deposit deductions. Some clients book movers plus third-party cleaners—we can advise timing so the unit is walk-through ready the morning keys are due.</p>

<h2>Condo compounds</h2>
<p>Management may inspect common-area damage from lifts—confirm elevator padding rules matched what you used on move day. Lift deposits should be refunded when photos show no new scratches—see <a href="/guides/condo-high-rise-moving-checklist-addis-ababa">condo checklist</a>.</p>

<h2>Meters and utilities</h2>
<p>Read water and electric meters after the last appliance leaves; send photos to the landlord the same day. Align Ethio telecom or fiber transfer with your move date so you are not billed for the next tenant’s usage.</p>

<h2>Month-end overlap</h2>
<p>Handover on the 30th collides with <a href="/guides/end-of-month-moving-rush-addis-guide">elevator rush</a>—book truck and lift before you promise the landlord an exact hour.</p>

<h2>Book move-out support</h2>
<p><a href="/booking">Schedule movers</a> · <a href="/guides/condo-high-rise-moving-checklist-addis-ababa">Condo move-in/out rules</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'holiday-moving-calendar-addis-ababa-timket-meskel': `<h2>Why holidays change your move</h2>
<p>Major Orthodox festivals bring <strong>processions, road closures, and crowd control</strong> across Addis Ababa. Moving trucks cannot assume normal routes near celebration sites. Book professional movers <strong>before</strong> holiday weeks—not on the eve of Ketera or Demera.</p>

<h2>Timket (Ethiopian Epiphany)</h2>
<p>Timket and <strong>Ketera</strong> (the eve) draw huge crowds to sites such as <strong>Jan Meda</strong>, Tirunesh Beijing (Akaki Kaliti), Lemi Kura Arabsa areas, and Hachalu Hundessa Square. Police routinely close approach roads for the duration of festivities—planning alternate routes or rescheduling load-out is often mandatory.</p>

<h2>Meskel (Finding of the True Cross)</h2>
<p>The <strong>Demera</strong> bonfire at <strong>Meskel Square</strong> triggers closures on radiating streets (Bole to Meskel, Mexico area, Ras Hotel corridor, and others) often from mid-morning until programs end. Avoid scheduling cross-city truck legs through central squares that day.</p>

<h2>Other busy dates</h2>
<p>National holidays, Eid, and large concerts can surprise routes even outside Timket/Meskel. Check city notices the week of your move and share updates with your crew lead—<a href="/guides/moving-truck-timing-freight-rules-addis-ababa">freight timing guide</a>.</p>

<h2>Practical planning</h2>
<ul>
<li>Confirm closure notices from city police the week of your move.</li>
<li>Prefer early-morning loads on non-festival days when freight rules and traffic align.</li>
<li>Build buffer for condo lift slots—management may blackout holiday dates.</li>
<li>Keep a backup day in your lease negotiation when festivals move on the lunar calendar.</li>
</ul>

<h2>Reschedule without penalty</h2>
<p>When public events block a route, Active Movers reschedules with written confirmation—better than idling a truck in a closed corridor. Mention festival risk when you <a href="/booking">book</a>.</p>

<h2>Related</h2>
<p><a href="/guides/end-of-month-moving-rush-addis-guide">End-of-month rush</a> · <a href="/blog">Seasonal tips</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'office-relocation-minimal-downtime-checklist': `<h2>Runbook owner</h2>
<p>Assign one person from IT and one from operations to own the move weekend. Movers follow numbered desk labels and floor plans—see <a href="/services/office-relocation">office relocation</a> and <a href="/guides/office-relocation-kazanchis-guide">Kazanchis office guide</a>.</p>

<h2>48 hours before</h2>
<ul>
<li>Forward phones and update auto-replies with new address if needed.</li>
<li>Print seating chart with desk numbers matching carton labels.</li>
<li>Backup servers; photograph patch panels before disconnect.</li>
<li>Notify both buildings of freight elevator reservations and after-hours access.</li>
</ul>

<h2>Move weekend sequence</h2>
<ul>
<li>Load in reverse unpack order—IT room last in at origin, first out at destination.</li>
<li>Keep one “Monday box” per department with cables, keyboards, and snacks.</li>
<li>Test internet and access control before announcing staff return.</li>
<li>Walk leadership through reception and fire exits before Monday traffic.</li>
</ul>

<h2>Downtime cost in the quote</h2>
<p>Office floors often start from <strong>45,000 ETB</strong> after survey on the <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 cost guide</a>. After-hours freight and IT escorts belong as line items—not day-of surprises. BPO and call-center floors: <a href="/guides/bpo-call-center-office-relocation-addis-guide">BPO guide</a> · <a href="/guides/ngo-office-relocation-addis-guide">NGO guide</a>.</p>

<h2>What movers do not move</h2>
<p>Shred confidential paper on site; carry laptops and tokens personally. Confirm insurance for server racks and copiers in the written scope.</p>

<h2>Book office move</h2>
<p><a href="/booking">Survey request</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'moving-addis-ababa-to-bishoftu-sululta-guide': `<h2>Greater Addis moves</h2>
<p>Many families and businesses treat <strong>Bishoftu</strong> (lakeside, industrial growth) and <strong>Sululta</strong> (northern suburban corridor) as part of their relocation map—not a different country, but not a same-day Bole-to-Bole hop either. Active Movers plans these as <strong>distance moves</strong> with clear crew and travel time in the quote.</p>

<h2>Typical distances</h2>
<ul>
<li><strong>Bishoftu</strong> — often cited around 45–50 km southeast of central Addis, depending on origin.</li>
<li><strong>Sululta</strong> — roughly 25–35 km north; exact time varies by sub-city start point and traffic.</li>
</ul>

<h2>What changes the price</h2>
<p>Expect pricing to reflect road time, toll on crew hours, and access at both ends—not only bedroom count. Villa and compound moves, office equipment, and full packing add volume. Industry practice often adds roughly <strong>15–25%</strong> over an equivalent in-city move for comparable homes, but your survey is the source of truth.</p>

<h2>Direction matters</h2>
<p>Southeast loads toward Bishoftu often leave via different outbound choke points than northern Sululta legs. Quote should show <strong>load hours in Addis</strong>, <strong>transit</strong>, and <strong>unload at destination</strong> separately—see <a href="/guides/long-distance-moving-ethiopia-cities-guide">long-distance overview</a>.</p>

<h2>Planning tips</h2>
<ul>
<li>Confirm truck can reach your destination compound—some phases use temporary access roads.</li>
<li>Align Addis load-out with Bishoftu/Sululta reception hours and building rules.</li>
<li>Label boxes by room; one truck load beats multiple shuttles when distance is involved.</li>
<li>Protect upholstery for highway vibration—<a href="/guides/packaging-service-addis-materials-guide">packing materials</a>.</li>
</ul>

<h2>Compare other legs</h2>
<p><a href="/guides/moving-addis-ababa-to-adama-guide">Adama (Nazret)</a> is farther southeast; <a href="/guides/moving-addis-ababa-to-hawassa-guide">Hawassa</a> is a full inter-city job. Pick the guide that matches your destination.</p>

<h2>Book a long leg</h2>
<p><a href="/services/local-moving">Local &amp; regional moving</a> · <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 pricing guide</a> · <a href="/booking">Free quote</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'moving-addis-ababa-to-adama-guide': `<h2>Addis to Adama (Nazret)</h2>
<p>Adama is one of the most common inter-city legs from Addis for families and factories (~100 km). Price reflects fuel, crew hours on road, and access at both origin condo and destination compound—not bedroom count alone.</p>

<h2>Route and timing</h2>
<ul>
<li>Leave Addis early to clear outbound congestion toward the Bishoftu–Adama corridor.</li>
<li>Confirm destination gate hours—some industrial sites accept trucks only mornings.</li>
<li>Rainy season can slow highway legs; build buffer for handover same day.</li>
<li>Avoid festival road closures near central Addis on load day—<a href="/guides/holiday-moving-calendar-addis-ababa-timket-meskel">holiday calendar</a>.</li>
</ul>

<h2>Quote structure</h2>
<p>Written quotes should list Addis load, highway transit, and Adama unload separately. Ask whether overnight hold is included if you cannot receive goods the same evening.</p>

<h2>Packing for highway transit</h2>
<p>Use blankets and stretch wrap on upholstered items; secure loads against shifting on longer drives than cross-town hops—<a href="/guides/fragile-packing-electronics-addis-cobblestone-guide">fragile packing</a> · <a href="/guides/packaging-service-addis-materials-guide">materials guide</a>.</p>

<h2>Industrial vs residential</h2>
<p>Factory relocations may need crane or pallet gear not used on apartment moves—declare equipment at survey. Residential compounds still require truck plate registration before gate entry.</p>

<h2>Pricing drivers</h2>
<p>Compare to <a href="/guides/moving-addis-ababa-to-bishoftu-sululta-guide">Bishoftu/Sululta guide</a>—Adama is farther; single consolidated truck beats partial shuttles.</p>

<h2>Book Adama leg</h2>
<p><a href="/booking">Quote</a> · <a href="/guides/long-distance-moving-ethiopia-cities-guide">All Ethiopia cities</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'moving-addis-ababa-to-hawassa-guide': `<h2>Hawassa is true long distance</h2>
<p>Hawassa moves from Addis are multi-hour southern routes—not suburban Bishoftu legs. Survey must capture volume for correct truck class and whether you need overnight transit or split loads.</p>

<h2>When to start planning</h2>
<p>Book at least <strong>2–3 weeks ahead</strong> for large homes; confirm Hawassa-side access and unloading point (street width, stairs, compound rules). Holiday traffic in Addis on load day still matters—<a href="/guides/holiday-moving-calendar-addis-ababa-timket-meskel">festival calendar</a>.</p>

<h2>Inventory discipline</h2>
<ul>
<li>Room-by-room list with fragile flag for electronics and glass.</li>
<li>Separate personal documents and jewelry for hand carry—not truck.</li>
<li>Label boxes by room to speed Hawassa unload when crew is on clock.</li>
<li>Photograph high-value items at load for insurance alignment.</li>
</ul>

<h2>Transit options</h2>
<p>Same-day unload is ideal when keys and labor align; otherwise confirm overnight secure hold in the quote. Crew rest and fuel are part of long legs—avoid brokers who quote “highway only” without unload hours.</p>

<h2>Packing and climate</h2>
<p>Long southern routes mean more vibration—double-box TVs and glass. Full pack services: <a href="/guides/packaging-service-addis-materials-guide">materials guide</a>.</p>

<h2>Related routes</h2>
<p><a href="/guides/moving-addis-ababa-to-adama-guide">Adama</a> · <a href="/guides/moving-addis-ababa-to-bishoftu-sululta-guide">Bishoftu/Sululta</a> · <a href="/guides/long-distance-moving-ethiopia-cities-guide">Ethiopia cities overview</a></p>

<h2>Book Hawassa move</h2>
<p><a href="/booking">Survey</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'fragile-packing-electronics-addis-cobblestone-guide': `<h2>Why Addis streets matter</h2>
<p>Cobblestone, speed bumps, and tight compound turns shock poorly packed screens. Original OEM boxes are best; otherwise use double-walled cartons and marked <strong>FRAGILE</strong> faces visible from the truck door.</p>

<h2>Loading orientation</h2>
<ul>
<li>Keep TVs and monitors upright; never lay unboxed panels flat under weight.</li>
<li>Secure PCs with internal padding; remove loose hard drives if advised by IT.</li>
<li>Wrap glass table tops vertically with edge guards.</li>
<li>Fill void space in cartons so items cannot slide on turns.</li>
</ul>

<h2>Climate and dust</h2>
<p>Electronics left on loading docks attract dust—seal boxes with tape and load electronics after soft goods when possible. Avoid storing heat-sensitive gear in closed trucks mid-day without ventilation.</p>

<h2>Professional materials</h2>
<p>Our <a href="/services/packaging">packaging crew</a> uses dish packs, bubble, and corner protectors—details on <a href="/guides/packaging-service-addis-materials-guide">materials guide</a>. Owner-packed fragile boxes should be noted on inventory before sign-off.</p>

<h2>Claims and documentation</h2>
<p>Photograph serial numbers at load; note existing scratches on monitors. Written scope should state whether electronics are included in declared move value.</p>

<h2>Condo lifts</h2>
<p>Pad lift walls when moving large TV cartons—management fines for scratches are separate from mover damage claims. See <a href="/guides/condo-high-rise-moving-checklist-addis-ababa">condo checklist</a>.</p>

<h2>Book fragile pack</h2>
<p><a href="/booking">Quote with packing</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'long-distance-moving-ethiopia-cities-guide': `<h2>Inter-city moves from Addis</h2>
<p>Moving from Addis Ababa to <strong>Hawassa</strong>, <strong>Adama</strong>, <strong>Bahir Dar</strong>, <strong>Dire Dawa</strong>, or other regional cities is priced on <strong>distance, truck class, crew days, and access</strong>—not the same formula as a Bole-to-Jemo local job.</p>

<h2>How quotes are built</h2>
<ul>
<li><strong>Origin load</strong> — stairs, lift, packing hours in Addis.</li>
<li><strong>Transit</strong> — fuel, driver time, possible overnight hold.</li>
<li><strong>Destination unload</strong> — gate rules, carry distance, second-day labor if keys arrive late.</li>
</ul>

<h2>Consolidated truck vs shuttle</h2>
<p>One full truck beats multiple small trips when highway time is involved. Partial loads may share mobilization only when routes align—ask dispatch for your corridor.</p>

<h2>City-specific guides</h2>
<p>Start with dedicated pages when available: <a href="/guides/moving-addis-ababa-to-adama-guide">Adama</a>, <a href="/guides/moving-addis-ababa-to-bishoftu-sululta-guide">Bishoftu/Sululta</a>, <a href="/guides/moving-addis-ababa-to-hawassa-guide">Hawassa</a>. Other destinations still need room inventory and photos at survey.</p>

<h2>Timing and holidays</h2>
<p>Load day in Addis can hit festival closures—<a href="/guides/holiday-moving-calendar-addis-ababa-timket-meskel">holiday calendar</a>. Book <strong>2–4 weeks ahead</strong> for large homes; confirm destination reception hours.</p>

<h2>Packing for highway legs</h2>
<p>Vibration and heat stress furniture and electronics—use pro materials from <a href="/guides/packaging-service-addis-materials-guide">packaging guide</a> and <a href="/guides/fragile-packing-electronics-addis-cobblestone-guide">fragile electronics</a>.</p>

<h2>Contracts</h2>
<p>Insist on line items before deposit—<a href="/guides/moving-contract-red-flags-addis-guide">red flags</a> · <a href="/blog/active-movers-prevents-price-creep-written-contract-addis">price creep</a>. Avoid delala brokers on long legs—<a href="/guides/broker-delala-vs-professional-movers-addis-guide">broker vs professional</a>.</p>

<h2>Book inter-city</h2>
<p><a href="/booking">Survey request</a> · <a href="/guides/how-much-do-movers-cost-addis-ababa-2026-guide">2026 pricing</a> · <a href="tel:+251982260000">+251982260000</a></p>`,

  'first-night-essentials-box-moving-guide': `<h2>Why one box matters</h2>
<p>After a long Addis move day, hunting through dozens of cartons for a charger or kettle ruins night one. Pack a single <strong>essentials box</strong> last onto the truck so it comes off first at the new home.</p>

<h2>What goes inside</h2>
<ul>
<li>Phone chargers, power strip, and lamp bulb for the bedroom.</li>
<li>Toiletries, towels, and one change of clothes per person.</li>
<li>Kettle, instant coffee or tea, snacks, and paper cups.</li>
<li>Basic tools: scissors, box cutter, trash bags, tape.</li>
<li>Bedding set or sleeping bags if beds are not assembled yet.</li>
<li>Kids’ comfort items if moving with children.</li>
</ul>

<h2>Labeling</h2>
<p>Mark the carton <strong>OPEN FIRST / NIGHT ONE</strong> in Amharic and English if movers rotate crews. Keep it with you in the car when possible for high-rise waits at the gate.</p>

<h2>Condo and compound moves</h2>
<p>Freight lifts may stop before furniture is upstairs—essentials in hand beat waiting for the wardrobe boxes. See <a href="/guides/condo-high-rise-moving-checklist-addis-ababa">condo checklist</a>.</p>

<h2>Do not pack in essentials</h2>
<p>Passports, lease papers, medications, and jewelry stay in a personal bag—not the essentials carton on the truck tail.</p>

<h2>After movers leave</h2>
<p>Set up bed and kitchen first; unpack room-by-room tomorrow. Pair with <a href="/guides/move-out-handover-checklist-addis-renters">move-out handover</a> if you still owe keys at the old unit.</p>

<h2>Book your move</h2>
<p><a href="/booking">Quote</a> · <a href="/guides/packaging-service-addis-materials-guide">Packing help</a> · <a href="tel:+251982260000">+251982260000</a></p>`,
}

function wc(c) {
  return c.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
}

for (const [slug, html] of Object.entries(files)) {
  const fp = path.join(GUIDE_DIR, `${slug}.json`)
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'))
  j.content = html.trim()
  j.readTime = Math.max(1, Math.round(wc(j.content) / 200))
  j.updatedAt = new Date().toISOString()
  j.quality = 'enriched'
  j.index = true
  j.enrichedAt = j.enrichedAt || new Date().toISOString()
  fs.writeFileSync(fp, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(slug, wc(j.content), j.index)
}
