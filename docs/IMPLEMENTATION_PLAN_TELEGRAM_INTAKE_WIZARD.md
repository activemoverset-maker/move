# Implementation Plan: Telegram Quote Intake Wizard

**Project:** Active Movers & Packers  
**Updated:** 19 October 2026 (review pass ×2 — aligned to shipped bot code)  
**Status:** Ready for implementation  
**Stop condition:** Further edits should be **code** or **copy/catalog content**, unless Telegram or parent-bot contracts change.
**Depends on:** `docs/IMPLEMENTATION_PLAN_TELEGRAM_BOT.md` (webhook, caps, staff reports, admin auth)  
**Parent bot:** Addis playbook Q&A + voice remains; this adds a **deterministic** quote path.

---

## 0. Pre-flight (when deploying intake)

| Step | Done when |
|------|-----------|
| Re-run `npm run telegram:set-webhook` after merge | `getWebhookInfo.allowed_updates` includes **`callback_query`** (today script only sends `message`) |
| `npm run db:push` | `TelegramSession.intakeStep`, `intakeData`, `intakeStartedAt` exist |
| Smoke-test inline buttons in **private** chat | `answerCallbackQuery` returns; no spinner stuck |
| Confirm staff group still receives reports | `intake_complete` body includes intake block |
| Regression: photo-only quote path (no wizard) | Still works when user never taps **Get a quote** |
| Parent doc | `IMPLEMENTATION_PLAN_TELEGRAM_BOT.md` §9 `allowed_updates` note updated to reference this plan |

---

## 1. Executive summary

Add a **guided quote intake** in private Telegram chat: date → from → to → dwelling type → conditional access questions (floor, elevator) → inventory (buttons or photos) → phone → staff handoff. Steps are **code-driven** (state machine), **not** Addis-generated questions, so intake is reliable, bilingual, and **does not consume** the 20 counted AI answers per day.

Users can still choose **“Ask a question”** for playbook FAQ (existing Addis pipeline).

---

## 2. Goals and non-goals

| In scope (v1) | Out of scope (v1) |
|---------------|-------------------|
| Main menu after `/start`: **Get a quote** vs **Ask a question** | Auto-pricing from intake (staff still quotes) |
| Linear + branching steps per dwelling type | GPS / `message.location` (optional v1.1) |
| Inline keyboards (single + multi-select; paginate if >20 items) | Full LLM-driven interview |
| Text answers for addresses/date | Vision model on photos |
| **Reply keyboard** with `request_contact` on phone step | Telegram Business `business_message` |
| Reuse existing photo + phone + `copyMessage` staff report | Staff `/reply` relay |
| Amharic + English copy on every prompt | Separate office-relocation wizard (office → short path + human) |
| Resume / cancel wizard (`/cancel`, menu) | |
| Intake summary in staff group + admin session detail | |
| **Legacy path:** media + phone without wizard (keep for users who only send photos) | |

---

## 3. How it fits the current codebase

| Existing | Change |
|----------|--------|
| `lib/telegram/webhook-handler.ts` | Central **router** (§3.1); intake before Addis when `intakeStep != null` |
| `lib/telegram/types.ts` | Add `callback_query`, optional `CallbackQuery` type; extend `TelegramUpdate` |
| `app/api/telegram/webhook/route.ts` | Resolve `chatId` from `message` **or** `callback_query.message`; pass full update to `handleTurn` |
| `TelegramSession` | Add `intakeStep`, `intakeData` (JSON), `intakeStartedAt` |
| `lib/telegram/report.ts` | `HandoffReason` + `intake_complete`; `formatIntakeBlock()`; eligibility rules per reason (§8) |
| `scripts/telegram-set-webhook.ts` | `allowed_updates`: `["message", "callback_query"]` |
| `components/admin/telegram-dashboard.tsx` | Intake summary + “In intake” badge |
| `data/telegram/playbook.md` | “For a quote, tap **Get a quote** in the bot.” |

**Caps (unchanged):** Intake steps, button taps, and wizard prompts **never** set `countsTowardLimit`. Only **Ask a question** path uses Addis under existing 20/24h and 8/10m rules.

**Turn lock (unchanged):** Intake handling runs inside existing `tryAcquireTurnLock`; `callback_query` and `message` from the same user share one lock.

### 3.1 Message router order (implement exactly)

