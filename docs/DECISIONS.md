# Decisions — The Evidence Room

Record of significant architectural and product decisions. Status labels: **Approved**, **Implemented**, **Superseded**.

---

## ADR-001 — Project workspace path

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Context:** The master plan examples use folder name `redhanded-evidence-room/`. The authorizing user instructed development to stay in the existing Cursor workspace.

**Decision:** Develop in `C:\dev\Personal\RedHandedTheGame`. Do not create or use `C:\dev\Personal\redhanded-evidence-room`.

**Consequences:** Target `src/` layout still follows the master plan. Only the repository folder name differs. Documented as an approved path deviation from the example path in the master specification.

---

## ADR-002 — Approved technology stack for M0

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Decision:** Use React 19, TypeScript (strict), Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router, Zustand, Zod, Motion for React, Vitest, Testing Library, Playwright, ESLint, and Prettier. No backend, database, auth, or payments.

**Consequences:** Dependencies are recorded in `package.json` and `package-lock.json`. Zustand/Zod/Motion are installed for later milestones but not used to implement game systems in M0.

---

## ADR-003 — TypeScript 5.9 instead of Vite template TypeScript 7

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Context:** `create-vite` scaffolded TypeScript ~7.0.2. `typescript-eslint@8` peer range requires TypeScript `>=4.8.4 <6.1.0`, blocking a clean ESLint install.

**Decision:** Pin TypeScript to `~5.9.0` for compatible stable tooling with ESLint. Aligns with master plan guidance to use compatible stable versions rather than blindly pinning versions from scaffolding.

**Consequences:** Strict mode remains enabled. Revisit when `typescript-eslint` officially supports TypeScript 7+.

---

## ADR-004 — ESLint over Vite template oxlint default

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Context:** The Vite React-TS template defaulted to oxlint. The master plan requires ESLint and Prettier.

**Decision:** Remove oxlint; configure ESLint flat config with TypeScript ESLint, React Hooks, React Refresh, and Prettier compatibility.

---

## ADR-005 — M0 delivers shell only; engine starts at M1

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Decision:** Milestone 0 includes documentation, tooling, Cursor rules, design tokens, routing, placeholder landing, not-found, and smoke tests. Do not implement game engine, case schemas/content modules, evidence board, interviews, timeline/puzzles, verdict scoring, fan challenges, or the cinematic M2 interface.

**Consequences:** Architecture is documented in `docs/ARCHITECTURE.md` as planned. Code remains a minimal accessible foundation.
