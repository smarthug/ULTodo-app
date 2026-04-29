# ULTodo — Product Requirements Document

| Field | Value |
|---|---|
| Product | ULTodo |
| Version | 1.0 (Phase 1 MVP) |
| Status | Shipped, iterating |
| Document owner | smarthug |
| Last updated | 2026-04-29 |

---

## 1. Vision

> **Build a productivity app that makes "choose less" the default behavior, not a discipline you have to fight for.**

Most people do not lack ways to capture tasks. They lack a tight, opinionated daily loop that forces them to surface a small number of things that actually matter and execute them with focus. ULTodo bakes that loop into the product:

> *Capture without friction → Triage by priority → Pick a small Today list → Execute in quiet timed bursts.*

The app is designed for a single user on their own device. There is no team mode, no sync, no analytics, no growth surface. It is a tool for thinking, not a SaaS.

---

## 2. Problem Statement

### 2.1 The user pain
Knowledge workers and self-directed individuals routinely accumulate dozens of "open" tasks across notes, sticky pads, project boards, and inboxes. The result is a chronic state of *low-grade triage debt*: every morning starts with deciding what to work on rather than working.

### 2.2 Why existing tools fall short
- **General task managers** (Todoist, Things, Apple Reminders) excel at capture but have weak day-of focus rituals. The "today" list is whatever is due today, which rarely reflects priority.
- **Project trackers** (Notion, Linear, Asana) impose collaboration and structure overhead that single-user productivity does not need.
- **Pomodoro apps** (Forest, Be Focused) handle execution but live separately from the task list, requiring context switching.
- **Eisenhower matrix tools** are typically static templates, not interactive triage surfaces.

No single tool combines: frictionless capture + matrix triage + a small forcing-function "today" list + integrated timed execution + offline-first single-user model.

### 2.3 The opportunity
Combine these workflows in a way that respects the user's attention budget. Use opinionated defaults to remove decision fatigue. Stay offline-only to remove account/sync friction. Optimize for *daily reuse*, not for resume-feature-checking.

---

## 3. Target Personas

### Persona A — The Independent Maker
- Solo founder, freelancer, indie creator, or graduate student
- Owns their own time but has no boss to set priorities
- Has tried 4+ task managers and abandoned each within a month
- Wants a tool that helps them say "no" to most things and "yes" to one thing right now
- **Mental model**: "I don't need more features. I need to actually start the next thing."

### Persona B — The Focused Knowledge Worker
- IC engineer, designer, writer, or analyst inside a larger organization
- Already lives inside Linear/Jira for team work; needs a *separate* personal layer for individual focus
- Wants their personal todo to never sync, never escape the device, never appear in any feed
- **Mental model**: "My team tracker is for the team. This is for me."

### Persona C — The Privacy-Conscious User (secondary)
- Wants their task list off the cloud entirely
- Values offline-first, no-account, no-telemetry as a hard requirement
- Will tolerate a smaller feature surface for it
- **Mental model**: "If it sends one byte to a server, it's not for me."

---

## 4. Product Principles

1. **Mobile-first, desktop-considered.** The 430px phone-frame layout is the canonical experience; desktop is an unfolding of it, never a separate product.
2. **Offline-only by default.** No accounts, no sync, no telemetry. IndexedDB on the device is the only source of truth.
3. **One screen at a time.** No nested modals, no tabs within tabs. On mobile sheets slide up; on desktop they become inline panels.
4. **Opinionated defaults, gentle escapes.** Today defaults to 3 tasks. Pomodoro defaults to 25/5. Inbox is the implicit fallback for unset priority. Settings exist but most users will never touch them.
5. **Quiet typography.** Visual language is *paper*, not *dashboard*. Instrument Serif italics for headlines, Geist for body, Geist Mono for numerals.
6. **Friction at capture is the enemy.** A new task should take fewer keystrokes than opening Apple Notes. Quick add is one tap from any screen.
7. **No-effort onboarding.** First load seeds enough projects, tags, and example tasks to make the matrix and brain dump look populated. The user can delete or keep them.

---

## 5. User Stories

