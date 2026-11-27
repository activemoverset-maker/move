# Implementation Plan: Restore pages excluded by `noindex`

**Project:** Active Movers & Packers (`https://www.activemoverset.com`)  
**Trigger:** Google Search Console → **Excluded by ‘noindex’ tag** (first detected **11/7/26**). Indexed-page count and impressions dropped after that.  
**Cause:** Not `robots.txt`. Ranking recovery W0 set **`index: false`** on **~622** of **670** blog/guide JSON files. Detail pages emit `noindex, follow` via `isIndexable()` in `lib/content-indexing.ts` and `generateSEO()`. The sitemap omits those URLs.  
**Related:** [IMPLEMENTATION_PLAN_RANKING_RECOVERY.md](./IMPLEMENTATION_PLAN_RANKING_RECOVERY.md) · [GUIDES_CONTENT_CHECKLIST.md](./GUIDES_CONTENT_CHECKLIST.md)

**Do not** “fix” this by deleting `Disallow` lines in `robots.txt`. Google is obeying the page tag.

**Reviewed:** 27 Nov 2026. Indexing rule, flagship vs denylist, and the “expect 48” checks below are the rules to implement. Do not follow an older sentence in this file if it conflicts with §2.

---

## 1. What is broken vs what is working

| Surface | Expected robots | In the noindex bucket? |
|---------|-----------------|------------------------|
| `/`, `/services/*`, `/booking`, `/contact`, `/about`, `/bole-bulbula` | `index, follow` (`app/layout.tsx`) | **No.** If one of these appears, stop and inspect that URL before touching the catalog. |
| ~48 allowlisted guides/blogs | `index, follow` | **No.** |
| ~622 other `/blog/{slug}` and `/guides/{slug}` | `noindex, follow` | **Yes.** This is the GSC report. |

The allowlist lives in `scripts/fix-guide-blog-metadata.mjs`:

- `FLAGSHIP_SLUGS` (25 guides) → `index: true`, `quality: flagship`
- `SECONDARY_INDEX_SLUGS` (17 guides) → `index: true` if ≥400 words
- `BLOG_INDEX_SLUGS` (6 blogs) → `index: true`
- **Everything else → `index: false`**, even when the body is already ≥400 words and `quality` is `enriched`

Re-running that script with `--write` **puts the hold back**. Any recovery must change the script, not only flip JSON once.

W0 already expanded posts to **≥400 words** and cleared the metadata audit. The remaining hold is the allowlist default, not a missing word-count pass.

The homepage strip is already safe to leave alone. `getFeaturedGuides()` sorts `quality: "flagship"` first, and `components/sections/moving-guides-section.tsx` renders `.slice(0, 4)`. Restoring index flags does not put 100 guides on `/`.

---

## 2. Decision (one rule)

**Index every published post of at least 400 words**, unless the slug is on `NOINDEX_SLUGS`.

This pass does **not** keep `quality: "needs-enrichment"` as a hold. W0 already marked the catalog `enriched`. If a published file is still `needs-enrichment` or has no quality, and it has ≥400 words and is not on the denylist, set `quality` to `"enriched"` and `index` to `true` in the same write.

| Result | When |
|--------|------|
| `index: false` | `status` is not `published` |
| `index: false` | Word count under 400 |
| `index: false` | Slug is in `NOINDEX_SLUGS` (a blog that is a thinner copy of a guide) |
| `index: true`, `quality: "flagship"` | Slug is in `FLAGSHIP_SLUGS` and `status` is `published`. **Flagship always wins over the denylist.** Do not put a flagship guide in `NOINDEX_SLUGS`. |
| `index: true`, keep `flagship` if already set, otherwise `quality: "enriched"` | Published, ≥400 words, not on the denylist |

`isIndexable()` already returns false for drafts and for `needs-enrichment`. After this write, runtime and JSON should agree: a draft is `index: false`; a restored post is `index: true` and `enriched` or `flagship`.

Do **not** request indexing for all 622 URLs in Search Console on day one. Flip the tags, ship the sitemap, and request indexing only for former holds. Google will recrawl the rest from the sitemap.

Homepage title stays **`Movers in Addis Ababa | Active Movers & Packers`**. This plan does not change money-page titles.

Near-duplicate paragraphs from `bulk-finish-thin-content.mjs` are an accepted quality risk. They are not a reason to leave the catalog on `noindex`. Unique local rewrites can continue after the tags are restored.

