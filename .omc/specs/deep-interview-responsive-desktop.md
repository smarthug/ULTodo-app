---
name: responsive-desktop
description: Add responsive desktop support to the existing mobile-only ULTodo app via multi-column layouts and sheet elimination
type: brownfield
status: PASSED
ambiguity: 0.065
threshold: 0.20
generated: 2026-04-28
---

# Deep Interview Spec: Responsive Desktop Support for ULTodo

## Metadata
- Interview ID: ulto-resp-desktop-2026-04-28
- Rounds: 5
- Final Ambiguity Score: 6.5%
- Type: brownfield
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.95 | 0.35 | 0.333 |
| Constraint Clarity | 0.95 | 0.25 | 0.238 |
| Success Criteria | 0.92 | 0.25 | 0.230 |
| Context Clarity | 0.90 | 0.15 | 0.135 |
| **Total Clarity** | | | **0.935** |
| **Ambiguity** | | | **0.065** |

## Goal

Convert the ULTodo app from a fixed 430px mobile-only layout into a **two-tier responsive app**: mobile/tablet (<1024px) keeps the existing UI unchanged, and desktop (≥1024px) gets a **per-page-customized multi-column layout** with a sidebar nav replacing BottomNav and **all four sheet modals replaced by inline panels/components**.

## Constraints

- **Mobile UI (375px) must remain visually and functionally unchanged.** No regressions allowed.
- **Tablet range (640–1023px) renders the mobile UI** (centered phone frame); not a separate breakpoint.
- **Desktop activation at ≥1024px only** — single Tailwind breakpoint (`lg:` or custom `desktop:`); no `md:`, no `xl:` differentiation.
- **No container queries** — viewport-based breakpoints only.
- **Mobile sheet components (`TaskDetailSheet`, `QuickAddSheet`, `FilterSheet`, `MenuSheet`) stay as-is for mobile.** Desktop renders inline alternatives via component branching.
- **No new data model.** Pomodoro session history, task tags, etc. — desktop uses only what already exists.
- **Existing IndexedDB storage, i18n (en/ko), dark mode tokens** must work identically on desktop.
- **Tailwind 4** stays the styling layer; no CSS-in-JS, no new component library.

## Non-Goals

- Tablet-specific intermediate layout (768–1023px stays mobile)
- Container queries / fluid layouts
- Keyboard shortcuts (e.g., `Cmd+K` palette, `j/k` nav, `n` for new task)
- WAI-ARIA accessibility audit
- Animations between viewport sizes or panel slide-in
- Visual regression testing baseline / screenshot diffing
- Pomodoro session history (no data model changes)
- Drag-and-drop enhancements for desktop
- Print stylesheet
- Browser support beyond what currently works

## Acceptance Criteria

### Layout
- [ ] **1440px desktop**: all 5 pages render correctly
  - [ ] **Today**: sidebar nav + task list + TaskDetail right panel (3-pane)
  - [ ] **Matrix**: 4 quadrants in a single row (replaces 2x2)
  - [ ] **BrainDump**: 3-column card grid
  - [ ] **Pomodoro**: timer centered, no layout change beyond removing the phone frame
  - [ ] **Settings**: single-column form, max-w-2xl
- [ ] **768px tablet**: falls back cleanly to mobile UI (centered phone frame)
- [ ] **375px mobile**: visually identical to current; no regressions

### Functionality
- [ ] All CRUD operations work on desktop after sheet removal (create / read / update / delete / complete)
- [ ] Sidebar nav switches between pages correctly (Today / BrainDump / Matrix / Pomodoro / Settings)
- [ ] **TaskDetail right panel**: shows empty state when no task selected
- [ ] **QuickAdd**: inline at top of task list (replaces bottom sheet)
- [ ] **Filter**: inline filter chips in page header (replaces FilterSheet)
- [ ] **Menu**: absorbed into sidebar nav (MenuSheet not rendered on desktop)
- [ ] Dark mode: token colors apply correctly on desktop

### Quality
- [ ] No horizontal scroll at any width ≥1024px
- [ ] Keyboard Tab navigation works; click interactions work

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| "Desktop = stretched mobile" | R1: showed 4 distinct desktop interpretations with previews | Multi-column responsive (option 2), not stretched single-column |
| "Need to support tablet" | R2: framed tablet as cost in code paths and QA surface | Tablet renders mobile UI — only 2 breakpoints |
| "Every page needs multi-column" | R3: surfaced page-character mismatch (Pomodoro is a timer) | Per-page customization: BrainDump=grid, Pomo=centered, Settings=wide form |
| "Sheets translate to desktop" | R4 CONTRARIAN: sheets are a mobile-screen-size artifact | Sheets eliminated on desktop; inline panels/components replace them |
| "Done = it looks right" | R5: pushed to define a testable QA checklist | Standard tier — layout + function + basic quality, no animations/a11y/shortcuts |

## Technical Context

### Tech Stack (verified from codebase)
- Vite + React 19.2.5 + TypeScript 6.0
- Tailwind CSS 4.2.4 (`@tailwindcss/vite`, inline `@theme` in `index.css`)
- class-variance-authority for variants, Lucide React icons, Motion for animations
- React Context API for state (`TaskStoreProvider`)
- IndexedDB for persistence