```
handleTurn(update)
  ├─ callback_query? → private chat, human from
  │    ├─ data starts with intake: → handleIntakeCallback (menu OR step; see §5.1)
  │    └─ else → answerCallbackQuery + ignore
  ├─ message? → private + from present
  │    ├─ /start, /help, /cancel  (extend COMMAND_RE to include cancel; not counted)
  │    ├─ awaitingName? → name capture (existing); blocks FAQ and intake until done
  │    ├─ photo | video?
  │    │    ├─ intakeStep set? → handleIntakeMedia (§3.5) — NOT legacy handleMedia
  │    │    └─ else → legacy handleMedia + scheduleMediaAck
  │    ├─ contact? → intake phone step OR legacy phone (§3.2)
  │    ├─ intakeStep set? → handleIntakeMessage (text/voice rules §4.3)
  │    ├─ awaitingPhone (legacy, no intake) → phone capture
  │    └─ FAQ path → HUMAN_KEYWORDS check → Addis pipeline
  └─ else → no-op (still webhook 200)
```

**User bootstrap:** `callback_query` has no top-level `message` on the update root — use `callback_query.from` + `callback_query.message.chat` and the same `getOrCreateUser` / `getActiveSession` helpers as for messages (add `from` + `chatId` params).

**Menu vs step callbacks:** `intake:menu:*` must work when `intakeStep` is **null** (e.g. **Get a quote** after `/start`). Step callbacks (`intake:dw:condo`, `intake:submit`) require matching `session.intakeStep` or respond with `answerCallbackQuery({ text: 'Please start again from /start', show_alert: true })`.

Human-keyword handoff runs on **FAQ path** and inside **intake text handler** (same regex as today); v1: keep `intakeStep`, still call `maybePostStaffReport` / `notifyStaffFollowUp`.

### 3.2 Coexistence with legacy media + phone flow

Today, users who send **photos first** get `awaitingPhone` without a wizard (`webhook-handler` media path).

| Situation | Behavior |
|-----------|----------|
| User in **intake** (`intakeStep` set) | Intake handler owns **phone** step; clear `awaitingPhone` when entering `phone` step or on submit |
| User **not** in intake, sends media | Unchanged: ask phone, `needs_quote` when phone + media |
| User taps **Get a quote** mid legacy flow | Set `intakeStep = 'move_date'`, reset `intakeData.v=1`; keep existing media rows on session |
| User taps **Ask a question** during intake | Set `intakeStep = null`; optional confirm “Quote paused” |

Do **not** require wizard completion before accepting orphan photos — staff still get value from legacy path.

### 3.5 Intake media (do not call legacy `handleMedia`)

Legacy `handleMedia` sets `awaitingPhone`, may call `maybePostStaffReport`, and runs `scheduleMediaAck` — wrong during partial wizard.

| | Legacy `handleMedia` | `handleIntakeMedia` |
|--|---------------------|---------------------|
| When | `intakeStep == null` | `intakeStep != null` |
| Phone prompt | Yes if no phone | No until `phone` step |
| Staff report | On phone + media | Only on **Submit** (`intake_complete`) |
| Ack | `scheduleMediaAck` | Short text ack; optional debounced ack on `inventory_photos` only |
| `intakeData.hasMedia` | N/A | Set `true` |

Persist rows in `TelegramMessage` (`kind` photo/video) the same way for `copyMessage` on submit.

### 3.3 `/start` and welcome voice

Current code sends privacy + **welcome TTS** on every `/start` (costly). For v1 intake:

1. First `/start` in a session (or once per 24h per user — product choice): short privacy + **main menu** (inline).
2. Welcome TTS: **only** on first `/start` ever or drop TTS on repeat `/start` (document in ops).

Menu callbacks must **not** be treated as FAQ turns or intake text steps.

### 3.4 Webhook `chatId` for errors

`route.ts` today only sets `chatId` from `update.message`. Extend:

```ts
const chatId =
  message?.chat?.type === 'private' ? String(message.chat.id)
  : callback_query?.message?.chat?.type === 'private'
    ? String(callback_query.message.chat.id)
    : null
```

So `safeApology` works after failed `callback_query` handling.

---

## 4. User experience

### 4.1 Entry

After privacy line (and optional one-time welcome voice):

```
What would you like to do?
[ 📦 Get a quote ]  [ 💬 Ask a question ]
[ ❓ Help ]
```

- **Get a quote** → only if `awaitingName` is false; else finish name first. Then `intakeStep = 'move_date'`, `intakeData = { v: 1, locale }`, `intakeStartedAt = now()`, clear `awaitingPhone` when starting a fresh quote.
- **Ask a question** → `intakeStep = null`; next text/voice uses Addis.
- **Help** → static bilingual text (privacy, 20-answer cap, @activemovers); not counted.

Keywords (Phase C): `quote`, `price`, `move`, `መጓጓዣ` → show same menu (do not auto-start wizard without confirmation — avoids accidental resets).

