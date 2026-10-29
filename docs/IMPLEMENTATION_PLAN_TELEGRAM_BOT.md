# Implementation Plan: Active Movers Telegram Bot

**Project:** Active Movers & Packers  
**Updated:** 18 October 2026 (five review passes; last pass = validation only)  
**Readiness:** Implementation-ready; run §0 before Phase 1 deploy.  
**Status:** Ready for implementation  
**AI provider:** Addis AI only (no OpenRouter in v1)  
**Human handoff:** private staff Telegram group + link to `@activemovers`

---

## 0. Pre-flight checklist (before production webhook)

| Step | Owner | Done when |
|------|--------|-----------|
| Create bot via [@BotFather](https://t.me/BotFather); store token in `TELEGRAM_BOT_TOKEN` | Ops | `getMe` succeeds |
| Create private staff supergroup; add bot; copy id to `TELEGRAM_STAFF_GROUP_ID` | Ops | Bot can `sendMessage` there |
| Generate `TELEGRAM_WEBHOOK_SECRET` (≥16 random bytes, charset `A-Za-z0-9_-` only) | Dev | Matches [setWebhook](https://core.telegram.org/bots/api#setwebhook) rules |
| Fund Addis wallet; run `voices.preview` + one test `voice.generate` | Dev | MP3 downloads |
| Write `data/telegram/playbook.md` (real pricing rules — placeholder is not enough for go-live) | Business | Legal review of what bot may say |
| `npm run setup-admin` + Phase 0 login before enabling dashboard | Dev | `/api/admin/*` returns 401 without cookie |
| `setWebhook` on **www** host; `getWebhookInfo` shows no error | Dev | Test message reaches webhook |
| Confirm Neon/Postgres connection pool: long work runs in `after()`, not inside `$transaction` | Dev | See §6 lock rules |

Telegram stores undelivered updates **≤24 hours** ([getting updates](https://core.telegram.org/bots/api#getting-updates)). Extended downtime means some customer messages are lost — monitor webhook health.

---

## 1. Executive summary

Build a Telegram bot that answers customer questions about Active Movers in Amharic and English, using **one business playbook** as the only source of facts. Spoken replies use **Addis Voices 2**. Customers may type or send a voice note; voice notes are transcribed with **Addis Scribe** (Turbo).

The bot does not replace dispatch and does not price a home from photos. It explains the business from the playbook, collects context, and posts a **conversation report** to a **staff group**. The customer continues with a person by opening `@activemovers` (and by phone when we have one). **Messaging the bot does not open a DM channel for a separate business account** unless the customer also contacts that account.

Every turn is stored in Postgres for `/admin/telegram` (users, sessions, volume, handoffs, estimated Addis spend). That UI ships only after **admin login** exists. Today `/admin` and `/api/admin/*` are **not authenticated**, despite `JWT_SECRET`, the `Admin` model, `bcryptjs`, and `jsonwebtoken` in the repo.

### Architecture

```
Telegram HTTPS POST → verify secret → dedupe update_id → 200 OK
  → after(): per-chat lock → Addis (Scribe? → chat → Voices 2) → Telegram send
  → Postgres log → optional staff-group report
```

Inbound voice: **Scribe → chat → Voices 2**. Caps: **20 counted answers / 24h** and **8 counted answers / 10 min**.

---

## 2. What we are building

| In v1 | Out of v1 |
|-------|-----------|
| Private chat with the bot | OpenRouter or a second LLM |
| One playbook in the system prompt | RAG, embeddings, vector search |
| Text in, voice note in | Addis Realtime / live call UX |
| Voice reply on Q&A turns + text caption | TTS on every photo ack |
| Name from Telegram or one question | Auto price from photos |
| Photos/videos copied to staff group | Vision quoting |
| Staff report + `@activemovers` + phone | Bot impersonating the human account |
| 20 counted answers per sliding 24h | Unlimited chat |
| Admin analytics behind login | Public dashboard |
| Staff `/reply` relay | — |

---

## 3. How it fits the current codebase

| Existing | Use |
|----------|-----|
| `lib/telegram.ts` | Keep for website booking/contact alerts to `TELEGRAM_CHAT_ID` |
| `TELEGRAM_BOT_TOKEN` | Same token for webhook + outbound API |
| Prisma + `db:push` | New models (no `prisma/migrations` folder today) |
| `app/admin/*` | Add `/admin/telegram` after auth |
| `middleware.ts` | Maled host blocks `/admin` on maledactive; **do not** require admin cookie on `/api/telegram/webhook` |
| `generateTelegramLink` | Same human username as handoff template |

**Webhook URL (production):** `https://www.activemoverset.com/api/telegram/webhook` only on the main site.

**Env split:** `TELEGRAM_STAFF_GROUP_ID` for bot handoff reports. `TELEGRAM_CHAT_ID` stays for website notifications. They may be the same group if operations wants one inbox.

**Bot in staff group:** Must be a **member** with permission to send messages. Admin rights are **not** required for `copyMessage` ([Telegram `copyMessage`](https://core.telegram.org/bots/api#copymessage)).

**Same token caveat:** After `setWebhook`, **all** bot updates (including messages the bot sends to groups, if Telegram delivers them) hit the webhook. The handler must accept only **private** chats from **human** users (`message.from` present, not `message.from.is_bot`).

**Telegram Business:** If `@activemovers` later uses Telegram Business connected to this bot, you may need `business_message` in `allowed_updates`. Out of v1 unless that connection already exists.

---

## 4. Addis AI usage

Official docs: [API overview](https://docs.addisassistant.com/docs/get-started/api-overview) · [Text generation](https://docs.addisassistant.com/docs/capabilities/text-generation) · [System instructions](https://docs.addisassistant.com/docs/capabilities/text-generation/system-instructions) · [Voices 2](https://docs.addisassistant.com/docs/capabilities/text-to-speech) · [Scribe / STT](https://docs.addisassistant.com/docs/capabilities/speech-to-text) · [Voice pipeline](https://docs.addisassistant.com/docs/integration/voice-interface) · [Pricing](https://docs.addisassistant.com/docs/platform/pricing)

### SDK install

Pin a tested release tarball (Scribe needs ≥ 0.4.0; speaker labels ≥ 0.6.0 — not needed for v1):

```bash
npm install https://github.com/Addis-AI-Org/addisai-js/releases/download/v0.6.0/addisai-0.6.0.tgz
```

`ADDIS_API_KEY` — server only, never `NEXT_PUBLIC_*`.

| Step | API | When |
|------|-----|------|
| Answer | `addis.chat.completions.create` | Counted text/voice turn under caps |
| Speak | `addis.voice.generate` | After chat text exists |
| Listen | `addis.scribe.transcribe({ backend: "turbo", requestId })` | Voice note / audio file |
| Estimate | `addis.voice.estimate` | Long reply; shorten script if `canGenerate` is false |

Do **not** use legacy `/api/v1/audio` (TTS) or `/api/v2/stt` (60s / 10MB; poor fit for Telegram voice).

### Chat

Addis `chat_generate` is **stateless**: every request must include full `conversation_history` / SDK `messages` again ([multi-turn docs](https://docs.addisassistant.com/docs/capabilities/text-generation)). Our DB transcript is the source of truth.

- `persona` + `system` (hard rules + playbook).
- `messages`: last 20 user/assistant **text** rows for this session (roles `user` | `assistant` only).
- `target_language`: `am` or `en` per turn (see language rule below).
- `temperature`: `0.2` via `generation_config`.
- `maxOutputTokens`: cap (~400–600) so spoken answers stay short before TTS; full detail goes in the text `sendMessage`.
- Log tokens from `usage_metadata` / SDK `usage` on every response ([chat_generate API](https://docs.addisassistant.com/docs/api-reference/chat-generate)).
- If `finish_reason` is `safety` or empty text, send a fixed handoff template — do not TTS.
- Language in code: Ge'ez in message → `am`; Latin-only → `en`; else `am`. Prefer Ge'ez in user prompts when possible ([Addis localization note](https://docs.addisassistant.com/docs/capabilities/text-generation)).

### Hard rules (in `system` always)

1. Playbook only; otherwise defer to human.  
2. No invented prices, dates, or discounts.  
3. Photos are for staff; confirm receipt only.  
4. Spoken part: 2–5 sentences; numbers/addresses in caption.  
5. Use stored `displayName`.

### Voices 2 → Telegram

- Pick voice via `voices.list` / `voices.preview`; default candidate `ADDIS_VOICE_ID=am-hamen`.
- `outputFormat: "mp3_44100"`.
- **Download** bytes from `clip.audioUrl` (signed; expires — do not store URLs in DB) or use SDK `clip.toFile()` / buffer helper ([Voices 2 generate](https://docs.addisassistant.com/docs/capabilities/text-to-speech)), then **`sendVoice` via multipart upload** (`voice` field, `type=audio/mpeg`).
- Reuse the same `clientRequestId` only when **retrying the same** TTS after timeout; new text → new id ([idempotency](https://docs.addisassistant.com/docs/capabilities/text-to-speech)).
- Call `voice.estimate` when balance is low; if `canGenerate` is false, send **text only** and log — do not loop TTS.

Do **not** pass the Addis URL to Telegram for `sendVoice`: Telegram’s “send by URL” path for voice is effectively **OGG ≤ ~1MB** ([Sending files](https://core.telegram.org/bots/api#sending-files)). Generated MP3 clips should be uploaded as files (≤ 50MB for bots).

**Caption limit:** `sendVoice` captions are **max 1024 characters** ([sendVoice](https://core.telegram.org/bots/api#sendvoice)). Spoken script can be short; put the full answer (checklists, addresses) in a **follow-up `sendMessage`** if caption would exceed ~900 chars. Never attach a 2k-char playbook answer only as a voice caption — delivery fails with `400: message caption is too long`.

### Scribe (Telegram voice notes)

- Limits: **180s**, **25MB** ([Scribe docs](https://docs.addisassistant.com/docs/capabilities/speech-to-text)).
- Playground accepts **WAV, MP3, M4A, WebM, OGG, FLAC** ([STT playground](https://docs.addisassistant.com/docs/playground/speech-to-text)) — Telegram **OGG/Opus** should work without ffmpeg in v1. If production rejects MIME, log and ask user to type; add conversion only then.
- `requestId` before upload; `scribe.recover` on interrupted HTTP.
- Billing: final transcript characters (docs: **3.5 ETB / 1k chars**; confirm `scribe.usage()`). Promos may apply ([pricing](https://docs.addisassistant.com/docs/platform/pricing)).
- Concurrency: up to **10** file jobs per account; **429** + `Retry-After` — one retry with same `requestId`.

### Cost notes

- `/start` welcome voice uses TTS but **does not** count toward the 20-answer cap (still bills Addis).
- Dashboard uses list rates as **estimates**; store raw usage from each API response.

### Latency & chat actions

STT + chat + TTS is often **10–30+ seconds**. The webhook returns 200 before this work (§9). Inside `after()`:

1. [`sendChatAction`](https://core.telegram.org/bots/api#sendchataction): `record_voice` during Scribe; `upload_voice` while downloading/uploading MP3; `typing` for text-only fallback. Indicators last **~5 seconds** and clear when the bot sends a message.
2. Re-send the same action **every ~4 seconds** until the reply is sent (ignore transient errors in that loop).
3. Prefer **short voice caption + full text in `sendMessage`** when the answer is long (see caption limit above).

Production `next.config.js` strips `console.log`; use `console.error` for failures.

---

## 5. Playbook document

**Source file:** `data/telegram/playbook.md`  
**Load in production:** bundle as a string — do not rely on `fs.readFile` at runtime on Vercel without `outputFileTracingIncludes`.

Recommended approach for this repo (`next.config.js` is plain JS, dev may use Turbopack):

1. Add `devDependency` `raw-loader` (or webpack `type: 'asset/source'` for webpack builds).
2. Extend `next.config.js` webpack rule for `*.md` under `data/telegram/`.
3. For Turbopack dev, add `experimental.turbo.rules` for `*.md` → `raw-loader` ([Next + raw markdown pattern](https://stackoverflow.com/questions/47954367/import-markdown-files-as-strings-in-next-js)).
4. `types/telegram-playbook.d.ts`: `declare module '*.md' { const content: string; export default content }`.
5. `lib/addis/playbook.ts` imports the string and builds `system` text.

Alternative: `lib/addis/playbook-content.ts` exporting a template literal (no webpack change; slightly worse for non-dev editors).

Sections to fill from the business: identity & contact, quote process, pricing rules, escalations, fixed Amharic phrases.

---

## 6. Conversation behavior

### Eligibility

- `message.chat.type === 'private'`.
- Ignore: groups, channels, `edited_message`, bot’s own messages, updates without `message`.

### Identity

- `/start`: save `first_name`, `last_name`, `username`.
- `displayName` = `first_name` if ≥2 letters; else `awaitingName = true` until next text (not sent to Addis, **not counted**).
- `/start` + `/help`: privacy line (§15) + welcome **text + one voice** (TTS cost, **not counted**).

**Commands:** Detect with `message.text` matching `^/(start|help)(@\w+)?(\s|$)` (handles `/start@YourBot`), or `entities` type `bot_command` using **UTF-16** offsets if you slice entities manually ([MessageEntity](https://core.telegram.org/bots/api#messageentity)). Do not treat `/start` as a counted FAQ turn.

### What counts toward “20 answers”

Increment **only after** a successful assistant delivery (voice or text fallback) for a user **text** or **voice** turn. Persist on the **user** message row: `countsTowardLimit = true` (and store assistant row without counting).

**Not counted:** `/start`, `/help`, name capture, phone capture, media, location, failed Addis (“try again”), cap-exhausted template, burst-block message.

### Sliding 24h cap

```sql
counted_24h = COUNT(*) FROM TelegramMessage
  WHERE userId = ? AND countsTowardLimit = true AND createdAt > now() - interval '24 hours'
```

Let `n = counted_24h` **before** handling the current text/voice message:

| `n` before this turn | Behavior |
|----------------------|----------|
| 0–16 | Normal chat + voice |
| 17–18 | Normal + one sentence: “2 / 1 replies left, then our team” |
| 19 | **Last** chat + voice; include human link; set `handoffReason = limit_reached` and post staff report after send |
| ≥ 20 | Fixed bilingual template only; no Addis; report only if `handoffAt` still null |

So the customer gets **20 model answers** per rolling day; message 21+ gets the template only.

### Burst cap (from day one)

```sql
counted_10m = same filter AND createdAt > now() - interval '10 minutes'
```

If `counted_10m >= 8` before a new text/voice turn: send “please wait a few minutes”, no Addis, no increment.

### Media

- Each album photo/video = separate webhook update, shared `media_group_id`.
- Store all; cap **15** photo/video rows per user per 24h.
- **Album ack (serverless-safe):** do not rely on in-memory `setTimeout` only — multiple Vercel instances will each fire. Use DB state:
  - On each photo/video insert, set `TelegramSession.lastMediaAt = now()` and `mediaAckSent = false` (or a small `TelegramMediaBatch` row keyed by `mediaGroupId` / session).
  - Each handler schedules `after(async () => { await sleep(3000); in a transaction: if no newer media row for this session/group since schedule time and !ackSent → send one thank-you text; set ackSent })`.
  - Only one ack per album/session burst.
- **No TTS** on media acks.
- Quote report only when **≥1 media** and **phone** on session (see below).
- `getFile` download limit **20MB** ([`getFile`](https://core.telegram.org/bots/api#getfile)) — enough for normal photos; huge videos may fail — log and ask for smaller clips.

### Phone before quote report

If media exists and `phone` is null: set `awaitingPhone`, ask in **text**, do not post quote report. Accept phone from:

- Plain text (`+251…`, `09…`, spaces/dashes stripped), or
- **`message.contact`** shared via Telegram’s contact button (`contact.phone_number`, `contact.user_id` should match sender when possible).

Validate loosely, save, **not counted**, then post report if media exists.

If user hits **limit** with no phone: still post report with `no phone` and push `t.me/{TELEGRAM_USERNAME}`.

### Keyword handoff (code, not LLM tools)

Amharic/English triggers (extend list in code): ሰው, አድርገኝ, ቅሬታ, agent, human, call me, manager, etc. → staff report + short handoff text (template OK without Addis if you prefer zero cost).

If `handoffAt` is already set (e.g. quote report sent) but the user later asks for a human, post a **short** group update (“customer requested a person — session X”) instead of a second full report.

### Concurrent messages from same user

Telegram may deliver **parallel** webhook requests ([webhook guide](https://telegrambots.github.io/book/3/updates/webhook.html); `max_connections` up to 40). Without coordination, two quick texts → two Addis bills and two voice notes.

**Use two different mechanisms — do not hold a Postgres advisory lock across Addis/Telegram HTTP calls.**

| Mechanism | Scope | Implementation |
|-----------|--------|----------------|
| **Turn mutex** (whole `handleTurn`) | One Addis pipeline per user at a time | `TelegramUser.processingUntil = now() + 2min` at start; clear at end. If locked, `sendMessage` “እባክዎ ትንሽ ይጠብቁ…” and **return** (no Addis). Optional: queue one pending flag to process after unlock. |
| **Short DB transaction** | Cap check + `countsTowardLimit` write | Inside `prisma.$transaction`, `SELECT pg_advisory_xact_lock(hashtext('tg-user:' \|\| telegramUserId))` then read count + insert rows — **milliseconds only** ([Prisma + xact lock](https://github.com/prisma/prisma/discussions/16740)). Never call Scribe/chat/TTS inside this transaction. |

`pg_advisory_xact_lock` auto-releases on commit/rollback ([PostgreSQL advisory locks](https://www.postgresql.org/docs/current/explicit-locking.html)). Holding it through a 20s Addis call blocks the pool and serializes unrelated work on hash collisions.

Runbook: if the user spams messages while `processingUntil` is set, they get the wait text, not double answers.

---

## 7. Staff group report

- **Plain text** only (no `parse_mode`) — addresses break Markdown.
- **Chat id:** supergroups are negative strings like `-1001234567890`. Get id via `@userinfobot` or `getUpdates` once in dev, store in `TELEGRAM_STAFF_GROUP_ID`.
- Post when `handoffAt` is null and:
  - `asked_for_human` keyword, or
  - `limit_reached` on 20th answer, or
  - media + phone present (`needs_quote`).

Body: session id, name, `@username` or none, numeric id, phone, intake fields, `n/20` in 24h, reason, last 10 transcript lines, **“Customer must message @{username} or call {phone}”**.

Then `copyMessage` from `chatId` (user private chat) to staff group for each stored `fileId` message.

On success: `handoffAt`, `staffMessageId`, `handoffReason`. Session stays `active` until 7d idle → `closed`.

Further media: short “more files for session X” line, not a full duplicate report.

**Failures:** log `console.error`; leave `handoffAt` null so next qualifying event retries.

---

## 8. Data model

All Telegram ids: **String**.

### `TelegramUpdate`

| Field | Notes |
|-------|--------|
| `updateId` | String, `@unique` — insert in webhook before `after()` |

### `TelegramUser`

| Field | Notes |
|-------|--------|
| `telegramUserId`, `chatId` | unique on `telegramUserId` |
| `username`, `firstName`, `lastName`, `displayName` | |
| `awaitingName`, `awaitingPhone` | boolean |
| `isBlocked` | true if Telegram returned 403 to send |
| `processingUntil` | DateTime nullable — turn mutex (see §6) |
| `createdAt`, `lastSeenAt` | |

### `TelegramSession`

| Field | Notes |
|-------|--------|
| `status` | `active` \| `closed` |
| intake + `phone` | nullable |
| `handoffReason` | `needs_quote` \| `asked_for_human` \| `limit_reached` |
| `handoffAt`, `staffMessageId` | |
| `lastMediaAt`, `mediaAckSent` | optional album debounce on session |

### `TelegramMessage`

| Field | Notes |
|-------|--------|
| `telegramMessageId`, `mediaGroupId` | |
| `role`, `kind`, `text` @db.Text, `fileId` | |
| `countsTowardLimit` | default false |
| usage columns | tokens, `sttCharacters`, `ttsSeconds` |

Indexes:

- `@@unique([userId, telegramMessageId])`
- `@@index([userId, countsTowardLimit, createdAt])`
- `@@index([sessionId, createdAt])`

---

## 9. Webhook & hosting

### Route config

`app/api/telegram/webhook/route.ts`:

```ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120 // headroom for STT+chat+TTS; see Vercel note below
```

### Handler sequence

1. Read body JSON **once**; parse `update_id`, `message`. **Pass the parsed `Update` object into `after()`** — the request body is not readable again.
2. Compare `X-Telegram-Bot-Api-Secret-Token` to `TELEGRAM_WEBHOOK_SECRET` with **`timingSafeEqual`** (secret: `A-Z a-z 0-9 _ -`, 1–256 chars per [setWebhook](https://core.telegram.org/bots/api#setwebhook)). Compare equal-length buffers only.
3. If secret env missing in production → **401** (fail closed). Local dev: use the same secret through ngrok; avoid disabling verification unless `NODE_ENV=development` and an explicit `TELEGRAM_WEBHOOK_INSECURE_DEV=true` flag (document as dangerous).
4. `INSERT TelegramUpdate` — on unique violation → **200** (duplicate). Note: Telegram may eventually choose a **random** `update_id` if the bot was idle a week+ ([Update](https://core.telegram.org/bots/api#update)) — dedupe still helps retries, not infinite history.
5. If not private human message → **200** (includes `channel_post`, group chatter, `my_chat_member`, etc.).
6. `after(async () => { try { await handleTurn(update) } catch (e) { console.error(e); await safeApology(chatId) } })`
7. **200** immediately with `Content-Type: application/json` and body `{"ok":true}` ([webhook ack](https://core.telegram.org/bots/webhooks)).

**Do not** reply to the webhook with embedded `sendMessage` JSON — Telegram will not return success/failure of that call to your app ([Bot API FAQ pattern](https://core.telegram.org/bots/api#getting-updates)). Always call `api.telegram.org` from `after()`.

**Sync path errors:** JSON parse failure → log + **200** (avoid retry storms on garbage POSTs). Secret failure → **401**. Unhandled throw in steps 1–6 before `after()` → still prefer **200** if `after()` was already scheduled; otherwise **200** + log (same rationale as [webhook best practice](https://valgorithms.github.io/TelegramPHP/guide/webhooks.html)).

### `after()` limits (documented)

- `after()` is **stable** in Next.js **≥ 15.1** (`import { after } from 'next/server'`). This repo is on **15.4.10** — no `experimental.after` flag ([`after` docs](https://nextjs.org/docs/app/api-reference/functions/after)).
- `after()` runs until route **`maxDuration`**.
- Vercel Fluid Compute: default **300s** on Hobby/Pro; configurable higher on Pro ([Vercel limits](https://vercel.com/docs/functions/limitations)).
- **`after()` is not durable:** crash or deploy mid-turn → no Telegram retry ([Vercel event-driven guidance](https://vercel.com/docs/event-driven-architecture)). Mitigations for v1: `update_id` dedupe, per-chat lock, apology in `catch`. **Phase 4+:** enqueue turn to **Vercel Queues** (or similar) if silent failures appear in logs.

Do **not** use fire-and-forget promises without `after()`.

### `setWebhook` (production)

```http
POST https://api.telegram.org/bot<TOKEN>/setWebhook
{
  "url": "https://www.activemoverset.com/api/telegram/webhook",
  "secret_token": "<TELEGRAM_WEBHOOK_SECRET>",
  "allowed_updates": ["message", "callback_query"],
  "max_connections": 10,
  "drop_pending_updates": true
}
```

Lower `max_connections` while each turn is slow (STT+TTS) to reduce parallel load. Add `scripts/telegram-set-webhook.ts` that reads env and calls the API.

**Quote intake wizard:** When `docs/IMPLEMENTATION_PLAN_TELEGRAM_INTAKE_WIZARD.md` is deployed, `allowed_updates` must include `callback_query` (inline menus). Re-run `npm run telegram:set-webhook` after merge.

`getWebhookInfo` after deploy. Remove webhook (`url: ""`) before switching back to local `getUpdates` testing.

Call [`setMyCommands`](https://core.telegram.org/bots/api#setmycommands) for `/start` and `/help`. Optional later: inline keyboard with `url: https://t.me/{TELEGRAM_USERNAME}` on handoff.

**Logging:** never log `TELEGRAM_BOT_TOKEN`, `ADDIS_API_KEY`, or full playbook+history prompts.

### Telegram API errors

If `sendMessage`/`sendVoice` returns **403** (user blocked bot), set a flag on `TelegramUser` and stop processing until `/start` again.

---

## 10. Admin analytics

**Blocked until Phase 0 login.**

- `POST /api/admin/login` → httpOnly cookie (JWT via `JWT_SECRET`, `Admin` + `bcryptjs`).
- Extend `middleware.ts`: protect `/admin` and `/api/admin` **except** login routes and the Telegram webhook.

Example matcher addition (keep existing Maled logic first; only run admin JWT when path matches):

```ts
// Pseudocode — merge with existing middleware.ts
const isAdminArea =
  pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
const isPublicAdmin =
  pathname === '/admin/login' || pathname === '/api/admin/login'
const isTelegramWebhook = pathname === '/api/telegram/webhook'

if (isAdminArea && !isPublicAdmin && !isTelegramWebhook) {
  // verify JWT cookie; else redirect or 401
}
```

Alternatively exclude webhook in `config.matcher` negative lookahead ([Next.js matcher](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher)) — but explicit path check is clearer alongside Maled rewrites.

Pages: `/admin/telegram`, APIs for overview + session detail. Link from `admin-dashboard.tsx`.

“Today” = **Africa/Addis_Ababa**. Cost estimate from logged usage (list ETB rates, labeled estimate).

---

## 11. File layout

```
data/telegram/playbook.md
types/telegram-playbook.d.ts
lib/addis/client.ts
lib/addis/playbook.ts
lib/telegram/bot.ts
lib/telegram/webhook-handler.ts
lib/telegram/report.ts
lib/telegram/locks.ts
lib/admin/auth.ts
app/api/telegram/webhook/route.ts
app/api/admin/login/route.ts
app/api/admin/telegram/...
app/admin/login/page.tsx
app/admin/telegram/page.tsx
components/admin/telegram-dashboard.tsx
scripts/telegram-set-webhook.ts
prisma/schema.prisma
middleware.ts
next.config.js                    # md raw import rule
```

---

## 12. Environment

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_BOT_TOKEN` | Bot API |
| `TELEGRAM_WEBHOOK_SECRET` | Webhook header; charset per Telegram |
| `TELEGRAM_STAFF_GROUP_ID` | e.g. `-100…` |
| `TELEGRAM_USERNAME` | Human link |
| `TELEGRAM_CHAT_ID` | Website alerts (unchanged) |
| `ADDIS_API_KEY` | Addis platform |
| `ADDIS_VOICE_ID` | After preview |
| `JWT_SECRET` | Admin session |

Update **README** env section when implementing.

---

## 13. Build order

### Phase 0 — Admin gate

Login + middleware. Webhook route excluded.

### Phase 1 — Text bot

Prisma, playbook import, webhook + `after()` + dedupe + lock, text → chat → download MP3 → multipart `sendVoice` + caption, caps, name flow.

**Done:** 3 Amharic Q&A with voice; 20th answer is last Addis call; duplicate `update_id` → one voice; MP3 not sent via URL.

### Phase 2 — Voice, media, staff

Scribe on OGG; media debounce; phone gate; plain report + `copyMessage`; keywords.

### Phase 3 — Dashboard

Behind auth.

### Phase 4 — Hardening

Retention (blank text >90d); optional TTS throttling; **Vercel Queue** if `after()` drops turns; optional staff `/reply`.

---

## 14. Failure behavior

| Case | User | Cap | Telegram retry |
|------|------|-----|----------------|
| Bad secret | — | — | Yes until 2xx |
| Duplicate `update_id` | — | — | 200, no-op |
| Addis 5xx/429 | try again text | no | 200 |
| Scribe fail / empty | type or shorter note | no | 200 |
| TTS fail | text answer | yes | 200 |
| Caption >1024 | voice + separate `sendMessage` with full text | yes | 200 |
| Addis wallet empty (`canGenerate` false) | text apology + human link | no* | 200 |
| Telegram 429 | brief wait + one retry | no | 200 |
| User blocked bot (403) | — | — | stop; set `isBlocked` |
| `after()` throw | apology if possible | no | **no** (why queue is phase 4) |

\*If chat already succeeded but TTS wallet fails, count the turn if text was delivered.

---

## 15. Privacy

`/start` discloses that content goes to Active Movers staff for quotes. No playbook+history in logs. Staff group is private.

---

## 16. Test plan

1. Name flows (`/start` with/without name).  
2. Playbook-bound answer + refused unknown price.  
3. English → `en` generation.  
4. Voice <30s → transcript + voice reply + usage.  
5. Voice `duration` >180 → no Addis.  
6. Album + phone → one ack, one report, copies in group.  
7. No username → report instructs call / `t.me/...`.  
8. `n` = 17,18,19,20,21 behavior per §6 table.  
9. 9th counted attempt within 10 minutes blocked.  
10. Same `update_id` twice → one reply.  
11. Report with `_` in address renders.  
12. `sendVoice` uses multipart file, not URL.  
13. Two parallel texts → lock prevents double answer (or second waits).  
14. Dashboard vs Prisma; admin API 401 without cookie.  
15. Booking alert still uses `lib/telegram.ts`.  
16. Group message → bot silent.  
17. Caption >1024: user still receives voice + full text message.  
18. Album of 4 photos on Vercel: exactly **one** thank-you (DB debounce, not double ack).  
19. User shares **contact** card → phone saved, quote report fires when media present.  
20. `sendChatAction` loop during a 15s Addis turn (no frozen UI).  
21. Second text while `processingUntil` active → wait message, single Addis pipeline.

---

## 17. Decisions (locked)

Addis-only; Voices 2 + Scribe Turbo; one bundled playbook; plain staff reports; human via `@activemovers`; phone required for **quote** report; 20 answers / 24h + 8 / 10m; per-chat lock; webhook 200 + `after()`; MP3 upload to Telegram; admin auth before transcripts; optional queue later.

---

## 18. Official references (review checklist)

| Topic | Link |
|-------|------|
| `setWebhook`, `secret_token`, `allowed_updates` | [setWebhook](https://core.telegram.org/bots/api#setwebhook) |
| `update_id` deduplication | [Update](https://core.telegram.org/bots/api#update) |
| `sendVoice`, file upload | [sendVoice](https://core.telegram.org/bots/api#sendvoice) |
| URL vs multipart limits | [Sending files](https://core.telegram.org/bots/api#sending-files) |
| `copyMessage` | [copyMessage](https://core.telegram.org/bots/api#copymessage) |
| `getFile` 20MB | [getFile](https://core.telegram.org/bots/api#getfile) |
| Next.js `after()` + `maxDuration` | [after](https://nextjs.org/docs/app/api-reference/functions/after) · [maxDuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration) |
| Vercel timeouts / `after` | [Function limits](https://vercel.com/docs/functions/limitations) · [Event-driven primitives](https://vercel.com/docs/event-driven-architecture) |
| Addis Scribe limits & OGG playground | [Speech-to-text](https://docs.addisassistant.com/docs/capabilities/speech-to-text) · [Playground](https://docs.addisassistant.com/docs/playground/speech-to-text) |
| Addis voice pipeline | [Voice interface](https://docs.addisassistant.com/docs/integration/voice-interface) |
| `sendChatAction` / 5s indicator | [sendChatAction](https://core.telegram.org/bots/api#sendchataction) |
| Caption 1024 on voice | [sendVoice](https://core.telegram.org/bots/api#sendvoice) |
| `after()` stable (15.1+) | [after](https://nextjs.org/docs/app/api-reference/functions/after) |

---

## 19. Third-review changelog (what changed)

| Topic | Finding | Plan update |
|-------|---------|-------------|
| Voice delivery | MP3 via multipart; Addis `audio_url` + `clientRequestId` idempotency | §4 |
| Caption | >1024 breaks `sendVoice` entirely | Split voice + `sendMessage` §4, §14, tests |
| Typing indicator | 5s max; long Addis pipeline needs ~4s refresh | §4 |
| Album debounce | In-memory timers break on serverless multi-instance | DB-backed ack §6 |
| Phone intake | `message.contact` is native Telegram | §6 |
| Webhook body | Must clone update for `after()` | §9 |
| `after()` | Stable in 15.1+, no experimental flag | §9 |
| Repeat human ask | After quote report | Short group ping §6 |
| Security | Token logging | §9 |

---

## 20. Fourth-review changelog

| Topic | Finding | Plan update |
|-------|---------|-------------|
| Advisory lock | Must **not** wrap Scribe/chat/TTS (pool + 10min query limits) | Split turn mutex vs short `$transaction` §6 |
| Webhook ack | Return `{"ok":true}`; no inline `sendMessage` in HTTP response | §9 |
| Handler errors | 200 after queueing work; 401 only for bad secret | §9 |
| Middleware | Explicit webhook exclusion when admin JWT lands | §10 |
| Go-live | BotFather, group id, playbook, 24h update retention | §0 |
| `processingUntil` | Field for turn mutex | §8 |

---

## 21. Review status (four passes)

| Pass | Focus |
|------|--------|
| 1 | Product scope, Addis-only, caps, staff report |
| 2 | `after()`, dedupe, admin gap, cap table |
| 3 | MP3 upload, caption 1024, chat actions, album DB debounce |
| 4 | Lock scope, webhook ack contract, middleware, pre-flight |
| 5 | Validation only: Addis stateless history, `maxOutputTokens`, `/start` parsing, `maxDuration` in route file |

**Stop condition:** The plan is complete for engineering. Further edits should be **playbook content** (`data/telegram/playbook.md`) or **code**, not more architecture reviews—unless you change host (non-Vercel), Addis API version, or enable Telegram Business `business_message` updates.
