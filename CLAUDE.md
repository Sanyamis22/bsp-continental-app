@AGENTS.md

# Claude / coding agents — BSP Continental

1. Read **`AGENTS.md`** fully before edits.
2. Follow phased work in **`docs/REBUILD_PLAN.md`**. Do not skip Phase 0 security for cosmetics.
3. Next.js 16 APIs may differ from training data — check `node_modules/next/dist/docs/` first.
4. Enforce: TypeScript for new files, route-group shells, service/repository layering, authz on APIs, no secret fallbacks.
5. Prefer strangler migrations and vertical slices over big-bang rewrites.
