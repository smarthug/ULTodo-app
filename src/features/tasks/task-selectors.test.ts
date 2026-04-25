import { describe, expect, it } from 'vitest'
import { filterTasks, selectTodayTasks } from './task-selectors'
import type { Task } from './task-types'

const task = (id: string, patch: Partial<Task>): Task => ({
  id,
  title: id,
  note: '',
  projectId: 'ultodo',
  tagIds: [],
  quadrant: null,
  done: false,
  focus: false,
  estMin: 15,
  createdAt: `2026-04-24T00:0${id.length}:00.000Z`,
  updatedAt: `2026-04-24T00:0${id.length}:00.000Z`,
  completedAt: null,
  ...patch,
})

describe('filterTasks', () => {
  it('uses inclusive OR for multiple selected tags', () => {
    const tasks = [
      task('a', { tagIds: ['deep'] }),
      task('b', { tagIds: ['quick'] }),
      task('c', { tagIds: ['call'] }),
    ]
    expect(filterTasks(tasks, { tagIds: ['deep', 'quick'] }).map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('treats all as a project filter sentinel', () => {
    const tasks = [task('a', { projectId: 'ultodo' }), task('b', { projectId: 'home' })]
    expect(filterTasks(tasks, { projectId: 'all' })).toHaveLength(2)
    expect(filterTasks(tasks, { projectId: 'home' }).map((t) => t.id)).toEqual(['b'])
  })
})

describe('selectTodayTasks', () => {
  it('excludes done tasks', () => {
    const result = selectTodayTasks([task('done', { done: true, focus: true, quadrant: 'ui' })], { todayCount: 3 })
    expect(result).toEqual([])
  })

  it('sorts focused tasks by quadrant order then updatedAt and createdAt', () => {
    const tasks = [
      task('null', { focus: true, quadrant: null, updatedAt: '2026-04-24T00:06:00.000Z' }),
      task('nuni', { focus: true, quadrant: 'nuni', updatedAt: '2026-04-24T00:06:00.000Z' }),
      task('uni', { focus: true, quadrant: 'uni', updatedAt: '2026-04-24T00:06:00.000Z' }),
      task('nui', { focus: true, quadrant: 'nui', updatedAt: '2026-04-24T00:06:00.000Z' }),
      task('ui-old', { focus: true, quadrant: 'ui', updatedAt: '2026-04-24T00:01:00.000Z', createdAt: '2026-04-24T00:01:00.000Z' }),
      task('ui-new', { focus: true, quadrant: 'ui', updatedAt: '2026-04-24T00:02:00.000Z', createdAt: '2026-04-24T00:01:00.000Z' }),
    ]
    expect(selectTodayTasks(tasks, { todayCount: 6 }).map((t) => t.id)).toEqual(['ui-new', 'ui-old', 'nui', 'uni', 'nuni', 'null'])
  })

  it('slices overfull focused lists to todayCount', () => {
    const tasks = [task('a', { focus: true, quadrant: 'ui' }), task('b', { focus: true, quadrant: 'nui' }), task('c', { focus: true, quadrant: 'uni' })]
    expect(selectTodayTasks(tasks, { todayCount: 2 }).map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('preserves non-ui focused tasks and fills gaps from ui without mutation', () => {
    const nonUi = task('manual', { focus: true, quadrant: 'nui' })
    const filler = task('filler', { focus: false, quadrant: 'ui', updatedAt: '2026-04-24T00:09:00.000Z' })
    const result = selectTodayTasks([nonUi, filler], { todayCount: 3 })
    expect(result.map((t) => t.id)).toEqual(['manual', 'filler'])
    expect(filler.focus).toBe(false)
  })
})
