# tarot (fe-user plugin)

Tarot subscription onboarding — guided session flow for new subscribers.

## Routes

Registered via `sdk.addRoute` in `index.ts`. See `src/views/` for the exact paths.

## Store

`src/stores/useTarotStore.ts` — session state and step management.

---

## Related

| | Repository |
|-|------------|
| 🖥 Backend | [vbwd-plugin-tarot](https://github.com/VBWD-platform/vbwd-plugin-tarot) |
| 🛠 Frontend (admin) | [vbwd-fe-admin-plugin-tarot](https://github.com/VBWD-platform/vbwd-fe-admin-plugin-tarot) |

**Core:** [vbwd-fe-user](https://github.com/VBWD-platform/vbwd-fe-user) · [vbwd-fe-core](https://github.com/VBWD-platform/vbwd-fe-core)

## Documentation

Full platform documentation lives at **[vbwd.cc/docs](https://vbwd.cc/docs)**.

- [Frontend plugins](https://vbwd.cc/docs-frontend-plugins) — how fe-admin / fe-user plugins are built and mounted
- [Architecture](https://vbwd.cc/docs-architecture) — platform layering and the core-agnosticism rule
- [Getting started](https://vbwd.cc/docs-getting-started) — install a VBWD instance and enable plugins
