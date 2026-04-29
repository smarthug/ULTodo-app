---
name: quickadd-priority-4buttons
description: Reduce QuickAddForm Priority section from 5 buttons (Inbox + 4 quadrants) to 4 toggleable quadrant buttons; unselected = Inbox
type: brownfield
status: PASSED
ambiguity: 0.08
threshold: 0.20
generated: 2026-04-29
rounds: 1
---

# Deep Interview Spec: QuickAdd Priority 4-button Toggle

## Goal
Replace the current 5-button Priority section in `QuickAddForm` (Inbox + Q1-Q4) with 4 toggleable quadrant buttons (Q1-Q4 only). Unselected state means `quadrant=null` which is treated as Inbox by the existing task store. Clicking the currently-selected button deselects it.

## Constraints
- **Single file change**: `src/components/task/QuickAddForm.tsx` only.
- **No store/data changes**: `quadrant=null` continues to mean Inbox (existing semantics in selectors).
- **Toggle behavior**: clicking the active button deselects (sets `quadrant=null`).
- **Hint text**: small inline hint near "Priority" label communicates "미선택 = Inbox" UX (e.g., `Priority · (unselected → Inbox)`).
- **Both modes covered**: new task creation AND editing existing task. For an existing task already in Q2, the Q2 button shows selected; clicking it deselects → Inbox.

## Non-Goals
- Don't change `TaskDetailPanel`'s "Move without dragging" 5-button section (different UX, used for explicit move).
- Don't change `task-store` or selectors logic.
- Don't add i18n keys for the new hint text (consistent with existing hardcoded English in QuickAddForm).
- Don't add visual confirmation/animation for deselection.

## Acceptance Criteria
- [ ] Priority section renders exactly 4 buttons (Q1-Q4 from `QLIST`)
- [ ] No "Inbox" button in Priority section
- [ ] Hint text near "Priority" label communicates unselected = Inbox
- [ ] Clicking an unselected quadrant button selects it (highlight border-accent)
- [ ] Clicking the currently-selected quadrant deselects it (quadrant becomes null)
- [ ] New task default: no selection visible (all 4 buttons in unselected state)
- [ ] Editing existing task with quadrant set: that quadrant button shows selected
- [ ] Submit with quadrant=null creates/saves task with quadrant=null (Inbox)
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Technical Context
Current code at `src/components/task/QuickAddForm.tsx:122-141`:
```tsx
<div className="grid grid-cols-2 gap-2">
  <button ... onClick={() => setQuadrant(null)} ...>Inbox<br/><span>Untriaged</span></button>
  {QLIST.map((q) => <button ... onClick={() => setQuadrant(q.id)}>{q.label}<br/><span>{q.hint}</span></button>)}
</div>
```

Change to:
```tsx
<div className="grid grid-cols-2 gap-2">
  {QLIST.map((q) => (
    <button
      key={q.id}
      type="button"
      onClick={() => setQuadrant((prev) => (prev === q.id ? null : q.id))}
      className={`rounded-2xl border p-3 text-left text-xs ${quadrant === q.id ? 'border-accent bg-accent-soft' : 'border-[var(--hair)] bg-paper-2'}`}
    >
      {q.label}<br/><span className="text-ink-3">{q.hint}</span>
    </button>
  ))}
</div>
```
Plus update the label line to include hint: `Priority · unselected → Inbox`.

## Ontology
| Entity | Type | Notes |
|--------|------|-------|
| QuickAddForm | component | only file modified |
| Priority section | UI region | 5 → 4 buttons |
| quadrant state | local state | `QuadrantId \| null`; null = Inbox |
| Toggle behavior | interaction | click selected → deselects |
