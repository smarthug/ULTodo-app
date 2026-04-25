# ULTodo App

Production-oriented Vite implementation of the ULTodo MVP, scaffolded as a sibling app from `ULTodo-minimal` while preserving the original Claude Design export as the visual reference.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 + shadcn-style local UI primitives
- Motion.dev
- React Router
- i18next / react-i18next
- IndexedDB via `idb`
- Matrix drag/drop via `@dnd-kit/core`
- Vitest + Testing Library + fake-indexeddb

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm test -- --run
npm run build
```

## MVP scope

Routes:

- `/brain` — Brain Dump capture, list/card view, search, project/tag filters
- `/matrix` — Eisenhower Matrix with dnd-kit drag/drop and fallback move controls
- `/today` — configurable focus shortlist with deterministic selector semantics
- `/pomo` — minimal Pomodoro timer with focus/break modes

Phase 1 is local-only. Calendar, timeboxing, auth/sync, advanced analytics, native packaging, and collaboration are intentionally out of scope.
