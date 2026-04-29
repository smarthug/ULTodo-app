---
name: braindump-detail-panel
description: Extend the desktop TaskDetailPanel pattern from TodayPage to BrainDumpPage so selecting a task on desktop reveals an inline editable detail panel
type: brownfield
status: PASSED
ambiguity: 0.12
threshold: 0.20
generated: 2026-04-29
rounds: 1
---

# Deep Interview Spec: BrainDump Detail Panel

## Metadata
- Interview ID: ulto-braindump-detail-2026-04-29
- Rounds: 1
- Final Ambiguity Score: 12%
- Type: brownfield (small follow-up to responsive-desktop work)
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.95 | 0.35 | 0.333 |
| Constraint Clarity | 0.92 | 0.25 | 0.230 |
| Success Criteria | 0.70 | 0.25 | 0.175 |
| Context Clarity | 0.95 | 0.15 | 0.143 |
| **Total Clarity** | | | **0.880** |
| **Ambiguity** | | | **0.120** |

## Goal

On desktop (≥1024px), make `BrainDumpPage` mirror `TodayPage`'s 3-pane layout: when the user clicks a task in either the card grid OR the list section view, the existing `TaskDetailPanel` (right-side inline panel with edit/move/focus actions) appears on the right with that task's data — same pattern, same component, same interactions as Today.

## Constraints

- **Scope is BrainDump only.** Do NOT touch MatrixPage, PomodoroPage, or SettingsPage in this work.
- **Mobile (<1024px) behavior must remain unchanged.** Tasks still open via `TaskDetailSheet` bottom sheet.
- **Both BrainDump views supported.** Card view (`lg:grid-cols-3`) AND list section view (Inbox / Important / Someday / Completed) must trigger the right panel on click.
- **Reuse, don't duplicate.** Use the existing `TaskDetailPanel` component with `variant="inline"` — same component already used by TodayPage. Pass `task` derived from `store.tasks.find(...)` so deletion/completion auto-clears the panel (same defensive pattern as TodayPage).
- **OutletContext is the wire.** Read `selectedTask`, `setSelectedTask`, `isDesktop`, `startFocus` from OutletContext (already exposed by AppShell — no AppShell changes needed).
- **Layout shape mirrors TodayPage.** Left column = scrollable content, right column = `<aside className="hidden w-[380px] shrink-0 border-l border-[var(--hair)] bg-paper lg:block">` containing `TaskDetailPanel`.
- **No new components.** No new files. Only `BrainDumpPage.tsx` is modified.

## Non-Goals

- Apply the same pattern to MatrixPage (deferred — Matrix has dnd context complications)
- Apply to PomodoroPage or SettingsPage (not relevant — different page natures)
- Add keyboard shortcuts for navigating list ↔ panel
- Add animations for panel appearance
- Add a "selected" visual indicator on the clicked task in the list/card (Today doesn't have this either)
- Tablet-specific behavior

## Acceptance Criteria

### Layout
- [ ] At 1440px on `/brain`: page renders with left content area + right TaskDetailPanel aside (`w-[380px]`, border-left)
- [ ] At 1024px on `/brain`: same 3-pane shape, no horizontal scroll
- [ ] At 375px on `/brain`: layout unchanged from current — no aside, full-width content

### Functionality
- [ ] **Card view click on desktop**: clicking any TaskCard sets `selectedTask`; right panel populates with that task
- [ ] **List view click on desktop**: clicking any TaskRow (in Inbox / Important / Someday / Completed sections) sets `selectedTask`; right panel populates
- [ ] **Empty state**: when `selectedTask` is null on desktop, right panel shows "Select a task" empty state (existing TaskDetailPanel behavior)
- [ ] **Mobile click unchanged**: at 375px, clicking a task in either view still opens `TaskDetailSheet` via `openTask` (which routes through AppShell's mobile branch)
- [ ] **Stale clear**: deleting or completing the selected task on desktop causes the panel to revert to empty state (use `store.tasks.find(t => t.id === selectedTask?.id) ?? null` defensive lookup like TodayPage does)
- [ ] **Route change clears selection**: navigating away from /brain and back shows empty panel (AppShell already handles this via `useEffect` on `location.pathname`)

### Quality
- [ ] No regression on TodayPage (shared component, shared OutletContext)
- [ ] No horizontal scroll at any width ≥1024px on /brain
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| "Today처럼" = same right panel | R1: clarified scope across page (BrainDump only? + Matrix?) and view (card / list / both) | BrainDump only, both views |
| Need to extend Matrix too | R1: explicitly excluded | Out of scope — Matrix has dnd; defer |
| Should add visual selection indicator on clicked task | Not asked, inferred from "Today처럼" — Today doesn't have one either | No indicator (parity with Today) |

## Technical Context

### Files Affected (single file)
- `src/pages/BrainDumpPage.tsx` — the only file touched

### Pattern to mirror (from TodayPage.tsx:91-115)
```tsx
if (isDesktop) {
  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="ul-scroll flex min-w-0 flex-1 flex-col overflow-y-auto pb-8">
        {/* existing left content: filter chips header + page header + quickAddInline + view toggle + cards/list */}
      </div>
      <aside className="hidden w-[380px] shrink-0 border-l border-[var(--hair)] bg-paper lg:block">
        <TaskDetailPanel
          task={store.tasks.find((t) => t.id === selectedTask?.id) ?? null}
          onClose={() => setSelectedTask(null)}
          onFocus={startFocus}
          variant="inline"
        />
      </aside>
    </div>
  )
}
```

### OutletContext fields needed (already exposed)
- `openTask` — already used; routes to sheet on mobile / sets selectedTask on desktop (handled by AppShell)
- `isDesktop` — already destructured
- `selectedTask`, `setSelectedTask` — currently NOT destructured by BrainDumpPage; add them
- `startFocus` — currently NOT destructured by BrainDumpPage; add for the panel's "Start" button

### Verification anchors
- Mobile: AppShell's `openTask` (line 43-49) checks `isDesktop` and routes to `setDetailTask` (sheet) on mobile; this code path is unchanged
- Desktop: same `openTask` calls `setSelectedTask` which BrainDump will now consume

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| BrainDumpPage | view | card view + list view | renders task list, calls `openTask` |
| TaskDetailPanel (inline) | component (existing) | task, onClose, onFocus, variant | reused from TodayPage pattern |
| selectedTask | state | Task \| null | lives in AppShell, threaded via OutletContext |
| openTask | callback | (task) => mobile sheet OR desktop selection | already polymorphic via isDesktop branch in AppShell |

## Ontology Convergence

| Round | Entity Count | New | Stable | Stability Ratio |
|-------|-------------|-----|--------|----------------|
| 1 | 4 | 4 | - | N/A (initial) |

Single-round interview — converged immediately because all entities are reused from the just-shipped responsive-desktop work.
