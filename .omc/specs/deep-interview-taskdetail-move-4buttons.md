---
name: taskdetail-move-4buttons
description: Apply the 4-button toggleable Inbox-elimination pattern (already in QuickAddForm Priority) to TaskDetailPanel's "Move without dragging" section
type: brownfield
status: PASSED
ambiguity: 0.05
threshold: 0.20
generated: 2026-04-29
rounds: 1
---

# Spec: TaskDetailPanel Move section — 4-button toggle

## Goal
Mirror the previously-shipped QuickAddForm Priority pattern in `TaskDetailPanel`'s "Move without dragging" section: remove the "Inbox" button, leave 4 quadrant buttons, make them toggleable (clicking the currently-selected quadrant deselects it → `quadrant=null` → task moves to Inbox). Add hint "(unselected → Inbox)" near the section label.

## Constraints
- Single file change: `src/components/task/TaskDetailPanel.tsx`
- No store/data changes (the existing `move()` function already accepts `null` and `store.patchTask` handles it)
- Affects both sheet variant (mobile bottom sheet) and inline variant (desktop right panel) — same body markup is shared
- Existing toggle pattern from `QuickAddForm.tsx:128` is the reference

## Non-Goals
- Don't touch QuickAddForm (already done)
- Don't add animations
- Don't add a separate "move to Inbox" affordance — toggle behavior + hint text covers it

## Acceptance Criteria
- [ ] TaskDetailPanel "Move without dragging" section renders exactly 4 buttons (Q1–Q4 from QLIST)
- [ ] No "Inbox" button in this section
- [ ] Hint text "unselected → Inbox" near the section label
- [ ] Clicking the currently-selected quadrant button calls `move(null)` (deselects → moves to Inbox)
- [ ] Clicking an unselected quadrant button calls `move(q.id)`
- [ ] If task is in Inbox already (`task.quadrant === null`), all 4 buttons appear in unselected state
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Technical Reference
Current code at `TaskDetailPanel.tsx` lines around the move grid:
```tsx
<div className="grid grid-cols-2 gap-2">
  <Button variant="soft" onClick={() => move(null)}>Inbox</Button>
  {QLIST.map((q) => (
    <Button key={q.id} variant={task.quadrant === q.id ? 'default' : 'soft'} onClick={() => move(q.id)}>
      {q.label}
    </Button>
  ))}
</div>
```

Change to:
```tsx
<div className="grid grid-cols-2 gap-2">
  {QLIST.map((q) => (
    <Button
      key={q.id}
      variant={task.quadrant === q.id ? 'default' : 'soft'}
      onClick={() => move(task.quadrant === q.id ? null : q.id)}
    >
      {q.label}
    </Button>
  ))}
</div>
```
Plus update the section label to include the hint inline.
