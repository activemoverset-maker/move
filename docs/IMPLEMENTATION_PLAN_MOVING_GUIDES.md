# Implementation Plan: Moving Guides Section

**Project:** Active Movers & Packers (`https://www.activemoverset.com`)  
**Updated:** 20 September 2026  
**Status:** Ready for implementation  
**Related doc:** [GUIDES_CONTENT_CHECKLIST.md](./GUIDES_CONTENT_CHECKLIST.md) — idea backlog, published inventory, and status tracking  

---

## 1. Executive summary

Add a **Moving Guides** section (`/guides`) that reuses the same **JSON-on-disk** content model as the blog (`data/blogs/*.json`), with its own routes, UI, categories, and sitemap entries. Guides are **evergreen, reference-style** pages (neighborhood relocation, service playbooks, pricing, commercial moves). The blog stays for **tips, seasonality, and lighter articles**.

**Do not duplicate** the same article at `/blog/...` and `/guides/...`. One canonical URL per topic; cross-link between sections.

### Recommended architecture (one sentence)

**`data/guides/*.json` + `lib/guide-data.ts` + `/guides` list and `/guides/[slug]` detail pages**, cloned from the blog pattern with guide-specific categories, CTAs, SEO schema, and nav — **no Prisma requirement for v1** (match current blog production path: JSON-only on the public site).

---

## 2. Goals and non-goals

### Goals

| Goal | How guides help |
|------|------------------|
| Scale local SEO without bloating “Blog” | URLs like `/guides/movers-megenagna-complete-guide` |
| Clear user intent | “Guide” = definitive reference + book CTA |
| Same workflow you already use | Drop JSON files; optional admin form later |
| Trackable content pipeline | Checklist doc for ideas → draft → published |
| Internal linking | Guides link to `/booking`, services, related blog posts |

### Non-goals (v1)

- Migrating all ~500 existing blog posts into guides (optional, phased; see §8)
- Google News sitemap for guides (keep **news sitemap for blog only**)
- Separate database table unless you later need admin + videos like legacy blog API

---

## 3. Content model (JSON)

### 3.1 File location and naming

| Item | Convention |
|------|------------|
| Directory | `data/guides/` |
| Filename | `{slug}.json` (same as blog, e.g. `movers-megenagna-complete-guide.json`) |
| Public URL | `https://www.activemoverset.com/guides/{slug}` |

Create `data/guides/.gitkeep` or one sample published guide when implementing.

### 3.2 Schema (same fields as blog)

Mirror `JsonBlogPost` / `BlogPost` in `lib/blog-data.ts`. **No new required fields for v1** — keeps generators and admin reuse simple.

```json
{
  "id": "guide-movers-megenagna-2026",
  "title": "Movers in Megenagna: Complete Relocation Guide (2026)",
  "titleAm": "",
  "excerpt": "Truck access, condo rules, timing, and pricing for Megenagna moves with Active Movers.",
  "excerptAm": "",
  "content": "<h2>...</h2><p>...</p>",
  "contentAm": "",
  "author": "Active Movers Team",
  "category": "area-guide",
  "tags": ["Megenagna", "Addis Ababa", "condo move"],
  "tagsAm": [],
  "readTime": 12,
  "featuredImage": "https://www.activemoverset.com/images/gallary/qua703.jpeg",
  "images": [],
  "status": "published",
  "publishedAt": "2026-09-20T09:00:00.000Z",
  "slug": "movers-megenagna-complete-guide-2026"
}
```

**Optional v2 fields** (add only when implementing features that use them):

| Field | Purpose |
|-------|---------|
| `updatedAt` | Shown on page + sitemap `lastmod` |
| `relatedService` | e.g. `local-moving`, `office-relocation` → CTA block |
| `relatedArea` | e.g. `bole`, `cmc` → hub grouping |
| `faq` | `[{ "question", "answer" }]` → FAQ schema |

### 3.3 Guide categories (replace blog categories on guide UI)

Use these in JSON `category` and in the guides list filter (parallel to `components/pages/blog-list.tsx`):

| `category` id | English label | Amharic (suggested) | Use for |
|---------------|---------------|---------------------|---------|
| `area-guide` | Area Guides | የአካባቢ መመሪያ | Neighborhood / subcity relocation |
| `service-guide` | Service Guides | የአገልግሎት መመሪያ | Office, condo, long-distance, storage |
| `pricing-guide` | Pricing & Planning | ዋጋ እና Planning | Costs, quotes, contracts, insurance |
| `commercial-guide` | Commercial & B2B | ንግድ / መስሪያ ቤት | BPO, retail, kitchen, warehouse |
| `checklist-guide` | Checklists | kontrol list | Move-in/out, handover, tenant |

