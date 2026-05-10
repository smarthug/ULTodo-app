import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuickAddForm } from './QuickAddForm'
import type { Project, Tag, TaskDraft } from '@/features/tasks/task-types'

const addTask = vi.fn<(draft: TaskDraft) => Promise<unknown>>()
const patchTask = vi.fn<() => Promise<unknown>>()

const projects: Project[] = [
  { id: 'personal', name: 'Personal', color: '#A8A29E', order: 1 },
  { id: 'ultodo', name: 'ULTodo', color: '#F97316', order: 2 },
  { id: 'work', name: 'Work', color: '#2563EB', order: 3 },
  { id: 'archived', name: 'Archived', color: '#999999', order: 4, archived: true },
]

const tags: Tag[] = [
  { id: 'deep-work', name: 'Deep work', color: '#7C3AED', order: 1 },
]

vi.mock('@/features/tasks/task-store', () => ({
  useTaskStore: () => ({
    projects,
    tags,
    addTask,
    patchTask,
    addTag: vi.fn(),
    removeTask: vi.fn(),
  }),
}))

describe('QuickAddForm', () => {
  it('selects exactly one project with chips and hides estimate input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<QuickAddForm onSubmit={onSubmit} autoFocus={false} />)

    expect(screen.queryByRole('combobox', { name: /project/i })).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/estimate/i)).not.toBeInTheDocument()

    const personal = screen.getByRole('radio', { name: 'Personal' })
    const ultodo = screen.getByRole('radio', { name: 'ULTodo' })
    const work = screen.getByRole('radio', { name: 'Work' })
    expect(personal).toBeChecked()
    expect(ultodo).not.toBeChecked()
    expect(work).not.toBeChecked()
    expect(screen.queryByRole('radio', { name: 'Archived' })).not.toBeInTheDocument()

    await user.click(ultodo)
    expect(personal).not.toBeChecked()
    expect(ultodo).toBeChecked()

    await user.keyboard('{ArrowLeft}')
    expect(personal).toBeChecked()
    expect(ultodo).not.toBeChecked()

    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(personal).not.toBeChecked()
    expect(ultodo).not.toBeChecked()
    expect(work).toBeChecked()

    await user.click(ultodo)
    expect(personal).not.toBeChecked()
    expect(ultodo).toBeChecked()

    await user.type(screen.getByPlaceholderText('What needs attention?'), 'Polish quick add')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(addTask).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Polish quick add',
      projectId: 'ultodo',
    }))
    expect(addTask.mock.calls[0][0]).not.toHaveProperty('estMin')
    expect(onSubmit).toHaveBeenCalled()
  })
})