### Files Affected (anchor points)
- `src/components/app-shell/AppShell.tsx:33-34` — remove `max-w-[430px]` cap on `lg:`, add desktop frame
- `src/components/app-shell/AppBar.tsx` — desktop variant or hide
- `src/components/app-shell/BottomNav.tsx` — hide on `lg:`, replace with new `Sidebar` component
- `src/pages/TodayPage.tsx` — add right TaskDetail panel slot on `lg:`
- `src/pages/BrainDumpPage.tsx` — `grid-cols-1 lg:grid-cols-3` for cards
- `src/pages/MatrixPage.tsx:52` — `grid-cols-2 lg:grid-cols-4 lg:grid-rows-1`
- `src/pages/PomodoroPage.tsx` — center container only
- `src/pages/SettingsPage.tsx` — `max-w-2xl` desktop wrapper
- `src/components/task/TaskDetailSheet.tsx` — extract content into reusable `TaskDetailPanel` for inline desktop use
- `src/components/task/QuickAddSheet.tsx` — extract content into reusable `QuickAddInline` for desktop top-of-list
- `src/components/settings/FilterSheet.tsx` — extract chips into `FilterChips` for desktop header
- `src/components/settings/MenuSheet.tsx` — content moves into new `Sidebar` component for desktop
- `src/index.css` — extend `@theme` with explicit `lg` breakpoint at 1024px if needed
- New: `src/components/app-shell/Sidebar.tsx` — desktop sidebar nav

### Component Branching Pattern
```tsx
// AppShell renders one or the other based on viewport
{isDesktop ? <Sidebar /> : <BottomNav />}
{isDesktop ? <TaskDetailPanel /> : <TaskDetailSheet />}
```
Detection via `useMediaQuery('(min-width: 1024px)')` hook OR pure CSS `hidden lg:flex` / `lg:hidden` for static elements.

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Mobile UI | view layer | viewport <1024px, max-w-430 phone frame | unchanged from current |
| Desktop UI | view layer | viewport ≥1024px, full-width multi-column | new |
| Breakpoint (1024px) | config | single threshold | divides Mobile UI from Desktop UI |
| Tablet treatment | policy | 640–1023px → renders Mobile UI | falls back to Mobile UI |
| Sidebar Nav | component (new) | nav items, FAB, branding | replaces BottomNav on Desktop UI |
| Page | concept | Today / BrainDump / Matrix / Pomodoro / Settings | each has mobile + desktop variant |
| Multi-column Layout | pattern | grid/flex with lg: prefixes | applied per-page on Desktop UI |
| Detail Panel (inline) | component (new) | right pane, empty-state | replaces TaskDetailSheet on Desktop UI |
| QuickAdd Inline | component (new) | top-of-list input | replaces QuickAddSheet on Desktop UI |
| Filter Chips | component (new) | inline header chips | replaces FilterSheet on Desktop UI |
| BrainDump grid | layout | 1→3 columns at lg: | per-page strategy |
| Pomodoro centered | layout | unchanged | per-page strategy |
| Settings wide form | layout | max-w-2xl single column | per-page strategy |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 6 | 6 | - | - | N/A |
| 2 | 8 | 2 | 0 | 6 | 75% |
| 3 | 11 | 3 | 0 | 8 | 73% |
| 4 | 13 | 3 (made explicit) | 0 | 10 | 85% |
| 5 | 13 | 0 | 0 | 13 | **100%** |

**Convergence reached at Round 5** — the same 13 entities appeared with no changes; the domain model is stable.

## Interview Transcript

<details>
<summary>Full Q&A (5 rounds)</summary>

### Round 1 — Goal Clarity
**Q:** 데스크탑에서 이 앱이 어떤 모습이길 원하세요? (4 visual previews: phone frame extended / responsive multi-column / full desktop redesign / unsure)
**A:** 반응형 멀티컬럼 (Recommended) — 사이드바 네비, Today=리스트+디테일, Matrix=4열, 모바일 그대로 유지
**Ambiguity after:** 46% (Goal 0.7, Constraints 0.5, Criteria 0.2, Context 0.8)

### Round 2 — Constraints (Breakpoint Strategy)
**Q:** 모바일과 데스크탑 사이의 전환 전략을 어떻게 가져갈까요?
**A:** 2단계: 모바일 ↔ 데스크탑 (≥1024px). 태블릿은 모바일 UI 그대로.
**Ambiguity after:** 33% (Goal 0.75, Constraints 0.80, Criteria 0.30, Context 0.85)

### Round 3 — Goal Clarity (Per-page Strategy)
**Q:** BrainDump, Pomodoro, Settings의 데스크탑 처리 전략은?
**A:** 페이지별 맞춤 (Recommended) — BrainDump=그리드, Pomo=중앙, Settings=넓은 폼
**Ambiguity after:** 29% (Goal 0.88, Constraints 0.80, Criteria 0.30, Context 0.85)

### Round 4 — CONTRARIAN MODE (Sheet Behavior)
**Q:** 데스크탑에서 4개 시트는 어떻게 동작? (challenge: 시트는 모바일 화면-크기 제약의 산물 — 데스크탑에서도 유지할 이유?)
**A:** 시트 제거/인라인화 (Recommended) — TaskDetail=우측 패널, QuickAdd=인라인 입력, Filter=인라인 칩, Menu=사이드바 흡수
**Ambiguity after:** 24% (Goal 0.92, Constraints 0.92, Criteria 0.30, Context 0.88)

### Round 5 — Success Criteria
**Q:** 완료 기준을 어느 수준으로?
**A:** 표준 (Recommended) — 1440/768/375 3-사이즈 검증, 다크모드 동일 적용, 시트 제거 후 CRUD, 가로스크롤 없음, 키보드 Tab 동작. 애니메이션/a11y 감사/단축키 제외.
**Ambiguity after:** 6.5% — **threshold passed**

</details>
