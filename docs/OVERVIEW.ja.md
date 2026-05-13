# ULTodo — 概要

> **選ぶものを減らし、深く終わらせる。**
>
> ULTodo は、アイゼンハワー・マトリクス、ポモドーロタイマー、今日の集中リスト、そしてすばやいブレインダンプをひとつの流れにまとめた、集中優先の生産性アプリです。オフラインで動作し、日々の意思決定を軽くすることを目的にしています。

---

## ULTodo とは

ULTodo は、ひとつの前提から設計された個人向けタスク管理アプリです。**多くの TODO アプリは「もっと記録する」ことを最適化しますが、本当に詰まりやすいのは「何を選ぶか」です。**

一般的なタスク管理ツールは、締切、依存関係、プロジェクト、タグ、コメント、共有などを積み上げがちです。ULTodo はそれとは逆に、毎日の実行に必要な少数のワークフローを意見のある形で組み込みます。

1. **Brain Dump** — 頭の中のことをすばやく外に出す。
2. **Eisenhower Matrix** — 取り出したタスクを 4 つの優先度領域へ分類する。
3. **Today** — 今日だけに集中する少数のタスクを選ぶ。
4. **Pomodoro** — 静かな時間ブロックで実行する。
5. **Settings** — 集中数、タイマー時間、言語、プロジェクト分類を調整する。

小さな画面では 430px 幅のスマートフォンフレームに収まり、デスクトップではサイドバー付きの複数カラムレイアウトに広がります。データは端末上の IndexedDB に保存され、アカウント、同期、サーバーは必要ありません。

---

## 主な機能

### 1. Today Focus

今日取り組む優先タスクを 1〜7 件の短いリストとして表示します。進捗バーで完了状況が分かり、最初のタスクは「次にやること」として視覚的に強調されます。タスクを開くと詳細パネルが表示され、集中対象への追加、完了、移動、編集、削除ができます。

> 「選ぶものを減らし、深く終わらせる。」

### 2. Brain Dump

思いついたことを摩擦なく入れられる受け皿です。表示モードは 2 種類あります。

- **リスト表示**: Inbox、Important、Someday、Completed のセクションにグループ化
- **カード表示**: モバイルでは 1 カラム、デスクトップでは 3 カラムのグリッド

検索バーでタイトルやメモを絞り込めます。プロジェクトとタグのフィルターにより、必要な範囲だけを見ながら整理できます。

> 「頭の中のすべてを、邪魔なく外へ。」

### 3. Eisenhower Matrix

緊急度と重要度でタスクを分類するマトリクスです。モバイルでは 2×2 グリッド、デスクトップでは 4 カラムで表示されます。未分類タスクは下部の Inbox に残ります。

タスクはドラッグ＆ドロップで領域間を移動できます。タッチ操作とポインター操作の両方に対応し、小さな画面やアクセシビリティのために、タップしてボタンで移動する代替操作も用意されています。

分類は次の通りです。

- **Q1 — 緊急かつ重要** (`ui`): 今すぐやる
- **Q2 — 緊急ではないが重要** (`nui`): 計画する
- **Q3 — 緊急だが重要ではない** (`uni`): 任せる、軽く処理する
- **Q4 — 緊急でも重要でもない** (`nuni`): 捨てる、まとめて処理する
- **Inbox** (`null`): まだ分類していないバックログ

> 「優先順位を、手で動かせるものにする。」

### 4. Pomodoro Timer

集中時間と休憩時間を切り替えられるシンプルなタイマーです。モバイルでは 288px、デスクトップでは 384px の大きな円形インジケーターを表示します。集中時間は 5〜60 分、休憩時間は 1〜30 分の範囲で設定できます。操作は Reset / Start / Pause のみで、実行中の余計な判断を減らします。

> 「静かに実行する。」

### 5. Settings

設定画面では、毎日の実行ループに関わる項目を調整できます。

- **言語切り替え**: English ↔ Korean（i18next）
- **Today focus count**: 1〜7 件
- **Pomodoro**: 集中時間 5〜60 分、休憩時間 1〜30 分
- **Projects**: カスタムプロジェクトの作成、名前変更、アーカイブ、8 色のカラーパレット
- **Scope hint**: プロジェクトとタグのフィルターは上部のスコープシートに集約

---

## デザイン方針

