# ULTodo — 프로젝트 소개

> **덜 고르고, 더 깊이 끝낸다.**
>
> 아이젠하워 매트릭스 · 포모도로 타이머 · 오늘 집중 리스트 · 프릭션 없는 브레인덤프를 한 화면에 묶은 오프라인-퍼스트 생산성 앱.

---

## ULTodo가 뭔가요?

ULTodo는 단일 사용자용 생산성 웹 앱입니다. 한 가지 전제에서 출발했습니다 — **대부분의 todo 앱은 더 많이 담는 데 최적화되어 있지만, 정작 일을 끝내는 병목은 *덜 고르는* 데 있다.**

전형적인 task 매니저들이 점점 늘어나는 인박스 위에 마감일·의존성·프로젝트·태그·코멘트·공유 같은 기능을 쌓아 올리는 동안, ULTodo는 의도적으로 좁힌 몇 가지 워크플로우를 일상의 루프 안에 직접 박아 넣었습니다.

1. **Brain Dump** — 머릿속의 모든 걸 빠르게 꺼내기
2. **Eisenhower Matrix** — 캡처한 task를 4개 사분면 중 하나로 드래그 (또는 Inbox에 그대로 두기)
3. **Today** — 오늘 *하루치만* 작은 집중 리스트 (개수 조절 가능) 고르기
4. **Pomodoro** — 그 리스트를 조용한 타이머 단위로 실행
5. **Settings** — 집중 개수, 타이머 길이, 언어, 프로젝트 분류 체계 조정

작은 화면에서는 전체 앱이 430px 폰 프레임 안에 들어가고, 데스크탑(≥1024px)에서는 사이드바 + 멀티컬럼 레이아웃으로 펼쳐집니다. 데이터는 디바이스의 IndexedDB에 저장됩니다 — 계정 없음, 동기화 없음, 서버 없음.

---

## 주요 기능

### 1. Today (오늘 집중)
하루 우선 task 1~7개의 조절 가능한 짧은 리스트. 라이브 진행률 바가 완료율을 보여줍니다. 첫 번째 task는 시각적으로 강조되어 "다음에 할 일"임을 표시. 각 task의 `Start` 버튼은 그 task를 focus 주제로 미리 로드한 채 포모도로 타이머를 띄웁니다.

> *"덜 고르고, 더 깊이 끝낸다."*

### 2. Brain Dump (브레인 덤프)
프릭션 없는 캡처 인박스. 두 가지 view 모드:
- **List view**: 그룹 섹션 — Inbox / Important / Someday / Completed
- **Card view**: 모바일 1컬럼, 데스크탑 3컬럼 그리드

검색 바로 제목/노트 텍스트를 좁힙니다. 프로젝트·태그 필터로 view 범위를 좁힙니다. 같은 view에서 빠른 리뷰와 분류(triage) 둘 다 가능.

> *"머릿속에 있는 모든 것, 길을 막지 않게."*

### 3. Eisenhower Matrix (아이젠하워 매트릭스)
모바일에서는 2×2 그리드, 데스크탑에서는 4컬럼 한 줄로 표시되는 긴급성/중요성 사분면. 그 아래에 미분류 task를 담은 Inbox 스트립. 사분면 사이로 task를 드래그하면 우선도가 다시 매겨집니다. 터치/포인터 센서 모두 지원. 접근성과 작은 화면을 위해 탭→버튼 폴백 이동 흐름도 제공.

사분면:
- **Q1 — 긴급 & 중요** ("ui"): 지금 한다
- **Q2 — 비긴급 & 중요** ("nui"): 계획한다
- **Q3 — 긴급 & 비중요** ("uni"): 위임한다
- **Q4 — 비긴급 & 비중요** ("nuni"): 버리거나 묶는다
- **Inbox** (quadrant = null): 미분류 백로그

> *"우선순위를 물리적으로 느끼게."*

