---
name: responsive-desktop-consensus
description: Consensus plan for adding responsive desktop support to ULTodo via single-breakpoint useMediaQuery + additive lg: classes + sheet body extraction
type: consensus-plan
spec: .omc/specs/deep-interview-responsive-desktop.md
status: APPROVED
iterations: 2
generated: 2026-04-28
planner: opus
architect: opus (APPROVE iter 2)
critic: opus (APPROVE iter 2)
---

# Consensus Plan: Responsive Desktop Support for ULTodo

> **Provenance**: Generated via `/deep-interview` (5 rounds, 6.5% ambiguity) → `/ralplan --consensus --direct` (Planner → Architect → Critic, 2 iterations to APPROVE).
> **Ready for**: `/autopilot` Phase 2 (Execution). Skips Phase 0 (Expansion) and Phase 1 (Planning).

## RALPLAN-DR Summary

### Principles
1. **Mobile-first preservation** — zero regressions below 1024px
2. **Single breakpoint simplicity** — one `lg:` threshold (1024px), no `md:`/`xl:` splits
3. **Additive layering** — desktop styles add via `lg:` classes or `isDesktop` ternary; never modify mobile paths
4. **Extract-not-rewrite** — sheet bodies become shared components; sheets remain wrappers for mobile
5. **Minimal new state** — reuse existing stores; no new React contexts

### Decision Drivers
1. Mobile regression safety — existing users are mobile-only
2. Development velocity — brownfield, must ship without architectural risk
3. Code reuse — sheet content must serve both mobile sheet wrapper and desktop inline embed

### Chosen Approach
Single `useMediaQuery('(min-width: 1024px)')` hook + additive Tailwind `lg:` classes + extracted sheet body components. **Approved unanimously by Architect + Critic across 2 iterations.**

### Invalidated Alternatives
- **Container queries** — rejected per spec constraint (viewport-only breakpoints)
- **Separate desktop route tree** — rejected for logic duplication across 5 pages
- **Pure CSS `hidden lg:flex` for everything** — rejected because structural changes (3-pane layout, OutletContext additions) require JS awareness

---

## ADR (Architecture Decision Record)

- **Decision**: Single `useMediaQuery` hook + additive `lg:` classes + extracted sheet bodies + `isDesktop` ternary for structural branching
- **Drivers**: Mobile regression safety, development velocity, code reuse between mobile sheets and desktop inline
- **Alternatives considered**: Container queries (spec violation), separate desktop route tree (90% logic duplication), pure CSS branching (sheets carry React state, would mount invisibly on desktop)
- **Why chosen**: Minimal JS surface (one hook, one boolean), maximum CSS reuse, zero mobile regression risk since mobile code paths are untouched
- **Consequences**: `useMediaQuery` causes a single re-render on breakpoint cross. Each sheet has 2 entry points (mobile wrapper + desktop inline embed). OutletContext expands but per-consumer destructuring isolates re-renders.
- **Follow-ups (out of scope)**: keyboard shortcuts (Cmd+K, j/k), WAI-ARIA audit, slide-in animations, visual regression baseline, drag-drop polish beyond geometry fixes

---

## Phase A: Foundation

### A1. `useMediaQuery` hook
- **File**: `src/hooks/use-media-query.ts` (NEW)
- **Work**: SSR-safe hook returning `boolean` for `(min-width: 1024px)`. Uses `window.matchMedia` with `change` event listener. Initial value computed from `window.matchMedia(query).matches` if `window` exists, else `false`.
- **Acceptance**: Hook returns `false` at 1023px, `true` at 1024px. No SSR crash on initial render.

