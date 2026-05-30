import { useCallback, useMemo } from 'react'
import { useOutletContext } from 'react-router'
import { MATRIX_LANES } from '@/data/quadrants'
import type { OutletContext } from '@/components/app-shell/AppShell'
import { FilterChips } from '@/components/settings/FilterChips'
import { MatrixQuadrant, type SortableMatrixMove } from '@/components/matrix/MatrixQuadrant'
import { useTaskStore } from '@/features/tasks/task-store'
import { filterTasks, selectMatrixLaneTasks } from '@/features/tasks/task-selectors'
import { buildSortableMatrixPatches } from './matrix-sortable'

export function MatrixPage() {
  const store = useTaskStore()
  const { openTask, isDesktop } = useOutletContext<OutletContext>()
  const scoped = useMemo(() => filterTasks(store.tasks, { projectId: store.settings.activeProjectId, tagIds: store.settings.activeTagIds, done: false }), [store.tasks, store.settings])
  const tasksByLane = useMemo(
    () => ({
      urgent: selectMatrixLaneTasks(scoped, 'urgent'),
      'not-urgent': selectMatrixLaneTasks(scoped, 'not-urgent'),
    }),
    [scoped],
  )
  const onSortEnd = useCallback(async (move: SortableMatrixMove) => {
    const patches = buildSortableMatrixPatches(tasksByLane, move)
    if (!patches.length) return
    await store.patchTasks(patches)
  }, [store, tasksByLane])

  return (
    <div className="pb-8">
      {isDesktop ? (
        <div className="border-b border-[var(--hair)] bg-paper px-5 py-3">
          <FilterChips layout="inline" />
        </div>
      ) : null}
      <div className="px-4 pt-5">
        <section className="mb-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Matrix · drag-to-rank</p>
          <h1 className="font-serif text-[34px] italic leading-[.98] tracking-[-.04em] text-ink">Rank what matters<br/><span className="text-accent">by height.</span></h1>
        </section>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {MATRIX_LANES.map((lane) => <MatrixQuadrant key={lane.id} lane={lane} tasks={tasksByLane[lane.id]} onOpen={openTask} onSortEnd={onSortEnd} />)}
        </div>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-4">Drag higher for more priority. Double-click a chip to open fallback controls.</p>
      </div>
    </div>
  )
}