### 4.2 Step sequence (default)

| Step ID | Prompt (EN example) | Input |
|---------|---------------------|--------|
| `move_date` | When do you want to move? | Text; inline **Not sure yet** |
| `from_location` | Moving **from**? (area, building, or address) | Text |
| `to_location` | Moving **to**? | Text |
| `dwelling_type` | Type of home? | Inline: Condo / Apartment / House / Office |
| `floor` | Which **floor**? (0 = ground) | Inline G, 1–5, 6+, or text |
| `elevator` | **Working elevator**? | Yes / No / Not sure |
| `inventory` | Tap items, then **Done**. You can send photos anytime. | Multi-select inline; paginate catalog |
| `inventory_photos` | Send photos/videos (optional). | Media + inline **Skip** |
| `phone` | Phone for callback. | Text, contact card, **Share phone** (reply keyboard) |
| `review` | Summary | Inline **Submit to team** only in v1 (**Edit** → v1.1) |

**Branching (`nextStep()`):**

| `dwellingType` | Next after `dwelling_type` |
|----------------|----------------------------|
| `condo`, `apartment` | `floor` → `elevator` → `inventory` |
| `house` | `floor` (prompt: “floors / access”) → skip `elevator` → `inventory` |
| `office` | Still collect `move_date`, `from_location`, `to_location` → `office_details` (company, size) → `phone` → `review` (inventory optional; photos via `handleIntakeMedia` still help) |

### 4.3 During wizard

- **Voice:** v1 — reply “Please type or use the buttons for this step.” (no Scribe; saves cost). v1.1: Scribe only on `from_location` / `to_location` / `move_date`.
- **FAQ-like text** during intake: inline **Continue quote** / **Switch to questions** (switch clears `intakeStep`).
- **`/cancel`:** `intakeStep = null`, `intakeData` cleared or archived in `notes`; confirm message.
- **Photos** any step: use **`handleIntakeMedia`** (§3.5); set `intakeData.hasMedia = true`; **do not** auto-advance except on `inventory_photos` (Skip allowed).
- **`message.contact`:** validate `contact.user_id === from.id` when present; save to `session.phone`; advance from `phone` step.

### 4.4 Completion

On **Submit** (`intake:submit` callback):

1. **Validate** minimum fields (§4.5).
2. **Mirror** to scalars: `moveDate`, `fromAddress`, `toAddress`, `serviceType` (dwelling slug or `office`), `notes` (JSON snippet or human-readable inventory + elevator/floor).
3. Call `maybePostStaffReport(sessionId, 'intake_complete')` when eligible.
4. User: “Thanks — our team will contact you. Message @activemovers anytime.”
5. Set `intakeStep = null` (wizard complete); keep session `active`.

If phone missing: stay on `phone`, `awaitingPhone = true`.

### 4.5 Minimum for `intake_complete` report

| Field | Required |
|-------|----------|
| `phone` | Yes |
| `fromLocation` / `toLocation` | Yes (both) |
| `moveDate` | Yes or explicit “not sure” |
| Inventory | **Either** ≥1 inventory slug **or** ≥1 photo/video on session **or** `office_details` text |

**Not** required for `intake_complete`: elevator/floor for house if skipped by branch (store “not asked” in notes).

---

## 5. Telegram UI mechanics

### 5.1 Inline keyboards

