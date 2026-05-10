import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BrainDumpPage } from './BrainDumpPage'
import type { Task } from '@/features/tasks/task-types'

const tasks: Task[] = [
  task('important', { quadrant: 'ui' }),
  task('someday', { quadrant: 'uni' }),
  task('inbox', { quadrant: null }),
  task('completed', { done: true, quadrant: 'ui', completedAt: '2026-05-10T00:00:00.000Z' }),
]

vi.mock('@/components/task/TaskRow', () => ({
  TaskRow: ({ task }: { task: Task }) => <div>{task.title}</div>,
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return {
    ...actual,
    useOutletContext: () => ({
      openTask: vi.fn(),
      isDesktop: false,
      quickAddInline: false,
      setQuickAddInline: vi.fn(),
      selectedTask: null,
      setSelectedTask: vi.fn(),
    }),
  }
})

vi.mock('@/features/tasks/task-store', () => ({
  useTaskStore: () => ({
    tasks,
    projects: [{ id: 'ultodo', name: 'ULTodo', color: '#F97316', order: 1 }],
    tags: [],
    settings: { activeProjectId: 'all', activeTagIds: [], brainView: 'list' },
    setSettings: vi.fn(),
    toggleTask: vi.fn(),
  }),
}))

describe('BrainDumpPage', () => {
  it('places Inbox immediately above Completed in list view', () => {
    render(<BrainDumpPage />)

    const sectionTitles = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)

    expect(sectionTitles).toEqual(['Important', 'Someday', 'Inbox', 'Completed'])
  })
})

function task(id: string, patch: Partial<Task>): Task {
  return {
    id,
    title: id,
    note: '',
    projectId: 'ultodo',
    tagIds: [],
    quadrant: null,
    done: false,
    focus: false,
    estMin: 15,
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: '2026-05-10T00:00:00.000Z',
    completedAt: null,
    ...patch,
  }
}