Blog categories (`moving-tips`, `packing-guide`, etc.) stay on blog only.

### 3.4 Content rules (editorial)

- **Title:** Include place or service + “guide” / “complete guide” where natural for SEO.
- **Excerpt:** 1–2 sentences; primary keyword in first 120 characters.
- **Body:** H2 sections; bullet lists for logistics; mention Active Movers once in intro + conclusion.
- **status:** `draft` excluded from public list and sitemap until `published`.
- **id prefix:** `guide-...` vs blog `blog-...` to avoid collisions in analytics.

---

## 4. Code implementation phases

### Phase 0 — Docs and sample content (done / in progress)

- [x] This implementation plan
- [x] [GUIDES_CONTENT_CHECKLIST.md](./GUIDES_CONTENT_CHECKLIST.md)
- [ ] Add 1–3 sample JSON files under `data/guides/` when coding starts

### Phase 1 — Data layer

**Create** `lib/guide-data.ts` by adapting `lib/blog-data.ts`:

| Function | Behavior |
|----------|----------|
| `getAllGuides()` | Read `data/guides/*.json`, parse dates, sort by `publishedAt` desc |
| `getGuideBySlug(slug)` | Single lookup |
| `getGuidesByCategory(category)` | Filter |
| `getRelatedGuides(post, limit)` | Same logic as `getRelatedBlogPosts` (category + tags) |
| `searchGuides(query)` | Same as blog search |

Export types `GuidePost` / `JsonGuidePost` (can alias same shape as blog or extend later).

**Optional refactor (Phase 1b):** Extract shared `lib/content-json.ts` with `loadContentFromDir(dirName)` to avoid duplication — only if you want one loader for blog + guides.

### Phase 2 — Routes and pages

| Path | File | Notes |
|------|------|--------|
| `/guides` | `app/guides/page.tsx` | Metadata title: “Moving Guides - Active Movers” |
| `/guides/[slug]` | `app/guides/[slug]/page.tsx` | `generateMetadata` via `generateSEO`, `notFound()` if missing |

Pattern: copy `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`; swap imports to `guide-data` and guide components.

**Static generation (optional):** `generateStaticParams()` from all published slugs for faster builds — same as you may add for blog later.

### Phase 3 — UI components

| Component | Based on | Guide-specific changes |
|-----------|----------|-------------------------|
| `components/pages/guide-list.tsx` | `blog-list.tsx` | Headline “Moving Guides”, categories from §3.3, link `/guides/{slug}` |
| `components/pages/guide-post.tsx` | `blog-post.tsx` | Breadcrumb “Guides”, prominent **Book a move** → `/booking`, optional “Related guides” |
| `components/seo/guide-seo.tsx` | `blog-seo.tsx` | Breadcrumb `Home > Guides > Title`; `section` = category |

**Visual differentiation (light):**

- Badge label “Guide” instead of blog category chip styling only
- Optional sidebar: phone, booking button, links to `/services/*`
- Footer line: “Last updated” if `updatedAt` present

### Phase 4 — Navigation and i18n

| File | Change |
|------|--------|
| `components/header.tsx` | Add `{ href: '/guides', label: t('nav.guides') }` after Blog or before |
| `components/footer.tsx` | Quick link to `/guides` |
| `components/bole-bulbula-footer.tsx` | Same if that site variant should match |
| Translation source (where `nav.blog` lives) | Add `nav.guides` EN + AM |

### Phase 5 — SEO and sitemap

| Item | Action |
|------|--------|
| `lib/sitemap-generator.ts` | Import `getAllGuides()`; add `/guides` (priority ~0.9) and each `/guides/{slug}` (priority ~0.75–0.8, `changefreq: monthly`) |
| News sitemap | **Do not** add guides (not news) |
| Canonical | Always `https://www.activemoverset.com/guides/{slug}` |
| Schema | Article or `HowTo` where steps exist; FAQ block if `faq` added in v2 |
| Internal links | From new guides to blog posts with `- [Read more tips](/blog/...)` |

Regenerate / deploy `public/sitemap.xml` via existing admin or build hook if applicable.

### Phase 6 — Admin (optional v1.1)

| Item | Action |
|------|--------|
| `app/admin/guides/add/page.tsx` | Clone `app/admin/blog/add/page.tsx` |
| `components/admin/add-guide-form.tsx` | Clone add-blog; POST writes JSON to `data/guides/` **or** new API route |
| `app/api/guides/route.ts` | GET list / POST create file (mirror JSON workflow if not using Prisma) |
| `components/admin/admin-dashboard.tsx` | Card “New Guide” → `/admin/guides/add` |

