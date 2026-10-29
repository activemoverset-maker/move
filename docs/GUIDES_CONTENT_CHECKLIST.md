# Moving Guides — Content Checklist & Idea Backlog

**Project:** Active Movers & Packers  
**Updated:** 21 September 2026  
**Companion:** [IMPLEMENTATION_PLAN_MOVING_GUIDES.md](./IMPLEMENTATION_PLAN_MOVING_GUIDES.md)  

Use this document to **capture ideas**, **track status**, and **record what is live** once `data/guides/*.json` exists.

---

## How to use this checklist

1. **Add ideas** in the backlog tables below (status = `idea`).
2. When you start writing, set status → `draft` and note the planned `slug`.
3. When JSON is in `data/guides/{slug}.json` and `status: "published"`, set → `published` and fill **JSON file** + **Live URL**.
4. **Review weekly:** pick 2–5 items from `idea` or `draft` by priority (P1 first).
5. After publishing, add **internal links** to related blog posts and `/booking`.

### Status legend

| Status | Meaning |
|--------|---------|
| `idea` | Title/topic only — not written |
| `draft` | JSON exists with `"status": "draft"` or WIP in editor |
| `published` | `"status": "published"` in `data/guides/` |
| `skip` | Decided not to create (note why in Notes) |

### Priority legend

| Priority | When to do it |
|----------|----------------|
| **P1** | High search demand + strong booking intent (major areas, pricing) |
| **P2** | Important but narrower (commercial niches, secondary areas) |
| **P3** | Long tail / future fill-in |

---

## Published inventory (fill as you ship)

_Keep this table updated — it is the source of truth for “what we have.”_

| Title | Slug | Category | JSON file | Live URL | Published |
|-------|------|----------|-----------|----------|-----------|
| Condo & High-Rise Moving Checklist | `condo-high-rise-moving-checklist-addis-ababa` | checklist-guide | `condo-high-rise-moving-checklist-addis-ababa.json` | `/guides/condo-high-rise-moving-checklist-addis-ababa` | 2026-09-20 |
| How Much Do Movers Cost (2026) | `how-much-do-movers-cost-addis-ababa-2026-guide` | pricing-guide | `how-much-do-movers-cost-addis-ababa-2026-guide.json` | `/guides/how-much-do-movers-cost-addis-ababa-2026-guide` | 2026-09-19 |
| Movers in Megenagna Complete Guide | `movers-megenagna-complete-guide-2026` | area-guide | `movers-megenagna-complete-guide-2026.json` | `/guides/movers-megenagna-complete-guide-2026` | 2026-09-18 |
| Truck timing & freight rules | `moving-truck-timing-freight-rules-addis-ababa` | checklist-guide | `moving-truck-timing-freight-rules-addis-ababa.json` | `/guides/moving-truck-timing-freight-rules-addis-ababa` | 2026-09-20 |
| Bole moving guide (2026) | `bole-moving-guide-addis-ababa-2026` | area-guide | `bole-moving-guide-addis-ababa-2026.json` | `/guides/bole-moving-guide-addis-ababa-2026` | 2026-09-20 |
| Office relocation Kazanchis | `office-relocation-kazanchis-guide` | commercial-guide | `office-relocation-kazanchis-guide.json` | `/guides/office-relocation-kazanchis-guide` | 2026-09-20 |
| Gelan Gura / corridor relocation | `gelan-gura-corridor-relocation-moving-guide` | area-guide | `gelan-gura-corridor-relocation-moving-guide.json` | `/guides/gelan-gura-corridor-relocation-moving-guide` | 2026-09-21 |
| Addis → Bishoftu / Sululta | `moving-addis-ababa-to-bishoftu-sululta-guide` | service-guide | `moving-addis-ababa-to-bishoftu-sululta-guide.json` | `/guides/moving-addis-ababa-to-bishoftu-sululta-guide` | 2026-09-21 |
| Ayat & Lemi Kura condos | `ayat-lemi-kura-condo-moving-guide` | area-guide | `ayat-lemi-kura-condo-moving-guide.json` | `/guides/ayat-lemi-kura-condo-moving-guide` | 2026-09-21 |
| CMC Mikael moving | `cmc-mikael-moving-guide-addis-ababa` | area-guide | `cmc-mikael-moving-guide-addis-ababa.json` | `/guides/cmc-mikael-moving-guide-addis-ababa` | 2026-09-21 |
| Piassa / Arada historic core | `piassa-arada-historic-core-moving-guide` | area-guide | `piassa-arada-historic-core-moving-guide.json` | `/guides/piassa-arada-historic-core-moving-guide` | 2026-09-21 |
| Holiday calendar (Timket/Meskel) | `holiday-moving-calendar-addis-ababa-timket-meskel` | checklist-guide | `holiday-moving-calendar-addis-ababa-timket-meskel.json` | `/guides/holiday-moving-calendar-addis-ababa-timket-meskel` | 2026-09-21 |
| Move-out / deposit handover | `move-out-handover-checklist-addis-renters` | checklist-guide | `move-out-handover-checklist-addis-renters.json` | `/guides/move-out-handover-checklist-addis-renters` | 2026-09-21 |
| BPO / call center office move | `bpo-call-center-office-relocation-addis-guide` | commercial-guide | `bpo-call-center-office-relocation-addis-guide.json` | `/guides/bpo-call-center-office-relocation-addis-guide` | 2026-09-21 |
| Jemo / Lebu / Lafto | `jemo-lebu-lafto-moving-guide-addis-ababa` | area-guide | `jemo-lebu-lafto-moving-guide-addis-ababa.json` | `/guides/jemo-lebu-lafto-moving-guide-addis-ababa` | 2026-09-21 |
| Gerji moving | `gerji-moving-guide-addis-ababa` | area-guide | `gerji-moving-guide-addis-ababa.json` | `/guides/gerji-moving-guide-addis-ababa` | 2026-09-21 |

