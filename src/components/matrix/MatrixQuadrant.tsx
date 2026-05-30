import { useEffect, useRef } from 'react'
import Sortable from 'sortablejs'
import type { MatrixLane, MatrixLaneId } from '@/data/quadrants'
import type { Task } from '@/features/tasks/task-types'
import { MatrixTaskChip } from './MatrixTaskChip'

const readTaskIds = (list: HTMLElement) => Array
  .from(list.querySelectorAll<HTMLElement>('[data-task-id]'))
  .map((item) => item.dataset.taskId)
  .filter((id): id is string => Boolean(id))

export interface SortableMatrixMove {
  movedTaskId: string
  targetLane: MatrixLaneId
  targetTaskIds: string[]
  sourceLane: MatrixLaneId
  sourceTaskIds: string[]
}

export function MatrixQuadrant({ lane, tasks, onOpen, onSortEnd }: { lane: MatrixLane; tasks: Task[]; onOpen: (task: Task) => void; onSortEnd: (move: SortableMatrixMove) => void }) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const listKey = `${lane.id}:${tasks.map((task) => task.id).join('|')}`

  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    const sortable = Sortable.create(list, {
      group: 'matrix',
      animation: 0,
      delay: 0,
      handle: '.matrix-drag-handle',
      draggable: '[data-task-id]',
      ghostClass: 'matrix-sortable-ghost',
      chosenClass: 'matrix-sortable-chosen',
      dragClass: 'matrix-sortable-drag',
      fallbackOnBody: true,
      fallbackTolerance: 1,
      swapThreshold: 0.65,
      invertSwap: true,
      onEnd: (event) => {
        const movedTaskId = event.item.dataset.taskId
        const targetLane = event.to.dataset.lane as MatrixLaneId | undefined
        const sourceLane = event.from.dataset.lane as MatrixLaneId | undefined
        if (!movedTaskId || !targetLane || !sourceLane) return

        onSortEnd({
          movedTaskId,
          targetLane,
          targetTaskIds: readTaskIds(event.to),
          sourceLane,
          sourceTaskIds: sourceLane === targetLane ? readTaskIds(event.to) : readTaskIds(event.from),
        })
      },
    })

    return () => sortable.destroy()
  }, [listKey, onSortEnd])

  return (
    <div className={`min-h-[360px] overflow-hidden rounded-[18px] border p-2.5 transition sm:p-3 lg:min-h-[calc(100vh-180px)] lg:min-w-0 ${lane.tone}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div><h3 className="text-sm font-bold tracking-[-.02em] text-ink">{lane.label}</h3><p className="font-mono text-[9px] uppercase tracking-[.08em] text-ink-4">{lane.hint}</p></div>
        <span className="font-mono text-[10px] text-ink-4">{tasks.length}</span>
      </div>
      <div key={listKey} ref={listRef} data-lane={lane.id} className="flex min-h-[280px] flex-col gap-2">
        {tasks.map((task) => <MatrixTaskChip key={task.id} task={task} onOpen={() => onOpen(task)} />)}
        {!tasks.length ? <p className="rounded-xl border border-dashed border-[var(--hair)] p-3 text-center text-xs text-ink-4">Drop tasks here.</p> : null}
      </div>
    </div>
  )
}
