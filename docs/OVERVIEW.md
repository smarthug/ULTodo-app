# ULTodo — Overview

> **Choose less. Finish deeper.**
>
> A focus-first productivity app that combines the Eisenhower Matrix, Pomodoro timing, a daily focus shortlist, and a frictionless brain dump — all offline-first, all on one screen.

---

## What is ULTodo?

ULTodo is a single-user productivity web app built around one premise: **most todo apps optimize for capturing more, but the bottleneck of getting things done is choosing less.**

Where typical task managers stack features (deadlines, dependencies, projects, tags, comments, sharing) on top of an ever-growing inbox, ULTodo bakes a few opinionated workflows directly into the daily loop:

1. **Brain Dump** — get everything out of your head, fast.
2. **Eisenhower Matrix** — drag every captured task into one of four quadrants (or leave it in the Inbox).
3. **Today** — pick a small, configurable shortlist of focus tasks for *today only*.
4. **Pomodoro** — execute that shortlist in quiet timed bursts.
5. **Settings** — tune focus count, timer durations, language, and your project taxonomy.

The whole app fits inside a 430-pixel phone frame on small screens, and expands into a sidebar-based multi-column layout on desktop (≥1024px). Data lives in IndexedDB on the device — no account, no sync, no server.

---

## Key Features

### 1. Today Focus
Configurable shortlist of 1–7 priority tasks for the day. A live progress bar shows completion. The first task is visually accented as the "next thing." A `Start` button on each task launches the Pomodoro timer pre-loaded with that task as the focus subject.

> *"Choose less. Finish deeper."*

### 2. Brain Dump
A frictionless capture inbox with two view modes:
- **List view**: grouped sections — Inbox, Important, Someday, Completed
- **Card view**: 1-column on mobile, 3-column grid on desktop

Search bar narrows by title/note text. Project and tag filters scope the view. The same view supports both rapid review and triage.

> *"Everything on your mind, nothing in your way."*

### 3. Eisenhower Matrix
A 2×2 grid (mobile) or 4-column row (desktop) of Urgent/Important quadrants, plus an Inbox strip below holding all untriaged tasks. Drag any task between quadrants to retitle its priority. Touch and pointer sensors both supported. Falls back to a tap-then-button move flow for accessibility and small screens.

Quadrants:
- **Q1 — Urgent & Important** ("ui"): do now
- **Q2 — Not Urgent & Important** ("nui"): plan
- **Q3 — Urgent & Not Important** ("uni"): delegate
- **Q4 — Not Urgent & Not Important** ("nuni"): drop or batch
- **Inbox** (null quadrant): untriaged backlog

> *"Make priority feel physical."*

### 4. Pomodoro Timer
A focused/break dual-mode timer with a generous 72px (mobile) / 96px (desktop) circular progress indicator. The current focus task title is shown beneath the timer. Configurable focus minutes (5–60) and break minutes (1–30). Reset / Start / Pause controls.

> *"Quiet execution."*

### 5. Settings
- **Language toggle**: English ↔ Korean (i18next)
- **Today focus count**: 1–7
- **Pomodoro**: focus minutes (5–60), break minutes (1–30)
- **Projects**: create / rename / archive custom projects with an 8-color palette. The default `Personal` project cannot be archived.
- **Scope hint**: project + tag filters live in the top scope sheet (filter chips on desktop)

---

## Design Philosophy

| Principle | What it means in ULTodo |
|---|---|
| **Mobile-first, desktop-considered** | The original 430px phone-frame UI is the canonical layout. Desktop unfolds it into a sidebar + multi-column shape, but never inverts the priority. |
| **Offline-only by default** | IndexedDB stores everything. No account, no sync, no telemetry. The app works on a flight or in a tunnel. |
| **One screen at a time** | No tabs within tabs, no nested modals. Sheets slide up on mobile; on desktop they become inline panels. |
| **Opinionated defaults, gentle escapes** | Today defaults to 3 focus tasks. Pomodoro defaults to 25/5. Inbox is the default quadrant. You can change everything in Settings, but you don't have to. |
| **Quiet typography** | Instrument Serif italics for headlines, Geist for body, Geist Mono for numerals and labels. The visual language is *paper*, not *dashboard*. |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build tool | Vite 8 |
| UI framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (inline `@theme` tokens, no config file) |
| Animation | Motion (Framer Motion fork) |
| Routing | React Router v7 |
| State | React Context (`TaskStoreProvider`) — single global store |
| Persistence | IndexedDB via `idb` |
| Drag-and-drop | `@dnd-kit/core` (pointer + touch sensors) |
| Internationalization | i18next + react-i18next (en, ko) |
| Icons | Lucide React |
| Component variants | class-variance-authority |
| Testing | Vitest + Testing Library + fake-indexeddb |