**Quick count:** Published: **166** guides · **504** blogs · **670** total JSON posts.

**W0 bulk pass (29 Oct 2026):** `node scripts/bulk-finish-thin-content.mjs --write` — removed duplicate scaffold blocks, expanded all posts to **≥400 words**, audit **412 → 0** issues. **Index tier:** **48** URLs (`25` flagship guides + **17** secondary guides + **6** trust/pricing blogs) via `scripts/fix-guide-blog-metadata.mjs` allowlists; remaining **622** posts **`index: false`** (enriched, sitemap-filtered).

**Curated secondary (29 Oct 2026):** `patch-curated-indexed-secondary-batch2.mjs` + `expand-indexed-curated-guides.mjs` — indexed secondary guides without generic bulk footers. **`getFeaturedGuides()`** surfaces indexable URLs first.

**After deploy:** [DEPLOY_AND_GBP_CHECKLIST.md](./DEPLOY_AND_GBP_CHECKLIST.md) · `node scripts/count-indexable-urls.mjs` (expect **48**).

**Batch 3 (Sep 2026):** `node scripts/generate-guides-batch-50-batch3.mjs` — 50 new guides (116 → 166).

_Batch of 50 guides added 2026-09-21 via `scripts/generate-guides-batch-50.mjs` — full slugs live under `data/guides/`._

_Batch of 50 **detailed** guides added 2026-09-22 via `scripts/generate-guides-batch-50-detailed.mjs` + `scripts/enrich-guides-batch-50-detailed.mjs` (topic-specific sections, FAQs, planning blocks)._

---

## Starter pack (recommended first 5 after launch)

Ship these to validate the section before scaling.

| Title (planned) | Slug (planned) | Category | Priority | Status | Notes |
|-----------------|----------------|----------|----------|--------|-------|
| Movers in Megenagna: Complete Relocation Guide | `movers-megenagna-complete-guide-2026` | area-guide | P1 | published | Shipped |
| How Much Do Movers Cost in Addis Ababa (2026) | `how-much-do-movers-cost-addis-ababa-2026-guide` | pricing-guide | P1 | published | Shipped as guide (canonical) |
| Condo Moving in Addis Ababa: Complete Guide | `condo-high-rise-moving-checklist-addis-ababa` | checklist-guide | P1 | published | Checklist guide shipped |
| Office Relocation in Kazanchis | `office-relocation-kazanchis-guide` | commercial-guide | P1 | idea | Downtime, IT, after-hours |
| Move-Out Checklist: Deposit & Handover | `move-out-handover-checklist-addis-renters` | checklist-guide | P2 | idea | Link to booking + cleaning blog posts |

