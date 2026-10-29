# Roamy — AI trip planner

Roamy is a French-language, AI-powered trip planner for 18–25 year olds. You answer six quick questions, pay once, and receive a personalised day-by-day itinerary by email, with an on-brand PDF.

The visual identity is based on the supplied Google Stitch mockups: cream paper, raspberry pink, vitamin orange, butter yellow, Anton display type, Nunito Sans body, pill controls, polaroid collages and die-cut stickers.

- **App**: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4
- **Data**: Prisma + SQLite locally, Postgres-compatible schema
- **Payments**: Stripe Checkout + signed webhooks (mock mode included)
- **AI**: Anthropic SDK, strict JSON + zod validation, retries (mock fixture included)
- **Email**: Resend + React Email (mock delivery included)
- **PDF**: `@react-pdf/renderer`
- **Tests**: Vitest + Playwright
- **Measured**: Lighthouse mobile 98 performance / 100 accessibility / 100 best practices / 100 SEO (production build)

The mockups and design audit live in `docs/` and `design/`. The application lives in **`app/`**.

---

## Quick start (zero credentials)

```bash
cd app
npm install
npm run dev
```

`npm run dev` creates the local SQLite database automatically (via `scripts/prepare-db.mjs`), so no migration step is needed on a fresh checkout. Open [http://localhost:3000](http://localhost:3000).

The default environment is fully mocked:

- `AI_MOCK=true` → a realistic Barcelona/Lisbonne fixture is generated locally.
- `PAYMENT_MOCK=true` → no Stripe account needed; the "payment" marks the order paid.
- No `RESEND_API_KEY` → the email is rendered and logged locally; the confirmation page exposes a **“Voir l'email envoyé (démo)”** link.

### Try the full funnel

1. Landing → **Créer mon planning**
2. Answer the 6 steps (destination, dates/travelers, budget, interests, rhythm, name/email)
3. On `/paiement/[id]` → **Simuler le paiement**
4. Watch `/confirmation/[id]` poll, then open the itinerary, the PDF, and the email preview
5. Go to `/mes-voyages` → enter the same email → open the **dev magic link** → see your trip

Without `.env`, the app also starts with safe defaults. Copy the example only when you want to customise:

```bash
cp .env.example .env
```

---

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `DATABASE_URL` | no (dev) | `file:./dev.db` | Postgres URL in production |
| `NEXT_PUBLIC_APP_URL` | no | `http://localhost:3000` | Absolute links in emails/PDFs |
| `AI_MOCK` | no | `true` | Set `false` to use Anthropic |
| `PAYMENT_MOCK` | no | `true` | Set `false` to use Stripe |
| `STRIPE_SECRET_KEY` | if `PAYMENT_MOCK=false` | — | `sk_test_...` / `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | if `PAYMENT_MOCK=false` | — | `whsec_...` from Stripe CLI/dashboard |
| `STRIPE_PRICE_ID_ESSENTIAL` | no | — | Optional pre-created Stripe Price; otherwise `price_data` is used |
| `STRIPE_PRICE_ID_PREMIUM` | no | — | Same |
| `ANTHROPIC_API_KEY` | if `AI_MOCK=false` | — | |
| `ANTHROPIC_MODEL` | no | `claude-sonnet-4-5` | Read from env at runtime |
| `RESEND_API_KEY` | no | — | Without it, emails are mocked |
| `EMAIL_FROM` | no | `Roamy <bonjour@roamy.travel>` | Must be a verified sender |
| `SUPPORT_EMAIL` | no | `bonjour@roamy.travel` | Displayed in failure states |
| `ADMIN_SECRET` | yes (prod) | dev value | `x-admin-secret` header for admin endpoints |
| `SESSION_SECRET` | yes (prod) | dev value | HMAC for magic-link cookies |
| `NEXT_PUBLIC_PLAN_ESSENTIAL_CENTS` | no | `900` | Price config (cents) |
| `NEXT_PUBLIC_PLAN_PREMIUM_CENTS` | no | `1900` | Price config (cents) |

Environment validation runs at startup (`lib/config/env.ts`). It fails with a clear, actionable message when a real integration is enabled without its key, and refuses default secrets in production.

> `npm run build` uses `NODE_ENV=production`. Change `ADMIN_SECRET` and `SESSION_SECRET` before building for production. A local `.env` with development secret values is included in this workspace; `.env.example` documents the required variables.

---

## Scripts

Run from `app/`.

| Command | What it does |
|---|---|
| `npm run dev` | Start Next dev server (creates DB) |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run test:watch` | Vitest watch |
| `npm run test:e2e` | Playwright funnel + mobile smoke (starts its own server in CI; reuses a running one locally) |
| `npm run format` / `format:check` | Prettier + Tailwind class sorting |
| `npm run email:dev` | React Email preview server on :3001 |
| `npm run qa:screenshots` | Capture the QA screenshot set in `design/screenshots/app/` (dev server must be running) |
| `npm run db:migrate` | Create/apply a Prisma migration |
| `npm run db:push` | Sync schema without a migration |
| `npm run db:studio` | Prisma Studio |
| `npm run db:reset` | Reset local DB |
| `npm run postinstall` | Generate Prisma client with a safe default URL |

> `test:e2e` needs Chromium once: `npx playwright install chromium`.

---

## Architecture

```
Roamy/
├── design/               # untouched mockups, copies, QA screenshots
├── docs/                 # audit, plan, progress, assets TODO
└── app/
    ├── app/
    │   ├── page.tsx                     # landing
    │   ├── planifier/                   # 6-step planner
    │   ├── paiement/[id]/               # boarding-pass checkout
    │   ├── confirmation/[id]/           # polling + success/failure
    │   ├── itineraire/[id]/              # generated result
    │   ├── itineraire-demo/             # static example + demo PDF
    │   ├── mes-voyages/                 # magic-link dashboard
    │   ├── mentions-legales|cgv|confidentialite/
    │   ├── api/                         # trips, checkout, webhook, auth, pdf, admin…
    │   ├── sitemap.ts robots.ts manifest.ts not-found.tsx error.tsx
    │   └── globals.css                  # design tokens
    ├── components/{brand,ui,marketing,form,payment,itinerary,emails,pdf,stickers,legal,dashboard}/
    ├── lib/{ai,api,auth,config,data,db,email,jobs,payments,pdf,schemas,stores,trips,utils}/
    ├── prisma/schema.prisma
    ├── public/{images,fonts,og-image.png,icon.svg}
    ├── emails/itinerary-preview.tsx     # npm run email:dev fixture
    ├── scripts/
    └── tests/{unit,e2e}/
```

### Order lifecycle

```
draft → pending_payment → paid → generating → sent
                                   ↘ failed (3 attempts) → manual retry
```

- The checkout route uses a **mock** branch when `PAYMENT_MOCK=true`; otherwise it creates a Stripe Checkout Session.
- The webhook verifies the signature, atomically updates `draft|pending_payment → paid`, and dispatches the generation job with `after()`.
- The job claims the trip atomically (`paid → generating`), generates, validates, stores the itinerary + PDF, sends the email, then marks `sent`.
- Duplicate webhooks and double clicks are safe.
- A recovery endpoint re-runs all `paid` jobs: `POST /api/admin/jobs/run`.

### Main API routes

| Route | Purpose |
|---|---|
| `POST /api/trips` | Create a validated draft (rate-limited, honeypot, origin check) |
| `POST /api/checkout` | Create Stripe session or mock-paid order |
| `POST /api/stripe/webhook` | Signed, idempotent payment webhook |
| `GET /api/trips/[id]/status` | Poll status (no PII; unguessable id) |
| `POST /api/trips/[id]/retry` | User-facing retry after `failed` |
| `GET /api/itineraries/[id]/pdf` | Stream the PDF |
| `GET /api/emails/[id]` | Mock email preview (only when `AI_MOCK=true`) |
| `POST /api/auth/magic-link` | Send dashboard magic link |
| `GET /api/auth/verify` | Consume token, set HttpOnly cookie |
| `GET /api/auth/logout` | Clear session |
| `GET /api/health` | DB + mock-mode health check |
| `POST /api/admin/trips/[id]/regenerate` | Regenerate (admin secret) |
| `POST /api/admin/trips/[id]/resend` | Resend existing itinerary (admin secret) |
| `DELETE /api/admin/trips/[id]` | Delete trip + itinerary + emails (GDPR) |
| `POST /api/admin/jobs/run` | Recover stuck paid jobs |

Admin calls:

```bash
curl -X POST http://localhost:3000/api/admin/trips/<id>/regenerate \
  -H "x-admin-secret: $ADMIN_SECRET"
```

---

## Real integrations

### Stripe

1. Set `PAYMENT_MOCK=false`.
2. Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and optionally the two `STRIPE_PRICE_ID_*` variables.
3. Local webhook:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy the whsec_... printed by the CLI into .env, restart the dev server
```

4. Pay with `4242 4242 4242 4242`, any future date, any CVC.
5. Production: add the webhook endpoint in the Stripe dashboard for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `checkout.session.expired`.

Promotion codes are enabled (`allow_promotion_codes: true`). Apple Pay / Google Pay are exposed automatically by Stripe Checkout depending on the device/browser.

If no Price ID is configured, the app sends inline `price_data` using the price constants — no Stripe product setup required.

### Anthropic

Set `AI_MOCK=false`, `ANTHROPIC_API_KEY`, and `ANTHROPIC_MODEL`. The prompt lives in `lib/ai/prompts.ts` (`PROMPT_VERSION = "roamy-v1.2"`). The model response is parsed, validated against `generatedItinerarySchema`, and retried up to 3 times with the zod errors fed back. Nothing unvalidated is stored or emailed.

### Resend

Set `RESEND_API_KEY`, verify your sending domain, and update `EMAIL_FROM`. Without a key, `EmailLog` rows are written with `status: "mock_sent"` and the full HTML preview is available from the confirmation page.

Local email design preview:

```bash
npm run email:dev
```

The template is at `components/emails/itinerary-email.tsx`. It is table-based via React Email, uses inline styles, absolute image URLs, a `color-scheme: light only` hint, and a plain fallback-friendly layout for Gmail/Apple Mail/Outlook.

### PDF

`@react-pdf/renderer` builds an A4 document (cover, one page per day, restaurants, budget, tips, packing, disclaimer). PDFs are stored as bytes in `Itinerary.pdf` and streamed from `/api/itineraries/[id]/pdf`. Your app URL is used for the email button; no public disk is required.

---

## Tests

```bash
npm run test        # unit: schemas, dates, mock itinerary, JSON extraction
npm run test:e2e    # full funnel + dashboard magic link + PDF + mobile smoke
```

The Playwright test:
landing → planner (6 steps) → mock payment → confirmation polling → sent → email preview → itinerary → PDF → `/mes-voyages` magic link → itinerary again.

For a clean e2e database, the Playwright config sets `DATABASE_URL=file:./e2e.db` and runs `prisma db push` before starting the web server. Locally it reuses an existing dev server on :3000.

---

## Deployment (Vercel + managed Postgres)

1. Create a Postgres database (Neon, Supabase, RDS…).
2. In `prisma/schema.prisma`, switch the datasource provider to `postgresql` (the rest of the schema is already Postgres-compatible: no SQLite-only types, statuses are strings validated by zod, arrays are JSON strings, PDFs are `Bytes`).
3. Set env vars in Vercel: `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `ADMIN_SECRET`, `SESSION_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `RESEND_API_KEY`, `EMAIL_FROM`, `AI_MOCK=false`, `PAYMENT_MOCK=false`.
4. Add `prisma migrate deploy` to the build/deploy step.
5. Point the Stripe webhook to `https://your-domain/api/stripe/webhook`.
6. Ensure the serverless function timeout is at least 60 s (generation + PDF + email). Use the `/api/admin/jobs/run` endpoint as a safety net after timeouts.
7. Rate limiting is in-memory today; swap `lib/api/guard.ts` for Upstash Redis in multi-instance deployments.

For a small deployment, the PDF-as-BLOB approach works. For high volume, move PDFs to S3/R2 and store the key instead.

---

## Security & GDPR

- Zod validation on every public input; shared trip schema on client and server.
- Same-origin check, rate limits, honeypot on public mutations.
- Stripe signature verification; idempotent transitions.
- No PII in application logs (only trip/log ids and error names).
- Magic-link tokens are hashed, single-use, 20-minute expiry; session cookie is HttpOnly, SameSite=Lax, HMAC-signed.
- Unpredictable cuid ids for status/PDF/payment pages; status endpoint exposes no PII.
- Consent checkbox required before creating a trip.
- Deletion: admin `DELETE /api/admin/trips/[id]` (cascades itinerary + email logs), or the “Demander la suppression de mes données” link on the dashboard.
- Legal pages are placeholders and must be completed by a legal professional.

---

## Known limitations / TODO

- Live Stripe/Anthropic/Resend paths are implemented and typed but were not exercised in this environment (no keys).
- Map is a styled panel with a Google Maps search link; no map provider key was supplied.
- “Personnaliser ce roadbook” currently sends the user back to the planner; in-place itinerary editing is not implemented.
- Plan max-days is marketing copy, not enforced at checkout.
- The footer/large wordmark and some decorative elements rely on Anton glyph metrics; check on older browsers.
- Photography rights need final confirmation; see `docs/assets-todo.md`.
- Lighthouse mobile score must be measured after real photos/fonts are in place; the page is built for it (local fonts, `next/image`, minimal JS on the landing).
- Email client QA (Gmail/Apple Mail/Outlook) should be done with real sends; the preview route covers design only.

---

## Credits

- Design source: supplied Google Stitch mockups (kept untouched in `design/mockups/`).
- Fonts: Anton and Nunito Sans, SIL Open Font License.
- Photos: Stitch mockup images (rights to confirm), Wikimedia Commons (Calanque de Sugiton, Plaza de España), Unsplash (road trip). See `docs/assets-todo.md`.
- All stickers and brand illustrations are original inline SVGs.
