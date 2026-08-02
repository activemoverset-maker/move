# Implementation Plan: Maled Active Movers — Multi-Domain Micro-Site

**Project:** Maled Active (`maledactive`) — separate moving company brand  
**Host repo:** Active Movers & Packers monolith (`activemovers`)  
**Updated:** 2 August 2026 (**v1**)  
**Status:** Ready for implementation  
**Primary domain (proposed):** `https://www.maledactive.com` (or TBD)  
**Scope:** 6 public pages · no admin · no blog · no TikTok · no booking calendar  

---

## 1. Executive summary

**Primary deliverable:** a polished, animation-rich **6-page marketing site** for **Maled Active** — a separate moving company — hosted in the same Next.js 15 repository as Active Movers, served on its **own domain** with complete brand separation.

**Secondary deliverable:** reusable domain-routing infrastructure (`middleware.ts` + route groups) that can support future micro-brands without a monorepo refactor.

### Recommended architecture (one sentence)

**Route group `(maledactive)` + host-based `middleware.ts` rewrites + isolated layout/metadata + shared `components/ui` primitives + Framer Motion animation system with `useReducedMotion` fallbacks.**

That is the best balance of separation, speed-to-ship, and package reuse for a 6-page site.

### Why not a monorepo?

| Factor | Monorepo (2 apps) | Route group + middleware |
|--------|-------------------|--------------------------|
| Page count | Overkill for 6 pages | ✅ Right-sized |
| Shared UI | Requires package extraction | ✅ Direct `@/components/ui` imports |
| Deploy complexity | 2 Vercel projects | ✅ 1 project, 2 domains |
| Brand isolation | Full | ✅ Sufficient with middleware guards |
| Time to ship | 3–5 days setup | ✅ 4–6 days total |

---

## 2. Goals & non-goals

### Goals

| # | Goal |
|---|------|
| G1 | `maledactive.com` serves only Maled Active pages |
| G2 | `activemoverset.com` never shows Maled Active routes (and vice versa) |
| G3 | Distinct visual identity — not a clone of Active Movers green theme |
| G4 | Professional motion design: scroll parallax, staggered reveals, ambient layers |
| G5 | Mobile-first, Lighthouse-friendly (animations respect `prefers-reduced-motion`) |
| G6 | Reuse existing infra: Tailwind, Framer Motion, contact API, analytics hooks |
| G7 | Own SEO: metadata, sitemap, robots, JSON-LD LocalBusiness |

### Non-goals (explicitly out of scope v1)

- Admin panel / CMS
- Blog
- TikTok feed
- Booking calendar / Prisma bookings
- Bilingual EN/AM (English-only v1; i18n hooks optional for v2)
- Separate Vercel project / monorepo migration

---

## 3. Site map (6 pages)

| # | Route | Purpose | Key sections |
|---|-------|---------|--------------|
| 1 | `/` | Home | Hero, services snapshot, trust stats, process, testimonials, CTA |
| 2 | `/services` | Services | 3–4 service cards with detail panels |
| 3 | `/about` | About | Story, values, team/coverage, why choose us |
| 4 | `/contact` | Contact | Form + phone/WhatsApp + map embed |
| 5 | `/privacy-policy` | Legal | Standard privacy copy (Maled Active branded) |
| 6 | `/terms-of-service` | Legal | Standard terms copy (Maled Active branded) |

**Optional v1.1 swap:** replace Terms with `/service-areas` if legal pages are lower priority.

### Navigation

```
Logo                    Home · Services · About · Contact     [Get a Quote]
```

Mobile: hamburger → full-screen animated drawer (staggered link reveal).

Footer columns: Services · Company · Contact · Legal.

---

## 4. Visual identity & design direction

Maled Active must feel like a **sibling brand**, not a reskin of Active Movers.

### Proposed palette (confirm with client)

| Token | Value | Usage |
|-------|-------|-------|
| `--maled-bg` | `#0a0f1a` | Page background (deep navy) |
| `--maled-surface` | `#111827` | Cards, panels |
| `--maled-accent` | `#f59e0b` | Primary CTA, highlights (amber) |
| `--maled-accent-2` | `#38bdf8` | Secondary accent (sky) |
| `--maled-text` | `#f8fafc` | Headings |
| `--maled-muted` | `#94a3b8` | Body secondary |