### 4. Pomodoro Timer (포모도로 타이머)
Focus / Break 듀얼 모드 타이머. 모바일 72px, 데스크탑 96px의 큰 원형 진행 표시기. 타이머 아래에 현재 focus task의 제목이 표시됩니다. 집중 시간(5~60분)과 휴식 시간(1~30분) 조절 가능. Reset / Start / Pause 컨트롤.

> *"조용한 실행."*

### 5. Settings (설정)
- **언어 토글**: English ↔ 한국어 (i18next)
- **Today 집중 개수**: 1~7
- **Pomodoro**: 집중 시간(5~60분), 휴식 시간(1~30분)
- **Projects**: 8색 팔레트로 사용자 정의 프로젝트 생성/이름 변경/보관(soft delete). 기본 `Personal` 프로젝트는 보관할 수 없음.
- **Scope hint**: 프로젝트·태그 필터는 상단 scope 시트에 (데스크탑은 필터 칩으로)

---

## 디자인 철학

| 원칙 | ULTodo에서의 의미 |
|---|---|
| **모바일 우선, 데스크탑은 부가** | 원래의 430px 폰 프레임 UI가 정본 레이아웃. 데스크탑은 그것을 사이드바 + 멀티컬럼 모양으로 펼치지만, 우선순위를 뒤집지는 않음. |
| **기본은 오프라인 전용** | IndexedDB가 모든 걸 저장. 계정 없음, 동기화 없음, 텔레메트리 없음. 비행기 안이나 터널에서도 동작. |
| **한 번에 한 화면** | 탭 안의 탭 없음, 모달 안의 모달 없음. 모바일에서는 시트가 위로 슬라이드, 데스크탑에서는 인라인 패널이 됨. |
| **의견 있는 기본값, 부드러운 탈출구** | Today는 기본 3개 집중 task. 포모도로는 기본 25/5분. Inbox가 기본 사분면. Settings에서 모두 바꿀 수 있지만, 바꿀 필요는 없음. |
| **조용한 타이포그래피** | 헤드라인은 Instrument Serif 이탤릭, 본문은 Geist, 숫자·라벨은 Geist Mono. 시각 언어는 *대시보드*가 아니라 *종이*. |

---

## 기술 스택

| 레이어 | 선택 |
|---|---|
| 빌드 도구 | Vite 8 |
| UI 프레임워크 | React 19 + TypeScript |
| 스타일 | Tailwind CSS v4 (인라인 `@theme` 토큰, 설정 파일 없음) |
| 애니메이션 | Motion (Framer Motion fork) |
| 라우팅 | React Router v7 |
| 상태 관리 | React Context (`TaskStoreProvider`) — 단일 글로벌 store |
| 영속성 | `idb`를 통한 IndexedDB |
| 드래그앤드롭 | `@dnd-kit/core` (포인터 + 터치 센서) |
| 국제화 | i18next + react-i18next (en, ko) |
| 아이콘 | Lucide React |
| 컴포넌트 variant | class-variance-authority |
| 테스트 | Vitest + Testing Library + fake-indexeddb |

백엔드 없음. Vite 외 빌드 단계 없음. gzip 후 npm 패키지 크기 600KB 미만.

---

## 아키텍처 개요

```
src/
├── app/              # App.tsx, router.tsx, providers.tsx
├── components/
│   ├── app-shell/    # AppShell (반응형 root), AppBar, BottomNav, Sidebar
│   ├── task/         # TaskCard, TaskRow, QuickAddForm, QuickAddSheet,
│   │                 #  TaskDetailPanel, TaskDetailSheet, TagChip, Checkbox
│   ├── matrix/       # MatrixQuadrant, MatrixTaskChip
│   ├── settings/     # FilterChips, FilterSheet, MenuSheet
│   ├── pomo/         # 포모도로 UI 부품
│   └── ui/           # Button, Card 프리미티브
├── pages/            # TodayPage, BrainDumpPage, MatrixPage, PomodoroPage, SettingsPage
├── features/
│   ├── tasks/        # task-store, task-types, task-selectors
│   └── settings/     # settings-types
├── db/               # bootstrap, client, repositories, schema (idb)
├── hooks/            # use-pomodoro, use-media-query
├── data/             # seed (PROJECTS, SEED_TAGS, SEED_TASKS), quadrants
├── i18n/             # i18next 설정 + en/ko 로케일 파일
├── lib/              # ids (makeId, slugify), dates, utils
└── styles/           # tokens.css (라이트/다크용 CSS 커스텀 프로퍼티)
```

