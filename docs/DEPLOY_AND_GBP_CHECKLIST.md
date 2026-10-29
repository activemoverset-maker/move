# Deploy, GBP & Search Console — Manual Checklist

**Companion:** [IMPLEMENTATION_PLAN_RANKING_RECOVERY.md](./IMPLEMENTATION_PLAN_RANKING_RECOVERY.md) Phases 4 & 6  
**Locked phone:** `+251982260000` · **Brand:** Active Movers & Packers  
**Indexable content URLs in repo:** **48** (run counter below after metadata changes)

---

## Before deploy

1. Set hosting env: `PHONE_NUMBER=+251982260000`, `WHATSAPP_NUMBER=+251982260000`, `NEXT_PUBLIC_SITE_URL=https://www.activemoverset.com`
2. `npm run build` succeeds locally
3. `node scripts/audit-guide-blog-metadata.mjs` → **Issues 0**
4. `node scripts/count-indexable-urls.mjs` → expect **48** indexable JSON posts (+ static routes in sitemap)

---

## Same week as deploy — Google Business Profile

| Field | Value |
|--------|--------|
| Name | Active Movers & Packers |
| Primary category | Mover (or closest GBP category) |
| Phone | **+251982260000** |
| Website | https://www.activemoverset.com/ |
| Address | Beka Building, Addis Ababa (match site) |
| Hours | Mon–Fri 8:00–18:00 (match `SITE_CONFIG.businessHours` until Saturday confirmed) |

Add photos monthly; respond to reviews; post occasional service updates.

---

## Day 0 — Search Console

- [ ] Confirm property for `https://www.activemoverset.com`
- [ ] Submit sitemap: `/sitemap-index.xml` or `/sitemap.xml` (whatever production serves)
- [ ] URL inspect: `/`, `/guides/how-much-do-movers-cost-addis-ababa-2026-guide`, one flagship area guide
- [ ] URL inspect one **`index: false`** blog (should show noindex if correct)
- [ ] Note baseline impressions/clicks for: brand query, “movers addis ababa”, “movers and packers addis ababa”

---

## Week 1–4

- [ ] Coverage: sitemap discovered; indexed count rises on **48** URLs, not 670
- [ ] Fix any “Duplicate without user-selected canonical” on blog/guide pairs (§6.7)
- [ ] Field CWV on homepage (Phase 5 only if **Poor**)

---

## Day 28

- [ ] Compare GSC queries vs day 0
- [ ] GBP insights: calls, direction requests, reviews
- [ ] Re-run `node scripts/audit-guide-blog-metadata.mjs` if editors changed JSON

---

## Optional editorial (W2–W5)

8–15 hand-enriched slugs per week from [GUIDES_CONTENT_CHECKLIST.md](./GUIDES_CONTENT_CHECKLIST.md); keep long-tail on `index: false` until pass §6.3 bar.