**Contrast with existing brands:**

| Brand | Vibe |
|-------|------|
| Active Movers (main) | Green `#16a34a`, light, bilingual |
| Addis Active Movers | Dark navy + orange premium landing |
| **Maled Active** | Dark navy + amber/gold — warm, confident, modern |

### Typography

- **Headings:** Plus Jakarta Sans (already in repo via `app/fonts/`) or Inter
- **Body:** Inter
- **Display accents:** Tight tracking, gradient text on hero headline

### Layout principles

1. Full-bleed hero sections with layered gradients + ambient blur orbs
2. Glass-morphism cards (`backdrop-blur`, subtle borders `border-white/10`)
3. Generous whitespace; max-width `1280px` content columns
4. One primary CTA per viewport (Call / WhatsApp / Get Quote)
5. Sticky mobile bottom bar: Call · WhatsApp · Quote (pattern from `addis-premium/landing.tsx`)

### Assets needed from client

- [ ] Logo (SVG preferred) → `public/maledactive/logo.svg`
- [ ] Hero image(s) → `public/maledactive/hero.jpg`
- [ ] Favicon → `public/maledactive/favicon.ico`
- [ ] OG image 1200×630 → `public/maledactive/og-image.jpg`
- [ ] Phone, WhatsApp, email, address
- [ ] 3–6 testimonials (name, quote, service type)
- [ ] Service list + short descriptions
- [ ] Final domain name

---

## 5. Animation system (advanced, performance-safe)

Leverage existing stack: **Framer Motion 10** (primary), **GSAP 3** (optional hero timelines only).

### 5.1 Core animation primitives

Create `components/maledactive/motion/` shared utilities:

| Component / hook | Behavior |
|------------------|----------|
| `MaledAmbientLayer` | Floating gradient orbs (inspired by `addis-premium/landing.tsx` `AmbientLayer`) |
| `MaledReveal` | Scroll-triggered fade + translateY with stagger |
| `MaledParallaxHero` | `useScroll` + `useSpring` + `useTransform` parallax (pattern from `addis-premium/hero.tsx`) |
| `MaledTextReveal` | Word or line stagger on hero headline |
| `MaledMagneticButton` | Subtle cursor-follow on primary CTAs |
| `MaledPageTransition` | Route enter/exit fade (layout group) |
| `useMaledReducedMotion()` | Wrapper around `useReducedMotion` — static fallbacks everywhere |

### 5.2 Per-page animation map

| Page | Signature motion |
|------|------------------|
| **Home hero** | Parallax background image, gradient shimmer, particle streaks, headline word stagger, floating stat chips |
| **Home services** | Staggered card reveal on scroll; icon scale on hover; accent line draw |
| **Home process** | Horizontal step timeline with scroll-linked progress bar |
| **Home testimonials** | Auto-advancing carousel with spring snap OR horizontal drag strip |
| **Services** | Accordion expand with height animation; icon morph |
| **About** | Split layout: image parallax left, content reveal right |
| **Contact** | Form fields stagger in; success state confetti-lite (CSS particles, not heavy lib) |
| **Legal pages** | Minimal — subtle heading reveal only |

### 5.3 Performance rules (non-negotiable)

- [ ] All infinite animations gated behind `!useReducedMotion()`
- [ ] `will-change` only on actively animating elements; remove after complete
- [ ] No GSAP ScrollTrigger on more than 2 sections per page
- [ ] Hero `priority` image only; below-fold lazy
- [ ] Target Lighthouse Performance ≥ 85 mobile
- [ ] Max 3 simultaneous `motion.div` infinite loops per page

### 5.4 Tailwind custom animations

Add to `tailwind.config.ts` under `maledactive` namespace:

```ts
keyframes: {
  'maled-shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
  'maled-float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  'maled-pulse-glow': {
    '0%, 100%': { opacity: '0.4' },
    '50%': { opacity: '0.7' },
  },
},
animation: {
  'maled-shimmer': 'maled-shimmer 8s linear infinite',
  'maled-float': 'maled-float 6s ease-in-out infinite',
  'maled-pulse-glow': 'maled-pulse-glow 4s ease-in-out infinite',
},
```

Scoped CSS noise overlay (copy pattern from `.addis-premium-noise` in globals).

---

## 6. Technical architecture

### 6.1 Domain routing flow

```
Request: Host = maledactive.com, Path = /services
        │
        ▼
middleware.ts
  ├─ isMaledActiveHost(host) → true
  ├─ Block: /admin, /blog, /api/admin/* → 404 or redirect to activemoverset.com
  ├─ Rewrite internally to /(maledactive)/services (or serve directly if paths are clean)
  └─ Set x-site-id: maledactive header for debugging

Request: Host = activemoverset.com, Path = /contact
        │
        ▼
middleware.ts
  ├─ isMaledActiveHost(host) → false
  ├─ Block: maledactive-only paths if any prefixed
  └─ Pass through to existing Active Movers routes
```

### 6.2 Folder structure

```
app/
  (maledactive)/
    layout.tsx              # Isolated root: metadata, fonts, no AM header/footer
    page.tsx                # Home
    services/page.tsx
    about/page.tsx
    contact/page.tsx
    privacy-policy/page.tsx
    terms-of-service/page.tsx
    not-found.tsx           # Branded 404

components/
  maledactive/
    layout/
      maled-header.tsx
      maled-footer.tsx
      maled-mobile-nav.tsx
      maled-sticky-cta.tsx
    sections/
      maled-hero.tsx
      maled-services-preview.tsx
      maled-trust-band.tsx
      maled-process.tsx
      maled-testimonials.tsx
      maled-cta.tsx
      maled-services-detail.tsx
      maled-about-story.tsx
      maled-contact-form.tsx
    motion/
      maled-ambient-layer.tsx
      maled-reveal.tsx
      maled-parallax-hero.tsx
      maled-text-reveal.tsx
      maled-magnetic-button.tsx
    ui/
      maled-glass-panel.tsx   # Brand-scoped glass card (optional)
    pages/
      maled-home-page.tsx
      maled-services-page.tsx
      maled-about-page.tsx
      maled-contact-page.tsx
      maled-legal-page.tsx

lib/
  maledactive-config.ts       # Site name, domain, contact, social
  maledactive-data.ts         # Services, testimonials, process steps
  maledactive-seo.ts          # JSON-LD, page metadata helpers
  maledactive-host.ts         # Host detection utilities (shared with middleware)

middleware.ts                 # NEW — host-based routing & guards

public/
  maledactive/
    logo.svg
    hero.jpg
    og-image.jpg
    favicon.ico
```

### 6.3 Isolation from Active Movers root layout

Today `app/layout.tsx` wraps **everything** with `<Header />`, `<ConditionalFooter />`, `<FloatingButtons />`, and Active Movers metadata.

**Strategy:** use Next.js route groups. The `(maledactive)` group gets its own `layout.tsx` that renders a minimal shell:

```tsx
// app/(maledactive)/layout.tsx — conceptual
export const metadata = { metadataBase: new URL('https://www.maledactive.com'), ... }

export default function MaledLayout({ children }) {
  return (
    <div className="maledactive-site min-h-screen bg-[#0a0f1a] text-white">
      <MaledHeader />
      <main>{children}</main>
      <MaledFooter />
      <MaledStickyCta />
      {/* NO Active Movers Header, Footer, FloatingButtons, LanguageProvider */}
    </div>
  )
}
```

**Also update** existing pathname guards so they don't conflict:

| File | Change |
|------|--------|
| `components/header.tsx` | Skip on maledactive host OR pathname (belt + suspenders) |
| `components/conditional-footer.tsx` | Same |
| `components/floating-buttons.tsx` | Hide on maledactive |
| `app/layout.tsx` | Consider wrapping AM chrome in a route group `(activemovers)` later; v1 can use host check in middleware + minimal maled layout |