- `callback_data` ≤ **64 bytes** ([InlineKeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton)); UTF-8.
- Prefix: `intake:` — reject anything else.
- Examples: `intake:menu:quote`, `intake:dw:condo`, `intake:el:y`, `intake:inv:bed`, `intake:inv_done`, `intake:skip_photos`, `intake:submit`.
- **No session UUID in callback** (too long). Validate against DB `intakeStep` + expected action; ignore stale buttons from old messages.
- **Always** call [`answerCallbackQuery`](https://core.telegram.org/bots/api#answercallbackquery) first (within webhook turn) — use `text` for inventory toggle feedback (“Added: bed”).
- v1: send **new message** per step; v1.1: `editMessageReplyMarkup` / `editMessageText` to reduce chat noise.

### 5.2 Reply keyboard (phone step — v1)

- `ReplyKeyboardMarkup` with one row: `KeyboardButton` + `request_contact: true`.
- After contact or valid typed phone: `ReplyKeyboardRemove`.
- Only show in private chat; hide when leaving `phone` step.

### 5.3 Inventory pagination

- Max **~8 items per row**, **~40 buttons** practical limit per message.
- Catalog ~20 items → one screen; if >25, use `intake:inv_page:2` callbacks.

### 5.4 Webhook

```json
"allowed_updates": ["message", "callback_query"]
```

`callback_query`: use `callback_query.from` for user id; `callback_query.message.chat` for chat; ignore if `chat.type !== 'private'`.

### 5.5 Logging

Never log full `intakeData` with phone in production info logs; staff report is enough.

---

## 6. Data model

### 6.1 `TelegramSession` (Prisma)

| Field | Type | Notes |
|-------|------|--------|
| `intakeStep` | `String?` | `null` = FAQ mode |
| `intakeData` | `Json?` | Versioned blob |
| `intakeStartedAt` | `DateTime?` | Funnel analytics |

**`intakeData` (v1):**

```ts
type IntakeData = {
  v: 1
  dwellingType?: 'condo' | 'apartment' | 'house' | 'office'
  floor?: string
  hasElevator?: boolean | 'unknown'
  moveDate?: string
  fromLocation?: string
  toLocation?: string
  officeDetails?: string
  inventory?: string[]
  hasMedia?: boolean
  locale?: 'am' | 'en'
}
```

On submit, copy `fromLocation` → `fromAddress`, `toLocation` → `toAddress`, etc.

### 6.2 `handoffReason`

Extend union: `needs_quote` | `asked_for_human` | `limit_reached` | **`intake_complete`**

Update `lib/telegram/report.ts` type and eligibility:

| Reason | Report when |
|--------|-------------|
| `needs_quote` | Legacy: media path; needs `phone` (existing) |
| `intake_complete` | §4.5 minimum met; **does not** require media if inventory text present |
| Others | Unchanged |

### 6.3 Inventory catalog

**File:** `data/telegram/intake-inventory.json` — `id`, `labelEn`, `labelAm`, `category`.

### 6.4 Session policy

- **One active session** per user (existing `getActiveSession`).
- Restart **Get a quote**: reset `intakeStep` + `intakeData` on same session; do not delete media messages.
- Optional v1.1: new session row per quote for cleaner staff history.

### 6.5 `intakeStep` allowed values

`null` | `move_date` | `from_location` | `to_location` | `dwelling_type` | `floor` | `elevator` | `office_details` | `inventory` | `inventory_photos` | `phone` | `review`

Implement as `const INTAKE_STEPS` in `lib/telegram/intake/types.ts` — `nextStep()` returns only these or `null` on completion.

---

## 7. Code layout

```
data/telegram/intake-copy.ts
data/telegram/intake-inventory.json
lib/telegram/intake/
  types.ts
  steps.ts              # nextStep(), branch table
  keyboards.ts
  handler.ts            # handleIntakeMessage, handleIntakeCallback
  validate.ts
lib/telegram/webhook-handler.ts
lib/telegram/report.ts  # formatIntakeBlock(), HandoffReason
lib/telegram/bot.ts     # answerCallbackQuery, sendMessageWithKeyboard helpers
app/api/telegram/webhook/route.ts
scripts/telegram-set-webhook.ts
prisma/schema.prisma
```

---

## 8. Staff report format

Plain text only (no `parse_mode`). Insert **before** “Recent:” transcript lines:

```
--- Quote intake ---
Move date: ...
From: ...
To: ...
Dwelling: apartment, floor 4, elevator: no
Inventory: bed, fridge (+ 3 photos)
Phone: +251...
Office: (if applicable)
```

If `handoffAt` already set and user submits again: `notifyStaffFollowUp(sessionId, …)` — do not duplicate full report.

---

## 9. Admin

- `GET /api/admin/telegram/sessions/[id]`: include `intakeStep`, `intakeData`, formatted summary string.
- Dashboard: badge **In intake**; show step name on session row.
- Optional: count abandoned intakes (`intakeStartedAt` >24h, `intakeStep` not null).

---

## 10. Build phases

### Phase A — Foundation

- Prisma + `db:push`
- Types + `callback_query` in webhook route and `handleTurn` dispatch stub
- `setWebhook` + `answerCallbackQuery` helper
- Main menu on `/start`; `/cancel`
- `intake/steps.ts` + copy files (no full steps yet)

### Phase B — Core path

- All steps through submit; `office_details` branch
- `report.ts` + `intake_complete`
- Phone reply keyboard + legacy coexistence (§3.2)
- Media + `inventory_photos` + Skip

### Phase C — Polish

- Keyword → menu
- Admin UI fields
- Playbook line; `/help` mentions quote flow
- Tests §11

### Phase D — v1.1

- Location pins; review **Edit**; welcome TTS policy; Scribe on address steps; `setMyCommands` `/quote`

---

## 11. Test plan

1. Menu: quote vs FAQ; FAQ still counts toward cap; intake does not.
2. Condo vs house branching (elevator skipped for house).
3. Inventory toggle + Done; pagination if catalog enlarged.
4. Photos during wizard + submit with phone → report + copies.
5. Submit without phone → blocked; contact button works.
6. `intake_complete` with inventory **only** (no photos) → report fires.
7. Legacy: photos only, no wizard → old phone gate + `needs_quote` unchanged.
8. `/cancel` → FAQ works; restart quote resets `intakeData`.
9. Stale inline **Submit** on old message → ignored safely.
10. `callback_query` only update → dedupe by `update_id`; apology `chatId` works.
11. 20/24h cap: intake submit still works.
12. Parallel callback + message → single lock behavior.
13. Admin shows intake JSON + step.
14. Re-run `getWebhookInfo` shows `callback_query` in allowed updates.
15. Photo during `move_date` step → **no** legacy “share phone for quote” prompt.
16. Menu **Get a quote** works with `intakeStep === null`.
17. `awaitingName` user tapping **Get a quote** → name prompt first.
18. Wrong-step callback (stale Submit) → alert, no staff report.

---

## 12. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Webhook still `message`-only in prod | §0 checklist; fail CI check on script constant optional |
| `maybePostStaffReport` early-return blocks `intake_complete` | Separate guard: `intake_complete` uses §4.5 not media rule |
| `handoffAt` blocks second submit | Use `notifyStaffFollowUp` for updates |
| Callback spam | `answerCallbackQuery` immediately; idempotent toggles |
| 64-byte `callback_data` | Short slugs; paginate inventory |
| Office row in §2 vs branch | Office = minimal path + human, not full inventory wizard |
| Welcome TTS cost on every `/start` | §3.3 policy before launch |
| Intake photos hit legacy `handleMedia` | §3.5 separate handler; test #15 |
| Menu callback requires `intakeStep` | `intake:menu:*` works when step is null §3.1 |
| `/cancel` not in current COMMAND_RE | Extend regex in Phase A |

---

## 13. Decisions (locked for v1)

- Intake = **TypeScript state machine**, not Addis tools.
- Intake **never** increments `countsTowardLimit`.
- **Inline** for choices; **reply keyboard** for contact on phone step.
- **`intake_complete`** report rules in §4.5 (inventory text OK without photos).
- FAQ path unchanged.
- **Legacy media path** remains for non-wizard users.

---

## 14. References

- [InlineKeyboardButton / callback_data](https://core.telegram.org/bots/api#inlinekeyboardbutton)
- [callback_query](https://core.telegram.org/bots/api#callbackquery)
- [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery)
- [KeyboardButton request_contact](https://core.telegram.org/bots/api#keyboardbutton)
- Parent: `docs/IMPLEMENTATION_PLAN_TELEGRAM_BOT.md` §6–§9

---

## 15. Review changelog (19 Oct 2026)

| Topic | Finding | Plan update |
|-------|---------|-------------|
| Webhook script | `allowed_updates` still `message` only in repo | §0, §5.4, Phase A |
| Webhook route | `chatId` ignores `callback_query` | §3.4 |
| `TelegramUpdate` type | No `callback_query` field | §3, Phase A |
| `report.ts` | `needs_quote` requires phone; no `intake_complete` | §6.2, §8, §12 |
| Office | Contradiction in goals table vs steps | §2, §4.2 `office_details` |
| `request_contact` | Was deferred to v1.1 | Moved to v1 §5.2 |
| `/start` TTS | Every start bills Addis | §3.3 |
| Legacy photos | Must coexist | §3.2, test #7 |
| Stale buttons | No UUID in callback_data | §5.1 |
| Review step Edit | Listed but not in v1 scope | v1 submit only §4.2 |

---

## 16. Review changelog (second pass, 19 Oct 2026)

| Topic | Finding | Plan update |
|-------|---------|-------------|
| Media during wizard | Legacy `handleMedia` triggers phone + report early | **§3.5** `handleIntakeMedia` |
| Router | Menu callbacks need `intakeStep === null` | **§3.1** menu vs step |
| Router | Media branch must be before intake text | **§3.1** |
| Name | `awaitingName` must run before intake | **§3.1**, **§4.1** |
| Office path | Unclear if from/to/date apply | **§4.2** still collects them |
| `/cancel` | Not in shipped `COMMAND_RE` | **§3.1**, **§12** |
| Callback bootstrap | No `message` on update root | **§3.1** user bootstrap |
| Step enum | Implementer drift | **§6.5** |
| Tests | Intake media vs legacy | **§11** #15–18 |
| Parent bot doc | `allowed_updates` still `message` only in §9 example | Cross-note **§0** |
