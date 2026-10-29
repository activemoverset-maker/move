# Implementation Plan: Homepage SEO 92 and Agentic browsing

**Project:** Active Movers & Packers (`https://www.activemoverset.com`)  
**Source:** Mobile Lighthouse 13.5.0 after the LCP pass (lab performance **95**).  
**Related:** [IMPLEMENTATION_PLAN_HOMEPAGE_LCP.md](./IMPLEMENTATION_PLAN_HOMEPAGE_LCP.md) — image and hydration work is done. Do not reopen it in this pass.

This pass is the leftover Lighthouse content checks on `/`. It does not change indexing, schema, or GBP.

| Category | Now | Target |
|----------|-----|--------|
| SEO | 92 | **100** on `/` |
| Agentic browsing | 1/2 | **2/2** |
| Accessibility | 87 | Unchanged unless the two named controls were part of that score. Map pins and price contrast stay out. |

---

## 1. Six “Learn More” links (SEO)

Lighthouse “Links do not have descriptive text” lists six homepage links that share generic text. Each visible label must name the destination.

| Destination | File | Current text |
|-------------|------|----------------|
| `/services/local-moving` | `components/sections/services-section.tsx` (~352) | `t('services.learnMore')` → “Learn More” |
| `/services/packaging` | same | “Learn More” |
| `/services/storage` | same | “Learn More” |
| `/services/office-relocation` | same | “Learn More” |
| `/services` | same, bottom CTA (~557) | `t('services.bottomCTA.learnMore')` → “Learn More” |
| `/services/packaging` | `components/sections/bento-features-section.tsx` (~127) | “Learn more” |

`SERVICES` in `constants/site.ts` already has `title` and `titleAm` per card (`Local Moving`, `Packaging Services`, `Storage`, `Office Relocation`, and the Amharic strings).

### Change

1. On each service card, replace `{t('services.learnMore')}` with the card’s own title:

   English: `Learn about {service.title}`  
   Amharic: `{service.titleAm}`

   Do not change the shared `services.learnMore` string in `lib/i18n.ts` to one new phrase. Four cards would still share it. Leave that key in place so `/services` (`components/pages/services-overview.tsx`) is unchanged in this pass.

2. Bottom CTA (`href="/services"`): replace `t('services.bottomCTA.learnMore')` with a new string, English **“View all services”**, Amharic equivalent in the same branch (`language === 'am'`). Update `lib/i18n.ts` `services.bottomCTA.learnMore` only if both languages are set there; otherwise set the string at the call site the way the bento already branches on `isAm`.

3. Bento packaging link (`href="/services/packaging"`): replace “Learn more” / “ተጨማሪ” with **“Packaging services”** / the packaging `titleAm`. It must not stay identical to the four service-card labels if those labels are also “Packaging Services” only — “Learn about packaging” on the bento and “Learn about Packaging Services” on the card is enough difference. The audit fails repeated generic text, not two links that both mention packaging.

4. Keep `href`s, click handlers, and icons. Only the visible text changes.

### Done when

- View source of `/` has no anchor whose only text is “Learn More” or “Learn more”.
- The six destinations above each have distinct, destination-specific text.
- Mobile Lighthouse SEO on `/` is **100**.

---

## 2. Two unnamed controls (Agentic browsing)

These are the only Agentic failures. They match two Accessibility “names and labels” items. Fix both in this pass.

### Mobile menu — `components/header.tsx` (~137)

The `lg:hidden` button wraps a Menu or X icon and has no name.

Add `aria-label={isOpen ? 'Close menu' : 'Open menu'}`. If the header already has Amharic strings for the menu, use those when `language === 'am'`. Do not add visible text. The icon stays.

### Contact icon — `components/sections/bento-features-section.tsx` (~210)

The `href="/contact"` link contains only `ArrowUpRight`.

Add `aria-label` **and** a `<span className="sr-only">Contact us</span>` (Amharic equivalent when `isAm`). The arrow stays. Screen readers, the accessibility tree, and crawlers then all see “Contact us”.

### Done when

- Agentic browsing on `/` is **2/2**.
- Those two nodes are gone from “Buttons must have discernible text” and “Links must have discernible text”.

---

## 3. Do not do in this pass

| Finding | Why skip |
|---------|----------|
| Map pin buttons in `service-areas-section.tsx` | Not in the SEO 92 or Agentic 1/2 lists. Separate a11y pass. |
| `text-primary` price contrast in the pricing table | Same. |
| “Learn More” on `components/pages/services-overview.tsx` | Not on `/`. Fix only if a later run of `/services` fails the same audit. |
| LCP, CSS, gtag, hero image | Lab performance is 95. Leave [IMPLEMENTATION_PLAN_HOMEPAGE_LCP.md](./IMPLEMENTATION_PLAN_HOMEPAGE_LCP.md) closed. |
| GBP and Search Console | Still [DEPLOY_AND_GBP_CHECKLIST.md](./DEPLOY_AND_GBP_CHECKLIST.md). |

---

## 4. Check

1. `npm run build` succeeds.
2. Homepage still shows the four service cards, the “view all services” button, the packaging bento link, the contact arrow, and the mobile menu.
3. Mobile Lighthouse on production `/`: SEO **100**, Agentic browsing **2/2**. Record the scores at the bottom of this file.

---

## 5. Order of work

| Step | Work | Status |
|------|------|--------|
| 1 | Descriptive service + bottom + bento links | **Done** — `services-section.tsx`, `bento-features-section.tsx`, `lib/i18n.ts` bottom CTA |
| 2 | Menu `aria-label` + contact link name | **Done** — `header.tsx`, bento contact link |
| 3 | Deploy, re-run Lighthouse on `/` | Pending |