### 5.1 Daily loop (P0 — must)
- **US-01** As a user, I open the app and see my Today shortlist with a progress bar so I know exactly what I'm executing today.
- **US-02** As a user, I tap `Start` on a Today task and the Pomodoro timer launches with that task's title shown beneath the countdown.
- **US-03** As a user, I capture a new task in <5 seconds from any screen using the bottom-bar `+` (mobile) or sidebar Add task button (desktop).
- **US-04** As a user, I drag a captured task from Inbox into one of four matrix quadrants to assign its priority.
- **US-05** As a user, I mark a task done with one tap on the checkbox in any list view.

### 5.2 Triage and review (P0)
- **US-06** As a user, I open Brain Dump and see all my tasks grouped (Inbox / Important / Someday / Completed) so I can scan and triage in one pass.
- **US-07** As a user, I switch Brain Dump to card view to scan tasks visually as 3-column cards on desktop.
- **US-08** As a user, I search Brain Dump by title/note text to find a specific task.
- **US-09** As a user, I filter Brain Dump and Today by project and/or tags to scope the view.

### 5.3 Configuration (P1 — should)
- **US-10** As a user, I change my Today focus count from 3 to N (1–7) so the daily loop fits my actual capacity.
- **US-11** As a user, I change Pomodoro focus and break minutes to my preferred timing (e.g., 50/10).
- **US-12** As a user, I switch the entire UI between English and Korean from Settings.
- **US-13** As a user, I create a new custom project with a name and color from Settings → Projects.
- **US-14** As a user, I rename or archive an existing project. The default `Personal` project cannot be archived.

### 5.4 Desktop ergonomics (P1)
- **US-15** As a desktop user, I see my Today list and a task detail panel side-by-side, so editing doesn't take me away from the list.
- **US-16** As a desktop user, I see all four matrix quadrants in a single row, not stacked 2×2.
- **US-17** As a desktop user, I navigate between Today / Brain / Matrix / Pomo / Settings via a persistent left sidebar instead of bottom tabs.

### 5.5 Edit and refine (P1)
- **US-18** As a user, I tap any task in any view and see its full detail with options to focus, mark done, start a Pomodoro, change quadrant, or open the full edit form.
- **US-19** As a user, I edit a task's title, note, project, tags, priority, and focus flag from a single inline form.
- **US-20** As a user, I move a task back to Inbox by clicking its currently-selected quadrant button (toggle behavior).

---

## 6. Feature Requirements

### 6.1 Routing & shell
- Five routes: `/today`, `/brain`, `/matrix`, `/pomo`, `/settings`
- Default route is `/today`
- `AppShell` provides AppBar, BottomNav (mobile), Sidebar (desktop), and renders the active page in `<Outlet />`
- A single `useIsDesktop()` hook (`(min-width: 1024px)`) drives the responsive switch

### 6.2 Today page
- Read `selectTodayTasks(tasks, settings)` for the shortlist (deterministic, capped at `settings.todayCount`)
- Live progress bar showing completed / total
- Each task is a `TaskCard` with `Start` button overlay
- Focus count stepper (`Minus` / value / `Plus`) inline in the page header
- Desktop: 3-pane layout (filter chips header + list / `TaskDetailPanel` right side)

### 6.3 Brain Dump page
- Two view modes: `list` (grouped sections) and `card` (1-col mobile, 3-col desktop grid)
- Search input filters by title and note (case-insensitive)
- View mode persists to `settings.brainView`
- Desktop: same 3-pane shape as Today (filter chips header + list/grid + right `TaskDetailPanel`)

### 6.4 Eisenhower Matrix page
- 2×2 quadrant grid (mobile) or 4-column row (desktop, ≥1024px)
- Inbox strip below the grid (full-width)
- Drag-and-drop via `@dnd-kit/core`: `PointerSensor` (5px activation distance) + `TouchSensor` (120ms delay, 8px tolerance)
- `DragOverlay` chip width: 192px mobile, 144px desktop
- Quadrants render `MatrixTaskChip` items with truncating text on narrow widths
- Fallback: tap a chip → opens `TaskDetailPanel` → "Move without dragging" 4-button toggle section

### 6.5 Pomodoro page
- Two modes: focus, break (toggle pill)
- Configurable durations from `settings.pomodoroMinutes` and `settings.breakMinutes`
- Circular SVG-emulated progress (clip-path on a bordered ring)
- Mobile: 288px circle. Desktop: 384px circle.
- If route was reached via `navigate('/pomo', { state: { taskId } })` (from a `Start` button), preload that task as the focus subject
- Otherwise, pick the first task with `focus: true` and `done: false`
- Controls: Reset / Start / Pause