> **Note:** Next.js nested layouts compose. The root `app/layout.tsx` still wraps `(maledactive)`. v1 approach: make root layout a thin shell (html/body/providers only) and move AM header/footer into `(activemovers)/layout.tsx`. This is a **required refactor** for clean separation.

### 6.4 Config module

```ts
// lib/maledactive-config.ts
export const MALED_SITE = {
  name: 'Maled Active Movers',
  shortName: 'Maled Active',
  tagline: 'Professional moving services you can trust',
  url: process.env.NEXT_PUBLIC_MALEDACTIVE_URL || 'https://www.maledactive.com',
  contact: {
    phone: process.env.MALED_PHONE_NUMBER || '+251XXXXXXXXX',
    whatsapp: process.env.MALED_WHATSAPP_NUMBER || '+251XXXXXXXXX',
    email: process.env.MALED_EMAIL || 'info@maledactive.com',
    address: 'Addis Ababa, Ethiopia', // TBD
  },
  social: {
    // TBD
  },
} as const
```

### 6.5 Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_MALEDACTIVE_URL` | Canonical URL for metadata/sitemap |
| `MALED_PHONE_NUMBER` | Click-to-call |
| `MALED_WHATSAPP_NUMBER` | WhatsApp CTA |
| `MALED_EMAIL` | Contact form recipient |
| `MALED_HOSTS` | Comma-separated: `maledactive.com,www.maledactive.com` |
| `NEXT_PUBLIC_GA_MALED_ID` | Optional separate GA4 property |

Existing `PHONE_NUMBER`, `WHATSAPP_NUMBER` remain for Active Movers only.

### 6.6 Contact form

**Reuse** `app/api/contact/route.ts` with a `site` field:

```ts
// POST body addition
{ ..., site: 'maledactive' }
```

Server routes to correct Telegram/email recipient based on `site`. No new API route needed.

### 6.7 SEO per domain

| Asset | Maled Active |
|-------|--------------|
| `metadataBase` | `https://www.maledactive.com` |
| `robots.txt` | Host-aware route OR separate handler checking host header |
| `sitemap.xml` | Host-aware: only 6 maledactive URLs when requested from maledactive.com |
| JSON-LD | `LocalBusiness` + `MovingCompany` schema in `lib/maledactive-seo.ts` |

---

## 7. middleware.ts specification

```ts
// middleware.ts — pseudocode
import { NextRequest, NextResponse } from 'next/server'
import { isMaledActiveHost, isActiveMoversHost } from '@/lib/maledactive-host'

const MALED_BLOCKED_ON_AM = [] // maledactive routes are in route group, not path-prefixed
const AM_BLOCKED_ON_MALED = [
  '/admin', '/blog', '/booking', '/tiktok', '/videos',
  '/api/admin', '/addis-active-movers', '/bole-bulbula',
]

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const { pathname } = request.nextUrl

  if (isMaledActiveHost(host)) {
    if (AM_BLOCKED_ON_MALED.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    const response = NextResponse.next()
    response.headers.set('x-site-id', 'maledactive')
    return response
  }

  // Active Movers host: ensure maledactive internals aren't accidentally exposed
  // (only needed if using path prefix during dev)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|fonts).*)'],
}
```

**Local dev:** use `localhost:3000` with `?site=maledactive` query override OR add `127.0.0.1 maledactive.local` to hosts file and pass `Host` header.

---

## 8. Implementation phases

### Phase M0 — Foundations (0.5 day)

- [ ] Create `lib/maledactive-config.ts`, `lib/maledactive-host.ts`, `lib/maledactive-data.ts`
- [ ] Add env vars to `.env.example`
- [ ] Refactor root layout: thin shell + `(activemovers)` route group (move existing pages)
- [ ] Scaffold `app/(maledactive)/layout.tsx`
- [ ] Implement `middleware.ts` with host detection
- [ ] Add `maledactive` Tailwind tokens / animations
- [ ] Create `public/maledactive/` placeholder assets

**Exit:** `maledactive.local` (or host override) serves blank branded shell; AM site unchanged.

