# Implementation Plan: Homepage LCP (PageSpeed 29 Oct 2026)

**Project:** Active Movers & Packers (`https://www.activemoverset.com`)  
**Source:** Mobile Lighthouse 13.5.0, Slow 4G, Moto G Power, captured 29 Oct 2026 11:52 GMT+3  
**Related:** [IMPLEMENTATION_PLAN_RANKING_RECOVERY.md](./IMPLEMENTATION_PLAN_RANKING_RECOVERY.md) Phase 5 (speed only if field CWV is poor)

Lab scores that day: **Performance 79**, Accessibility 87, Best Practices 100, SEO 92. **Field data: none** (Search Console “No Data”). Google is not using this lab run for rankings yet.

| Metric | Lab | Target |
|--------|-----|--------|
| FCP | 1.1 s | Keep |
| **LCP** | **5.2 s** | **≤ 2.5 s good, ≤ 4.0 s acceptable** |
| TBT | 100 ms | Keep |
| CLS | 0 | Keep |
| Speed Index | 3.8 s | Improves if LCP image starts sooner |

LCP element: full-bleed hero `img` for `/images/qua1.png` (via `/_next/image`). Breakdown: TTFB **0 ms**, **resource load delay 1,410 ms**, download 600 ms, render delay 40 ms. Almost all of the miss is “browser does not start the image until late,” not server time.

---

## 1. Do this — hero is a static first paint

**File:** `components/sections/hero-section.tsx`

Today the LCP image is:

```tsx
<Image src={HERO_IMAGES[currentImageIndex]} priority={currentImageIndex === 0} … />
```

`priority` does not emit `<link rel="preload">` or `fetchpriority="high"` when `src` is a runtime index. Lighthouse reported the image as lazy and not high priority even though `priority={true}` is set for slide 0. The slideshow already waits 8 seconds before the first rotation (`rotationTimer`).

### Change

1. Keep slide 0 as a **string literal** so Next can preload it:

   `<Image src="/images/qua1.png" priority fetchPriority="high" fill quality={70} sizes="100vw" alt="" />`

2. Mount slides 1–4 only after the first rotation (`currentImageIndex > 0`), each **without** `priority`. Crossfade on top of the first image so the LCP node is not swapped out when the slideshow starts.
3. Do not wrap the first image in a transform that starts at opacity 0. The existing `motion.div` parallax (`springBackgroundY`) is fine if the image is in the initial HTML at full opacity. The `opacity-60` wrapper may stay; it is not what delayed discovery.
4. Leave `AdvancedTruck3D` and `ScrollTriggeredAnimations` behind `showFx` (already idle-deferred). Do not put them back on the first paint.

### Asset

`public/images/qua1.png` is a PNG served through the image optimizer at `q=70` and `w=750` on the phone test. If the file is multi‑megabyte, add a phone-width source (about 1200 px wide, WebP or AVIF) and point slide 0 at that file. Do this only if the optimized response is still large after the preload fix. The 1.4 s delay matters more than the 600 ms download.

### Done when

- View source of `/` contains a preload or an `img` for `qua1` with `fetchpriority="high"` and **without** `loading="lazy"`.
- Mobile PageSpeed LCP **under 4 s**. Stretch goal **≤ 2.5 s**.
- Slideshow still advances after ~8 s. Hero H1 and CTAs unchanged.

---

## 2. Do this if the logo audit is still on the new deploy

PageSpeed flagged a **raw** tag, not the header:

```html
<img alt="Active Movers Logo" class="w-16 h-8 …" src="/images/logo.jpg">
```

That class is `components/animations/advanced-truck-3d.tsx` (truck decal). Header and footer already use `next/image` with `sizes`. The truck mounts only after idle, so this is **not** the LCP element. Estimated savings were **27 KB**.

- Point the truck `<img>` at a small file (WebP, ~128 px wide) **or** drop the logo from the 3D truck.
- Do not replace schema/OG `logo.jpg` in this pass (`lib/seo-utils.ts`, `lib/schema-markup.ts`). Those are not the phone LCP.

---

## 3. Do not chase in this pass

| Finding | Why skip |
|---------|----------|
| Render-blocking CSS (~650 ms, two CSS files) | Next/Tailwind global CSS. Splitting it is a separate project and will not remove the 1.4 s image delay. |
| Unused JS in `gtag.js` (~74 KB) and a long task at ~4.7 s | Analytics. Load after `load` only if a later trace still shows it on the critical path. TBT is already 100 ms. |
| Legacy polyfills in `5964-….js` (~12 KB) | Next compiler output. Ignore unless `browserslist` is widened on purpose. |
| Non-composited animations (35 nodes) | Mostly the deferred truck and particles (`showFx`). CLS is already 0. |
| Accessibility 87 | Mobile menu button has no name (`header.tsx` `lg:hidden`). Map pins and an icon-only `/contact` link have no accessible name. Teal price text (`text-primary` in the pricing table) fails contrast. Fix in a UI pass; not the 5.2 s LCP. |
| SEO 92 | `services-section.tsx` uses “Learn More” on five service links. Give each link the service name. Not a ranking blocker next to GBP and the 48 indexed URLs. |

---

## 4. Check after deploy

1. `npm run build` succeeds.
2. PageSpeed mobile on `https://www.activemoverset.com/` (not a stale preview). Confirm the LCP node is `qua1` **with** `fetchpriority="high"`.
3. Record LCP, FCP, CLS, TBT in this doc.
4. Leave Search Console field CWV until Chrome has traffic. Lab 79 is not the ranking input. [DEPLOY_AND_GBP_CHECKLIST.md](./DEPLOY_AND_GBP_CHECKLIST.md) still owns GBP and the day-28 review.

---

## 5. Order of work

| Step | Work | Owner | Status |
|------|------|--------|--------|
| 1 | Static `qua1.png` LCP image + lazy later slides | Code | **Done** — `hero-lcp-background.tsx` (server) + slideshow overlay in `hero-section.tsx`; homepage passes `lcpBackground` from `app/(main)/page.tsx` |
| 2 | Rebuild, deploy, re-run mobile PageSpeed | Code | **Build OK** locally; deploy + lab numbers TBD |
| 3 | Truck logo only if step 2 still lists `logo.jpg` | Code | **Done** — `advanced-truck-3d.tsx` uses `next/image` + `/images/logotr.png` |
| 4 | Menu/pin names, price contrast, “Learn More” text | Later UI pass | Open |