---

## 3. Code changes

### 3.1 `scripts/fix-guide-blog-metadata.mjs`

Replace the “allowlist or else false” branch. Apply in this order so flagship and draft cannot both win:

1. If `status !== "published"` → `index: false`. Stop. Do not promote quality.
2. If `FLAGSHIP_SLUGS` has the slug → `quality: "flagship"`, `index: true`. Stop. Flagship beats `NOINDEX_SLUGS`.
3. If word count &lt; 400, or slug is in `NOINDEX_SLUGS` → `index: false`. Leave an existing `flagship` quality as-is if you ever hit this branch; do not downgrade it to `enriched`. This branch should not contain flagship slugs.
4. Otherwise → `index: true`. If `quality` is missing or `needs-enrichment`, set `quality: "enriched"`. If it is already `flagship` or `enriched`, leave quality unchanged.

Delete `SECONDARY_INDEX_SLUGS` and `BLOG_INDEX_SLUGS` in the same change. Commented-out copies will get restored by accident.

`NOINDEX_SLUGS` starts as the list from §4. An empty set is allowed.

Dry run first:

```bash
node scripts/fix-guide-blog-metadata.mjs
node scripts/fix-guide-blog-metadata.mjs --write
node scripts/count-indexable-urls.mjs
```

**Target count:** on the order of **650+** indexable URLs (670 minus denylist, drafts, and any file still under 400 words), not 48.

### 3.2 `scripts/count-indexable-urls.mjs`

The script currently warns unless the total is exactly 48, and tells you to re-run the metadata script to “fix” the drift. That warning would fire on a successful recovery.

In the same change:

- Count published posts with `index === true` (already what it does).
- Drop the hard-coded `total !== 48` warning.
- Print the total. Optionally warn only if the total is still under 100, which would mean the allowlist branch is still in effect.

### 3.3 Runtime (no behavior change if JSON is correct)

These already honor `index`:

- `lib/content-indexing.ts` → `isIndexable()`
- `app/(main)/blog/[slug]/page.tsx` and `app/guides/[slug]/page.tsx` → `generateSEO({ index })`
- `lib/sitemap-generator.ts` → `getIndexableBlogPosts()` / `getIndexableGuides()`

After the JSON write, sitemap and HTML robots follow automatically. Do not special-case robots.txt.

`generateSitemap()` also appends published rows from Prisma before the JSON list, and dedupes by slug. JSON is the catalog that matters. After deploy, if the live sitemap contains blog URLs that are not in `data/blogs/`, note them. Do not block this pass on the database.

### 3.4 Homepage featured strip

No code change. Flagship sort plus `.slice(0, 4)` already caps the strip. Do not remove the slice.

### 3.5 Docs in the same change

The ranking-recovery doc still describes **48** as the live policy in the inventory (§1), the sitemap row (§3.5), and the W0 / §6.2 rollout. Update those in the same commit so the next reader does not re-apply the allowlist. Point them here.

- [IMPLEMENTATION_PLAN_RANKING_RECOVERY.md](./IMPLEMENTATION_PLAN_RANKING_RECOVERY.md) — inventory, §3.5 sitemap row, §6.2 “W0 hold” as historical, Appendix C already points here.
- [GUIDES_CONTENT_CHECKLIST.md](./GUIDES_CONTENT_CHECKLIST.md) — replace “expect **48**” with the count from `count-indexable-urls.mjs`.
- [DEPLOY_AND_GBP_CHECKLIST.md](./DEPLOY_AND_GBP_CHECKLIST.md) — if it says to inspect an `index: false` URL as the normal case, change that to: one restored URL shows `index, follow`; one denylist or draft URL still shows `noindex`.

---

## 4. Denylist (only real duplicates)

Before `--write`, skim pairs where a **blog** and a **guide** target the same query. Canonical stays the **guide**. Set the **blog** slug in `NOINDEX_SLUGS` and keep a visible link to the guide in the blog body.

Never add a `FLAGSHIP_SLUGS` guide to `NOINDEX_SLUGS`. The script ignores the denylist for those slugs anyway.

Start with pairs you can confirm by title, not a guess. Examples to check (include the blog only if it is a thinner copy of the guide):

| Check blog | Prefer guide |
|------------|----------------|
| Posts titled like “movers in Megenagna / Bole / CMC / Gerji” | Matching `*-moving-guide*` already in `FLAGSHIP_SLUGS` |
| “How much do movers cost” / 2025 cost posts | `how-much-do-movers-cost-addis-ababa-2026-guide` |

