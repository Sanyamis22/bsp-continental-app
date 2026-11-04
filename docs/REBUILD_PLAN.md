# BSP Continental — Full Rebuild Plan

**Status:** Phases 0, 1, 2 done; Phase 3 done for Profile, Requests, Notifications, Leads, Payments, Auth (see checklist below). Phase 4 started (shared UI kit + auth surface). Phase 5 (cleanup) pending.  
**Stack today:** Next.js 16.2 / React 19 / TypeScript strict / Mongoose / next-auth v4 / separate verified admin JWT (Option B, jose)  
**Target:** TypeScript strict · segregated route shells · cohesive domain layer · hardened APIs · consistent UX

---

## Status checklist (keep current)

- [x] **Phase 0 — Security:** secret fallbacks removed (fail closed via `requireEnv`); admin JWT verified in `proxy.ts` and APIs (`requireAdmin`); `requireUser` / ownership scoping on requests, notifications, upload, profile, chat, CIBIL; OTPs in Mongo (hashed, TTL, single use, attempt cap, lockout); sliding-window rate limits + resend cooldowns (`lib/rate-limit.ts`, `lib/otp.ts`); server-side prices (`lib/catalog.ts`) and signature-verified payments; debug routes (`test-db`, `wpotpsend`, unused `verify-otp` / `welcome` / `vetting`) deleted; `.env.example` added; baseline security headers.
- [x] **Phase 1 — TypeScript:** `tsc --noEmit` clean under `strict`, zero `.js` / `.jsx` in `src/`, `npm run typecheck`.
- [x] **Phase 2 — Route groups:** `(marketing)`, `(auth)`, `(app)`, `(admin)/admin/(console)` layouts own their chrome; `NavShell` deleted; legacy URLs redirect (`next.config.mjs`); admin status clones merged into `/admin/dashboard/requests?status=`.
- [~] **Phase 3 — Domain:** services + repositories for Profile, Request, Notification, Lead, Payment, Auth. Pending: unified `{ error: { code, message } }` response shape (needs a shared client hook), real `/api/admin/users`, TanStack Query hooks.
- [~] **Phase 4 — UI rebuild / shared kit:** shadcn-style kit in `src/components/ui` (Button, Input, Textarea, Label, Card, Badge, Table, Skeleton, Separator, Dialog; brand tokens in `globals.css`; `components.json` for future `shadcn add`). Converted so far: login, register, forgot-password, admin login, app top bar. **Next:** dashboard forms, `my-requests`, admin requests/leads tables, marketing pages; then TanStack Query hooks (`useRequests`, `useProfile`, `useNotifications`). `shadcn init` itself fails here (npm `allow-scripts` setting), so kit files were written by hand from the base-nova pattern on `@base-ui/react`.
- [ ] **Phase 5 — Hardening:** CSP, remove mock-data fallbacks in admin users page, strip PII `console.log`s, tests, delete leftover orphans.

**Rotate before deploy** (these values were committed in git history): the Gmail app password, the Resiliohub token that was hard-coded in the removed `wpotpsend` route, the admin password and the JWT secret.

---

## 0. Security blockers (do before feature work)

These are live risks in current code. Treat as Phase 0, same week.

| Issue | Where | Action |
|-------|-------|--------|
| Gmail app password hardcoded as fallback | `api/auth/[...nextauth]/route.js` | Remove fallbacks; rotate Gmail app password + all leaked env values |
| Admin default `admin123` + fixed JWT secret fallback | `api/admin/login/route.js` | Fail closed if env missing; rotate `JWT_SECRET` / `ADMIN_PASSWORD` |
| Admin MW checks cookie **presence**, never `jwt.verify` | `middleware.js` | Verify signature + expiry + role |
| `/api/requests`, `/api/upload`, `/api/admin/leads`, payments, chat, cibil | most of `api/` | Session/role guards on every mutating or sensitive read |
| OTP in `global.*` memory | forget/verify routes | Persist OTP in Mongo with TTL index |
| `/api/test-db`, `/api/wpotpsend` OTP echo | prod-reachable | Delete or gate behind `NODE_ENV !== 'production'` + auth |
| Linux case mismatch `/api/user/Profile` vs `/profile` | Profile route + dashboard fetch | Normalize to lowercase paths |

**Rule:** Never commit secrets. Never ship hardcoded credential fallbacks.

---

## 1. Goals (acceptance criteria)