### Phase M1 — Core layout & motion primitives (1 day)

- [ ] `MaledHeader` — scroll-aware blur, logo, nav, mobile drawer with stagger
- [ ] `MaledFooter` — 4-column, social links
- [ ] `MaledStickyCta` — mobile bottom bar
- [ ] Motion primitives: `MaledAmbientLayer`, `MaledReveal`, `MaledParallaxHero`, `MaledTextReveal`
- [ ] `MaledGlassPanel` UI primitive

**Exit:** Reusable component library ready; Storybook optional.

### Phase M2 — Home page (1.5 days) ← flagship

- [ ] `MaledHero` — parallax image, gradient overlays, headline stagger, dual CTAs
- [ ] `MaledServicesPreview` — 4 cards, hover lift, icon animation
- [ ] `MaledTrustBand` — animated count-up stats (reuse `components/ui/count-up.tsx`)
- [ ] `MaledProcess` — 4-step timeline with scroll progress
- [ ] `MaledTestimonials` — carousel / drag strip
- [ ] `MaledCta` — full-bleed closing section
- [ ] Wire `maled-home-page.tsx` → `app/(maledactive)/page.tsx`
- [ ] Home metadata + JSON-LD

**Exit:** Home page looks premium, animates smoothly on mobile, reduced-motion safe.

### Phase M3 — Inner pages (1 day)

- [ ] Services page — service detail cards
- [ ] About page — story + values
- [ ] Contact page — form (reuse UI inputs), map, WhatsApp/phone cards
- [ ] Privacy + Terms — legal template with brand shell

**Exit:** All 6 routes live with metadata.

### Phase M4 — SEO, domain & polish (0.5 day)

- [ ] Host-aware `robots.txt` and `sitemap.xml` (or dedicated routes under `(maledactive)`)
- [ ] Favicon + manifest for maledactive
- [ ] GA4 events: `maled_cta_click`, `maled_form_submit`, `maled_call_click`
- [ ] Attach domain in Vercel; verify SSL
- [ ] Cross-domain isolation QA
- [ ] Lighthouse pass

**Exit:** Production-ready on live domain.

### Phase M5 — Content & launch (0.5 day, client-dependent)

- [ ] Replace placeholder copy/images
- [ ] Final contact details
- [ ] Client sign-off
- [ ] DNS cutover

---

## 9. Total estimate

| Phase | Duration |
|-------|----------|
| M0 Foundations | 0.5 day |
| M1 Layout + motion | 1 day |
| M2 Home (flagship) | 1.5 days |
| M3 Inner pages | 1 day |
| M4 SEO + domain | 0.5 day |
| M5 Content + launch | 0.5 day |
| **Total** | **~5 days** |

Assumes copy/images provided by client. Animation-heavy home is the critical path.

---

## 10. Shared vs isolated code

| Shared (import from existing) | Maled-only (new) |
|-------------------------------|------------------|
| `components/ui/button.tsx` | All `components/maledactive/*` |
| `components/ui/input.tsx` | `lib/maledactive-*` |
| `components/ui/card.tsx` | `app/(maledactive)/*` |
| `components/ui/count-up.tsx` | Brand assets in `public/maledactive/` |
| `lib/utils.ts` (cn, phone links) | `middleware.ts` host rules |
| `lib/analytics.ts` (extend) | |
| `app/api/contact/route.ts` (extend) | |
| `app/fonts/*` | |

**Do not reuse:** Active Movers `Header`, `Footer`, `FloatingButtons`, `SITE_CONFIG`, green theme tokens, admin APIs, blog data, TikTok components.

---

## 11. Vercel domain setup

1. **Settings → Domains** → Add `maledactive.com` and `www.maledactive.com`
2. DNS: `A` record → `76.76.21.21` or `CNAME` → `cname.vercel-dns.com`
3. Set env vars on Vercel project (production + preview)
4. Optional: redirect `maledactive.com` → `www.maledactive.com` (or apex preference)
5. Verify both domains serve maledactive and activemoverset.com still serves AM

---

## 12. Testing checklist