If a pair is unclear, **index both** in this pass. A wrong denylist hides a URL again. A duplicate can be noindexed in a follow-up after GSC shows cannibalization.

Do not noindex `/`, services, booking, or the guide index.

Record the final `NOINDEX_SLUGS` list in §7 before `--write`. Empty is a valid result.

---

## 5. Ship order

| Step | Work | Done when |
|------|------|-----------|
| 1 | Spot-check one GSC example URL is `/blog/` or `/guides/`, not `/` | Confirmed |
| 2 | Build `NOINDEX_SLUGS` from §4 (may be empty). No flagship slugs in it | List in §7 |
| 3 | Change the metadata script (§3.1) and the counter (§3.2). Dry run, then `--write` | Count ≫ 48, counter does not warn “expected 48” |
| 4 | Update the “48” lines in §3.5 | Docs match the new count |
| 5 | `npm run build` | Succeeds |
| 6 | Commit JSON + script + docs. Do not commit `.env` | On `main` |
| 7 | After deploy, view source on one former hold URL: `index, follow`. Sitemap includes it | Live |
| 8 | GSC: submit sitemap. Request indexing for **up to 15 former holds** that used to get impressions | Submitted |
| 9 | Week 2–4: Pages report — “Excluded by noindex” should fall; indexed count should rise | Recorded in §7 |

Do **not** spend indexing requests on URLs that are already indexed. These stay in Google without a request:

- `https://www.activemoverset.com/`
- `https://www.activemoverset.com/guides/how-much-do-movers-cost-addis-ababa-2026-guide`
- `https://www.activemoverset.com/guides/bole-moving-guide-addis-ababa-2026`
- `https://www.activemoverset.com/services/local-moving`

Use the requests on former holds. Export GSC Performance → Pages for the period before 11/7/26 if the range allows, and pick slugs that had impressions and are now `index: false`. If that export is not available, pick 10 neighborhood or cost blogs that are not on `NOINDEX_SLUGS`.

---

## 6. What not to do

| Don’t | Why |
|-------|-----|
| Remove `noindex` by editing `robots.txt` | The tag is in HTML metadata. |
| Set every file `index: true` by hand | The metadata script will revert them on the next `--write`. |
| Leave `SECONDARY_INDEX_SLUGS` / `BLOG_INDEX_SLUGS` in the script | The old branch comes back. |
| Leave the counter expecting 48 | A good run looks like a failure. |
| Mass “Request indexing” on 622 URLs | Quota and no extra ranking benefit. Sitemap is the path. |
| Request indexing for `/` and the flagship guides | They are already indexed. |
| Put a flagship guide on `NOINDEX_SLUGS` | Flagship wins in code, and the guide should stay indexed. |
| Delete the 622 JSON files | Lists and old links still need the URLs. |
| Change the homepage title again in this pass | Separate experiment, already shipped. |

---

## 7. Checklist

- [x] GSC sample is the catalog `noindex` (Excluded by noindex, first detected 11/7/26), not money pages
- [x] `NOINDEX_SLUGS`:
  - `how-much-do-movers-cost-addis-ababa-2026-pricing-guide` (same query as the 2026 cost guide; body already links to it)
  - `moving-costs-addis-ababa-2025` (stale 2025 price tables; body now links to the 2026 guide)
- [x] No flagship slug is in that list
- [x] Script order is draft → flagship → denylist/short → everyone else `index: true`
- [x] `count-indexable-urls.mjs` no longer expects 48
- [x] Count recorded: **668** (166 guides + 502 blogs)
- [x] Ranking-recovery inventory, sitemap row, guides checklist, and deploy checklist updated
- [x] Build passes
- [ ] Deployed; one former hold URL shows `index, follow`
- [ ] Sitemap submitted; up to 15 **former holds** requested
- [ ] Day 28: excluded-by-noindex count ______ ; indexed count ______

---

## 8. Success

Search Console **Excluded by ‘noindex’ tag** shrinks to drafts, posts under 400 words, and `NOINDEX_SLUGS`. Homepage and service URLs stay indexed. The homepage still shows four guides.

Impressions may lag the tag change by days to a few weeks. Judge the fix by the Pages report, not by the next morning’s ranking for “movers in Addis Ababa.”
