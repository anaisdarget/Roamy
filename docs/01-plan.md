# Roamy — Build Plan

## 1. What we are building

A production-quality Next.js site for **Roamy**, an AI trip planner for 18–25 year olds. French copy ("tu"), retro-solar-pop art direction, complete funnel:

```
Landing → /planifier (6 steps) → POST trip draft → /paiement/[id]
→ Stripe Checkout (or PAYMENT_MOCK) → /confirmation/[id] (poll)
→ AI generation (Anthropic or AI_MOCK) → itinerary saved → PDF rendered
→ branded email sent (Resend or mock) → status "sent"
→ /itineraire/[id] + PDF download + email preview (mock)
```

## 2. Architecture

### 2.1 Stack (as requested)

- **Next.js 15 App Router**, React 19, TypeScript strict, server components by default.
- **Tailwind CSS v4** with design tokens as CSS variables in `app/globals.css` and `@theme` mappings. No config file needed in v4; tokens are the single source of truth.
- **Radix UI** primitives (Accordion, Popover, RadioGroup, VisuallyHidden) restyled from scratch.
- **react-hook-form + zod**; shared schemas in `lib/schemas/trip.ts` used by client, API and AI validation.
- **Zustand** with `persist` → `sessionStorage`, versioned store, for the multi-step form.
- **Prisma + SQLite** locally (`file:./dev.db`), schema written with Postgres-compatible types (no SQLite-only features, no enums; constant string unions validated by zod).
- **Stripe Checkout** hosted, webhook signature verification, idempotent update.
- **Anthropic SDK** with strict JSON extraction + zod validation + retry with validation feedback; `AI_MOCK=true` fixture.
- **Resend + React Email**; `@react-email/render` server-side; local preview via `npm run email:dev`.
- **@react-pdf/renderer** for the on-brand A4 PDF, stored as bytes in DB.
- **Vitest** unit tests; **Playwright** e2e funnel and screenshot capture.
- **ESLint 9 flat config + Prettier**, no `any`.

### 2.2 Why `app/app/`

The repository root is the design workspace; the Next.js project lives in `app/` per the brief. Inside it, `app/` is the Next App Router directory (standard Next layout). Mockups live untouched in `design/mockups/`.

### 2.3 Data model (Prisma)

`TripRequest` (all business answers, status machine, plan, Stripe ids, attempts), `Itinerary` (validated JSON string, PDF bytes, model/tokens), `EmailLog` (status, subject, mock preview HTML, resend id), `MagicLinkToken` (dashboard auth). See `app/prisma/schema.prisma`.

Status machine: `draft → pending_payment → paid → generating → sent` with `failed` branch. All transitions are idempotent (`updateMany` guards).

### 2.4 Server boundaries

- `POST /api/trips` — validate, ratelimit, honeypot, create `draft` (CSRF/origin check).
- `POST /api/checkout` — validate ownership/id, create Stripe session or mock-paid.
- `POST /api/stripe/webhook` — raw body, signature, idempotent mark paid + dispatch job.
- `GET /api/trips/[id]/status` — returns status + itinerary id only, `no-store`.
- `POST /api/trips/[id]/generate` — internal trigger (admin).
- `POST /api/admin/trips/[id]/resend|regenerate`, `DELETE /api/admin/trips/[id]` — `x-admin-secret`.
- `GET /api/itineraries/[id]/pdf`, `GET /api/emails/[id]` — PDF / mock email preview.
- `POST /api/auth/magic-link|verify|logout`, `GET /api/me/trips`.
- `GET /api/health` — env + DB check.

All mutations go through `lib/api/guard.ts` (origin check, JSON content type, rate limit, zod). No PII in logs.

### 2.5 Generation job