1. **Three product surfaces**, zero shared chrome:
   - **Marketing** — public landing + services + legal; marketing Navbar + Footer only
   - **User app** — post-login; app shell (sidebar + top bar) only; **no marketing Navbar**
   - **Admin app** — admin shell only; separate auth
2. **TypeScript everywhere** (`strict: true`); shared types for DTOs, session, domain entities
3. **Low coupling / high cohesion** — pages render; services own rules; repos own DB; APIs thin
4. **One auth story for users**; admin either role-based under same Auth.js **or** isolated verified JWT (no dual half-auth)
5. **Stable routes** — no 404 menu links; one canonical path per feature
6. **Readable, testable, SOLID-aligned** modules; agents follow `AGENTS.md` + `.cursor/rules`

---

## 2. Current architecture (diagnosis)

### 2.1 Coupling hotspots

- **Single root layout** wraps **all** routes in `NavShell` + `Footer` → marketing Navbar leaks into dashboard; admin bottom nav on login
- **`NavShell`** picks chrome by pathname string — layout responsibility wrongly in client component
- **Fat pages** — dashboard service forms + admin request tables embed fetch, upload, status PATCH, UI
- **Triplicated schemas** — Contact/Inquiry in `src/model` **and** inline in API routes (fields diverge)
- **Empty** `src/model/Notification.js` while API imports it
- **No shared client** — `fetch('/api/requests')` copy-pasted ~10×; no types; IDOR via `?email=`

### 2.2 Route / UX bugs

| Symptom | Cause |
|---------|--------|
| Navbar after login | Root layout always mounts marketing Navbar via NavShell |
| Sidebar on some pages only | `BottomNavigation` gates on `/dashboard*`; other authed pages (`/notifications`) miss it |
| Home double Navbar | `page.js` also renders `<Navbar />` |
| Dead links | `/profile`, `/my-requests`, `/services/Project-Finance-Assistance`, `/dashboard/loan-readiness`, etc. |
| Duplicate admin trees | `/admin/approved` vs `/admin/dashboard/approved` |

### 2.3 Auth split

```
User  → next-auth JWT → MW on /dashboard* only; APIs mostly ignore session
Admin → bsp_admin_token → MW cookie-exists only; APIs never verify JWT
```

---

## 3. Target architecture

### 3.1 Route groups (App Router)

```
src/app/
  layout.tsx                 # html/body, fonts, providers ONLY — no nav/footer
  (marketing)/
    layout.tsx               # MarketingNavbar + Footer
    page.tsx                 # landing
    about|contact|services|… 
  (auth)/
    layout.tsx               # minimal centered shell — no marketing nav, no app sidebar
    login|register|forget-password/
  (app)/                     # authenticated user product
    layout.tsx               # AppSidebar + AppTopBar (NO marketing Navbar)
    dashboard/…
    notifications/
    requests/…               # canonical request flows (replace /request/* orphans)
  (admin)/
    layout.tsx               # AdminShell only
    admin/
      login/
      dashboard/…            # single tree; delete legacy /admin/approved etc.
```

**Hard UX rules**

- After user login → only `(app)` chrome
- After admin login → only `(admin)` chrome
- Marketing Navbar **never** mounts under `(app)` or `(admin)`
- Logged-in user hitting `/` → redirect `/dashboard` (keep) **or** allow marketing without app chrome (product choice; default keep redirect)

### 3.2 Layering (dependency direction)

```
UI (app/**/page.tsx, components)
  → hooks / server actions (optional)
    → services/ (domain use-cases)
      → repositories/ (Mongoose)
        → models/ (schemas only)
      → lib/ (db, mail, s3, otp, payments)
types/ shared across layers (no imports from UI)
```

**Forbidden:** page → mongoose; API route → 200-line business blob; model file importing React.

### 3.3 Suggested folder map (post-TS)

```
src/
  app/…                      # routes only
  components/
    marketing/ | app/ | admin/ | ui/
  features/                  # optional feature folders if a flow grows (requests, leads)
  services/                  # RequestService, AuthService, LeadService, …
  repositories/
  models/                    # rename from model/; one schema per entity
  lib/
    auth/                    # authOptions, getSession, requireUser, requireAdmin
    db.ts | mail.ts | s3.ts | otp.ts | razorpay.ts
  stores/                    # Zustand: UI-only (sidebar collapsed, modal open)
  types/
  middleware.ts
```

