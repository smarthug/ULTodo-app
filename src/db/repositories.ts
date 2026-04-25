import { DEFAULT_SETTINGS, type Settings } from '@/features/settings/settings-types'
import type { Project, Tag, Task, TaskDraft } from '@/features/tasks/task-types'
import { nowIso } from '@/lib/dates'
import { makeId, slugify } from '@/lib/ids'
import { getDb } from './client'

export async function readAll() {
  const db = await getDb()
  const [tasks, projects, tags, settings] = await Promise.all([
    db.getAll('tasks'),
    db.getAll('projects'),
    db.getAll('tags'),
    db.get('settings', 'default'),
  ])
  return {
    tasks: tasks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    projects: projects.filter((p) => p.id !== 'all').sort((a, b) => a.order - b.order),
    tags: tags.sort((a, b) => a.order - b.order),
    settings: settings ?? DEFAULT_SETTINGS,
  }
}

export async function createTask(draft: TaskDraft) {
  const db = await getDb()
  const at = nowIso()
  const task: Task = {
    id: makeId('task'),
    title: draft.title.trim() || 'Untitled',
    note: draft.note ?? '',
    projectId: draft.projectId,
    tagIds: draft.tagIds ?? [],
    quadrant: draft.quadrant ?? null,
    done: false,
    focus: draft.focus ?? false,
    estMin: draft.estMin ?? 15,
    createdAt: at,
    updatedAt: at,
    completedAt: null,
  }
  await db.put('tasks', task)
  return task
}

export async function updateTask(id: string, patch: Partial<Task>) {
  const db = await getDb()
  const current = await db.get('tasks', id)
  if (!current) throw new Error(`Task ${id} not found`)
  const next: Task = { ...current, ...patch, id, updatedAt: nowIso() }
  if (patch.done === true && !current.done) next.completedAt = nowIso()
  if (patch.done === false) next.completedAt = null
  await db.put('tasks', next)
  return next
}

export async function deleteTask(id: string) {
  const db = await getDb()
  await db.delete('tasks', id)
}

export async function createTag(name: string) {
  const db = await getDb()
  const id = slugify(name)
  if (!id) throw new Error('Tag name required')
  const existing = await db.get('tags', id)
  if (existing) return existing
  const tags = await db.getAll('tags')
  const tag: Tag = { id, name: name.trim(), color: '#6B6459', order: tags.length + 1 }
  await db.put('tags', tag)
  return tag
}

export async function patchSettings(patch: Partial<Settings>) {
  const db = await getDb()
  const current = (await db.get('settings', 'default')) ?? DEFAULT_SETTINGS
  const next: Settings = { ...current, ...patch, id: 'default' }
  await db.put('settings', next)
  return next
}

export async function replaceProject(project: Project) {
  if (project.id === 'all') throw new Error('The all sentinel must not be persisted as a project')
  const db = await getDb()
  await db.put('projects', project)
  return project
}
