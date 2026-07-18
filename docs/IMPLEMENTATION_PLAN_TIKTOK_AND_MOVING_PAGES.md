# Implementation Plan: TikTok-First Experience + Moving Pages

**Project:** Active Movers & Packers (`https://www.activemoverset.com`)  
**Updated:** 18 July 2026 (**v3 — TikTok-first + research**)  
**Status:** Ready for implementation  
**TikTok account (locked):** **`@activemoverset`**  
**Profile:** [https://www.tiktok.com/@activemoverset](https://www.tiktok.com/@activemoverset)  
**Display name:** Active Movers ET  

---

## 1. Executive summary

**Primary deliverable:** a production-grade **TikTok media product** on the Active Movers site for `@activemoverset` — not a single broken embed.

**Secondary deliverable:** a set of beautiful bilingual marketing pages (how-it-works, areas, FAQ, pricing, etc.) that reuse existing content and match the main green brand.

This v3 plan is **TikTok-heavy**. It is grounded in official TikTok developer docs and current embed/performance research (sources in §5).

### Recommended architecture (one sentence)

**Curated DB feed + oEmbed enrichment for titles/thumbnails + facade cards everywhere + official Embed Player (`player/v1`) only inside a modal + optional Display API sync later.**

That is the best balance of quality, speed, control, and maintainability for a Next.js business site.

---

## 2. Why TikTok is the main focus

Moving customers trust what they can *see*. `@activemoverset` videos are live social proof. The current homepage section embeds **`@freemanmovers`**, uses fake stats, and loads poorly. Fixing this into a real feed system is the highest-impact upgrade on the site.

| Today | Target |
|-------|--------|
| Wrong account embed | Only `@activemoverset` |
| One video | Curated multi-video feed + full `/tiktok` hub |
| Fake likes/comments | Real metadata from oEmbed / Display API where available |
| Heavy/uncontrolled embed | Facade-first; player loads on intentional watch |
| No admin | Full CMS: paste URL → enrich → feature → publish |
| No analytics | Watch, share, follow, book-from-video events |

---

## 3. Research findings (with links)

### 3.1 Official video embeds + oEmbed (required)

**Docs:** [Embed Videos — TikTok for Developers](https://developers.tiktok.com/doc/embed-videos)

- Manual path: open video on **desktop** tiktok.com → Share → Embed → copy code.
- Programmatic path: **GET** oEmbed:

```
https://www.tiktok.com/oembed?url=https://www.tiktok.com/@activemoverset/video/{VIDEO_ID}
```

**oEmbed returns (useful fields):**

| Field | Use on our site |
|-------|-----------------|
| `title` | Card title / SEO / admin autofill |
| `author_name` / `author_url` | Verify author is Active Movers ET |
| `thumbnail_url` | Facade poster (critical for performance) |
| `thumbnail_width` / `thumbnail_height` | Aspect ratio / CLS reservation |
| `html` | Official blockquote + script markup |

**Practical guides (2026):**  
[How to Embed a TikTok Video (2026)](https://tiktokembed.com/blog/how-to-embed-tiktok-video) · [Embed troubleshooting](https://tiktokembed.com/blog/tiktok-embed-not-working)

**Rules from research:**
- Load `https://www.tiktok.com/embed.js` **once per page**, not once per video.
- Keep blockquote fallback content for crawlers / no-JS.
- Do **not** strip inline width styles (`max-width: 605px; min-width: 325px`) or embeds collapse.
- Profile URLs alone cannot embed a single video — need `/video/{id}`.
- Removed/private videos fail silently — validate on admin import via oEmbed.
- Ad blockers / strict privacy browsers may block embeds → always provide “Open on TikTok” fallback.
- CSP must allow TikTok domains (`script-src` / `frame-src` / `img-src` for `*.tiktok.com` and related CDNs).

### 3.2 Official creator profile embed (feature)

**Docs:** [Embed Creator Profiles](https://developers.tiktok.com/doc/embed-creator-profiles)

- Embeds `@activemoverset` profile card with follower/following/likes overview.
- Includes a **selection of up to ~10 recent videos**.
- oEmbed: `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@activemoverset`
- Uses `data-embed-type="creator"` + `data-unique-id="activemoverset"`.
- Private/underage accounts cannot embed (ours should be public).
- Desktop: videos autoplay on hover; mobile: when on-screen; horizontal scroll supported.

**Plan use:** secondary “Official profile” module on `/tiktok` and optionally About — **not** a replacement for our curated feed (we need categories, CTAs, branding, and featured control).

### 3.3 Official Embed Player with controls (best modal player)

**Docs:** [Embed Player](https://developers.tiktok.com/doc/embed-player)

Iframe URL pattern:

```
https://www.tiktok.com/player/v1/{VIDEO_ID}?controls=1&progress_bar=1&play_button=1&volume_control=1&fullscreen_button=1&loop=0&autoplay=0&music_info=0&description=0&rel=0&muted=0
```

**Why this is better than classic blockquote embeds for our modal:**
- Query-param UI customization (`controls`, `autoplay`, `muted`, `description`, `music_info`, `rel`, etc.).
- **`postMessage` API** between host page and iframe:
  - Host → player: `play`, `pause`, `seekTo`, `mute`, `unMute`
  - Player → host: `onPlayerReady`, `onStateChange`, `onCurrentTime`, `onMute`, `onVolumeChange`, `onPlayerError`
- Can autoplay **after** user opens modal (gesture context), pause on close, mute by default on mobile policies, track ended → show Book CTA.

**Recommended modal strategy:** use **Player v1 iframe** inside the watch modal (not 20 classic embeds on the grid).

### 3.4 Performance reality (must design for this)

Research ([justinribeiro/lite-tiktok](https://github.com/justinribeiro/lite-tiktok), [performance write-up](https://justinribeiro.com/chronicle/2022/07/15/terrible-tiktok-embed-web-performance-and-my-imperfect-web-component-solution/), WordPress performance notes):

- A **single** classic TikTok embed can pull **~500KB JS + several MB media** (~8–12MB in worst cases) even before interaction.
- Multiple on-page embeds can crash mobile browsers.
- Industry pattern: **facade / lite embed** — show poster first; hydrate player only on click or near-viewport.
- Classic `embed.js` has **no clean “play” API** → two-tap UX if you facade then hydrate blockquote. **Player v1 + postMessage avoids much of that pain** for our modal.

**Hard rule for Active Movers:**  
Grid/cinema = **posters only**. At most **one** live player mounted at a time (modal).

### 3.5 Display API + Login Kit (optional auto-sync)

**Docs:**  
[Display API overview](https://developers.tiktok.com/doc/display-api-overview) ·  
[Display API get started](https://developers.tiktok.com/doc/display-api-get-started/) ·  
[Login Kit Web](https://developers.tiktok.com/doc/login-kit-web) ·  
[Scopes](https://developers.tiktok.com/doc/tiktok-api-scopes)

To auto-list `@activemoverset` videos you need:
1. TikTok Developer app approval  
2. Login Kit + Display API products  
3. Scopes: `user.info.basic`, `video.list`  
4. OAuth for the business TikTok account  
5. `POST https://open.tiktokapis.com/v2/video/list/` with fields like `id,title,video_description,duration,cover_image_url,embed_link,share_url`  
6. Refresh token job every ~12 hours  
7. `POST /v2/video/query/` when covers expire  

**Content Posting API** ([docs](https://developers.tiktok.com/products/content-posting-api)) is for *publishing TO TikTok* — out of scope (we display, we don’t post from the website).

**Plan decision:**  
- **Phase A (MVP):** curated admin + oEmbed enrichment (no TikTok app approval required).  
- **Phase B:** optional Display API sync once developer app is approved.

### 3.6 Third-party feed widgets (evaluated, not primary)

Tools like EmbedSocial advertise branded TikTok walls ([example article](https://embedsocial.com/blog/embed-tiktok-video/)). Pros: fast. Cons: cost, less brand control, another vendor, weaker booking CTA wiring.

**Decision:** build in-house on Next.js + Prisma. Use official TikTok APIs/embeds only.

---

## 4. Chosen TikTok architecture (best way)

```
Admin pastes TikTok URL
        │
        ▼
Server calls oEmbed (validate + title + thumbnail)
        │
        ▼
Prisma TikTokVideo (curated, featured, category, order)
        │
        ├──────────────► Homepage cinema strip (facades)
        ├──────────────► /tiktok feed grid (facades + filters)
        ├──────────────► Watch modal → Player v1 iframe (1 at a time)
        └──────────────► Optional: official Creator Profile embed module

Phase B (optional): Display API cron → upsert new videos as drafts for admin approval
```

### Why this is the best approach

| Approach | Verdict |
|----------|---------|
| Only classic embeds on page | ❌ Too heavy; kills Lighthouse/mobile |
| Only creator profile embed | ❌ Little control; no categories/CTAs/branding |
| Only third-party widget | ❌ Weak fit for booking funnel |
| Display API only, no CMS | ❌ Approval delay; cover expiry; less editorial control |
| **Curated CMS + oEmbed + facade + Player v1 modal** | ✅ Best for Active Movers |
| Later + Display API sync | ✅ Nice upgrade path |

---

## 5. TikTok feature set (main product)

### 5.1 Feature backlog (ship in waves)

#### Wave A — Core feed (must ship)

| Feature | Description |
|---------|-------------|
| **SOCIAL constant** | Lock `@activemoverset` in `lib/social.ts` |
| **URL paste ingest** | Admin pastes video URL → parse id → oEmbed fetch |
| **Author guard** | Reject if oEmbed `author_url` is not `@activemoverset` |
| **Thumbnail cache** | Store `thumbnail_url`; optionally mirror to `/public/images/tiktok/` |
| **Featured cinema strip** | Homepage horizontal 9:16 cards (6 featured) |
| **Full `/tiktok` hub** | Media destination page |
| **Category filters** | moves / packing / office / tips / reviews / behind_scenes |
| **Facade cards** | Poster + play affordance; no iframe until watch |
| **Watch modal** | Player v1 iframe; Esc/focus trap; pause on close |
| **Deep link** | `/tiktok?v={videoId}` opens that video |
| **Share** | Web Share API + copy link to deep URL |
| **Open on TikTok** | Always-visible fallback |
| **Follow CTA** | Links to [tiktok.com/@activemoverset](https://www.tiktok.com/@activemoverset) |
| **Book-from-video CTA** | Maps category → WhatsApp/booking prefill |
| **Admin CRUD + reorder** | Feature/hide/order/bulk |
| **Empty / error states** | Polished; never show wrong brand |
| **Analytics** | card_click, modal_open, follow, share, book_cta, open_external |
| **SEO** | `/tiktok` metadata + VideoObject ItemList; `sameAs` TikTok |
| **Purge wrong accounts** | Remove `@freemanmovers` / `@activemovers` mismatches |
| **`/videos` redirect** | 301 → `/tiktok` |

#### Wave B — Rich TikTok experience (high value)

| Feature | Description |
|---------|-------------|
| **Creator profile module** | Official profile embed on `/tiktok` (“Latest from TikTok”) |
| **Editorial featured row** | 1 large + 2 side videos at top of `/tiktok` |
| **Keyboard gallery** | ← / → next/prev video in modal |
| **Ended → convert** | On `onStateChange === ended`, show quote CTA overlay |
| **Autoplay-in-modal** | `autoplay=1` after open (user gesture) |
| **Mute-first mobile** | Start muted; unmute control via postMessage |
| **`rel=0`** | Prefer author videos over generic recommendations in player |
| **Local view counter** | Increment on modal open |
| **Trending / pinned** | `isPinned` for permanent top clips |
| **Campaign tags** | e.g. `bole`, `ramadan`, `office2026` for internal campaigns |
| **WhatsApp share card** | Prefill “Saw this Active Movers ET TikTok…” |
| **QR for print** | Admin generates QR to `/tiktok?v=` for trucks/flyers |
| **Sitemap video entries** | Include featured TikTok URLs |
| **CSP hardening** | Document required TikTok allowlist |
| **Health check** | Cron: re-oEmbed featured videos; flag 404/removed |
| **i18n** | EN/AM for all TikTok UI chrome |

#### Wave C — Power features (after Wave A/B)

| Feature | Description |
|---------|-------------|
| **Display API OAuth connect** | Admin “Connect TikTok” via Login Kit |
| **Auto-import drafts** | Cron lists new videos → admin approve queue |
| **Cover refresh job** | Re-query covers before expiry |
| **Playlist pages** | `/tiktok/playlists/office-moves` |
| **Embed-on-blog** | Reuse feed card + modal in blog posts |
| **Service page strips** | 3 related TikToks on packing/office pages |
| **“Watch then book” funnel** | `/tiktok` → modal → `/get-quote?from=tiktok&v=` |
| **A/B cinema vs grid** | Homepage layout experiment |
| **Live follower snapshot** | Cache profile oEmbed title/metrics if available |
| **Accessibility** | aria labels, reduced motion, focus rings, captions note |

### 5.2 Public surfaces (TikTok)

| Surface | Route / placement | Behavior |
|---------|-------------------|----------|
| Cinema strip | Homepage (replaces current section) | 6 featured facades → modal |
| Media hub | **`/tiktok`** | Hero + filters + grid + profile module + CTA |
| Alias | `/videos` | Redirect to `/tiktok` |
| Service teaser | `/services/packaging`, `/office-moving`, etc. | 3 category-matched facades |
| About / Why us | optional strip | 3 social-proof clips |
| Floating? | **No** | Don’t compete with Call/WhatsApp floaters |

### 5.3 Watch modal UX (detail)

1. User clicks facade  
2. Modal opens with poster skeleton  
3. Mount **one** iframe:  
   `https://www.tiktok.com/player/v1/{id}?controls=1&autoplay=1&rel=0&description=0&music_info=0`  
4. Listen for `onPlayerReady` / `onStateChange` / `onPlayerError`  
5. Side panel (desktop) or bottom sheet (mobile): title, category, Book, WhatsApp, Open on TikTok, Share  
6. On close: `postMessage` pause; destroy iframe (free memory)  
7. On error 1001 INVALID_VIDEO: show “Video unavailable” + Open on TikTok + admin health flag  

### 5.4 Admin CMS UX (detail)

**`/admin/tiktok`**

1. Paste URL → live preview of parsed id  
2. Server oEmbed → show thumbnail + title + author check  
3. Edit title EN/AM, category, featured, pinned, campaign tags  
4. Drag reorder featured + global  
5. Bulk activate/deactivate  
6. “Re-fetch oEmbed” button  
7. “Preview as visitor” opens modal  
8. Health column: OK / Removed / Thumbnail stale  
9. Optional: Connect TikTok (Wave C)

### 5.5 Data model (expanded)

```prisma
model TikTokVideo {
  id              String   @id @default(cuid())
  videoId         String   @unique
  url             String
  title           String
  titleAm         String?
  description     String?  @db.Text
  descriptionAm   String?  @db.Text
  authorName      String?
  authorUrl       String?
  thumbnailUrl    String?          // from oEmbed
  thumbnailLocal  String?          // mirrored local path
  thumbnailWidth  Int?
  thumbnailHeight Int?
  username        String   @default("activemoverset")
  category        String   @default("moves")
  campaignTag     String?
  durationHint    String?
  oembedHtml      String?  @db.Text // optional cached official html
  isFeatured      Boolean  @default(false)
  isPinned        Boolean  @default(false)
  isActive        Boolean  @default(true)
  healthStatus    String   @default("ok") // ok | removed | error | stale_thumb
  lastOembedAt    DateTime?
  order           Int      @default(0)
  viewCountLocal  Int      @default(0)
  shareCountLocal Int      @default(0)
  source          String   @default("manual") // manual | display_api
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([isActive, isFeatured, order])
  @@index([category, isActive])
  @@index([healthStatus])
}

model TikTokSettings {
  id                 String   @id @default(cuid())
  profileUsername    String   @default("activemoverset")
  showCreatorEmbed   Boolean  @default(true)
  homepageFeaturedN  Int      @default(6)
  // Wave C OAuth fields (encrypted at rest)
  accessTokenEnc     String?
  refreshTokenEnc    String?
  tokenExpiresAt     DateTime?
  openId             String?
  lastSyncAt         DateTime?
  updatedAt          DateTime @updatedAt
}
```

### 5.6 Server modules / APIs

```
lib/social.ts                         # @activemoverset locked
lib/tiktok/parse.ts                   # extract video id from URL
lib/tiktok/oembed.ts                  # fetch + validate author
lib/tiktok/player.ts                  # build player/v1 URL + postMessage helpers
lib/tiktok/categories.ts
lib/tiktok/map.ts                     # DB → UI DTO

app/api/tiktok/route.ts               # public list
app/api/tiktok/[id]/view/route.ts
app/api/tiktok/[id]/share/route.ts
app/api/admin/tiktok/route.ts
app/api/admin/tiktok/[id]/route.ts
app/api/admin/tiktok/reorder/route.ts
app/api/admin/tiktok/oembed/route.ts   # preview before save
app/api/admin/tiktok/health/route.ts
app/api/admin/tiktok/sync/route.ts     # Wave C Display API
```

### 5.7 oEmbed enrichment flow (server)

```ts
// Pseudocode — admin paste
const url = normalizeTikTokUrl(input) // must include /@activemoverset/video/{id}
const data = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`)
assert(data.author_url.includes('@activemoverset'))
save({
  videoId,
  title: data.title,
  thumbnailUrl: data.thumbnail_url,
  thumbnailWidth: data.thumbnail_width,
  thumbnailHeight: data.thumbnail_height,
  authorName: data.author_name,
  authorUrl: data.author_url,
  oembedHtml: data.html, // strip duplicate <script> when rendering
  lastOembedAt: now,
  healthStatus: 'ok',
})
```

### 5.8 Player helpers

```ts
export function buildTikTokPlayerSrc(videoId: string, opts?: {
  autoplay?: boolean
  muted?: boolean
  rel?: boolean
}) {
  const q = new URLSearchParams({
    controls: '1',
    progress_bar: '1',
    play_button: '1',
    volume_control: '1',
    fullscreen_button: '1',
    timestamp: '1',
    loop: '0',
    autoplay: opts?.autoplay ? '1' : '0',
    muted: opts?.muted ? '1' : '0',
    music_info: '0',
    description: '0',
    rel: opts?.rel === false ? '0' : '0', // prefer author; keep 0 for brand control
    closed_caption: '1',
  })
  return `https://www.tiktok.com/player/v1/${videoId}?${q}`
}

export function postToTikTokPlayer(iframe: HTMLIFrameElement, type: string, value?: unknown) {
  iframe.contentWindow?.postMessage(
    { 'x-tiktok-player': true, type, value },
    '*' // tighten if TikTok documents a specific origin
  )
}
```

### 5.9 Creator profile embed snippet (secondary module)

From [official docs](https://developers.tiktok.com/doc/embed-creator-profiles):

```html
<blockquote
  class="tiktok-embed"
  cite="https://www.tiktok.com/@activemoverset"
  data-unique-id="activemoverset"
  data-embed-type="creator"
  style="max-width: 720px; min-width: 288px;">
  <section>
    <a target="_blank" href="https://www.tiktok.com/@activemoverset">@activemoverset</a>
  </section>
</blockquote>
<!-- load embed.js once via TikTokEmbedProvider -->
```

Toggle via `TikTokSettings.showCreatorEmbed`.

### 5.10 Performance & CSP checklist

- [ ] Zero iframes on initial homepage paint  
- [ ] Reserve 9:16 space (aspect-ratio) to prevent CLS  
- [ ] Lazy-load poster images (`loading="lazy"` below fold)  
- [ ] Only one Player v1 iframe alive  
- [ ] Destroy iframe on modal close  
- [ ] `dns-prefetch` / `preconnect` to `https://www.tiktok.com` on `/tiktok` only  
- [ ] CSP allowlist documented for TikTok scripts/frames/images  
- [ ] Fallback UI when embed blocked  

### 5.11 Analytics map

| Event | Label / value |
|-------|----------------|
| `tiktok_card_click` | videoId, category, surface (home\|hub\|service) |
| `tiktok_modal_open` | videoId |
| `tiktok_player_ready` | videoId |
| `tiktok_player_ended` | videoId |
| `tiktok_player_error` | errorCode |
| `tiktok_follow_click` | surface |
| `tiktok_open_external` | videoId |
| `tiktok_share` | method (native\|copy) |
| `tiktok_book_cta` | videoId, category |
| `tiktok_filter` | category |

---

## 6. TikTok implementation phases (primary track)

### Phase T0 — Foundations (0.5 day)

- Lock `SOCIAL.tiktok = @activemoverset`
- Purge wrong usernames in code
- Confirm CSP needs
- Collect **12–16** public `@activemoverset` video URLs

### Phase T1 — Ingest + CMS (1.5–2 days)

- Prisma models + migrate  
- oEmbed preview/create APIs  
- Admin UI paste → enrich → save → reorder  
- Author validation against `@activemoverset`

### Phase T2 — Public feed UX (2–3 days) ← **flagship**

- Facade card + cinema strip on homepage  
- `/tiktok` hub (hero, filters, grid, load more)  
- Watch modal with **Player v1** + postMessage  
- Deep links, share, follow, book CTA  
- Analytics + SEO  
- Seed videos  
- `/videos` → `/tiktok`

**Exit criteria:** visitor can browse many Active Movers ET clips fast on mobile; watching feels intentional and premium; homepage does not load megabytes of TikTok JS up front.

### Phase T3 — Rich TikTok features (1.5–2 days)

- Creator profile embed module  
- Editorial featured row  
- Next/prev in modal  
- Ended → quote CTA  
- Health check cron  
- Service-page teaser strips  
- Optional local thumbnail mirroring  

### Phase T4 — Display API sync (optional, 2–4 days + approval time)

- TikTok Developer app + Login Kit  
- Store refresh token securely  
- Sync job → draft videos  
- Admin approval queue  
- Cover refresh via `/v2/video/query/`

---

## 7. Marketing pages (secondary, still in plan)

Keep these, but **after** TikTok Waves A/B unless running parallel.

| Priority | Route | Purpose |
|----------|-------|---------|
| P0 | `/how-it-works` | Process |
| P0 | `/areas` | Service areas hub |
| P0 | `/faq` | FAQ |
| P0 | `/packing-guide` | Packing education |
| P0 | `/pricing` | Price ranges / factors |
| P1 | `/why-us` | Trust |
| P1 | `/moving-checklist` | Utility SEO |
| P1 | `/office-moving` | B2B story |
| P1 | `/storage-guide` | Storage story |
| P1 | `/reviews` | Testimonials hub |
| P1 | `/get-quote` | Fast lead landing |
| P2 | `/areas/[slug]` | Megenagna / Bole / CMC |

**Brand rule:** main green `#16a34a` system — not the dark/orange premium landing.

**Design rule:** shared `components/marketing/*` primitives; one job per section; full-bleed heroes; no repeated stats spam.

Each marketing page should include a **small TikTok teaser** (2–3 facades) where relevant (packing page → packing category, etc.).

---

## 8. Navigation (TikTok-forward)

```
Home
Services ▾
Areas ▾
Watch → /tiktok          ← first-class nav item
Resources ▾ (How it works, Pricing, FAQ, Checklist, Why us, Reviews)
Blog
Contact
[Book Now]
```

Footer: Watch column with “TikTok feed” + `@activemoverset`.

Homepage order:

`Hero → Services → Showcase → Calendar → Testimonials → **TikTok cinema** → Gallery → CTA`

Optional Explore strip: `How it works · Areas · Pricing · Watch`

---

## 9. File map (TikTok-heavy)

### Create (TikTok)

```
lib/social.ts
lib/tiktok/parse.ts
lib/tiktok/oembed.ts
lib/tiktok/player.ts
lib/tiktok/categories.ts
lib/tiktok/map.ts

app/tiktok/page.tsx
app/videos/page.tsx
app/admin/tiktok/page.tsx

app/api/tiktok/route.ts
app/api/tiktok/[id]/view/route.ts
app/api/tiktok/[id]/share/route.ts
app/api/admin/tiktok/route.ts
app/api/admin/tiktok/[id]/route.ts
app/api/admin/tiktok/reorder/route.ts
app/api/admin/tiktok/oembed/route.ts
app/api/admin/tiktok/health/route.ts
app/api/admin/tiktok/sync/route.ts

components/marketing/tiktok-facade-card.tsx
components/marketing/tiktok-cinema-strip.tsx
components/marketing/tiktok-feed-grid.tsx
components/marketing/tiktok-filters.tsx
components/marketing/tiktok-watch-modal.tsx
components/marketing/tiktok-player.tsx
components/marketing/tiktok-creator-embed.tsx
components/marketing/tiktok-cta-panel.tsx
components/pages/tiktok-page.tsx
components/admin/tiktok-management.tsx
components/providers/tiktok-embed-provider.tsx
```

### Modify

```
prisma/schema.prisma
components/sections/tiktok-section.tsx
lib/video-utils.ts
lib/i18n.ts
lib/seo-utils.ts
lib/sitemap-generator.ts
components/header.tsx
components/footer.tsx
components/admin/admin-dashboard.tsx
app/page.tsx
```

---

## 10. Testing (TikTok-focused)

### Functional

- [ ] Only `@activemoverset` videos ingest (reject others)
- [ ] oEmbed failure shows clear admin error
- [ ] Featured order respected on homepage
- [ ] Filters on `/tiktok`
- [ ] Modal: open/close, Esc, focus trap, pause on close
- [ ] Deep link `?v=` works when shared
- [ ] Share copies deep link
- [ ] Player error shows fallback
- [ ] `/videos` redirects
- [ ] Inactive/removed videos hidden or flagged

### Performance

- [ ] Homepage: **0** TikTok iframes before click  
- [ ] `/tiktok` grid: **0** iframes before click  
- [ ] After watching 5 videos sequentially, only 1 iframe exists  
- [ ] Mobile scroll remains smooth with 12+ facades  

### Cross-browser / blockers

- [ ] Chrome / Safari / Firefox  
- [ ] When embed blocked: facade + Open on TikTok still useful  

---

## 11. Acceptance criteria (TikTok done)

1. Homepage cinema strip shows **6** real `@activemoverset` facades  
2. `/tiktok` is a full media hub with filters, modal Player v1, follow + book CTAs  
3. Admin can paste a URL, auto-fill from oEmbed, feature it, and see it live  
4. No Freeman Movers / fake stats remain  
5. Page weight stays sane (facade-first)  
6. Analytics fire for open / follow / book  
7. Creator profile embed optional module works (Wave B)  

Marketing pages may ship in parallel but **do not block** TikTok Wave A/B.

---

## 12. Content checklist

- [x] Username locked: **`@activemoverset`**
- [ ] 12–16 public video URLs from that account
- [ ] Category per video
- [ ] 6 homepage featured picks
- [ ] Confirm profile is public (required for embeds)
- [ ] Optional: TikTok Developer app for Wave C sync

---

## 13. Source index (bookmark these)

| Topic | Link |
|-------|------|
| Embed videos + oEmbed | https://developers.tiktok.com/doc/embed-videos |
| Creator profile embed | https://developers.tiktok.com/doc/embed-creator-profiles |
| Embed Player + postMessage | https://developers.tiktok.com/doc/embed-player |
| Display API overview | https://developers.tiktok.com/doc/display-api-overview |
| Display API get started | https://developers.tiktok.com/doc/display-api-get-started/ |
| Login Kit (web) | https://developers.tiktok.com/doc/login-kit-web |
| API scopes | https://developers.tiktok.com/doc/tiktok-api-scopes |
| Content Posting (out of scope) | https://developers.tiktok.com/products/content-posting-api |
| oEmbed spec | https://oembed.com/ |
| 2026 embed how-to | https://tiktokembed.com/blog/how-to-embed-tiktok-video |
| Embed troubleshooting | https://tiktokembed.com/blog/tiktok-embed-not-working |
| Lite/facade approach | https://github.com/justinribeiro/lite-tiktok |
| Perf deep dive | https://justinribeiro.com/chronicle/2022/07/15/terrible-tiktok-embed-web-performance-and-my-imperfect-web-component-solution/ |
| Active Movers ET profile | https://www.tiktok.com/@activemoverset |

---

## 14. Decisions log

| Topic | Decision |
|-------|----------|
| Username | **`@activemoverset`** locked |
| Primary route | `/tiktok` |
| Grid strategy | Facades only |
| Modal player | Official **Player v1** + postMessage |
| Metadata | **oEmbed** on ingest (+ refresh) |
| Profile widget | Official creator embed as secondary module |
| Auto-sync | Phase T4 Display API (optional) |
| Third-party widgets | Not used |
| Brand | Main green site vibe |

### Still open

1. Seed video URL list  
2. Whether to mirror thumbnails locally in Wave A or B  
3. When to apply for TikTok Display API access  

---

## Addenda

| Date | Change |
|------|--------|
| 2026-07-18 | v1 — basic feed + 4 pages |
| 2026-07-18 | v2 — expanded pages + stronger feed |
| 2026-07-18 | **v3** — TikTok-first rewrite after web research: oEmbed, creator profile embed, Player v1 controls, facade performance rules, Display API sync path, large TikTok feature backlog (Waves A–C), source index with official links |
