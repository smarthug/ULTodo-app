import type { DBSchema } from 'idb'
import type { Settings } from '@/features/settings/settings-types'
import type { Project, Tag, Task } from '@/features/tasks/task-types'

export interface MetaRecord { key: string; value: string | number | boolean }
export interface PomodoroSession {
  id: string
  taskId?: string
  mode: 'focus' | 'break'
  plannedSeconds: number
  remainingSeconds: number
  status: 'idle' | 'running' | 'paused' | 'completed'
  startedAt?: string
  endedAt?: string
}

export interface ULTodoDB extends DBSchema {
  tasks: { key: string; value: Task; indexes: { projectId: string; quadrant: string; done: number; focus: number; updatedAt: string } }
  projects: { key: string; value: Project; indexes: { order: number; archived: number } }
  tags: { key: string; value: Tag; indexes: { name: string; order: number } }
  settings: { key: string; value: Settings }
  pomodoroSessions: { key: string; value: PomodoroSession; indexes: { taskId: string; startedAt: string; status: string } }
  meta: { key: string; value: MetaRecord }
}

export const DB_NAME = 'ultodo-local'
export const DB_VERSION = 1
export const SEED_VERSION = 1
