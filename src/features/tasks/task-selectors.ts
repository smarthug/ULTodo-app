import { quadrantRank } from '@/data/quadrants'
import type { Settings } from '@/features/settings/settings-types'
import type { ProjectFilterId, Task, TaskFilters } from './task-types'

export function filterTasks(tasks: Task[], filters: TaskFilters) {
  const search = filters.search?.trim().toLowerCase()
  return tasks.filter((task) => {
    if (filters.projectId && filters.projectId !== 'all' && task.projectId !== filters.projectId) return false
    if (filters.tagIds?.length && !filters.tagIds.some((tagId) => task.tagIds.includes(tagId))) return false
    if (filters.quadrant !== undefined && task.quadrant !== filters.quadrant) return false
    if (filters.focus !== undefined && task.focus !== filters.focus) return false
    if (filters.done !== undefined && task.done !== filters.done) return false
    if (filters.inbox && task.quadrant !== null) return false
    if (search && !task.title.toLowerCase().includes(search) && !task.note.toLowerCase().includes(search)) return false
    return true
  })
}

export function matchesProject(task: Task, projectId: ProjectFilterId) {
  return projectId === 'all' || task.projectId === projectId
}

const newest = (a?: string, b?: string) => (b ?? '').localeCompare(a ?? '')

export function compareTodayTasks(a: Task, b: Task) {
  const quadrant = quadrantRank(a.quadrant) - quadrantRank(b.quadrant)
  if (quadrant !== 0) return quadrant
  const updated = newest(a.updatedAt, b.updatedAt)
  if (updated !== 0) return updated
  return newest(a.createdAt, b.createdAt)
}

export function selectTodayTasks(tasks: Task[], settings: Pick<Settings, 'todayCount'>) {
  const open = tasks.filter((task) => !task.done)
  const focused = open.filter((task) => task.focus).sort(compareTodayTasks)
  const focusedIds = new Set(focused.map((task) => task.id))
  const fill = open
    .filter((task) => !focusedIds.has(task.id) && task.quadrant === 'ui')
    .sort((a, b) => newest(a.updatedAt, b.updatedAt) || newest(a.createdAt, b.createdAt))
  return [...focused, ...fill].slice(0, settings.todayCount)
}

export function groupBrainDump(tasks: Task[]) {
  const groups = { inbox: [] as Task[], important: [] as Task[], someday: [] as Task[], done: [] as Task[] }
  tasks.forEach((task) => {
    if (task.done) groups.done.push(task)
    else if (task.quadrant === null) groups.inbox.push(task)
    else if (task.quadrant === 'ui' || task.quadrant === 'nui') groups.important.push(task)
    else groups.someday.push(task)
  })
  return groups
}
