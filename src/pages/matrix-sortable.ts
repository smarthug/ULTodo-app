import { quadrantForMatrixLane, type MatrixLaneId } from '@/data/quadrants'
import type { SortableMatrixMove } from '@/components/matrix/MatrixQuadrant'
import type { Task } from '@/features/tasks/task-types'

const orderValue = (index: number) => (index + 1) * 1000

export function buildSortableMatrixPatches(tasksByLane: Record<MatrixLaneId, Task[]>, move: SortableMatrixMove) {
  const knownTaskIds = new Set([...tasksByLane.urgent, ...tasksByLane['not-urgent']].map((task) => task.id))
  if (!knownTaskIds.has(move.movedTaskId)) return []

  const patchMap = new Map<string, Partial<Task>>()
  const addPatch = (id: string, patch: Partial<Task>) => {
    if (!knownTaskIds.has(id)) return
    patchMap.set(id, { ...patchMap.get(id), ...patch })
  }
  const applyOrder = (taskIds: string[]) => {
    taskIds
      .filter((id) => knownTaskIds.has(id))
      .forEach((id, index) => addPatch(id, { matrixOrder: orderValue(index) }))
  }

  applyOrder(move.targetTaskIds)
  if (move.sourceLane !== move.targetLane) applyOrder(move.sourceTaskIds)
  addPatch(move.movedTaskId, { quadrant: quadrantForMatrixLane(move.targetLane) })

  return Array.from(patchMap, ([id, patch]) => ({ id, patch }))
}
