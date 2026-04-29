---
name: project-crud
description: Add Projects management section to SettingsPage with create, rename, archive (soft-delete) operations, surfacing the missing project-creation capability
type: brownfield
status: PASSED
ambiguity: 0.158
threshold: 0.20
generated: 2026-04-29
rounds: 2
---

# Deep Interview Spec: Project CRUD in Settings

## Goal
Add a `Projects` Card section to `SettingsPage` that lets the user **create, rename, and archive** custom projects. New projects appear automatically in `FilterChips`, `FilterSheet`, and the `QuickAddForm` project dropdown (no changes to those — they already iterate `store.projects`). Archived projects disappear from those lists but their tasks remain intact, retaining `projectId` for traceability.

## Constraints

- **Single new UI surface**: SettingsPage `Projects` Card. Do NOT add inline create UI to FilterChips, FilterSheet, or QuickAddForm.
- **Soft delete only**: archive via `archived=true` flag. No hard delete. The `Project.archived?: boolean` field already exists in the type — leverage it.
- **The `personal` seed project cannot be archived.** It is the fallback for new tasks. Block the archive button (or hide it) for `id === 'personal'`.
- **The `all` sentinel must never appear in this UI** (it is a filter pseudo-project, not a real one). Existing repository code already enforces this in `replaceProject`.
- **Color picker**: predefined palette of 6–8 token-friendly swatches (no free hex input). Pick from existing project color values + a few new ones to match the visual language. Auto-pick first unused swatch as default.
- **Edit scope**: rename (name) + recolor (color). Order is auto-managed (append to end on create); not user-editable.
- **Auto-select on create**: setting `activeProjectId` to the newly created project's id immediately after create. Reduces friction of "create then select".
- **ID generation**: `crypto.randomUUID()` (matches what `createTask` likely uses) OR a slug from name with collision suffix — pick whichever matches existing pattern in `repositories.ts`.
- **Filtering**: `FilterChips`, `FilterSheet`, and `QuickAddForm` project dropdown must filter out `archived === true` projects. Today's task list / matrix / brain dump rendering does NOT need to filter — tasks belonging to archived projects still show up; they just lose their colored project badge fallback gracefully.
- **Mobile + desktop both supported**: SettingsPage is responsive (just shipped `lg:max-w-2xl`); the new Card works at all widths.
- **i18n**: Add Korean translations for new strings (`settings.projects.*`).

## Non-Goals

- Inline "+ New" in FilterChips / FilterSheet / QuickAddForm (out of scope per Round 1)
- Hard delete with cascade or task reassignment
- Drag-and-drop reordering of projects
- Project icons (only color)
- Bulk archive / unarchive
- Unarchive UI (archived projects are out of sight; user can manually flip flag in IndexedDB if needed — explicit non-goal for v1)
- Project description / notes field
- Cross-project task move UI changes
- Sharing/collaboration (single user app)

## Acceptance Criteria

### Backend
- [ ] `src/db/repositories.ts` exports `createProject(name: string, color: string): Promise<Project>`
- [ ] `src/db/repositories.ts` exports `archiveProject(id: string): Promise<Project>` that sets `archived: true`
- [ ] `createProject` rejects if `name` is empty/whitespace
- [ ] `createProject` rejects if `id === 'all'` collision (use new UUID, never reuse 'all')
- [ ] `archiveProject` rejects if `id === 'personal'` or `id === 'all'`
- [ ] New project gets `order = max(existing.order) + 1`

### Store
- [ ] `useTaskStore` exposes `addProject(name, color): Promise<Project>` — calls `createProject`, reloads, returns project
- [ ] `useTaskStore` exposes `archiveProject(id): Promise<void>` — calls `archiveProject` repo fn, reloads
- [ ] `useTaskStore` exposes `renameProject(id, patch): Promise<Project>` — calls `replaceProject` with merged fields, reloads
- [ ] After `addProject`, store's `settings.activeProjectId` is set to the new project id (auto-select)

