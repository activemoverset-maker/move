# Implementation Plan: Agentic browsing 4/4

**Project:** Active Movers & Packers (`https://www.activemoverset.com`)  
**Benchmark:** [habeshamovers.com](https://www.habeshamovers.com/) Lighthouse Agentic **4/4** (their [llms.txt](https://www.habeshamovers.com/llms.txt) and [ai-catalog.json](https://www.habeshamovers.com/ai-catalog.json), fetched 29 Oct 2026)  
**Related:** [IMPLEMENTATION_PLAN_HOMEPAGE_SEO.md](./IMPLEMENTATION_PLAN_HOMEPAGE_SEO.md) (menu and contact names). Performance and LCP stay closed.

Lighthouse 13.5’s Agentic category is four checks, not the two-name check from earlier runs:

| Audit | Habesha | Active Movers (local, pre-deploy) |
|-------|---------|-------------------------------------|
| Accessibility tree is well-formed | Pass | **Fixed** — map pin `aria-label` / `aria-pressed` in `service-areas-section.tsx`; menu + contact from `383df53` |
| Cumulative Layout Shift | Pass (their lab 0.011) | Lab CLS is 0. Leave it. |
| `llms.txt` follows recommendations | Pass | **`public/llms.txt`** + `rel="describedby"` in `app/layout.tsx` |
| `ai-catalog.json` schema is valid | Pass | **`public/ai-catalog.json`** |

Low warnings on Habesha’s catalog (“media type text/html is not a standard discovery type”) did not fail the audit. Do not chase those.

This does not change rankings, GBP, or the index tier. It makes the site readable to agents and clears the Lighthouse category.

---

## Specs to follow

**llms.txt** — [llmstxt.org](https://llmstxt.org/) (v2, August 2026):

1. One H1: the site name. Required. Nothing before it.
2. A blockquote: one or two sentences.
3. Optional prose with no extra headings.
4. H2 sections whose items are `- [Name](https://absolute-url): short note`.
5. Absolute `https` URLs. A final `## Optional` section only for links an agent can skip. No YAML front matter.

v2 also allows `<link rel="describedby" href="https://www.activemoverset.com/llms.txt">` in the document head so agents can find the file without guessing. Add that in `app/layout.tsx`.

**ai-catalog.json** — the schema Lighthouse 13.5 validates ([ARD conformance notes in Lighthouse 13.5](https://unpkg.com/lighthouse@13.5.0/third-party/ard/README.md), schema `ai-catalog.schema.json`). Habesha’s file is the working example for this version: `specVersion` `"1.0"`, a `host` object, and `entries` with `identifier` (`urn:air:…`), `displayName`, `type`, `url`, `description`, `tags`, `capabilities`, `representativeQueries` (a few real questions), `version`, `updatedAt`.

Newer Lighthouse builds prefer `/.well-known/ard.json` and warn on `ai-catalog.json` ([Lighthouse changelog, ARD v0.91](https://github.com/GoogleChrome/lighthouse/pull/17258)). The user’s current report is 13.5 and scores `ai-catalog.json`. Ship **`/ai-catalog.json`** so this lab matches Habesha. Do not also invent a second schema in this pass.

---

## 1. Accessibility tree

**File:** `components/sections/service-areas-section.tsx`

Each map pin is a `<motion.button>` with no name (~103). Add `aria-label` from the area name already on the pin (`area.en` / `area.am`), for example “Show Bole on the map” and the Amharic equivalent when `language === 'am'`.

Re-check the homepage for any other control that is only an icon. Menu and the bento contact link were named in `383df53`. Do not restyle the map. Do not change price colors in this pass.

---

## 2. `/llms.txt`

**File:** `public/llms.txt` (served at `https://www.activemoverset.com/llms.txt`).

Mirror Habesha’s **shape**, not their claims. Use only facts already on this site:

- Brand: Active Movers & Packers.
- Phone: `+251982260000` (display `0982260000`). Do not use Habesha’s numbers.
- Email and address already in `constants/site.ts` (`activemoverset@gmail.com`, Beka Building, Addis Ababa).
- Services that exist: local moving `/services/local-moving`, packaging `/services/packaging`, storage `/services/storage`, office relocation `/services/office-relocation`.
- Booking `/booking`, contact `/contact`, prices on `/#pricing`, guides index `/guides`, and the 2026 cost guide `/guides/how-much-do-movers-cost-addis-ababa-2026-guide`.
- Starting prices from `constants/pricing.ts`: studio from 17,000 ETB, 2-bedroom 22,000, 3-bedroom 28,000, villa 38,000, office from 45,000, stair carry often 2,000–5,000. Say they are starting prices, not a binding quote.
- Do not copy “4.9 stars”, “300+ moves”, “50+ reviews”, or “best moving company” unless those figures are already published on this site. They are not.

Suggested sections, each an H2 with link lists where there are URLs:

1. H1 `Active Movers & Packers` and a blockquote: movers and packers in Addis Ababa; call `0982260000` to book.
2. Contact and hours (prose or a short list, no H3).
3. Services, with one link per real URL and a one-line note.
4. Prices, pointing at `/#pricing` and the cost guide, plus the starting figures above.
5. Key links: home, booking, contact, guides, service areas page if one exists (`/bole-bulbula` only if it is a real area page).
6. `## Optional`: sitemap `https://www.activemoverset.com/sitemap.xml`.

Add one line to `public/robots.txt`:

```
# LLM guidance
# https://www.activemoverset.com/llms.txt
```

Allow the file (the current `Allow: /` already does). Do not add Habesha’s `llms-full.txt` unless the short file is not enough after the Lighthouse run.

---

## 3. `/ai-catalog.json`

**File:** `public/ai-catalog.json`.

Copy Habesha’s field names. Replace host and entries with this site:

- `host.displayName`: Active Movers & Packers
- `host.identifier`: `did:web:www.activemoverset.com`
- `host.documentationUrl`: `https://www.activemoverset.com/llms.txt`
- `host.logoUrl`: a logo URL that returns 200 (`https://www.activemoverset.com/images/logotr.png` if that file is deployed)

Entries (same shape as theirs, `type` may stay `text/html` or `text/markdown` for llms.txt; the low media-type warning is acceptable):

| displayName | URL |
|-------------|-----|
| Book a move | `https://www.activemoverset.com/booking` |
| Local moving | `https://www.activemoverset.com/services/local-moving` |
| Office relocation | `https://www.activemoverset.com/services/office-relocation` |
| Packaging | `https://www.activemoverset.com/services/packaging` |
| Storage | `https://www.activemoverset.com/services/storage` |
| AI agent guidance (llms.txt) | `https://www.activemoverset.com/llms.txt` (`type`: `text/markdown`) |

Each entry: unique `urn:air:www.activemoverset.com:…` identifier, a one-sentence description, 2–4 `representativeQueries` a customer would actually ask, `version` `1.0.0`, `updatedAt` the ship date in ISO-8601. No quote calculator entry. This site’s booking page is `/booking`, not `/quote`.

In `app/layout.tsx` metadata or the root `<head>`, add:

```html
<link rel="describedby" href="https://www.activemoverset.com/llms.txt">
```

That is the v2 discovery hint. It is not a substitute for the file at `/llms.txt`.

---

## 4. Do not do

| Item | Why |
|------|-----|
| Copy Habesha review counts, prices, or phone | Different business. |
| WebMCP, agent cards, or an MCP server | Not what their 4/4 required. |
| CSS, hero image, gtag | Lab performance is already 95. |
| Price contrast and other a11y beyond unnamed controls | Separate pass. |
| `/.well-known/ard.json` | Only if a later Lighthouse (past 13.5) fails `ai-catalog.json` and asks for ARD v0.91. |

---

## 5. Check

1. `https://www.activemoverset.com/llms.txt` is markdown, starts with one `# Active Movers & Packers`, and every link is absolute.
2. `https://www.activemoverset.com/ai-catalog.json` is valid JSON and lists only live URLs.
3. Map pins have accessible names. Mobile menu and contact icon still do.
4. `npm run build` succeeds.
5. Mobile Lighthouse 13.5 on `/`: Agentic browsing **4/4**. Record the four audit names here. Low media-type warnings on catalog entries are fine if the schema audit passes.

---

## 6. Order of work

| Step | Work | Status |
|------|------|--------|
| 1 | Map pin `aria-label` / `aria-pressed` | **Done** — `service-areas-section.tsx` |
| 2 | `public/llms.txt` + robots comment | **Done** |
| 3 | `public/ai-catalog.json` | **Done** |
| 4 | `<link rel="describedby">` in `app/layout.tsx` | **Done** |
| 5 | Deploy, Lighthouse Agentic 4/4 | Pending |
