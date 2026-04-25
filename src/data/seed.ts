import type { Project, Tag, Task } from '@/features/tasks/task-types'

export const PROJECTS: Project[] = [
  { id: 'personal', name: 'Personal', color: '#C76B2A', order: 1 },
  { id: 'ultodo', name: 'ULTodo', color: '#4F6B3C', order: 2 },
  { id: 'writing', name: 'Writing', color: '#3A5BC7', order: 3 },
  { id: 'home', name: 'Home & life', color: '#8B5A3C', order: 4 },
]

export const SEED_TAGS: Tag[] = [
  { id: 'deep', name: 'deep work', color: '#C76B2A', order: 1 },
  { id: 'quick', name: 'quick', color: '#4F6B3C', order: 2 },
  { id: 'call', name: 'calls', color: '#3A5BC7', order: 3 },
  { id: 'writing', name: 'writing', color: '#8B5A3C', order: 4 },
  { id: 'review', name: 'review', color: '#6B4B8B', order: 5 },
  { id: 'errand', name: 'errands', color: '#6B6459', order: 6 },
]

const base = '2026-04-24T08:00:00.000Z'
const stamp = (minutes: number) => new Date(new Date(base).getTime() + minutes * 60_000).toISOString()

export const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Ship the Matrix drag-and-drop', projectId: 'ultodo', tagIds: ['deep'], quadrant: 'ui', done: false, focus: true, estMin: 50, note: 'Spring physics, predictive swap.', createdAt: stamp(1), updatedAt: stamp(40) },
  { id: 't2', title: 'Reply to Anna about the offsite', projectId: 'personal', tagIds: ['call', 'quick'], quadrant: 'ui', done: false, focus: true, estMin: 10, note: '', createdAt: stamp(2), updatedAt: stamp(39) },
  { id: 't3', title: 'Review Q2 roadmap draft', projectId: 'ultodo', tagIds: ['review', 'deep'], quadrant: 'ui', done: false, focus: true, estMin: 45, note: '', createdAt: stamp(3), updatedAt: stamp(38) },
  { id: 't4', title: 'Write the “focus mode” essay', projectId: 'writing', tagIds: ['writing', 'deep'], quadrant: 'nui', done: false, focus: false, estMin: 90, note: '', createdAt: stamp(4), updatedAt: stamp(20) },
  { id: 't5', title: 'Plan Q3 offsite itinerary', projectId: 'ultodo', tagIds: ['deep'], quadrant: 'nui', done: false, focus: false, estMin: 60, note: '', createdAt: stamp(5), updatedAt: stamp(19) },
  { id: 't6', title: 'Read Deep Work chapter 3', projectId: 'personal', tagIds: ['deep'], quadrant: 'nui', done: false, focus: false, estMin: 30, note: '', createdAt: stamp(6), updatedAt: stamp(18) },
  { id: 't7', title: 'Draft onboarding copy', projectId: 'ultodo', tagIds: ['writing'], quadrant: 'nui', done: false, focus: false, estMin: 45, note: '', createdAt: stamp(7), updatedAt: stamp(17) },
  { id: 't8', title: 'Renew parking permit', projectId: 'home', tagIds: ['errand', 'quick'], quadrant: 'uni', done: false, focus: false, estMin: 15, note: '', createdAt: stamp(8), updatedAt: stamp(16) },
  { id: 't9', title: 'Schedule dentist', projectId: 'home', tagIds: ['call', 'quick'], quadrant: 'uni', done: false, focus: false, estMin: 10, note: '', createdAt: stamp(9), updatedAt: stamp(15) },
  { id: 't10', title: 'Forward expense reports', projectId: 'personal', tagIds: ['quick'], quadrant: 'uni', done: false, focus: false, estMin: 5, note: '', createdAt: stamp(10), updatedAt: stamp(14) },
  { id: 't11', title: 'Try the new pour-over method', projectId: 'personal', tagIds: [], quadrant: 'nuni', done: false, focus: false, estMin: 20, note: '', createdAt: stamp(11), updatedAt: stamp(13) },
  { id: 't12', title: 'Organize bookmarks folder', projectId: 'personal', tagIds: ['errand'], quadrant: 'nuni', done: false, focus: false, estMin: 25, note: '', createdAt: stamp(12), updatedAt: stamp(12) },
  { id: 't13', title: 'Research calm color palettes', projectId: 'ultodo', tagIds: ['deep'], quadrant: null, done: false, focus: false, estMin: 30, note: '', createdAt: stamp(13), updatedAt: stamp(22) },
  { id: 't14', title: 'Cancel unused subscription', projectId: 'home', tagIds: ['errand', 'quick'], quadrant: null, done: false, focus: false, estMin: 5, note: '', createdAt: stamp(14), updatedAt: stamp(21) },
  { id: 't15', title: 'Idea: weekly review ritual', projectId: 'writing', tagIds: [], quadrant: null, done: false, focus: false, estMin: 0, note: 'Sunday evening, 20m. Recap + top 3.', createdAt: stamp(15), updatedAt: stamp(23) },
  { id: 't16', title: 'Backup old hard drive', projectId: 'home', tagIds: ['errand'], quadrant: null, done: false, focus: false, estMin: 40, note: '', createdAt: stamp(16), updatedAt: stamp(24) },
  { id: 't17', title: 'Call mom', projectId: 'personal', tagIds: ['call'], quadrant: null, done: false, focus: false, estMin: 20, note: '', createdAt: stamp(17), updatedAt: stamp(25) },
  { id: 't18', title: 'Morning pages', projectId: 'personal', tagIds: ['writing', 'quick'], quadrant: 'ui', done: true, focus: true, estMin: 20, note: '', createdAt: stamp(18), updatedAt: stamp(26), completedAt: stamp(27) },
]
