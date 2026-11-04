<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BSP Continental — Agent Rules

Rebuild plan (source of truth for phased work): [`docs/REBUILD_PLAN.md`](docs/REBUILD_PLAN.md).

These rules bind all agents and codegen. Prefer **deletion** and **reuse** over new abstraction. Ship the smallest change that advances the current plan phase.

---

## Hard product shells (non-negotiable)

Three surfaces. Never mix chrome.

| Surface | Route group | Chrome allowed | Forbidden |
|---------|-------------|----------------|-----------|
| Landing page | `(landing-page)` | Landing-page navbar + Footer | App sidebar, admin chrome, post-login landing-page navbar |
| Auth | `(auth)` | Minimal centered shell | Landing-page navbar, app sidebar, admin chrome |
| Client app | `(client-app)` | App sidebar + app top bar | Landing-page navbar, landing-page footer-as-nav, admin chrome |
| Super admin | `(super-admin)` | Admin shell only | Landing-page navbar, user sidebar; hide admin nav on `/admin/login` |

- Root `layout` = `html` / `body` / fonts / providers **only**. No global `NavShell`.
- Pathname-based chrome switching in a shared client wrapper is **banned** (that caused Navbar/sidebar inconsistency).
- After user login, landing-page navbar **must not** appear.
- One canonical path per feature; add redirects for legacy URLs; do not leave duplicate admin trees.

---

## SOLID / design hard rules

1. **S — Single responsibility**  
   - Page/component: render + wire events.  
   - Service: one use-case / business rule set.  
   - Repository: persistence only.  
   - Route handler: HTTP parse → authz → service → response.  
   - Layout: chrome for **one** surface only.

2. **O — Open/closed**  
   Add a service type / status via config + service methods. Do not clone admin pages per status.

3. **L — Liskov**  
   Shared helpers (repos, mappers, error types) must be substitutable without special-casing callers.

4. **I — Interface segregation**  
   Narrow props and hook return types. No god `DashboardContext` dumping all domain data.

5. **D — Dependency inversion**  
   UI and route handlers depend on **services**, not Mongoose models. Services depend on repositories / ports, not React.

### Coupling / cohesion

- **Allowed dependency direction:** `app → services → repositories → models/lib`. Never reverse.
- **No cross-surface imports:** `components/landing-page/*` must not import `components/super-admin/*` or `components/client-app/*` (shared primitives only via `components/ui`).
- **High cohesion:** all Request status transitions live in one `RequestService` (or equivalent), not scattered in pages/API files.
- **Low coupling:** pages do not call `fetch` to five endpoints with duplicated auth; use one hook/service per aggregate.
- **No inline Mongoose schemas inside route files.** One model file per entity under `src/models/`.
- **No business rules in React components** beyond display conditionals.

### YAGNI / ponytail

- Do not add Redux, new UI kits, or micro-frontends unless the plan phase requires them.
- State: session via Auth.js; server data via RSC/services or TanStack Query; UI chrome via small Zustand stores only.
- Extract shared UI only after **3+** real call sites.
- Mark deliberate shortcuts: `// ponytail: <ceiling> — upgrade via <path>`.

---

## TypeScript

- New source files **must** be `.ts` / `.tsx`. Do not add new `.js` / `.jsx`.
- Target `strict: true`. Avoid `any`; prefer `unknown` + narrowing at boundaries.
- Domain + DTO types live in `src/types/`. Augment next-auth Session/JWT in `src/types/next-auth.d.ts`.
- During migration, `allowJs` may exist; every touched JS file should be converted when edited if cost is low.
- Run / respect `typecheck` (`tsc --noEmit`) before claiming a TS task done.

---

## Security (hard)

- **Never** hardcode secrets, API keys, default admin passwords, or JWT secrets in source. Fail closed if env missing.
- **Never** commit `.env` or credentials. Update `.env.example` with names only.
- Every sensitive API: authenticate + authorize (ownership for user resources; admin role for admin).
- Do not trust client-supplied `email` / `userId` for authorization — use session.
- Admin tokens: **verify** signature and expiry (presence check alone is insufficient).
- Uploads and payments: auth required; amounts and keys decided server-side.
- Never return OTP codes in API responses. OTP storage: durable store with TTL, not process memory.
- Do not leave debug routes (`test-db`, OTP harnesses) reachable in production.

If a task would weaken authz, refuse and fix the guard instead.

---

## API / backend conventions

- Thin handlers in `src/app/api/**`.
- Shared helpers: `requireUser()`, `requireAdmin()`, consistent error shape `{ error: { code, message } }`.
- Validate input at the trust boundary (body/query). Prefer schema validation (e.g. Zod) when adding new endpoints.
- Idempotent where practical for payments/webhooks.
- Log without secrets or full PII.

---

## Frontend conventions

- Server Components by default; `'use client'` only for interactivity.
- Read Next.js docs under `node_modules/next/dist/docs/` before using unfamiliar App Router APIs.
- Match existing visual language when editing a surface; large redesign only under plan Phase 4+.
- Accessibility baseline: labels, focus, keyboard for interactive controls.
- No duplicate chrome components mounted from both layout and page.

---

## Git / change hygiene

- Small PRs aligned to plan phases / vertical slices (e.g. Profile slice before mass UI rewrite).
- Do not mix unrelated refactors with feature work.
- Do not invent docs the user did not ask for; keep `docs/REBUILD_PLAN.md` status accurate when completing a phase.
- Code, commits, and PR bodies: normal professional prose (not caveman compression).
- **Never** add an AI / agent / Cursor / Copilot `Co-authored-by` trailer (or any equivalent co-author credit) on commits. Commits are authored only by the human developer.

---

## Before writing code — checklist

1. Which plan phase does this serve? If none, stop and ask.
2. Which surface (landing page / auth / client app / super admin)? Use that layout only.
3. Does a service/repo already exist? Extend it; do not duplicate.
4. Is authz on the API path? If not, add it in the same change.
5. Are types updated? New public shapes need types in `src/types/`.
6. Will this increase coupling across surfaces? If yes, redesign.

---

## Explicitly out of scope for drive-by changes

- Rewriting the entire UI in one PR
- Introducing a second state library
- New service verticals not in the plan
- Keeping `NavShell`-style global chrome “for convenience”
