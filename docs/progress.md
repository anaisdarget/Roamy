# Progress

Last updated: 2026-10-29

## Status: feature-complete, mock-mode tested end-to-end

**Checks**
- `npm run lint` — pass
- `npm run typecheck` — pass
- `npm run test` — 19 unit tests pass
- `npm run test:e2e` — 2 Playwright tests pass (full funnel + mobile smoke)
- `npm run build` — pass (with local `.env` secrets; see README)
- Lighthouse mobile (production build): **Performance 98 · Accessibility 100 · Best practices 100 · SEO 100** — LCP 2.4 s, CLS 0, TBT 10 ms

## Done

### Discovery
- Recursive inventory, every mockup HTML read, screenshot reviewed.
- Design tokens extracted into `docs/00-mockup-audit.md`.
- Ambiguities + assumptions documented.
- Build plan + deviations in `docs/01-plan.md`.
- Mockups preserved; copies in `design/mockups/`.

### Milestone 1 — setup, tokens, base UI
- Next 16 App Router, React 19, TypeScript strict, Tailwind 4 (PostCSS), ESLint flat config, Prettier.
- Local Anton + Nunito Sans (`next/font/local`).
- Full token layer: colors, typography, radii, shadows, stripes, animations, reduced motion.
- Radix Accordion, Popover, Slot; buttons, cards, pills, fields, checkbox, stickers, logo, header, footer.
- Prisma + SQLite migration; env validation with zod; zero-config local DB script.

### Milestone 2 — landing
- Hero with polaroid collage and stickers.
- Static yellow ticker (no marquee animation).
- How it works (3 cards), destinations arch grid, roadbook preview, phone mockup, testimonials (clearly marked as placeholders), 2-tier pricing, accessible FAQ, final CTA, footer with giant wordmark.
- OG image, sitemap, robots, manifest, structured data.

### Milestone 3 — planner
- 6 focused steps; per-step tinted background, segmented progress, sticker, microcopy.
- Zustand + sessionStorage persistence, URL `?step=N` sync, back/forward support.
- Destination ARIA combobox with 76 destinations, free text, surprise picker, trending polaroids.
- Date range popover (react-day-picker, French), quick ranges, past/max-30-days validation.
- Travelers steppers, budget slider + presets, interest sticker chips, rhythm cards.
- Identity step with consent, honeypot, optional preferences, plan selector.
- Friendly French validation, Enter-to-continue, sticky mobile nav.
- `POST /api/trips` (zod, rate limit, origin check, honeypot) → draft → payment.

### Milestone 4 — payment + webhook
- Boarding-pass recap with edit links, round price sticker, trust badges, mock/real checkout.
- Stripe Checkout session, promotion codes, expiry, cancel state.
- Webhook signature verification, idempotent transition to paid, after() job dispatch.

### Milestone 5 — AI + email + PDF
- Versioned system prompt (`roamy-v1.2`) with budget/rhythm/group/season rules.
- Anthropic SDK + strict zod validation + 3 validation retries with feedback.
- Realistic mock fixture (`AI_MOCK=true`) that respects dates, days count, group and budget.
- DB-backed job with atomic claim, 3 attempts/backoff, failed state and alert log.
- React Email itinerary template (table-based, inline styles, dark-mode meta, absolute images, PDF CTA).
- A4 PDF via `@react-pdf/renderer`, Anton headings, budget/tips/packing sections; stored as bytes and streamed by API.
- Mock email preview endpoint; admin resend/regenerate.

### Milestone 6 — confirmation + itinerary
- Gradient confirmation screen, spinning sun, floating fish/waves, rotating messages, real polling.
- Sent state with itinerary/PDF/email-preview links; failed state with retry + support.
- Itinerary result page matching the mockup: hero, metrics, ticker, day tabs + cards, map panel, included list, budget bars, restaurants, packing, disclaimer, final CTA.
- Static `/itineraire-demo` + demo PDF.

### Milestone 7 — dashboard, legal, SEO
- `/mes-voyages` magic-link auth (hashed single-use tokens, signed HttpOnly cookie), polaroid cards, statuses, logout, deletion request.
- Legal pages (mentions, CGV, privacy) with clear "À COMPLÉTER" warnings.
- 404 and error pages on-brand.
- Sitemap, robots, manifest, OG image, metadata.

### Milestone 8 — tests, polish, docs
- 19 unit tests; full Playwright funnel incl. dashboard magic link and PDF.
- Mobile smoke test with overflow check.
- Docs: audit, plan, progress, assets TODO, README.

## In progress / next
- Real credentials integration (Stripe test mode, Anthropic, Resend) — code paths ready, not executed here.
- Lighthouse mobile run and final performance tuning.
- Full screen-reader + keyboard audit (axe + manual) on all screens.
- Email client QA on Gmail / Apple Mail / Outlook (Litmus or real accounts). `npm run email:dev` now renders a fixture preview locally.
- Real photography + legal copy.
- Optional: editable itinerary (currently "Personnaliser" sends back to planner), promo-code UX, account deletion self-serve.

## Known issues / limitations
1. Rate limiting is in-memory per instance; use Upstash/Redis in production.
2. PDFs are stored as BLOBs in the DB; fine at this scale, consider S3/R2 for volume.
3. Map is a stylised panel + Google Maps search link; no map provider key supplied.
4. `after()` job dispatch relies on a long-lived serverless invocation; `/api/admin/jobs/run` is the recovery path.
5. Photos from the mockups have unclear rights — see `assets-todo.md`.
6. Legal text is placeholder and must be reviewed by a lawyer.
7. Plan max days is marketing copy, not enforced on checkout.
8. Magic-link dev URL is only returned when no Resend key and mock/dev mode is active.
9. The `?step` URL normalises only after hydration (one frame at `/planifier`).
10. Stripe/Anthropic/Resend live paths are type-checked but not live-tested in this environment.

## QA screenshots
`design/screenshots/app/` contains final 1280px, 768px and 375px captures of landing, planner steps, payment, confirmation (loading + sent), itinerary + demo, email, dashboard, login, legal and 404. Regenerate with `npm run qa:screenshots` while the dev server runs. `design/screenshots/questionnaire.png` is the original mockup screenshot.