---

## Area guides — Addis neighborhoods & corridors

_Add rows freely. Duplicate areas are OK if angle differs (e.g. “Bole Atlas corridor” vs “Bole 22”)._

| Area / topic | Slug (planned) | Priority | Status | JSON file | Notes |
|--------------|----------------|----------|--------|-----------|-------|
| Bole | `bole-moving-guide-addis-ababa` | P1 | idea | | |
| Bole Bulbula | `bole-bulbula-relocation-guide` | P1 | idea | | Align with `/bole-bulbula` landing |
| CMC | `cmc-movers-relocation-guide` | P1 | idea | | |
| Megenagna | `movers-megenagna-complete-guide-2026` | P1 | idea | | Starter pack |
| Kazanchis | `kazanchis-moving-guide-diplomatic-district` | P1 | idea | | |
| Piassa / Arada | `piassa-arada-moving-guide-historic-core` | P2 | idea | | Narrow streets |
| Gerji | `gerji-relocation-guide` | P2 | idea | | |
| Sarbet | `sarbet-moving-guide` | P2 | idea | | |
| Summit | `summit-area-relocation-guide` | P2 | idea | | |
| Ayat | `ayat-moving-guide-new-developments` | P2 | idea | | |
| Jemo | `jemo-budget-relocation-guide` | P2 | idea | | |
| Gotera | `gotera-condo-moving-guide` | P2 | idea | | |
| Kality | `kality-industrial-residential-moving-guide` | P2 | idea | | |
| Akaki | `akaki-kality-corridor-moving-guide` | P2 | idea | | |
| Gullele | `gullele-hills-moving-guide` | P2 | idea | | |
| Yeka / Kotebe | `yeka-kotebe-relocation-guide` | P2 | idea | | |
| Lebu | `lebu-lafto-moving-guide` | P2 | idea | | |
| Gelan / Gelan Gura | `gelan-gura-smart-city-moving-guide` | P1 | idea | | Large housing wave |
| Old Airport / Laphto | `old-airport-laphto-relocation-guide` | P2 | idea | | |
| Sidist Kilo | `sidist-kilo-student-faculty-moving-guide` | P2 | idea | | |
| Mexico / Churchill | `mexico-square-churchill-corporate-corridor` | P2 | idea | | |
| Mercato / Atkilt Tera | `mercato-retail-move-inventory-guide` | P3 | idea | | |
| Sululta (out of city) | `sululta-suburban-relocation-from-addis` | P3 | idea | | |
| _Your idea:_ | | | idea | | |

---

## Service guides

| Service topic | Slug (planned) | Priority | Status | JSON file | Notes |
|---------------|----------------|----------|--------|-----------|-------|
| Local moving (Addis) | `local-moving-addis-ababa-guide` | P1 | idea | | Link `/services/local-moving` |
| Condo / high-rise | `condo-movers-addis-ababa-complete-guide` | P1 | idea | | Starter pack |
| Villa / large home | `villa-large-home-moving-guide-addis` | P2 | idea | | |
| Office relocation | `office-relocation-addis-ababa-guide` | P1 | idea | | |
| Packing services | `professional-packing-services-guide-addis` | P2 | idea | | Link `/services/packaging` |
| Storage | `moving-storage-solutions-guide-addis` | P2 | idea | | Link `/services/storage` |
| Long-distance (Ethiopia) | `long-distance-moving-ethiopia-guide` | P2 | idea | | |
| International / expat | `expat-international-relocation-addis-guide` | P2 | idea | | |
| Same-day / emergency | `same-day-emergency-moving-addis-guide` | P3 | idea | | |
| Piano / heavy items | `piano-heavy-item-moving-guide-addis` | P3 | idea | | |
| _Your idea:_ | | | idea | | |

---

## Pricing, legal & planning

