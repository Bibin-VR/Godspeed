# Copilot instructions for Godspeed

## Project snapshot
- This is a Next.js 15 App Router + TypeScript app with Tailwind v4 styling and Prisma/PostgreSQL for payment/membership persistence.
- Main business flow: gym membership checkout with **UPI**, then membership activation + transaction logging + optional Twilio WhatsApp welcome.

## Architecture and boundaries
- UI routes live in `app/` (`/`, `/about`, `/contact`, `/join`).
- Payment API is route handler under `app/api/`:
  - `app/api/upi/verify/route.ts`
- Server-only integrations are centralized in `lib/server/` (`whatsapp.ts`).
- Plan catalog is a single source of truth in `lib/plans.ts` and is consumed by both UI and APIs.
- Prisma schema (`prisma/schema.prisma`) defines `User`, `Membership`, `TransactionLog` and enums for provider/status/tier.

## Key data flow (membership)
- Join UI (`components/join/join-multi-step-form.tsx`) collects plan + user details, then calls API routes.
- UPI path: open UPI app from join form -> user submits UTR -> `/api/upi/verify` finalizes DB state.
- On GitHub Pages static export (`NEXT_PUBLIC_STATIC_EXPORT=true`), UTR is sent via WhatsApp from client flow instead of calling server API.
- Activation logic persists membership + transaction log and triggers `sendWhatsAppWelcomeMessage` when phone is present.

## Conventions specific to this repo
- Use `@/` imports (configured in `tsconfig.json`).
- Keep shared domain mapping in `lib/` (example: `toPlanTier()` in `lib/membership.ts`).
- UPI is the only payment mode. Do not reintroduce card/wallet gateway SDKs unless explicitly requested.
- For assets rendered with optional GitHub Pages base path, prefix local `/...` URLs using `NEXT_PUBLIC_BASE_PATH` pattern (see `app/page.tsx`).
- `next.config.ts` supports GitHub Pages export when `GITHUB_PAGES=true`; keep `basePath/assetPrefix` compatibility when touching asset URLs.
- UI style uses utility classes heavily; helper `cn()` in `lib/utils.ts` is used for class merging.

## Developer workflows
- Install deps: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Production build/start: `npm run build` then `npm run start`
- Prisma lifecycle:
  - `npm run prisma:generate`
  - `npm run prisma:migrate`
  - `npm run prisma:studio`
- Instagram asset refresh script (manual): `node scripts/fetch-instagram-assets.mjs`

## Environment variables you will likely need
- UPI public config: `NEXT_PUBLIC_UPI_ID`, optional `NEXT_PUBLIC_UPI_NAME`
- Database: `DATABASE_URL`
- WhatsApp/Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, optional `WHATSAPP_DEFAULT_COUNTRY_CODE`
- Optional public config: `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Static export marker: `NEXT_PUBLIC_STATIC_EXPORT` (set in GitHub Pages workflow)

## Guardrails for changes
- Do not duplicate pricing/plan amounts in multiple places; update `lib/plans.ts` first.
- Keep `PaymentProvider` as UPI-only in Prisma and API payloads.
- Membership activation is UTR-driven through `/api/upi/verify`; keep idempotency on `externalPaymentId` (UTR).
- No test framework is configured yet; validate changes via lint + targeted manual flow checks.
