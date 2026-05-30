# ULTodo App

Production-oriented Vite implementation of the ULTodo MVP, scaffolded as a sibling app from `ULTodo-minimal` while preserving the original Claude Design export as the visual reference.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 + shadcn-style local UI primitives
- Motion.dev
- React Router
- i18next / react-i18next
- IndexedDB via `idb`
- Matrix drag/drop via SortableJS
- Capacitor Android/iOS native shells
- Vitest + Testing Library + fake-indexeddb

## Run

```bash
npm install --legacy-peer-deps
npm run dev
```

## Verify

```bash
npm run lint
npm test -- --run
npm run build
```

## Native Builds

```bash
npm run cap:sync
cd android
./gradlew bundleRelease assembleDebug
```

Release signing is read from `android/keystore.properties` when present. Keep the matching upload key outside git; the project ignores `*.jks`, `*.keystore`, and `keystore.properties`.

## MVP scope

Routes:

- `/brain` — Brain Dump capture, list/card view, search, project/tag filters
- `/matrix` — two-column priority Matrix with SortableJS drag/drop ordering
- `/today` — configurable focus shortlist with deterministic selector semantics
- `/pomo` — minimal Pomodoro timer with focus/break modes

Phase 1 is local-only. Calendar, timeboxing, auth/sync, advanced analytics, and collaboration are intentionally out of scope.