| Topic | Slug (planned) | Priority | Status | JSON file | Notes |
|-------|----------------|----------|--------|-----------|-------|
| Moving costs 2026 | `how-much-do-movers-cost-addis-ababa-2026` | P1 | idea | | Starter pack |
| Hourly vs fixed pricing | `hourly-vs-fixed-moving-pricing-addis` | P2 | idea | | |
| Reading a moving contract | `moving-contract-red-flags-addis` | P2 | idea | | |
| Moving insurance | `moving-insurance-guide-ethiopia` | P2 | idea | | |
| DIY vs professional (true cost) | `diy-vs-professional-movers-addis-guide` | P2 | idea | | |
| Group / neighbor discounts | `group-moving-discounts-condo-guide` | P3 | idea | | Related blog exists |
| Rent / deposit / handover | `move-out-handover-checklist-addis-renters` | P2 | idea | | Starter pack |
| Woreda address change | `address-change-woreda-after-move-guide` | P3 | idea | | |
| _Your idea:_ | | | idea | | |

---

## Commercial & specialty

| Topic | Slug (planned) | Priority | Status | JSON file | Notes |
|-------|----------------|----------|--------|-----------|-------|
| BPO / call center (100+ seats) | `bpo-office-relocation-guide-addis` | P1 | idea | | |
| Kazanchis office | `office-relocation-kazanchis-guide` | P1 | idea | | Starter pack |
| Restaurant / kitchen | `restaurant-kitchen-relocation-guide` | P2 | idea | | |
| Retail / boutique | `retail-boutique-relocation-guide-addis` | P2 | idea | | |
| Warehouse / Kality port | `warehouse-migration-kality-guide` | P2 | idea | | |
| Clinic / medical records | `medical-clinic-relocation-compliance-guide` | P3 | idea | | |
| School / campus (summer) | `school-campus-summer-move-guide` | P3 | idea | | |
| Embassy / high-security | `high-security-diplomatic-relocation-guide` | P3 | idea | | |
| _Your idea:_ | | | idea | | |

---

## Idea inbox (quick capture)

_Paste one line per idea — move to a section above when ready._

```
- 
- 
- 
```

---

## Blog overlap log (avoid duplicate canonical URLs)

When a topic exists as a **blog** post and you create a **guide**, record which URL is canonical.

| Topic | Blog slug (if any) | Guide slug (if any) | Canonical | Action |
|-------|-------------------|---------------------|-----------|--------|
| Group moving discounts | `group-moving-discounts-neighbors-same-condo-active-movers` | _TBD_ | _TBD_ | Guide = deep reference; blog = tip — or merge |
| Megenagna movers | _search data/blogs_ | _TBD_ | _TBD_ | |
| _add rows_ | | | | |

---

## Content quality checklist (per guide before publish)

Use for every JSON file before setting `"status": "published"`:

- [ ] Unique `slug` and `id` (`guide-...`)
- [ ] `title` + `excerpt` include primary keyword naturally
- [ ] `category` is one of: `area-guide`, `service-guide`, `pricing-guide`, `commercial-guide`, `checklist-guide`
- [ ] `content` has clear H2 structure (intro, logistics, pricing/timing, Active Movers CTA, conclusion)
- [ ] `featuredImage` URL valid (existing gallery path)
- [ ] `readTime` roughly matches length
- [ ] `tags` (3–8) for related guides + internal linking
- [ ] No duplicate of existing **published** guide slug
- [ ] Cross-link 1–3 related **blog** posts where helpful
- [ ] Row updated in **Published inventory** table above
- [ ] Sitemap regenerated after batch publish (see implementation plan §5)

---

## JSON template (copy for new guides)

Save as `data/guides/{slug}.json`:

```json
{
  "id": "guide-CHANGE-ME",
  "title": "",
  "titleAm": "",
  "excerpt": "",
  "excerptAm": "",
  "content": "",
  "contentAm": "",
  "author": "Active Movers Team",
  "category": "area-guide",
  "tags": [],
  "tagsAm": [],
  "readTime": 10,
  "featuredImage": "https://www.activemoverset.com/images/gallary/qua703.jpeg",
  "images": [],
  "status": "draft",
  "publishedAt": "2026-09-20T09:00:00.000Z",
  "slug": "CHANGE-ME"
}
```

---

## Monthly review prompts

- Which **P1** areas still have no guide?
- Search Console: top queries with no matching `/guides/` page?
- Which guides got booking CTA clicks?
- Retire or merge thin guides that duplicate blog posts
- Refresh **pricing** and **year** in titles annually (2026 → 2027)

---

**Maintainers:** Update **Published inventory** and status columns whenever you add or ship a guide JSON file.
