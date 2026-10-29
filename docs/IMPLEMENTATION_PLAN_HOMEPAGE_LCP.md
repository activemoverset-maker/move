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
3. Do not wrap the first image in a transform that starts at opacity 0. The `opacity-60` wrapper may stay; it is not what delayed discovery. **Superseded by §6:** the 12:20 lab showed `springBackgroundY` on this same `motion.div` is what delayed paint. Pass 1 left the image inside that wrapper. Pass 2 pulls it out.
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
| 2 | Rebuild, deploy, re-run mobile PageSpeed | Code | **Done** — commit `907d3e0`. Lab 12:20: Performance **89**, LCP **2.9 s**, FCP 1.6 s, TBT 210 ms, CLS 0, SI 4.5 s. Image has `fetchpriority="high"`. `logo.jpg` did not return. |
| 3 | Truck logo only if step 2 still lists `logo.jpg` | Code | **Done** — `advanced-truck-3d.tsx` uses `next/image` + `/images/logotr.png` |
| 4 | Menu/pin names, price contrast, “Learn More” text | Later UI pass | Open — still the a11y 87 / SEO 92 findings on the 12:20 run |
| 5 | Pull LCP image out of the motion wrapper (§6) | Code | **Done** — static `lcpBackground` layer outside `springBackgroundY` |

---

## 6. Pass 2 — paint the hero image before hydration

**Source:** Mobile Lighthouse 13.5.0, Slow 4G, Moto G Power, captured 29 Oct 2026 12:20 GMT+3 on `https://activemoverset.com/` after commit `907d3e0`.

Pass 1 did what it was for. LCP fell **5.2 s → 2.9 s** (score **79 → 89**). The LCP node is the hero `img` with `fetchpriority="high"` and `src` `/_next/image?url=%2Fimages%2Fqua1.png&w=750&q=70`. It is not lazy.

| Subpart | 11:52 | 12:20 |
|---------|-------|-------|
| Time to first byte | 0 ms | 0 ms |
| Resource load delay | 1,410 ms | **700 ms** |
| Download | 600 ms | **160 ms** |
| Element render delay | 40 ms | **1,440 ms** |

The file arrives quickly. About half of the remaining 2.9 s is **element render delay**: the bytes are in, then Chrome does not count the image as painted for another 1.4 s. That lines up with main-thread tasks in `chunks/5964-….js` at about 2.0 s, 2.3 s, and 2.9 s. The image sits inside the Framer Motion node that only gets a real `y` after hydration:

```tsx
<motion.div className="absolute inset-0 z-0" style={{ y: springBackgroundY }}>
  <div className="absolute inset-0 opacity-60">{lcpBackground}</div>
</motion.div>
```

`springBackgroundY` comes from `useScroll` + `useSpring` in the client `HeroSection`. Until that bundle runs, the LCP element is not a static painted layer.

FCP 1.1 s → 1.6 s and Speed Index 3.8 s → 4.5 s are the cost of prioritizing the hero image and a busier main thread. TBT 100 ms → 210 ms is the same `5964` chunk plus gtag tasks at ~4.5 s (after LCP). CLS stayed 0. Field CWV is still empty. 2.9 s is “needs improvement” (good is ≤ 2.5 s). Closing most of the 1.4 s render delay is what gets this lab under 2.5 s and likely over a performance score of 90.

### Change

**File:** `components/sections/hero-section.tsx`

1. Render `{lcpBackground}` in a **plain** `div` (`absolute inset-0 z-0`). No `motion.div`, no `style={{ y }}`, no `useSpring` on that node.
2. Leave `opacity-60` on that static wrapper so the hero looks the same. Opacity is not the 1.4 s gap.
3. Keep gradients, the `z-18` veil, and slides 1–4 where they are. Slides still mount only when `currentImageIndex > 0`, still without `priority`, and may stay inside the parallax `motion.div`. They cover `qua1` after the first 8 s rotation. Do not unmount the LCP image when the slideshow advances.
4. Leave the text block on `springTextY`. Lighthouse is not measuring the H1 as LCP.
5. Do not move `AdvancedTruck3D` or `ScrollTriggeredAnimations` earlier than `showFx`.

Target shape:

```tsx
<div className="absolute inset-0 z-0">
  <div className="absolute inset-0 opacity-60">{lcpBackground}</div>
  <motion.div className="absolute inset-0" style={{ y: springBackgroundY }}>
    {currentImageIndex > 0 ? <Image src={HERO_IMAGES[currentImageIndex]} … /> : null}
    {/* existing gradients */}
  </motion.div>
</div>
```

### Preload — only if render delay drops and load delay does not

The 12:20 critical-request chain is the document plus two CSS files (max **547 ms**). The hero image is not in that chain, which matches the remaining **700 ms** resource load delay: the request starts when the parser reaches the `<img>`, after render-blocking CSS (`6d55530f….css`, ~28 KiB, ~800 ms).

After the static move, view source of `/`. If there is still no `<link rel="preload" as="image">` for the **same** `/_next/image?url=/images/qua1.png&w=750&q=70` URL the `<img src>` uses, emit that preload from the server page (`app/(main)/page.tsx` or `HeroLcpBackground`). Do not also preload the raw `/images/qua1.png`. That would download the file twice. Do not hand-compress `qua1.png` in this pass. The optimized download is already 160 ms.

### Do not chase on this run either

| Finding (12:20) | Why skip |
|-----------------|----------|
| Render-blocking CSS, est. savings 120 ms | Not the 1.4 s render delay. |
| Unused CSS ~22 KiB, legacy polyfills ~12 KiB | Same as §3. |
| gtag ~178 KiB, tasks at ~4.5 s | After LCP. TBT is 210 ms. Defer only if a later trace still misses the TBT ≤ 200 ms line after §6. |
| 35 non-composited animations (truck stripes, particles, exhaust) | Deferred `showFx`. CLS is 0. |
| Accessibility 87, SEO 92, Agentic browsing 1/2 | Same items as §3: menu button name, map-pin buttons, icon-only `/contact` link, `text-primary` price contrast, five “Learn More” links. UI pass, not this LCP pass. |

### Done when

- The LCP `<img>` is not a descendant of a `motion` node or a scroll-linked transform.
- Slideshow still waits ~8 s, then advances. H1, CTAs, and the dimmed hero look unchanged.
- `npm run build` succeeds.
- Mobile PageSpeed on the production URL: LCP **≤ 2.5 s**. Element render delay should fall from ~1.4 s to a few hundred milliseconds. If LCP is still above 2.5 s and render delay is already low, do the preload check above and stop. Do not open a CSS-split project for the leftover.