`lib/jobs/generation.ts`:
1. Atomic claim `paid → generating` (`updateMany where status in [paid, generating?]`); safe on duplicate webhooks.
2. Build prompt from answers (versioned `PROMPT_VERSION`).
3. Call `generateItinerary()`; parse/validate with zod; on invalid, retry up to 3 times including validation errors in the follow-up message.
4. Persist `Itinerary` JSON.
5. Render PDF, store bytes.
6. Render React Email HTML, send via Resend or store mock log.
7. `generating → sent`.
On failure: exponential backoff (800 ms, 1.6 s, 3.2 s), max 3 attempts, then `failed` + structured alert log. Admin can retry/resend. `after()` from `next/server` dispatches without blocking the webhook.

### 2.6 Mock modes

- `PAYMENT_MOCK=true`: `/api/checkout` skips Stripe, marks paid, dispatches job, returns confirmation URL.
- `AI_MOCK=true`: returns a realistic Barcelona fixture generated relative to the user's dates/travelers/budget, validated by the same zod schema.
- `RESEND` absent: renders email and writes `EmailLog(status="mock_sent", previewHtml=…)`.
- No credentials needed for `npm install && npm run dev`.

## 3. Folder structure

```
Roamy/
├── design/                 # untouched mockups + screenshots + DESIGN.md
├── docs/                   # audit, plan, progress, assets todo
├── app/                    # Next.js project
│   ├── app/
│   │   ├── (marketing)/page.tsx
│   │   ├── planifier/page.tsx
│   │   ├── paiement/[id]/page.tsx
│   │   ├── confirmation/[id]/page.tsx
│   │   ├── itineraire/[id]/page.tsx
│   │   ├── itineraire-demo/page.tsx
│   │   ├── mes-voyages/…
│   │   ├── mentions-legales|cgv|confidentialite/page.tsx
│   │   ├── api/…
│   │   ├── layout.tsx, globals.css, not-found.tsx, error.tsx
│   │   ├── sitemap.ts, robots.ts, opengraph-image.tsx
│   │   └── admin/page.tsx (secret-gated local ops)
│   ├── components/
│   │   ├── brand/ ui/ marketing/ form/ itinerary/ stickers/
│   │   ├── emails/ pdf/
│   ├── lib/
│   │   ├── ai/ config/ db/ jobs/ payments/ email/ schemas/
│   │   ├── security/ utils/ data/ (destinations, faq, sample)
│   ├── prisma/
│   ├── public/images, public/fonts
│   ├── tests/unit, tests/e2e
│   ├── scripts/
│   ├── .env.example, .env
│   ├── README.md
└── docs/progress.md
```

## 4. Design implementation rules

- Tokens in `globals.css` only; components never hardcode hex except sticker art.
- Fonts: local Anton + Nunito Sans via `next/font/local`, `display: swap`, subsets latin.
- Buttons/chips/inputs: pill radius; outline states 2px; focus-visible ring orange + offset.
- Cards: 32px radius, white on cream, soft shadow only on hover.
- Stickers: inline SVG, cream 7px stroke, `aria-hidden`, rotation ≤ 8°.
- Mobile-first; test 375 / 768 / 1280.
- No marquee animation, no confetti, no parallax; reduced-motion honoured.
- FAQ uses Radix Accordion; form uses real labels, `aria-describedby` errors, `aria-live` for step changes; counters labelled; tabs use ARIA tablist.

## 5. Milestones

### M1 — Setup, tokens, base UI (commit `chore: bootstrap…`)
- Next 15 + TS + Tailwind 4 + ESLint/Prettier/Vitest.
- Local fonts, token layer, global background motifs.
- Base components: Button, Pill, Card, Input, Textarea, Checkbox, RadioCard, Sticker, Logo, Header, Footer, Accordion, Container.
- Prisma schema + migration + seedless DB. Env validation.
- **Gate**: lint, typecheck, unit test of schemas.

### M2 — Landing (commit `feat: build landing page`)
- Hero, static ticker, how-it-works, destinations arch grid, roadbook preview, phone mockup, testimonials (placeholder), pricing, FAQ, CTA, footer.
- Metadata, OG image, sitemap, robots.
- **Gate**: lint, typecheck, unit tests, visual screenshots.