### UI — SettingsPage
- [ ] New `Projects` Card rendered in SettingsPage (between Pomodoro and the Scope hint, or wherever fits)
- [ ] Card lists current non-archived projects with: color dot · name · [Edit] · [Archive] buttons
- [ ] `personal` project shows but its [Archive] button is hidden or disabled
- [ ] [Edit] toggles inline rename input + color swatches; Save / Cancel
- [ ] [+ New project] button at bottom expands inline form: name input + color swatch picker + Add / Cancel
- [ ] Empty name on create is rejected (button disabled or no-op)
- [ ] After creating, the new project appears in the list AND gets selected as the active filter

### Filtering / Integration
- [ ] `FilterChips` (both stacked and inline layouts) filters out `archived === true` projects from the list
- [ ] `FilterSheet` filters out archived projects
- [ ] `QuickAddForm` project dropdown filters out archived projects (it already does `project.id !== 'all'` — extend with `!archived`)
- [ ] Existing tasks belonging to an archived project still render correctly elsewhere (no console errors, project name lookup either resolves or gracefully falls back)

### Quality
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Mobile (375px) and desktop (1024+px) both work — SettingsPage already responsive
- [ ] i18n keys added: `settings.projects` (eyebrow), `settings.projects.hint`, `settings.projects.add`, `settings.projects.namePlaceholder`, `settings.projects.color`, `settings.projects.cancel`, `settings.projects.save`, `settings.projects.archive`, `settings.projects.edit` — Korean translations included

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Hard delete is fine | R2: tasks reference projectId — orphaning is bad | Archive (soft delete) — preserves data |
| Inline "+ New" in QuickAddForm is convenient | R1: native select dropdown can't show modal cleanly | Confined to Settings, single management surface |
| Free hex color picker | Inferred — adds complexity without value | Predefined palette (6–8 swatches) |
| Personal project can be archived | Inferred — would break new-task default | Block archive on `id === 'personal'` |

## Technical Context

### Existing files to read/modify
- `src/db/repositories.ts` (lines 78-95 for `replaceProject`) — add `createProject`, `archiveProject`
- `src/features/tasks/task-store.tsx` (lines 8-21 for `TaskStoreValue`) — add 3 new methods
- `src/features/tasks/task-types.ts` — `Project` already has `archived?: boolean`, `order: number`
- `src/db/bootstrap.ts:11-13` — seeds projects from `PROJECTS` constant; check that constant for color palette inspiration
- `src/data/projects.ts` (likely) — existing project seed data, color palette source
- `src/pages/SettingsPage.tsx` — add new Card section
- `src/components/settings/FilterChips.tsx` — add archived filter
- `src/components/settings/FilterSheet.tsx` — add archived filter
- `src/components/task/QuickAddForm.tsx` — add archived filter to projectOptions useMemo
- `src/i18n/locales/en.json` + `ko.json` — new keys

### Color palette (proposed)
Use existing project colors as baseline, extend with 4–6 more in similar warm/muted ULTodo aesthetic. Concrete proposal (verify against tokens.css palette):
- `#C76B2A` (existing accent orange)
- `#8B4513` (existing dark brown)
- `#5B7C5A` (sage green)
- `#3D5A6C` (slate blue)
- `#8B5A8C` (muted purple)
- `#A8463F` (terracotta red)
- `#6B6B6B` (neutral gray)
- `#D4A574` (sand)

Final palette to be confirmed against existing tokens.css and PROJECTS seed data during implementation.

## Ontology

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Project | core domain (existing) | id, name, color, order, archived? | Task.projectId references Project.id |
| addProject | store action (NEW) | (name, color) → Project | calls createProject + reload + auto-select |
| archiveProject | store action (NEW) | (id) → void | sets archived=true; blocked for 'personal' |
| renameProject | store action (NEW) | (id, patch) → Project | calls replaceProject |
| Projects Card | UI section (NEW) | list + inline create/edit forms | lives in SettingsPage |
| Color palette | constant (NEW) | string[] | drives swatch picker |

## Ontology Convergence

| Round | Entity Count | Stable | Stability Ratio |
|-------|-------------|--------|----------------|
| 1 | 4 (Project, SettingsPage, FilterSheet, QuickAddForm) | - | N/A |
| 2 | 6 (added Archive policy, Color palette) | 4 | 67% |

Domain stable enough for implementation — additional entities are implementation details (component names) not new domain concepts.