| 原則 | ULTodo での意味 |
|---|---|
| **モバイルファースト、デスクトップも考慮** | 430px のスマートフォン UI が基準。デスクトップでは自然に広がるが、優先順位は変えない。 |
| **オフラインのみを標準にする** | すべて IndexedDB に保存。アカウント、同期、テレメトリーなし。飛行機の中でも使える。 |
| **一度にひとつの画面** | 入れ子のタブや複雑なモーダルを避ける。モバイルではシート、デスクトップではインラインパネル。 |
| **意見のある初期値、やさしい逃げ道** | Today は 3 件、Pomodoro は 25/5、未分類は Inbox。必要なら Settings で変えられる。 |
| **静かなタイポグラフィ** | 見た目はダッシュボードではなく紙に近い。見出し、本文、数字の役割を分ける。 |

---

## 技術スタック

| レイヤー | 採用技術 |
|---|---|
| ビルドツール | Vite 8 |
| UI フレームワーク | React 19 + TypeScript |
| スタイリング | Tailwind CSS v4 |
| アニメーション | Motion |
| ルーティング | React Router v7 |
| 状態管理 | React Context (`TaskStoreProvider`) |
| 永続化 | IndexedDB via `idb` |
| ドラッグ＆ドロップ | `@dnd-kit/core` |
| 国際化 | i18next + react-i18next（en, ko） |
| アイコン | Lucide React |
| テスト | Vitest + Testing Library + fake-indexeddb |

バックエンドはありません。Phase 1 はローカル専用の MVP です。

---

## アーキテクチャ概要

```text
src/
├── app/              # App, router, providers
├── components/       # AppShell, ナビゲーション, Matrix, filters など
├── pages/            # Today, BrainDump, Matrix, Pomodoro, Settings
├── features/         # task-store, task-types, selectors, settings types
├── db/               # IndexedDB bootstrap, client, repositories, schema
├── hooks/            # use-pomodoro, use-media-query
├── data/             # seed data, quadrants
├── i18n/             # i18next config + en/ko locales
└── lib/              # dates, ids, utilities
```

### レスポンシブ戦略

`useIsDesktop()` が `(min-width: 1024px)` を判定し、`AppShell` がモバイル用とデスクトップ用のレイアウトを切り替えます。

- **モバイル（1024px 未満）**: 430px の電話フレーム、BottomNav、下から開くシート
- **デスクトップ（1024px 以上）**: 左サイドバー、メイン領域、Today / Brain Dump では右側のタスク詳細パネル
- **タブレット（640〜1023px）**: モバイル UI を中央の電話フレームとして表示

### ドメインモデル

```ts
interface Task {
  id: string
  title: string
  note: string
  projectId: string
  tagIds: string[]
  quadrant: 'ui' | 'nui' | 'uni' | 'nuni' | null
  done: boolean
  focus: boolean
  estMin: number
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

interface Project {
  id: string
  name: string
  color: string
  order: number
  archived?: boolean
}

interface Tag {
  id: string
  name: string
  color: string
  order: number
}

interface Settings {
  language: 'en' | 'ko'
  todayCount: number
  pomodoroMinutes: number
  breakMinutes: number
  activeProjectId: string | 'all'
  activeTagIds: string[]
  brainView: 'list' | 'card'
}
```

---

## はじめ方

```bash
# インストール
npm install --legacy-peer-deps

# 開発サーバー
npm run dev

# 検証
npm run lint
npm test -- --run
npm run build
```

初回起動時には、既定のプロジェクト、タグ、サンプルタスクが IndexedDB に投入されます。以後はブラウザ内のローカルデータを読み込みます。データをリセットしたい場合は、ブラウザの DevTools から IndexedDB の `ultodo-local` データベースを削除して再読み込みしてください。

---

## プロジェクト状況

**Phase 1 — ローカル専用 MVP**（現在）

実装済み:

- 5 つのルート（Today、Brain Dump、Matrix、Pomodoro、Settings）
- ドラッグ＆ドロップによるマトリクス分類
- 集中 / 休憩を切り替えるポモドーロタイマー
- プロジェクトの作成、名前変更、アーカイブ
- Korean / English の言語切り替え
- デスクトップ向けレスポンシブレイアウト
- Inbox を含むアイゼンハワー・マトリクス運用

Phase 1 の対象外:

- カレンダー / タイムボクシング
- 認証 / クラウド同期
- 複数デバイス対応
- 高度な分析 / レポート
- ネイティブアプリ化
- 共同作業 / 共有
- 繰り返しタスク
- ファイル添付
- 通知

---

## ライセンスと帰属

単一ユーザー向けのデモプロジェクトです。ビジュアルリファレンスは Claude Design の初期エクスポートをもとに、Vite + React 19 + Tailwind v4 のプロダクション寄り構成へ移植されています。