**v1 minimum:** authors can add JSON by hand + checklist; admin can wait.

### Phase 7 — Analytics and QA

| Check | How |
|-------|-----|
| `trackEvent` on guide list / guide CTA | Match blog patterns in `lib/analytics` |
| Lighthouse / CLS | Hero image dimensions on guide detail |
| Search Console | Submit updated sitemap after launch |
| 404 | Draft slugs not linked publicly |

---

## 5. File checklist (implementation)

Copy or create the following:

```
data/guides/
  README.md                          # optional: pointer to checklist + schema
  {slug}.json                        # one file per guide

lib/guide-data.ts

app/guides/page.tsx
app/guides/[slug]/page.tsx

components/pages/guide-list.tsx
components/pages/guide-post.tsx
components/seo/guide-seo.tsx

# Phase 4+
components/header.tsx                # edit
components/footer.tsx                # edit
# translations                       # edit

# Phase 5+
lib/sitemap-generator.ts             # edit

# Phase 6 (optional)
app/admin/guides/add/page.tsx
app/api/guides/route.ts
components/admin/add-guide-form.tsx
```

---

## 6. Blog vs guides — decision matrix

When creating **new** content, use this:

| Write as **blog** (`/blog`) | Write as **guide** (`/guides`) |
|-----------------------------|--------------------------------|
| Seasonal (Timket, Meskel, Enkutatash) | “Complete guide to [neighborhood]” |
| Short tips, hacks, listicles | Pricing, contracts, insurance deep dives |
| Company news, behind the scenes | Office / BPO / warehouse relocation playbooks |
| “Things to do after move” lifestyle | Tenant handover, woreda address change |
| Packing trick for one item | End-to-end service guide (condo, villa, long-distance) |

If unsure: **local + commercial intent → guide**; **timely or narrow tip → blog**.

---

## 7. Launch sequence

1. Implement Phases 1–3 with **3–5 published** sample guides (see checklist “Starter pack”).
2. Phase 4 nav + Phase 5 sitemap.
3. Soft launch: link guides from homepage or services page (one module “Popular guides”).
4. Produce new guides from checklist; **do not** bulk-migrate blog until priorities are clear.
5. Phase 6 admin when non-devs need to publish.

---

## 8. Optional migration from existing blog

**Not required for launch.** If you later split content:

1. Pick candidates via slug/title patterns: `*guide*`, `*complete*`, `*movers-guide*`, `*relocation-guide*`.
2. Copy JSON to `data/guides/`; change `id` to `guide-...`; set `category` per §3.3.
3. On old blog post: either remove JSON or add short blog stub with link: “Full guide moved to […](/guides/...)”.
4. **301 redirects** from old `/blog/{slug}` only if you delete or replace blog URL (avoid breaking 500 URLs without a redirect map).

Script idea (future): `scripts/migrate-blog-to-guide.ts` — dry-run list only; manual approve per file.

---

## 9. Testing plan

| Test | Expected |
|------|----------|
| `/guides` loads, filters by category | Only `status: published` |
| `/guides/valid-slug` | Renders HTML content, metadata correct |
| `/guides/invalid-slug` | 404 |
| Draft guide JSON | Not in list, not in sitemap |
| Mobile nav | Guides link works |
| Related guides | Same category/tags surface 3 items |
| Booking CTA | Navigates to `/booking` |

---

## 10. Success metrics (30–90 days)

- Indexed `/guides/*` URLs in Search Console
- Impressions/clicks for “movers [area] Addis” queries on guide URLs
- Booking clicks from guide pages (analytics event)
- Checklist: steady movement from **Idea → Published** (see checklist doc)

---

## 11. References in this repo

| Resource | Path |
|----------|------|
| Blog data loader | `lib/blog-data.ts` |
| Blog list UI | `components/pages/blog-list.tsx` |
| Blog detail UI | `components/pages/blog-post.tsx` |
| Blog routes | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` |
| Sitemap | `lib/sitemap-generator.ts` |
| Example JSON | `data/blogs/group-moving-discounts-neighbors-same-condo-active-movers.json` |
| Content backlog | `docs/GUIDES_CONTENT_CHECKLIST.md` |

---

## 12. Open decisions (fill in when you decide)

| Decision | Options | Chosen |
|----------|---------|--------|
| Nav label EN | “Guides” / “Moving Guides” / “Area Guides” | _TBD_ |
| Admin v1 | JSON-only vs admin form | _TBD_ |
| Migrate blog posts | Yes (how many) / No / Later | _Later_ |
| Amharic body content | Per-guide vs excerpt-only | _TBD_ |

---

**Next step:** Implement Phase 1–3, add starter guides from the checklist “Starter pack” section, then wire nav + sitemap.