### A2. AppShell desktop branch
- **File**: `src/components/app-shell/AppShell.tsx`
- **Work**:
  - Import `useMediaQuery`. Derive `const isDesktop = useMediaQuery('(min-width: 1024px)')`.
  - **motion.div layout fix**: Change line 34 from `<motion.div layout className="...">` to `<motion.div layout={!isDesktop} className={isDesktop ? desktopClasses : mobileClasses}>`. Prevents Framer Motion animating the width jump at the 1024px breakpoint.
  - **Phone-frame chrome cleanup**: Use `isDesktop` ternary for className, NOT `lg:` overrides. Mobile branch keeps existing classes (`max-w-[430px]`, `sm:h-[860px] sm:rounded-[46px] sm:border-[10px] sm:border-[#171511]`). Desktop branch entirely omits phone-frame classes and applies `h-screen w-full max-w-none rounded-none border-0 shadow-none`.
  - Desktop layout wrapper: `<div className="flex h-screen">` with `<Sidebar />` (left, `w-60`) + main content area (`flex-1 overflow-hidden flex flex-col`).
  - Conditional rendering: `{isDesktop ? <Sidebar /> : <BottomNav />}`. On desktop, hide AppBar menu/filter buttons.
  - On desktop, do NOT render `<QuickAddSheet>`, `<FilterSheet>`, `<MenuSheet>`, `<TaskDetailSheet>`. Pages handle inline equivalents.
  - **OutletContext expansion**: Update `OutletContext` type at line 13 to `{ openTask, startFocus, isDesktop, selectedTask, setSelectedTask, quickAddInline?, setQuickAddInline? }`. Provide all fields via the Outlet context value.
  - **Per-consumer destructuring map** (verified against current code):
    - `TodayPage` (line 13): `openTask, startFocus, isDesktop, selectedTask, setSelectedTask`
    - `BrainDumpPage` (line 14): `openTask, isDesktop`
    - `MatrixPage` (line 28): `openTask` only (unchanged)
    - `PomodoroPage`: no `useOutletContext` call (unchanged)
    - `SettingsPage`: no `useOutletContext` call (unchanged)
- **Acceptance**: At 1023px, phone-frame chrome visible, layout animation active. At 1024px, full-width layout, no phone chrome, no layout animation on the wrapper, sidebar visible.

### A3. Sidebar component
- **File**: `src/components/app-shell/Sidebar.tsx` (NEW)
- **Work**: NOT a trivial nav list. Must:
  - Subscribe to `useTaskStore()` for badge counts mirroring `MenuSheet.tsx:18-21`
  - Use `useTranslation()` for labels (existing keys: `nav.today`, `nav.brain`, `nav.matrix`, `nav.focus`, `nav.settings`)
  - Reuse `menu.eyebrow` for sidebar header (verified present in `en.json:3` "Menu" / `ko.json:3` "메뉴") — NO new i18n key needed
  - Render `NavLink` items with active state styling (e.g., `bg-paper-2` when active, matching MenuSheet button styling)
  - Render Settings link with same icon-badge treatment as `MenuSheet.tsx:53-59`
  - Accept `onQuickAdd` callback prop for sidebar-bottom FAB triggering desktop QuickAdd inline in active page
  - Fixed dimensions: `h-screen w-60`, `border-r border-[var(--hair)]`
- **Acceptance**: Sidebar renders 5 nav items with correct i18n in both en/ko; badge counts match MenuSheet; clicking nav items navigates correctly; FAB triggers QuickAdd callback.

---

## Phase B: Sheet Body Extraction

### B1. QuickAddForm extraction
- **File**: `src/components/task/QuickAddForm.tsx` (NEW, extracted from QuickAddSheet.tsx)
- **Work**:
  - Extract lines 12-108 of QuickAddSheet into `QuickAddForm`. Owns all 8 useState fields internally (`title`, `note`, `projectId`, `tagIds`, `quadrant`, `focus`, `estMin`, `newTag`)
  - **Remove the `useEffect` keyed on `[editingTask, open, store.projects]` entirely** (lines 22-32 of current QuickAddSheet). That effect resets state on `open` flip — replaced with key-based reset.
  - **State reset strategy**: Parent controls reset via React `key` prop: `<QuickAddForm key={editingTask?.id ?? 'new'} editingTask={editingTask} onSubmit={handleSubmit} onDelete={handleDelete} />`. When `editingTask` changes, React unmounts/remounts, useState initializes from `editingTask` props.
  - The `open` prop is removed from QuickAddForm (sheet-only concern). Form is always "open" when rendered.
  - Props: `{ editingTask?: Task | null; onSubmit: () => void; onDelete?: () => void }`
- **File**: `src/components/task/QuickAddSheet.tsx` (modified)
  - Becomes a thin wrapper: retains `open`/`onClose` props, renders backdrop + slide-up container, delegates to `<QuickAddForm key={editingTask?.id ?? 'new'} editingTask={editingTask} onSubmit={onClose} onDelete={onClose} />`
- **Acceptance**: Mid-edit resize remounts form via key (acceptable). Mobile QuickAddSheet behavior unchanged. Desktop inline form renders without sheet wrapper.

### B2. TaskDetailPanel extraction
- **File**: `src/components/task/TaskDetailPanel.tsx` (NEW, extracted from TaskDetailSheet body)
- **Work**: Extract detail content (task fields display, edit, complete, focus button). Accepts `{ task: Task | null; onClose; onFocus }`. Renders empty state ("Select a task" — short message + subtle icon, matches existing visual language) when `task` is null.
- **File**: `src/components/task/TaskDetailSheet.tsx` (modified to wrap TaskDetailPanel)
- **Acceptance**: Panel renders task details or empty state. Sheet wrapper unchanged for mobile.