### 3.4 State management

| State kind | Tool | Examples |
|------------|------|----------|
| Server/session | Auth.js / next-auth session + RSC | user id, role |
| Server data | Prefer RSC + `services/` on server; client: **TanStack Query** | requests list, profile, notifications |
| Client UI | **Zustand** (tiny) | sidebar minimize, modal flags |
| Forms | Controlled local state or React Hook Form later | service request wizards |

**Do not** put server entities in Zustand. **Do not** add Redux unless complexity forces it (YAGNI).

### 3.5 Auth target (recommended)

**Option A (preferred):** Unify on Auth.js / next-auth with `role: 'user' | 'admin'`. Admin login uses credentials against admin user(s) in DB or env-seeded admin. Middleware + `requireAdmin()` on APIs. One cookie model.

**Option B:** Keep admin cookie JWT but **always** `jwt.verify`, httpOnly + `secure` in prod, short TTL, refresh optional; still share types and `requireAdmin` helper.

Migrate OTP stores to Mongo (`Otp` collection, TTL index). Remove `global.otpCache` / `global.forgetCache`.

---

## 4. Phased delivery

### Phase 0 — Security hotfix (1–2 days)

- Strip credential fallbacks; document required env in `.env.example`
- Verify admin JWT in middleware; protect sensitive APIs with session/role
- Fix Profile path casing; remove or lock `test-db` / OTP-leak endpoints
- Rotate leaked secrets (Gmail, JWT, admin password)

**Exit:** No unauthenticated write to requests/upload/leads/payments; no secrets in repo.

### Phase 1 — TypeScript foundation (2–4 days)