### 반응형 전략

`AppShell` 안에서 단일 `useIsDesktop()` 훅(`(min-width: 1024px)`)이 `isDesktop` boolean을 만들어 냅니다. 셸은 완전히 분리된 두 레이아웃 중 하나를 렌더링합니다:

- **모바일 (<1024px)**: 430px 폰 프레임, BottomNav, 아래에서 슬라이드업 되는 모달 시트
- **데스크탑 (≥1024px)**: 풀폭을 Sidebar + 메인 콘텐츠 + (Today/BrainDump의 경우) 우측 TaskDetail 패널로 분할. 시트 없음 — 시트의 본문은 재사용 가능한 인라인 컴포넌트로 추출됨

태블릿 (640~1023px)은 폰 프레임을 가운데 정렬한 모바일 UI를 렌더링.

### 도메인 모델

```ts
interface Task {
  id: string
  title: string
  note: string
  projectId: string                // FK → Project.id
  tagIds: string[]                 // FK → Tag.id[]
  quadrant: 'ui' | 'nui' | 'uni' | 'nuni' | null  // null = Inbox
  done: boolean
  focus: boolean                   // Today 짧은 리스트의 멤버
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
  todayCount: number               // 1~7
  pomodoroMinutes: number          // 5~60
  breakMinutes: number             // 1~30
  activeProjectId: string | 'all'
  activeTagIds: string[]
  brainView: 'list' | 'card'
}
```

---

## 시작하기

```bash
# 설치
npm install

# 개발 (Vite dev server, http://localhost:5173)
npm run dev

# 검증
npm run lint
npm test -- --run
npm run build
```

브라우저에서 앱을 열면 첫 로드 시 기본 프로젝트(`Personal`, `ULTodo`, `Writing`, `Home & life`), 태그, 18개의 예제 task가 시드됩니다. 이후 로드는 IndexedDB에서 읽어옵니다.

로컬 데이터 리셋: DevTools → Application → IndexedDB → `ultodo` 데이터베이스 삭제 후 새로고침.

---

## 프로젝트 상태

**Phase 1 — 로컬 전용 MVP** *(현재)*

배포됨:
- 5개 라우트 모두 (Today, Brain Dump, Matrix, Pomodoro, Settings)
- 드래그앤드롭 매트릭스 분류
- Task 사전 로딩이 가능한 포모도로 타이머
- 컬러 팔레트 + 소프트 보관(archive) 지원하는 프로젝트 CRUD
- 한국어 / 영어 언어 토글
- 반응형 데스크탑 레이아웃 (사이드바 + Today 3-pane, 4컬럼 매트릭스, 3컬럼 브레인덤프 그리드)
- 4개 사분면 아이젠하워 매트릭스 (Inbox는 quadrant=null로 암묵적 처리)

**Phase 1 범위 외:**
- 캘린더 / 타임박싱
- 인증 / 클라우드 동기화
- 멀티 디바이스 지원
- 고급 분석 / 리포트
- 네이티브 패키징 (Tauri / Capacitor)
- 협업 / 공유
- 반복 task
- 파일 첨부
- 알림

---

## 라이선스 및 출처

단일 사용자 데모 프로젝트. 시각적 레퍼런스: 원본 Claude Design 익스포트를 production 형태의 Vite + React 19 + Tailwind v4 앱으로 포팅.