### B3. FilterChips extraction
- **File**: `src/components/settings/FilterChips.tsx` (NEW, extracted from FilterSheet body)
- **Work**: Inline project/tag filter chips (lines 11-28 of current FilterSheet). Reads filter state from store directly.
- **File**: `src/components/settings/FilterSheet.tsx` (modified to wrap FilterChips)
- **Acceptance**: Chips render inline on desktop page headers. Sheet unchanged for mobile.

### B4. MenuSheet — no extraction needed
- **File**: `src/components/settings/MenuSheet.tsx` (UNCHANGED)
- **Reason**: Sidebar replaces MenuSheet on desktop entirely. MenuSheet still renders on mobile via `!isDesktop` guard in AppShell.

---

## Phase C: Per-Page Desktop Layouts

### C1. TodayPage — 3-pane layout
- **File**: `src/pages/TodayPage.tsx`
- **Work**: When `isDesktop`: render `<div className="flex h-full">` with left column (FilterChips header + task list + QuickAddForm at top when triggered) and right column (`<TaskDetailPanel task={selectedTask} ... />`). Read `selectedTask`/`setSelectedTask` from OutletContext. On mobile: `openTask` opens sheet (current behavior); on desktop: `openTask` calls `setSelectedTask(task)`.
- **Acceptance**: Desktop shows list + detail side-by-side. Clicking task populates right panel. Empty state when nothing selected.

### C2. BrainDumpPage — 3-column grid
- **File**: `src/pages/BrainDumpPage.tsx`
- **Work**: Card view container at line 39: `flex flex-col gap-3` → `flex flex-col gap-3 lg:grid lg:grid-cols-3`. Add QuickAddForm inline at top when `isDesktop` and triggered from sidebar FAB. Add FilterChips in header area.
- **Acceptance**: Cards flow in 3 columns on desktop. QuickAdd visible inline.

### C3. MatrixPage — 4-column row + dnd geometry
- **File**: `src/pages/MatrixPage.tsx`
- **Work**:
  - Line 52: change grid from `grid-cols-2` to `grid-cols-2 lg:grid-cols-4 lg:grid-rows-1`
  - Line 52: add `layout={!isDesktop}` to the `motion.div` grid container (same gating pattern as AppShell to prevent layout animation on breakpoint cross)
  - Line 56: DragOverlay — change `<div className="w-48">` to `<div className="w-48 lg:w-36">` (144px fits in ~189px quadrant at 1024px - 240px sidebar)
- **File**: `src/components/matrix/MatrixQuadrant.tsx`
  - Line 10: add `lg:min-w-0 overflow-hidden` to enable content truncation at narrow widths
  - Verify header + task chips list handles ~189px width without overflow (existing `text-sm` header and `text-[9px]` hint should be fine; ensure MatrixTaskChip text uses `truncate`)
- **Acceptance**: 4 quadrants in a single row on desktop. Drag overlay does not exceed quadrant width. No horizontal overflow at 1024px.

### C4. PomodoroPage — centered, larger timer
- **File**: `src/pages/PomodoroPage.tsx`
- **Work**: Line 24 (timer circle): change `size-72` to `size-72 lg:size-96` (288px → 384px on desktop). Inner `inset-5`/`inset-10` rings scale proportionally via absolute positioning. Centered in content area; no other layout change.
- **Acceptance**: Timer circle is 384px on desktop. Centered. No phone frame.

### C5. SettingsPage — wide form
- **File**: `src/pages/SettingsPage.tsx`
- **Work**: Wrap content in `lg:max-w-2xl lg:mx-auto`.
- **Acceptance**: Settings form is max 672px wide, centered on desktop.

---

## Phase D: Wire-up + Verification

### D1. Integration wiring
- Hide `BottomNav` on desktop (conditional render via `isDesktop`)
- Hide AppBar menu/filter icon buttons on desktop (sidebar replaces)
- Verify dark mode tokens apply to new Sidebar and all extracted components (all use `var(--*)` tokens — no new colors)
- Verify i18n on Sidebar (en/ko toggle works)

### D2. Verification Matrix