No backend. No build step beyond Vite. No npm package > 600 KB after gzip.

---

## Architecture Overview

```
src/
├── app/              # App.tsx, router.tsx, providers.tsx
├── components/
│   ├── app-shell/    # AppShell (responsive root), AppBar, BottomNav, Sidebar
│   ├── task/         # TaskCard, TaskRow, QuickAddForm, QuickAddSheet,
│   │                 #  TaskDetailPanel, TaskDetailSheet, TagChip, Checkbox
│   ├── matrix/       # MatrixQuadrant, MatrixTaskChip
│   ├── settings/     # FilterChips, FilterSheet, MenuSheet
│   ├── pomo/         # Pomodoro UI bits
│   └── ui/           # Button, Card primitives
├── pages/            # TodayPage, BrainDumpPage, MatrixPage, PomodoroPage, SettingsPage
├── features/
│   ├── tasks/        # task-store, task-types, task-selectors
│   └── settings/     # settings-types
├── db/               # bootstrap, client, repositories, schema (idb)
├── hooks/            # use-pomodoro, use-media-query
├── data/             # seed (PROJECTS, SEED_TAGS, SEED_TASKS), quadrants
├── i18n/             # i18next config + en/ko locale files
├── lib/              # ids (makeId, slugify), dates, utils
└── styles/           # tokens.css (CSS custom properties for light/dark)
```

### Responsive Strategy

A single `useIsDesktop()` hook (`(min-width: 1024px)`) drives an `isDesktop` boolean inside `AppShell`. The shell renders one of two completely separate layouts:

- **Mobile (<1024px)**: 430px phone frame, BottomNav, modal sheets sliding up from the bottom.
- **Desktop (≥1024px)**: Full-width split into Sidebar + main content + (on Today/BrainDump) right-side TaskDetail panel. No sheets — sheet bodies were extracted into reusable inline components.

Tablet (640–1023px) renders the mobile UI centered in a phone frame.

### Domain Model

```ts
interface Task {
  id: string
  title: string
  note: string
  projectId: string                // FK → Project.id
  tagIds: string[]                 // FK → Tag.id[]
  quadrant: 'ui' | 'nui' | 'uni' | 'nuni' | null  // null = Inbox
  done: boolean
  focus: boolean                   // member of Today shortlist
  estMin: number
  createdAt: string                // ISO
  updatedAt: string                // ISO
  completedAt?: string | null
}

interface Project {
  id: string
  name: string
  color: string                    // hex
  order: number
  archived?: boolean               // soft delete
}

interface Tag {
  id: string
  name: string
  color: string
  order: number
}

interface Settings {
  language: 'en' | 'ko'
  todayCount: number               // 1–7
  pomodoroMinutes: number          // 5–60
  breakMinutes: number             // 1–30
  activeProjectId: string | 'all'
  activeTagIds: string[]
  brainView: 'list' | 'card'
}
```

---

## Getting Started

```bash
# Install
npm install

# Develop (Vite dev server, http://localhost:5173)
npm run dev

# Verify
npm run lint
npm test -- --run
npm run build
```

Open the app in a browser. The first load seeds default projects (`Personal`, `ULTodo`, `Writing`, `Home & life`), tags, and 18 example tasks. Subsequent loads read from IndexedDB.

To reset the local data: open DevTools → Application → IndexedDB → delete the `ultodo` database, then refresh.

---

## Project Status

**Phase 1 — Local-only MVP** *(current)*

Shipped:
- All 5 routes (Today, Brain Dump, Matrix, Pomodoro, Settings)
- Drag-and-drop matrix triage
- Pomodoro timer with task pre-loading
- Project CRUD with color palette + soft archive
- Korean / English language toggle
- Responsive desktop layout (sidebar + 3-pane on Today, 4-column matrix, 3-column brain dump grid)
- Eisenhower Matrix with 4 quadrants (Inbox handled implicitly via quadrant=null)

**Out of scope for Phase 1:**
- Calendar / timeboxing
- Authentication / cloud sync
- Multi-device support
- Advanced analytics / reports
- Native packaging (Tauri / Capacitor)
- Collaboration / sharing
- Recurring tasks
- File attachments
- Notifications

---

## License & Attribution

Single-user demo project. Visual reference: original Claude Design export, ported into a production-shaped Vite + React 19 + Tailwind v4 app.