1. Add `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
2. `tsconfig.json` — `strict: true`, path `@/*` → `./src/*`
3. Rename entry files gradually: `jsconfig` → `tsconfig`; allow `allowJs` **only** during migrate, then remove
4. Add `src/types/` — `user.ts`, `request.ts`, `session.ts`, `api.ts`
5. Type `authOptions` callbacks (`JWT` / `Session` module augmentation)
6. ESLint + `tsc --noEmit` in CI / `npm run typecheck`

**Exit:** `tsc` clean with `allowJs` shrinking; new files must be `.ts`/`.tsx`.

### Phase 2 — Route segregation + chrome (3–5 days)

1. Introduce `(marketing)`, `(auth)`, `(app)`, `(admin)` layouts
2. Root layout: providers + fonts only
3. Delete `NavShell` god-object; move chrome into group layouts
4. Remove duplicate Navbar from home `page`
5. Canonicalize paths (table below); add redirects from old URLs
6. Fix middleware matcher for all authed surfaces (`/notifications`, etc.)

**Canonical routes**

| Old / broken | New |
|--------------|-----|
| `/profile` | `/dashboard/profile` |
| `/my-requests` | `/dashboard/my-requests` |
| `/notifications` | stay or `/dashboard/notifications` (prefer under `(app)`) |
| `/request/*` | `/dashboard/…` service forms or `/dashboard/requests/new?type=` |
| `/admin/approved` etc. | `/admin/dashboard/…` only |
| `/services/Project-Finance-Assistance` | map to real service slug or remove link |

**Exit:** Visual QA — marketing / login / dashboard / admin each have correct chrome only.

### Phase 3 — Domain + API refactor (1–2 weeks)

1. Move Mongoose models → `src/models/*.ts`; kill inline schemas in routes
2. Implement repositories + services for: User, Profile, Request, Inquiry, Contact, Notification
3. Thin route handlers: parse → authorize → service → map DTO → response
4. Shared errors: `AppError` + consistent `{ error: { code, message } }`
5. Replace email-based IDOR with `session.user.id` ownership checks
6. Admin list/filter/patch via authenticated admin services (dedupe 4 near-clone admin pages → one requests view + status filter)
7. Wire Notification model; fix empty file
8. Payments: auth + server-side amount from catalog; persist payment records

**Exit:** No business logic in page components beyond orchestration; APIs authz-tested.

### Phase 4 — Frontend rebuild per surface (1–2 weeks)

1. **Marketing** — cohesive landing; fix service pages; branding fonts; no app chrome
2. **User app** — consistent sidebar; profile shows user + requests; service request UX; notifications bell wired
3. **Admin** — single request inbox (status tabs); leads; users API (replace mock); search wired to API
4. Extract shared UI primitives under `components/ui` (button, input, table) — only when reused 3+ times
5. TanStack Query hooks: `useRequests`, `useProfile`, `useNotifications`
6. Zustand: sidebar collapse only

**Exit:** README unfinished checklist cleared; no dead nav links.

### Phase 5 — Hardening & cleanup (ongoing)

- Delete legacy pages (`/loan`, `/cibil` orphans, `/wpotpsend` harness, duplicate admin)
- Rate-limit auth + OTP + chat
- Logging without PII; remove `console.log` of phones
- Basic tests: service unit tests + 1–2 API authz tests + critical E2E (login → create request → admin approve)
- Update README for real setup; keep `docs/REBUILD_PLAN.md` status current

---

## 5. SOLID mapping (how we apply it here)

| Principle | Practice in this codebase |
|-----------|---------------------------|
| **S**ingle responsibility | One service method = one use-case; one component = one UI job; layouts own chrome only |
| **O**pen/closed | New service type = extend enum + form config; avoid editing every admin page |
| **L**iskov | Shared `Repository<T>` / DTO mappers behave consistently |
| **I**nterface segregation | Narrow hooks/props (`RequestListProps` not god `DashboardProps`) |
| **D**ependency inversion | Routes/UI depend on service interfaces; services depend on repo interfaces, not concrete mongoose calls in UI |

**Coupling:** no cross-import between `components/marketing` and `components/admin`.  
**Cohesion:** all Request status transitions live in `RequestService`, not scattered PATCH handlers.

---

## 6. TypeScript / typing standards

- `strict: true`; no `any` without `// ponytail: temporary — remove by <ticket>`
- Prefer `unknown` + narrow at boundaries (API `req.json()`)
- Zod (optional Phase 3+) for runtime validation of body/query — align with types via `z.infer`
- Export domain types from `src/types`; re-export DTOs used by client hooks
- Augment next-auth `Session` / `JWT` once in `types/next-auth.d.ts`

---

## 7. Middleware & security checklist

- Matcher covers: marketing auth redirects, all `(app)` paths, all `(admin)` except login, **and** optionally `/api/*` via shared `require*` in handlers (edge MW for pages; handlers for APIs)
- CSRF: next-auth defaults; admin cookie `sameSite: 'lax'|'strict'`, `secure: true` in production
- Uploads: auth + content-type allowlist + size cap + per-user prefix in S3
- Never return OTP codes in JSON responses
- Principle of least privilege on admin actions (audit log later)

---

## 8. Migration tactics (low risk)

1. **Strangler:** new route groups first; redirect old paths; delete old files when traffic zero
2. **allowJs** during TS migrate; forbid new `.js`/`.jsx` via ESLint / AGENTS rule
3. **One vertical slice end-to-end** before mass rewrite — e.g. Profile GET/PUT typed + authed + `(app)` layout — proves pattern
4. Do **not** rewrite UI and backend for every feature in the same PR; slice by phase

**First vertical slice (recommended):**  
`(app)` layout + typed Profile API + `ProfileService` + dashboard profile page. Then Requests.

---

## 9. Decisions to confirm with product owner

1. Logged-in users: force `/dashboard` on `/`, or allow browsing marketing without app chrome?
2. Admin auth: Option A (unified Auth.js roles) vs Option B (verified separate JWT)?
3. Keep chatbot / CIBIL sandbox / Razorpay in v1 rebuild scope or park behind feature flags?
4. Brand fonts / visual redesign in Phase 4 or separate design track?

---

## 10. Success metrics

- [ ] Zero marketing Navbar on `/dashboard/**` and `/admin/**`
- [ ] Zero admin chrome on `/admin/login` and marketing
- [ ] `tsc --noEmit` passes; no new JS source files
- [ ] All sensitive APIs require auth; requests scoped by user id
- [ ] Single admin requests UI; no duplicate route trees
- [ ] No secrets in source; `.env.example` complete
- [ ] Dead links from nav/README resolved
- [ ] New code follows `AGENTS.md` + `.cursor/rules/*`

---

## 11. Execution order (short)

```
P0 security → P1 TS tooling/types → P2 route groups/layouts
  → vertical slice (Profile) → P3 Request/Lead domain
  → P4 UI polish per surface → P5 delete legacy + tests
```

Agents and humans: follow this plan; update checkboxes when a phase exits. Do not start Phase 4 visual rebuild before Phase 2 chrome segregation and Phase 0 security.