| Width | Page | Concrete Checks |
|-------|------|----------------|
| **375px** | Today | Phone frame visible; task list scrolls; tapping task opens TaskDetailSheet (bottom sheet); QuickAddSheet opens from BottomNav +; no sidebar |
| **375px** | Matrix | 2x2 grid; drag-to-triage works; DragOverlay w-48 |
| **375px** | BrainDump | Single-column cards/list; search bar functional |
| **768px** | All | Centered phone frame (sm: chrome active); identical to 375px behavior inside frame |
| **1024px** | Today | Sidebar visible left (w-60); task list center; TaskDetailPanel right with empty state when nothing selected; clicking task populates panel; QuickAddForm visible at top of list when FAB clicked; no phone-frame chrome; no BottomNav |
| **1024px** | Matrix | Sidebar + 4-column single row; drag task from Inbox to each of 4 quadrants — drop targets register; chip overlay (lg:w-36) does not exceed quadrant width; no horizontal scroll |
| **1024px** | BrainDump | Sidebar + 3-column card grid; FilterChips in header; QuickAddForm inline |
| **1024px** | Pomodoro | Sidebar + timer centered; timer circle lg:size-96; no other layout change |
| **1024px** | Settings | Sidebar + single-column form max-w-2xl centered |
| **1440px** | Today | Same as 1024 with more breathing room; panel widths scale proportionally |
| **1440px** | Matrix | 4 quadrants wider; drag-and-drop functional |
| **1440px** | All | Dark mode toggle: all desktop components respect dark tokens; i18n toggle: sidebar labels switch en/ko |

### D3. Critical QA checkpoint at exactly 1024px
Open Matrix page at 1024px viewport width. Drag a task from Inbox strip to each of the 4 quadrants in sequence. Verify:
- (a) each drop target highlights with `ring-2 ring-accent`
- (b) task moves to correct quadrant
- (c) DragOverlay chip does not exceed quadrant boundary
- (d) no horizontal scrollbar appears

---

## Acceptance Criteria Mapping (from spec)

| Spec AC | Plan Phase | Verified By |
|---------|-----------|------------|
| 1440px Today: sidebar + list + TaskDetailPanel (3-pane) | A2, A3, B2, C1 | D2 row 1440px Today |
| 1440px Matrix: 4 quadrants single row | C3 | D2 row 1440px Matrix + D3 |
| 1440px BrainDump: 3-column card grid | C2 | D2 row 1440px (extends 1024px row) |
| 1440px Pomodoro: centered, no layout change beyond removing frame | A2, C4 | D2 row 1024px Pomodoro |
| 1440px Settings: single-column form, max-w-2xl | C5 | D2 row 1024px Settings |
| 768px tablet: falls back to mobile UI | A2 (ternary excludes desktop branch) | D2 row 768px |
| 375px mobile: visually identical, no regressions | All (additive-only changes) | D2 row 375px |
| All CRUD operations work on desktop | B1, B2, C1 | D2 functional checks |
| Sidebar nav switches pages | A3 | D2 sidebar checks |
| TaskDetail right panel: empty state when no task selected | B2, C1 | D2 1024px Today |
| QuickAdd inline at top of task list | B1, C1, C2 | D2 1024px Today/BrainDump |
| Filter inline chips in header | B3, C1, C2 | D2 1024px Today/BrainDump |
| Menu absorbed into sidebar | A3, B4 | D2 1024px all |
| Dark mode tokens on desktop | D1 | D2 1440px all dark mode |
| No horizontal scroll at >=1024px | C3 (min-w-0, overflow-hidden) | D2, D3 |
| Keyboard Tab navigation works | A3 (NavLink), B1-B3 (button) | D2 manual check |

---

## Execution Notes for Autopilot

- **Phase order is non-negotiable**: A → B → C → D. Phase A must complete before Phase C (pages depend on `isDesktop` from AppShell). Phase B must complete before Phase C (pages embed extracted components).
- **Within Phase B, order does not matter**: B1, B2, B3 are independent.
- **Within Phase C, order does not matter**: C1-C5 are independent.
- **Mobile regression check is the primary gate**: After each phase, verify 375px behavior unchanged before proceeding.
- **No package additions required**: All new code uses existing dependencies (React, react-router, Tailwind, Framer Motion, dnd-kit, i18next).

## Residual Risks (accepted by Critic)

1. **`isDesktop` first-render flash**: `useMediaQuery` initial value depends on `window.matchMedia` being available. For Vite SPA this is synchronous and risk is negligible. SSR contexts would need different handling (not applicable here).
2. **Matrix at exactly 1024px is tight**: 189px per quadrant. Plan explicitly QA-gates this at D3 — regressions caught before ship.
3. **Mid-edit form resize loses state**: Acceptable per Critic — the alternative (sharing state across mobile/desktop instances) adds complexity for a rare edge case.