### Domain isolation

- [ ] `maledactive.com/` → Maled home (not Active Movers)
- [ ] `maledactive.com/admin` → blocked or redirected
- [ ] `activemoverset.com/` → Active Movers (unchanged)
- [ ] `activemoverset.com/admin` → still works
- [ ] Each maledactive page has correct canonical URL on maledactive domain

### Functional

- [ ] All nav links work
- [ ] Mobile drawer opens/closes with animation
- [ ] Contact form submits and routes to Maled recipient
- [ ] Phone / WhatsApp links use Maled numbers
- [ ] 404 page branded on maledactive

### Animation / a11y

- [ ] `prefers-reduced-motion: reduce` → no infinite loops; static layout
- [ ] Focus visible on all interactive elements
- [ ] No layout shift from lazy animations (CLS < 0.1)
- [ ] Smooth scroll on mobile with 6+ animated sections

### Performance

- [ ] Lighthouse Performance ≥ 85 (mobile)
- [ ] LCP < 2.5s on home hero
- [ ] No GSAP/Framer jank on mid-range Android

### SEO

- [ ] Unique title/description per page
- [ ] OG image renders correctly when shared
- [ ] sitemap.xml lists only 6 URLs on maledactive host
- [ ] JSON-LD validates in Google Rich Results Test

---

## 13. Acceptance criteria (done)

1. `maledactive.com` serves a **6-page** professional site with distinct branding  
2. Active Movers site is **unchanged** in look, routes, and admin functionality  
3. Home page features **advanced animations** (parallax hero, stagger reveals, ambient layer) with reduced-motion fallbacks  
4. Contact form works and delivers to Maled Active channels  
5. SEO assets (metadata, sitemap, robots) are domain-correct  
6. Mobile sticky CTA bar present  
7. Lighthouse Performance ≥ 85 mobile on home  

---

## 14. Content checklist (client)

- [ ] Final domain name confirmed
- [ ] Logo + favicon + OG image
- [ ] Hero photograph(s)
- [ ] Phone, WhatsApp, email, physical address
- [ ] 3–4 services with descriptions
- [ ] 3–6 testimonials
- [ ] About copy (company story, 2–3 paragraphs)
- [ ] Service areas (if listing on About or Services)
- [ ] Google Maps embed URL
- [ ] Optional: social links (Facebook, Instagram, TikTok)

---

## 15. Decisions log

| Topic | Decision |
|-------|----------|
| Architecture | Route group `(maledactive)` + `middleware.ts` |
| Monorepo | **No** — not justified for 6 pages |
| Animation library | Framer Motion primary; GSAP optional for hero only |
| i18n | English-only v1 |
| CMS | None — static config in `lib/maledactive-data.ts` |
| Booking | None v1 |
| Contact API | Reuse `/api/contact` with `site: 'maledactive'` |
| Brand colors | Navy + amber (pending client approval) |

### Still open

1. Final domain (`maledactive.com` assumed)  
2. Maled Active contact phone/email/WhatsApp  
3. Logo and photography  
4. Whether to add `/service-areas` instead of Terms  
5. Separate GA4 property vs single property with site dimension  

---

## 16. Source references (in-repo patterns)

| Pattern | Reference file |
|---------|----------------|
| Premium dark landing | `components/landing/addis-premium/landing.tsx` |
| Parallax hero | `components/landing/addis-premium/hero.tsx` |
| Site-specific config | `lib/addis-premium-config.ts` |
| Path-based layout isolation | `app/addis-active-movers/layout.tsx` |
| Conditional chrome | `components/conditional-footer.tsx`, `components/header.tsx` |
| Count-up stats | `components/ui/count-up.tsx` |
| Scroll animations | `components/animations/scroll-triggered-animations.tsx` |
| Implementation plan format | `docs/IMPLEMENTATION_PLAN_TIKTOK_AND_MOVING_PAGES.md` |

---

## Addenda

| Date | Change |
|------|--------|
| 2026-08-02 | v1 — Initial plan: 6-page maledactive micro-site, domain middleware, animation system, phased rollout |