### 6.6 Settings page
- Language toggle: en / ko (writes to `settings.language`, calls `i18n.changeLanguage`)
- Today focus count stepper: 1–7
- Pomodoro stepper: focus 5–60, break 1–30
- **Projects management**: list of non-archived projects with rename and archive buttons + inline new-project form (name + 8-color palette swatch picker)
- Personal project's archive button is hidden (cannot be archived)
- Scope hint paragraph at bottom

### 6.7 Quick add and edit form (`QuickAddForm`)
- Single shared component for both new task creation and existing task editing
- Owns its own state (8 useState fields). Parent controls reset via React `key` prop, not via `open`-keyed `useEffect`
- Fields: title, note, project (dropdown), estimate (number), tags (chips + new-tag input), priority (4 toggleable quadrant buttons, no Inbox button — unselected = Inbox), Today focus toggle
- Mobile entry: bottom sheet (`QuickAddSheet`)
- Desktop entry: inline panel at top of Today/BrainDump list when triggered from the Sidebar `Add task` button

### 6.8 Task detail panel (`TaskDetailPanel`)
- Two variants: `sheet` (mobile bottom sheet) and `inline` (desktop right-side fixed panel)
- Inline variant shows "Select a task" empty state when no task is selected
- Body: title, note, Focus / Done / Start buttons (3-col), Move without dragging (4-button toggle, no Inbox button), Edit task button
- Edit task → opens `QuickAddForm` (sheet on mobile, inline below body on desktop)
- Defensive lookup: `store.tasks.find(t => t.id === selectedTask?.id) ?? null` so deletion auto-clears the panel

### 6.9 Persistence
- Single IndexedDB database `ultodo` with object stores: `tasks`, `projects`, `tags`, `settings`, `meta`
- `bootstrapDatabase()` seeds defaults on first load (idempotent via `meta.seededVersion`)
- All mutations go through `repositories.ts` exports → `useTaskStore` reload → React re-render
- No optimistic updates; everything is `await db.put → reload → setState`

### 6.10 Internationalization
- i18next with two locales (`en`, `ko`)
- All Sidebar / MenuSheet / SettingsPage / Projects-section strings are translated
- QuickAddForm, TaskDetailPanel internal labels are intentionally untranslated for v1 (deferred)

---

## 7. Acceptance Criteria

### 7.1 Build & quality gates
- [ ] `npm run build` passes (TypeScript strict, Vite production build)
- [ ] `npm run lint` passes (ESLint, no warnings)
- [ ] `npm test -- --run` passes (Vitest with fake-indexeddb)
- [ ] Bundle size ≤ 600 KB gzipped

### 7.2 Mobile (375px viewport)
- [ ] All 5 routes render inside the 430px phone frame
- [ ] BottomNav with `+` FAB visible on every page
- [ ] Sheet modals (QuickAdd, TaskDetail, Filter, Menu) slide up from the bottom
- [ ] Drag-and-drop works in Matrix via touch
- [ ] No horizontal scroll
- [ ] Pomodoro circle is 288px (`size-72`)

### 7.3 Tablet (768px viewport)
- [ ] Phone frame is centered with `sm:` chrome (rounded corners, dark border, drop shadow)
- [ ] Behavior inside the frame is identical to 375px

### 7.4 Desktop (1024px and 1440px)
- [ ] No phone-frame chrome
- [ ] Sidebar visible on the left (`w-60`, full height)
- [ ] BottomNav not rendered
- [ ] Today: 3-pane (sidebar + list + TaskDetailPanel right; empty state when no task selected)
- [ ] Brain Dump: 3-column card grid (card view) or grouped sections (list view); right TaskDetailPanel
- [ ] Matrix: 4 quadrants in single row; inbox strip below; DragOverlay 144px wide
- [ ] Pomodoro: 384px circle (`lg:size-96`), centered
- [ ] Settings: `lg:max-w-2xl` form, centered

### 7.5 Functional
- [ ] Create / edit / delete / complete a task — works on mobile and desktop
- [ ] Drag a task between matrix quadrants — persists immediately
- [ ] Click a task in matrix → opens panel with quadrant move buttons
- [ ] Switch language en ↔ ko — Sidebar / MenuSheet / SettingsPage labels update
- [ ] Create a new project from Settings — appears in FilterChips and QuickAddForm dropdown immediately, becomes active filter
- [ ] Archive a project — disappears from filters; tasks remain
- [ ] Personal project cannot be archived (button hidden)
- [ ] Pomodoro timer counts down, transitions correctly between focus/break, persists across page navigation

