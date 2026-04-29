---
name: pomodoro-decouple
description: Decouple PomodoroPage from the task system — remove Start-from-task entry points, task title display, and the startFocus/onFocus prop chain
type: brownfield
status: PASSED
ambiguity: 0.08
threshold: 0.20
generated: 2026-04-29
rounds: 1
---

# Spec: Pomodoro / Task Decoupling

## Goal
Make the Pomodoro page a pure standalone timer — no awareness of tasks, no entry points from task UIs that pre-load a focus subject. The "Today focus" system (the `task.focus` flag and the Today shortlist) is unrelated to Pomodoro and must remain untouched.

## Constraints
- Pomodoro page itself stays (route `/pomo`, sidebar/bottomnav `Focus` link unchanged)
- `Task.focus` field stays — it is the Today shortlist marker, not a Pomodoro flag
- `TaskDetailPanel` "Focus" button stays — it toggles Today membership, not Pomodoro
- All changes are removals/simplifications; no new files

## Non-Goals
- Don't rename "Focus" anywhere (no i18n changes)
- Don't remove the Pomodoro page or its route
- Don't change Today shortlist selection logic
- Don't change Pomodoro mode toggle or timer durations

## Acceptance Criteria
- [ ] TodayPage TaskCard no longer renders the bottom-right `Start` button overlay
- [ ] TaskDetailPanel action grid changes from 3-column (Focus/Done/Start) to 2-column (Focus/Done)
- [ ] TaskDetailPanel `onFocus` prop is removed; callers (TaskDetailSheet, BrainDumpPage, TodayPage) no longer pass it
- [ ] `AppShell.startFocus` function removed; `OutletContext.startFocus` field removed
- [ ] PomodoroPage no longer reads `location.state.taskId`
- [ ] PomodoroPage no longer displays a task title under the timer (replaced with a quiet placeholder or removed entirely — the existing "Quiet execution." headline already covers the "what is this page" question)
- [ ] PomodoroPage no longer imports `useLocation` or `useTaskStore` if neither is needed afterwards
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Mobile and desktop both work; navigating to /pomo from sidebar/bottomnav still shows the timer

## Files Affected
- `src/pages/TodayPage.tsx` — remove `Start` button overlay in the today list, drop `startFocus` from OutletContext destructure, drop `Play` icon import if unused
- `src/components/task/TaskDetailPanel.tsx` — remove `onFocus` prop, change action grid to 2 cols, drop `Play` icon import if unused
- `src/components/task/TaskDetailSheet.tsx` — drop `onFocus` prop and pass-through
- `src/components/app-shell/AppShell.tsx` — remove `startFocus` function, remove from `OutletContext` type and provider value, drop `Task` import if unused after
- `src/pages/PomodoroPage.tsx` — drop `useLocation`, drop `useTaskStore` if not needed, drop the task lookup, drop the `<p>` line that renders `task?.title`
- `src/pages/BrainDumpPage.tsx` — drop `startFocus` from OutletContext destructure, drop `onFocus` from `<TaskDetailPanel>` call
