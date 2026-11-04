# BSP Continental

Financial and property-compliance services portal. Three separate products in one Next.js 16 app:

| Product | URLs | Code |
|---------|------|------|
| **Landing page** (public website, payments for service inquiries) | `/`, `/services/*`, `/contact`, legal pages | `src/app/(landing-page)`, `src/components/landing-page` |
| **Client app** (after login) | `/dashboard/**` | `src/app/(client-app)`, `src/components/client-app` |
| **Super admin panel** | `/admin/**` | `src/app/(super-admin)`, `src/components/super-admin` |

Login, register and password reset live in `src/app/(auth)`. Stack: TypeScript (strict), Next.js App Router, Mongoose, Auth.js (users) + a separate signed JWT (admin), Razorpay, S3, shadcn-style UI kit in `src/components/ui`.

## Run it

```bash
npm install
cp .env.example .env.local      # fill in every value; the app fails closed when one is missing
npm run dev
```

Needs MongoDB. Admin login uses `ADMIN_USERNAME` / `ADMIN_PASSWORD`; `JWT_SECRET` must be at least 32 characters.

| Command | What it does |
|---------|--------------|
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | unit + route-authorization tests |
| `npm run build` | production build |

More: [docs/TESTING.md](docs/TESTING.md) (incl. the API integration suite), [docs/REBUILD_PLAN.md](docs/REBUILD_PLAN.md) (architecture and phase status), [AGENTS.md](AGENTS.md) (rules for contributors and coding agents).

## How the code is layered

`app (routes) -> services -> repositories -> models`, with `lib/` for infrastructure (db, auth guards, OTP, rate limiting, mail). Route handlers only parse input, authorize, call a service and respond. Nothing under `app/` or `components/` imports Mongoose.

## Operating notes

- **Prices** are edited in the super admin panel (`/admin/dashboard/pricing`). The landing page, the pay button and the Razorpay charge all read the same value. `src/lib/catalog.ts` only holds the starting defaults.
- **Rate limits and cooldowns** (sliding window, stored in Mongo): admin login, OTP sends (30s cooldown, 3 per 10 min per number), OTP checks (5 wrong guesses lock the number for 15 min), inquiries, contact, uploads.
- **Parked integrations** (no UI yet): `/api/chat` and `/api/cibil` return 404 unless `FEATURE_CHAT=true` / `FEATURE_CIBIL=true`.
- **Logs** never contain OTPs, phone numbers or secrets; unexpected errors return a generic message to the client.

## Product backlog (original notes, not yet built)

```
1 date 22/09/2026

1 sign up jarte time pdf send ho gmail pe 
2 whatsapp business setup notification and otp number verification alert warning 
3 admin page me data saaf clear dikhe 
4 fonts chack and branding fonts use maun hedres 
5 property and cibil and finacial cundt ka service pe image overveiw ko banifit details ke sath shioiw karna hai 
6 dynamic offer slider dynamic 
7 path error my- request reqired optionel 
8 https://www.bspccontinental.com/services/Project-Finance-Assistance dashboard pe erre file path 
9 https://www.bspccontinental.com/dashboard/profile stup
profile me data dikhe user ka and uska request ko dikhaye 

10 path sidebar 
11 admin login 
12 u chabnge admin ka 
13 admin ko customer [anel data dikhe unka request dikhe active ]
14
```