### 7.6 Privacy / data
- [ ] No network calls after initial bundle load (verifiable in DevTools Network tab)
- [ ] All data lives in IndexedDB `ultodo` database
- [ ] Reloading the page restores exact previous state

---

## 8. Non-Goals (Phase 1)

The following are explicitly out of scope for Phase 1. They may be revisited later.

- Cloud sync, multi-device, or any backend
- Authentication / accounts
- Recurring tasks (every Tuesday, every month, etc.)
- Subtasks / hierarchies / dependencies
- Task due dates and reminders
- Calendar integration / view
- Time-tracking beyond Pomodoro session count
- Notifications (push, in-app, or system)
- File attachments
- Comments / notes longer than a single textarea
- Sharing / collaboration / mentions
- Advanced analytics, reports, weekly review screens
- Native packaging (Tauri, Capacitor, Electron)
- Themes / theming customization beyond the existing dark mode tokens
- Drag-to-reorder within a list
- Bulk operations (multi-select)
- Keyboard shortcuts (Cmd+K palette, j/k navigation, etc.)
- WAI-ARIA accessibility audit and full a11y compliance
- Visual regression testing baseline

---

## 9. Technical Constraints

- **Single-user, single-device.** No identity, no auth, no concept of "current user."
- **IndexedDB only** for persistence. No localStorage as primary store. No sessionStorage.
- **No new runtime dependencies** added without strong justification. Bundle stays under 600 KB gzipped.
- **No CSS-in-JS.** Tailwind utility classes only, except the inline `@theme` token block in `index.css`.
- **No global state libraries** beyond React Context. No Redux, no Zustand, no MobX, no Jotai.
- **Tailwind v4 inline `@theme`** — no `tailwind.config.js`. Custom tokens live in `styles/tokens.css`.
- **Single breakpoint at 1024px.** No `md:` or `xl:` differentiation. Tablet renders mobile UI.
- **No SSR.** Vite SPA only. `useMediaQuery` initial value uses `window.matchMedia`.

---

## 10. Success Metrics

Because the app is offline-only and has no telemetry, success is defined by *qualitative* user behavior signals rather than analytics:

- **Daily reuse**: the user opens the app at least 3 days a week without prompting
- **Today shortlist completion rate**: subjectively, "most days I finish what I picked"
- **Triage debt**: Inbox holds <20 untriaged tasks at any given time
- **Pomodoro adoption**: at least one session per active day
- **Settings stability**: the user changes Pomodoro defaults once or twice and then never again

If the user starts using a paper notebook again, the product has failed.

---

## 11. Roadmap

### Phase 1 — Local-only MVP (current, shipped)
- Five routes, full responsive layout
- Project CRUD with archive
- Korean / English i18n
- Drag-and-drop matrix
- Pomodoro timer with task pre-loading
- Sidebar navigation on desktop, BottomNav on mobile

### Phase 2 — Polish (next)
- Keyboard shortcuts (Cmd+K palette, j/k task navigation, n for new task, Enter to focus)
- WAI-ARIA accessibility audit
- Slide-in animation for desktop TaskDetailPanel
- Drag-to-reorder within Today and within Inbox
- Visual regression testing baseline at the four canonical viewport widths

### Phase 3 — Optional cloud sync (deferred, possibly never)
- E2E-encrypted sync via a single user's own backend (no provider account)
- Multi-device support
- Will only be considered if Phase 1 + 2 retain a single user across 90 days

### Explicitly will not happen (no roadmap entry)
- Team collaboration
- Marketplace / templates
- Plugins / integrations
- Mobile app store distribution
- Subscription / paid tier

---

## 12. Open Questions

- Should the Pomodoro timer ring/notify on completion? Phase 1 silently transitions; user has to look. Not yet decided whether silent execution is correct or just unfinished.
- Should completed tasks fade out of Brain Dump after N days? Currently they stay forever in the Completed section.
- Should there be an "Unarchive project" path? Currently archive is one-way from the UI; user must edit IndexedDB directly to restore. Acceptable for v1.

---

## 13. Document History

| Date | Change | Author |
|---|---|---|
| 2026-04-29 | Initial PRD captured from shipped Phase 1 codebase + interview | smarthug |
