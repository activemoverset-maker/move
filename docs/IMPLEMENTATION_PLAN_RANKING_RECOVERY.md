# Implementation Plan: Ranking Recovery

**Project:** Active Movers & Packers (`https://www.activemoverset.com`)  
**Updated:** 29 October 2026 (phone locked to `+251982260000`)  
**Status:** **Phases 1–3 + W0 complete in repo** (29 Oct 2026). **48** indexable URLs, audit **0**. **Next:** deploy + [DEPLOY_AND_GBP_CHECKLIST.md](./DEPLOY_AND_GBP_CHECKLIST.md) (GBP, GSC, production `.env`). Optional: W2–W5 editorial on more slugs.  
**Scope:** Organic and local ranking. Page-speed overlay work is landed. This plan covers identity, money pages, GBP, measurement, and **enriching** the existing blog/guide catalog.  
**Benchmark:** [habeshamovers.com](https://www.habeshamovers.com/) — §4  
**Related:** [GUIDES_CONTENT_CHECKLIST.md](./GUIDES_CONTENT_CHECKLIST.md)

---

## 1. Executive summary

Core Web Vitals matter, but for movers in Addis Ababa rankings are driven by:

1. **Google Business Profile** — category, reviews, photos, NAP, hours  
2. **Site-wide content quality** — many weak pages can dampen the whole domain; fix is **better copy**, not deleting the catalog  
3. **Money pages** — homepage, services, pricing FAQ, flagship area landings  
4. **One business identity** — name, phone, hours, schema, H1 rules aligned everywhere  

**Inventory:** **504** blog JSON files + **166** guides (**670** URLs). **W0:** all published posts ≥400 words, metadata audit **0** issues. **48** URLs indexed (25 flagship guides + 17 secondary + 6 blogs); **622** `index: false` with sitemap filter. Long-tail copy still uses shared expansion blocks—acceptable for holds; **W2–W5** editorial optional.

### Product decisions (locked)

**Keep every guide and blog slug and existing HTML block structure.** Enrich text in place. Control discovery with **`index` / `quality` fields** and sitemap filters—not bulk file deletion. Use **`noindex` only** for drafts, duplicate cannibal pairs, and posts intentionally held until they pass the enrichment bar.

**Canonical phone (locked):** **`+251982260000`** for click-to-call, WhatsApp, schema `telephone`, GBP, privacy/terms, and every CTA. Display format may vary (`+251 98 226 0000`); E.164 in code and JSON-LD must stay `+251982260000`. Update production `.env` and GBP if anything still shows `+251982270000`.

### Recommended sequence

**Phase 1 (identity + one phone in schema) → Phase 4 GBP same week → Phase 3 money pages + price table → Phase 2 W0 metadata then enrichment waves W1–W5 → Phase 5 speed only if field CWV Poor → Phase 6 measure at 28 days.**

---

## 2. Goals and non-goals

### Goals

| Goal | Outcome |
|------|---------|
| One real brand name in chrome | `Active Movers & Packers` in header/footer/schema—not “Movers in Addis Ababa - …” |
| One H1 per public page | Topic H1 on page; logo line is not `<h1>` |
| Schema = reality | `MovingCompany`, hours from `SITE_CONFIG`, phone from same source as UI |
| Catalog stays; quality rises | All JSON files remain; prose reads like local operator knowledge |
| Indexing tracks quality | Sitemap + homepage featured modules favor enriched URLs |
| Query-matched homepage | Title + single H1: “Movers and Packers in Addis Ababa” |
| Price table on money pages | Bedroom tiers + stairs + office start (**Active Movers** ETB, not Habesha’s) |
| GBP / map pack | Mover category, reviews, photos, NAP match site |

### Non-goals

- Deleting `/blog` or `/guides` or 600+ JSON files  
- Site-wide template swap (generic “Step-by-step planning” block on every slug without local rewrites)  
- Fake `hreflang` for `?lang=am`  
- Homepage FAQ schema for questions not visible on the page  
- Quoting star counts without a verified GBP number  
- Perfect Lighthouse before identity + enrichment  
- Rebuilding `/addis-active-movers` as a second SEO homepage (treat as campaign landing; see §6.8)  

---

## 3. What is already done (speed)

Do not redo unless Search Console still shows the problem:

- `GlobalLoadingScreen` removed from `components/site-chrome.tsx`; `loading-context` defaults `isLoading: false`  
- Hero paints first; deferred 3D / extra images (`hero-section.tsx`)  
- Deferred homepage sections + lazy maps (`deferred-home-sections.tsx`, `lazy-on-view.tsx`, `lazy-map.tsx`)  
- `next/image` on key surfaces; AVIF/WebP in `next.config.js`  
- Blog/guide list paths avoid loading full HTML where implemented  
- Public marketing routes under `app/(main)/` with shared `SiteChrome`  

Measure with Search Console **field** CWV after deploy.

---

## 3.5 Repo baseline — shipped in code (verify on production deploy)

| Item | Plan target | Repo state (Oct 2026) | Post-deploy check |
|------|-------------|----------------------|-------------------|
| Display name | `Active Movers & Packers` | `constants/site.ts` | View source chrome |
| Homepage `<title>` | Movers and Packers… | `app/(main)/page.tsx` | GSC URL inspect |
| Hero H1 | One phrase + city | `lib/i18n.ts` → single title; subtitle empty | One `<h1>` on `/` |
| Header logo | Not `<h1>` | `components/header.tsx` → `<p>` | Rich Results |
| hreflang | None until `/am/` | No `?lang=am` in `app/layout.tsx` alternates | — |
| Schema | `MovingCompany` + real hours | `lib/seo-utils.ts`, `constants/contact.ts` | Rich Results test |
| Phone in UI/schema | **`+251982260000`** | `constants/contact.ts` → `SITE_CONFIG.links` | Footer + JSON-LD on live site |
| Sitemap | Indexable only | `getIndexableBlogPosts` / `getIndexableGuides` | Live sitemap count ≈ static + **48** posts |
| `index` / `quality` | On JSON + types | Loaders + `fix-guide-blog-metadata.mjs` | Spot-check `noindex` hold URL |
| Detail robots | Respect `index: false` | `generateSEO` + `isIndexable()` on guide/blog pages | — |
| Homepage guides | Indexable first | `getFeaturedGuides()` → indexable, flagship sort | Homepage module |
| Homepage cost FAQ | Visible + schema | `home-pricing-section.tsx` + `HOME_PRICING_FAQ` | FAQ ⊆ visible text |
| Catalog W0 | Audit clean | `node scripts/audit-guide-blog-metadata.mjs` → **0** | Re-run after bulk edits |

**Still manual:** production `.env` / hosting secrets (`PHONE_NUMBER`, `WHATSAPP_NUMBER`), **GBP** (Phase 4), **GSC** baseline (Phase 6). Local `.env` may override phone—ensure production uses **`+251982260000`**.

**Conclusion:** Phases **1–3** and **W0** code paths are in the repo. Ranking outcomes depend on **deploy + GBP + time on indexable URLs**, not on indexing all 670 posts.

---

## 4. Competitor benchmark — habeshamovers.com

Short site: query homepage, price FAQ table, header phone, ~5 locations, ~50 reviews (4.9).

**Copy:** query title/H1, price table + stairs, phone/booking early, local detail on area pages, one GBP review figure.  
**Do not copy:** boast FAQ, cloned locations, their ETB table unless you confirm pricing, broken sitemap, contradictory hours.

---

## 5. Phase 1 — Identity and markup (code, one PR)

Do **before** enrichment so every URL shares one NAP and schema.

### 5.1 Brand and titles

| Location | Change |
|----------|--------|
| `constants/site.ts` | `name: 'Active Movers & Packers'` |
| `app/(main)/page.tsx` | `title`: `Movers and Packers in Addis Ababa \| Active Movers & Packers` |
| `app/layout.tsx` | Default title: brand + service + city (not keyword-stuffed) |
| `lib/i18n.ts` | `hero.title` + `hero.subtitle` → **one logical H1** (e.g. title “Movers and Packers in Addis Ababa”, subtitle empty or moved to `<p>`) |
| `components/footer.tsx` | Uses `SITE_CONFIG.name` — updates automatically after §5.1 |

Keep city keywords in **titles and H1**, not in the legal/display company name string.

### 5.2 One H1

- `components/header.tsx`: logo text → `<p>` or `<span>` with `className` unchanged.  
- `components/sections/hero-section.tsx`: ensure **only one** `<h1>` on `/` (adjust i18n + markup if subtitle must stay visual).  
- `components/landing/addis-premium/*`: no second H1 when combined with any local header on that route.

### 5.3 Remove fake hreflang

`app/layout.tsx`: delete `alternates.languages.am` (and `en` pair if it only mirrors `/`). Language toggle stays client-side; no hreflang until real Amharic URLs exist.

### 5.4 Phone — single source of truth (locked: `+251982260000`)

**Rule:** One E.164 number everywhere: **`+251982260000`**. All surfaces read **`SITE_CONFIG.links.phone`** and **`SITE_CONFIG.links.whatsapp`**—no scattered literals, no env override to a different number.

**Phase 1 code + config:**

| Action | Detail |
|--------|--------|
| `constants/site.ts` | Defaults: `phone` and `whatsapp` → `'+251982260000'` (already the fallback when env unset) |
| Production `.env` / hosting secrets | Set `PHONE_NUMBER=+251982260000` and `WHATSAPP_NUMBER=+251982260000` (replace `+251982270000` in local `.env`) |
| Google Business Profile | Primary phone **`+251982260000`** — must match site after deploy |
| Schema | `lib/seo-utils.ts`, `lib/schema-markup.ts` — import from `SITE_CONFIG`, do not duplicate hardcoded strings |
| CTAs | `bole-bulbula-page.tsx`, privacy, terms, `lib/i18n.ts`, `floating-buttons.tsx` if applicable — use `SITE_CONFIG` or shared helper |

**Do not** introduce a second number for “branches”; Bole Bulbula uses the same line unless a separate GBP listing exists (none in this plan).

### 5.5 Structured data

**Files:** `lib/seo-utils.ts`, `lib/schema-markup.ts`, `components/seo/global-seo.tsx`

- Change local entity `@type` from `LocalBusiness` to **`MovingCompany`**.  
- `openingHoursSpecification`: parse **`SITE_CONFIG.businessHours`** (Mon–Fri 8–18 today; add Saturday block when business confirms). Remove 24/7 unless true.  
- `logo` / `image`: URL that returns 200 (`/images/logotr.png` or verified logo).  
- `sameAs`: only live profiles.  
- Align **`schema-markup.ts`** with **`seo-utils.ts`** (no duplicate conflicting generators).

### 5.6 Header phone (Habesha parity)

Habesha shows click-to-call in the header. Active Movers has `Phone` in mobile menu; **add visible desktop click-to-call** using `SITE_CONFIG.links.phone` (track `phone_click` like footer). Optional in same PR as §5.1.

### 5.7 Phase 1 done when

- View source `/`: **one** `<h1>`, chrome brand = `Active Movers & Packers`.  
- Rich Results: valid `MovingCompany` / `Organization`, phone = footer on **production** build.  
- No `hreflang` to `?lang=am`.  
- Grep: **`982270000` must be zero hits** in repo after Phase 1; **`982260000`** only via `SITE_CONFIG` / schema import / i18n fed from constants (no one-off literals in page files).

---

## 6. Phase 2 — Enrich the catalog (editorial + small code)

### 6.1 JSON fields (backward compatible)

| Field | Values | Purpose |
|-------|--------|---------|
| `status` | `published`, `draft`, `archived` | Build + list eligibility |
| `index` | boolean; default **`true`** if omitted | Robots + sitemap |
| `quality` | `flagship`, `enriched`, `scaffold`, `needs-enrichment` | Editorial + featured modules |
| `enrichedAt` | ISO date | Audit trail |

**Extend types:** `JsonBlogPost` / guide JSON types in `lib/blog-data.ts`, `lib/guide-data.ts`; parse optional fields in `parseBlogJson` / guide parser.

### 6.2 Indexing rules (clear rollout)

Avoid contradicting “legacy stays indexed” vs “hold until enriched”. Use **three rollout modes**:

| Mode | When | Sitemap | `robots` on detail URL |
|------|------|---------|-------------------------|
| **Legacy (launch)** | Before W0 audit ships | All `published` (today’s behavior) | `index, follow` |
| **W0 hold** | Metadata audit flags post | Omit URL | `noindex, follow` + `index: false` |
| **Enriched** | Passes §6.3 checklist | Include URL | `index, follow` + `quality: enriched` or `flagship` |

**Helper (implement once):**

```ts
function isIndexable(post: { status: string; index?: boolean; quality?: string }): boolean {
  if (post.status !== 'published') return false
  if (post.index === false) return false
  if (post.quality === 'needs-enrichment') return false
  return true
}
```

**Sitemap (`lib/sitemap-generator.ts`):**

- Filter JSON blogs and guides with `isIndexable`.  
- **Deduplicate** JSON vs Prisma blog slugs (both sources exist today).  
- Keep static money routes (`/`, `/services/*`, `/bole-bulbula`, `/guides`, `/blog` index pages).

**Lists:**

- `/blog`, `/guides`: show **all** `published` (user-facing archive intact).  
- `moving-guides-section.tsx`, related posts: prefer `quality ∈ {flagship, enriched}` then fill with recent published.

**Detail metadata:**

- `app/(main)/blog/[slug]/page.tsx`, `app/guides/[slug]/page.tsx`: if `!isIndexable(post)`, set `robots: { index: false, follow: true }` (extend `generateSEO` or page metadata).

### 6.3 Enrichment quality bar

**Gold standards:**

- `data/guides/how-much-do-movers-cost-addis-ababa-2026-guide.json`  
- `data/guides/piassa-arada-historic-core-moving-guide.json`  
- `data/guides/ayat-lemi-kura-condo-moving-guide.json`  

| Requirement | Bad | Good |
|-------------|-----|------|
| Excerpt | Keyword chains | 1–2 natural sentences |
| Opening | “This guide explains…” | Audience + #1 local constraint |
| Local detail | Generic condo text | Named sub-city, gate, road, lift rule |
| Body | Telegraphic bullets only | Normal paragraphs + actionable lists |
| Pricing | Silent | Link `/services/*`, cost guide; **from X ETB** when true |
| Length | &lt;400 words thin | Area guides ≥800w; tips ≥600w; dense checklists OK shorter |
| Links | Random/none | 2–4 related guides + service + `/booking` |
| `readTime` | 53 on 5-min read | ~word count ÷ 200 |
| `publishedAt` | Future date | ≤ today; set `updatedAt` on edit |
| Images | 404 `qua703`/`qua705` | Verified `/images/gallary/*` or real job photo |

**Keep existing `<h2>` sections**; rewrite content inside them.

### 6.4 Anti-patterns

- `scripts/enrich-guides-batch-50-detailed.mjs` without rewriting Overview/Access for that slug.  
- Same “Neighborhood note” paragraph on every area guide (seen on multiple `*-moving-guide-addis.json` files).  
- One-night LLM pass on all 670 files without spot-check.  

### 6.5 W0 — Metadata hygiene (all 670, week 1)

1. Audit script (read-only first): `scripts/audit-guide-blog-metadata.mjs` → CSV of future dates, excerpt pattern, word count, broken featured URLs, inflated `readTime`.  
2. Fix images → known-good gallery paths.  
3. Fix dates and `readTime`.  
4. Rewrite keyword-list excerpts.  
5. Set `quality: "needs-enrichment"`, `index: false` on worst offenders until body pass; leave strong guides as `flagship` / `index: true`.

Optional apply script: `scripts/fix-guide-blog-metadata.mjs` (no prose generation).

**Bulk body pass (Oct 2026):** `scripts/bulk-finish-thin-content.mjs --write` expands thin posts with one expansion block + optional `wordTopUp` (no repeated H2 loops). If duplicate “Professional planning” blocks appear, run `scripts/dedupe-bulk-expansion-blocks.mjs --write`, then **re-run** `bulk-finish --write` until audit shows 0 `thinBody`. Indexed secondary guides: `scripts/patch-curated-secondary-guides.mjs` + `scripts/patch-curated-indexed-secondary-batch2.mjs`; all **17** secondary index slugs are in `NO_BULK_APPEND` in bulk-finish (top-up only, no template H2).

### 6.6 Enrichment waves

| Wave | Scope | Index when |
|------|--------|------------|
| **W0** | Metadata all 670 | Holds on `index: false`; strong files stay indexable |
| **W1** | Cost guide + P1 guides (~15–20) | Already mostly strong — mark `flagship` |
| **W2** | Area guides you actually serve | After §6.3 each |
| **W3** | Remaining guides | After pass |
| **W4** | High-intent blogs (~80) | After pass |
| **W5** | Long-tail blogs | After pass |

**Velocity target:** 8–15 enriched URLs per week with human spot-check (adjust to team size). Track in [GUIDES_CONTENT_CHECKLIST.md](./GUIDES_CONTENT_CHECKLIST.md) + spreadsheet: slug, wave, quality, enrichedAt, indexable.

### 6.7 Cannibalization

If `/blog/...` and `/guides/...` duplicate intent after enrichment: canonical = **guide**; blog gets `index: false` + body link to guide.

**Worked example:** `data/blogs/group-moving-discounts-neighbors-same-condo-active-movers.json` — keep slug; enrich prose; fix excerpt, image, `readTime`, dates; set `index: true` when pass complete.

### 6.8 Secondary landing — `/addis-active-movers`

Separate brand tone (“Addis Active Movers”) risks splitting entity signals.

- **Do not** noindex the route if it is used in ads.  
- **Do:** canonical or prominent link to main homepage; same phone/NAP as Phase 1; avoid competing for “movers and packers addis ababa” (premium/long-tail title OK).  
- **Do not** add a second stuffed `SITE_CONFIG.name`; keep premium metadata local to that route only.

### 6.9 Phase 2 done when

- `isIndexable()` wired to sitemap + detail robots.  
- W0 audit clean: no future dates / 404 featured images in **indexable** set.  
- Homepage guide strip prefers enriched/flagship. **`getFeaturedGuides()`** (Oct 2026) filters **`isIndexable()`** first, sorts **flagship** ahead of enriched—homepage no longer lists random noindex long-tail.  
- At least **one** wave-2 area guide passes §6.3 as template for editors.

---

## 7. Phase 3 — Money pages

| Page | Files | Must include |
|------|--------|--------------|
| Homepage | `app/(main)/page.tsx`, `hero-section.tsx`, `lib/i18n.ts` | Query H1; phone + booking early; link to cost guide / price table |
| Price FAQ | `data/guides/how-much-do-movers-cost-addis-ababa-2026-guide.json` (+ optional `/faq`) | Table: studio / 2BR / 3BR / villa, stairs, office **from 45,000 ETB**; local **from 17,000 ETB** aligns with `constants/site.ts` `SERVICES` |
| Services | `app/services/**`, `components/pages/service-detail.tsx` | Same anchors; booking CTA |
| Area | `app/(main)/bole-bulbula/page.tsx` + flagship guides | Local access; hours = contact only |
| Contact / booking | `app/(main)/contact/page.tsx`, `booking/page.tsx` | NAP, hours, map |

**Homepage FAQ schema (`components/seo/homepage-seo.tsx`):**

- Either add a **visible** “How much does a move cost in Addis Ababa?” block on the homepage (with table or link to cost guide) and include that Q in schema, **or** remove cost from schema until visible.  
- Prefer adding Habesha-style cost FAQ to homepage **or** services index—not invisible schema.

**Trust copy:** Remove “trusted by thousands” unless substantiated; match GBP review count or omit stars.

### Phase 3 done when

- Price table + phone + booking reachable without opening blog.  
- No duplicate H1/title across money pages.  
- FAQ JSON-LD ⊆ visible FAQ text.

---

## 8. Phase 4 — Google Business Profile

Same week as Phase 1 deploy:

Name `Active Movers & Packers` · Primary **Mover** · Phone **`+251982260000`** (same as site) · NAP/hours = site · Website = homepage · Services list · Photos monthly · Review asks + replies · Posts = ops updates.

**Done when:** GBP primary phone is **`+251982260000`** and matches footer, header CTAs, and JSON-LD on production.

---

## 9. Phase 5 — Speed (conditional)

Only if mobile field CWV **Poor** after Phases 1–3 deploy. Targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 (p75).

---

## 10. Phase 6 — Measure

| When | Check |
|------|--------|
| Day 0 | GSC baseline: “movers addis ababa”, “movers and packers…”, brand |
| Week 1 | URL inspect `/`, one flagship guide, one `index: false` hold |
| Week 2–4 | Sitemap size tracks enrichment; coverage errors down |
| Day 28 | Field CWV not Poor |
| Week 4–8 | Query stability; GBP calls/reviews |

---

## 11. Implementation order

| Step | Work | Owner |
|------|------|--------|
| 1 | Phase 1 PR (identity, schema, phone refactor, hreflang, optional header phone) | Code |
| 2 | Phase 4 GBP aligned to step 1 | Business |
| 3 | Phase 3 money pages + homepage cost FAQ visibility | Code + editorial |
| 4 | Phase 2 code: `isIndexable`, types, sitemap, robots, featured guides | Code |
| 5 | Phase 2 W0 metadata + W1–W2 enrichment | Editorial |
| 6 | W3–W5 + cannibalization | Editorial |
| 7 | Phase 5 if needed | Code |
| 8 | Day-28 review | Business |

### Commits

1. `fix: brand, single H1, MovingCompany schema, central phone`  
2. `content: homepage query match, price table, visible cost FAQ`  
3. `seo: indexable helpers, sitemap filter, guide strip quality`  
4. `content: enrich wave N` (repeat)

Never mix Phase 1 with 500-file JSON edits.

---

## 12. Files to touch (master list)

| File | Phase |
|------|--------|
| `constants/site.ts` | 1 (defaults `+251982260000`) |
| `.env` / production env vars | 1 (`PHONE_NUMBER`, `WHATSAPP_NUMBER`) |
| `lib/i18n.ts` | 1 (phone strings from constants) |
| `components/header.tsx`, `footer.tsx` | 1, 1.6 |
| `components/sections/hero-section.tsx` | 1, 3 |
| `lib/i18n.ts` | 1, 3 |
| `app/layout.tsx`, `app/(main)/page.tsx` | 1, 3 |
| `lib/seo-utils.ts`, `lib/schema-markup.ts`, `components/seo/global-seo.tsx` | 1 |
| `components/pages/bole-bulbula-page.tsx` | 1 |
| `app/(main)/privacy-policy/page.tsx`, `terms-of-service/page.tsx` | 1 |
| `components/seo/homepage-seo.tsx` | 3 |
| `app/services/**/page.tsx`, `components/pages/service-detail.tsx` | 3 |
| `lib/blog-data.ts`, `lib/guide-data.ts` | 2 |
| `app/(main)/blog/**`, `app/guides/**` | 2 |
| `lib/sitemap-generator.ts` | 2 |
| `components/sections/moving-guides-section.tsx` | 2 |
| `components/seo/guide-seo.tsx` | 2 (optional `Article` + breadcrumb only for indexable) |
| `data/guides/how-much-do-movers-cost-addis-ababa-2026-guide.json` | 3 |
| `data/blogs/*.json`, `data/guides/*.json` | 2 |
| `app/(main)/addis-active-movers/page.tsx` | 2.8 |
| `docs/GUIDES_CONTENT_CHECKLIST.md` | 2 |
| `scripts/audit-guide-blog-metadata.mjs`, `scripts/fix-guide-blog-metadata.mjs`, `scripts/count-indexable-urls.mjs` | 2 W0 / deploy verify |

---

## 13. Decisions

| # | Topic | Status |
|---|--------|--------|
| 1 | **Canonical phone** | **Locked: `+251982260000`** — site, schema, WhatsApp, GBP, `.env` (see §5.4) |
| 2 | Saturday hours | Open — extend `SITE_CONFIG.businessHours` + schema if open Saturday |
| 3 | Bedroom price table | Open — confirm studio / 2BR / 3BR / villa / stair surcharges; extend cost guide + `service-detail` |
| 4 | GBP review count | Open — required before homepage star line |
| 5 | Archive UX | **Default locked:** show all published on `/blog` and `/guides`; homepage features enriched only |

---

## 14. End-to-end readiness checklist

**Repo (done unless noted):**

- [x] §3.5 identity, schema, sitemap policy, W0 audit **0**, **48** index tier  
- [x] **`982270000`** not in tracked source (grep docs only for warnings); phone via `constants/contact.ts`  
- [x] One hero `<h1>` on `/`; header logo not `<h1>`  
- [x] Sitemap excludes `index: false` holds (not 670 post URLs)  
- [x] Homepage pricing + cost FAQ visible; `homepage-seo.tsx` uses `HOME_PRICING_FAQ`  
- [x] W0 + curated secondary/indexed blogs; scripts in `scripts/` (see §6.5 bulk pass note)  

**Deploy & business (you):**

- [ ] Production `.env`: `PHONE_NUMBER` / `WHATSAPP_NUMBER` = **`+251982260000`**  
- [ ] **GBP** Phase 4: name, phone, hours, website, photos, reviews — match Appendix E  
- [ ] Rich Results + live sitemap spot-check after deploy  
- [ ] GSC baseline (day 0) + **day-28** checkpoint — see `docs/DEPLOY_AND_GBP_CHECKLIST.md`  
- [ ] Optional ongoing: W2–W5 hand rewrites on more slugs; cannibal audit (§6.7)  

---

## Appendix A — Enrichment worksheet

```text
Slug:
Type: guide | blog
Wave: W0–W5
Local hook (one sentence):
Price anchor:
Internal links (2–4):
Featured image 200 OK:
readTime / dates:
quality: flagship | enriched
index: true
```

---

## Appendix B — Example transformation

**File:** `data/blogs/group-moving-discounts-neighbors-same-condo-active-movers.json`

- **Excerpt (target):** “When two units in the same compound move the same week, one truck and one elevator slot often costs less than two separate bookings—here’s how to split the quote fairly.”  
- **Body:** Expand Economics / Coordination sections into normal prose; Ayat/Friendship City management patterns; when **not** to share a truck.  
- **Metadata:** `readTime` ~6, valid image, realistic dates, `quality: enriched`, `index: true`.

---

## Appendix C — Policy history

Mass **noindex** of the catalog was an earlier draft default. **Current policy:** enrich-first, tiered indexing, narrow noindex for duplicates and pre-enrichment holds.

---

## Appendix D — Indexing decision tree

```text
published?
  no → draft/archived (404 or noindex)
  yes → index === false OR quality === needs-enrichment?
    yes → noindex, omit sitemap (W0 hold)
    no → duplicate of stronger guide URL?
      yes → noindex blog duplicate, link to guide
      no → include sitemap, index follow (flagship | enriched | legacy passing W0)
```

---

## Appendix E — Locked NAP (reference)

| Field | Value |
|-------|--------|
| Name | Active Movers & Packers |
| Phone | **+251982260000** |
| WhatsApp | **+251982260000** (same line unless product later splits) |
| Address | Beka Building, Addis Ababa, Ethiopia (match GBP street-level) |
| Hours | Mon–Fri 8:00–18:00 per `SITE_CONFIG.businessHours` until Saturday confirmed |
| Website | https://www.activemoverset.com/ |
