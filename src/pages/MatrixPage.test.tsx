import { describe, expect, it } from 'vitest'
import { buildSortableMatrixPatches } from './matrix-sortable'
import type { Task } from '@/features/tasks/task-types'

const task = (id: string): Task => ({
  id,
  title: id,
  note: '',
  projectId: 'ultodo',
  tagIds: [],
  quadrant: 'ui',
  done: false,
  focus: false,
  estMin: 15,
  createdAt: '2026-05-10T00:00:00.000Z',
  updatedAt: '2026-05-10T00:00:00.000Z',
  completedAt: null,
})

describe('buildSortableMatrixPatches', () => {
  it('persists a reordered urgent lane from Sortable DOM order', () => {
    const a = task('a')
    const b = task('b')
    const c = task('c')

    const patches = buildSortableMatrixPatches(
      { urgent: [a, b, c], 'not-urgent': [] },
      { movedTaskId: 'c', sourceLane: 'urgent', targetLane: 'urgent', sourceTaskIds: ['a', 'c', 'b'], targetTaskIds: ['a', 'c', 'b'] },
    )

    expect(patches).toEqual([
      { id: 'a', patch: { matrixOrder: 1000 } },
      { id: 'c', patch: { matrixOrder: 2000, quadrant: 'ui' } },
      { id: 'b', patch: { matrixOrder: 3000 } },
    ])
  })

  it('persists a shared-list move across lanes', () => {
    const a = task('a')
    const b = task('b')
    const c = task('c')

    const patches = buildSortableMatrixPatches(
      { urgent: [a], 'not-urgent': [b, c] },
      { movedTaskId: 'a', sourceLane: 'urgent', targetLane: 'not-urgent', sourceTaskIds: [], targetTaskIds: ['b', 'a', 'c'] },
    )

    expect(patches).toEqual([
      { id: 'b', patch: { matrixOrder: 1000 } },
      { id: 'a', patch: { matrixOrder: 2000, quadrant: 'nui' } },
      { id: 'c', patch: { matrixOrder: 3000 } },
    ])
  })

  it('ignores unknown task ids from DOM noise', () => {
    const a = task('a')
    const b = task('b')

    const patches = buildSortableMatrixPatches(
      { urgent: [a], 'not-urgent': [b] },
      { movedTaskId: 'a', sourceLane: 'urgent', targetLane: 'not-urgent', sourceTaskIds: [], targetTaskIds: ['b', 'missing', 'a'] },
    )

    expect(patches).toEqual([
      { id: 'b', patch: { matrixOrder: 1000 } },
      { id: 'a', patch: { matrixOrder: 2000, quadrant: 'nui' } },
    ])
  })
})