### M3 — Multi-step form (commit `feat: add six-step trip planner`)
- Store + URL step sync + per-step validation + keyboard + stickers + backgrounds.
- Destination combobox (60 entries), date range picker, counters, budget slider, interests, rhythm, identity + consent + honeypot.
- POST create draft → payment redirect.
- **Gate**: unit tests of date/budget/step validation; e2e partial.

### M4 — Payment + webhook (commit `feat: add payment flow`)
- Boarding pass page, plan recap, edit links, trust badges, Stripe + mock checkout, cancel state.
- Webhook, idempotency, dispatch.
- **Gate**: unit test of status transitions; mock checkout e2e.

### M5 — AI + email + PDF (commit `feat: generate itinerary, email and PDF`)
- Prompt v1, schema, Anthropic + mock, retries, budget normalisation.
- Jobs, email template, PDF, preview route, admin resend/regenerate.
- **Gate**: fixture validation test, generation job test (mock), email render snapshot.
- **Gate**: itinerary page rendering.

### M6 — Confirmation + itinerary result (commit `feat: add confirmation and itinerary pages`)
- Polling, rotating messages, states, failure/support.
- Itinerary page matching the mockup, day tabs, sidebar.
- **Gate**: e2e funnel to sent + itinerary view.

### M7 — Dashboard, legal, utility, SEO (commit `feat: add dashboard, legal pages and SEO`)
- Magic-link dashboard, legal pages, 404/error, assets TODO, privacy/delete flow.
- **Gate**: lint/typecheck/tests.

### M8 — Tests, polish, docs (commit `test: cover funnel…`)
- Full Playwright funnel; screenshot matrix; Lighthouse-oriented fixes; README; final report.
- **Gate**: all checks pass.

## 6. Test plan

- **Unit (Vitest)**: trip zod schema (dates, counts, budget, consent), `computeTotalBudget`, day-count, destination search, AI JSON schema/fixture, status transition helper, price formatting, email HTML escaping basics.
- **E2E (Playwright)**: landing → CTA → 6 steps (free-text destination, trend card, dates via quick chip, counters, budget, interests, rhythm, identity) → payment mock → confirmation polling → sent → itinerary → PDF endpoint 200. Mobile viewport smoke.
- **Visual**: `scripts/screenshots.mjs` captures `/`, `/planifier`, `/paiement`, `/confirmation`, `/itineraire-demo` at 375/768/1280. Manual comparison with the questionnaire screenshot.

## 7. Deviations from the requested stack / spec

| Item | Decision | Reason |
|---|---|---|
| Tailwind config file | Tailwind v4 CSS-first `@theme` | Latest stable; tokens in one place |
| Font | Anton + Nunito Sans | Mockups + DESIGN.md explicitly specify them; brief allows mockups to win |
| Pricing | 2 plans (9€ / 19€) | Mockup shows two tiers; brief's "single offer" loses to source of truth |
| How it works | 3 cards | Mockup has three |
| Ticker | Static, not animated | Brief forbids marquee |
| Questionnaire steps | 6 focused steps | Brief requires one question per screen; mockup already says "Étape X sur 6" |
| PDF storage | DB bytes served by API | Works on serverless; no persistent disk assumption |
| Map | Stylised panel + external search link | No map provider key provided; avoids a broken embed |
| Rate limiting | In-memory fixed window | Zero infra for local; documented production swap |
| Dashboard | Implemented minimally | Implied by "Retour à mes voyages" and avatar |
| DB enums | String + zod unions | SQLite local support; Postgres portable |

## 8. Known risks

- **Stripe webhook in local dev** needs `stripe listen`; mock mode is the default so the funnel never blocks.
- **PDF font registration** must use TTF, not woff2; use Anton TTF + Helvetica fallback.
- **React Email** must stay table-safe; avoid grid/flex-only layouts.
- **Next 15 `after()`** may not run in some edge deployments; the admin retry endpoint + cron endpoint are the safety net. Documented.
- **Pure white cards** technically break the "no pure white" art rule, but the mockups use white; fidelity wins.
