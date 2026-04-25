import { DndContext, DragOverlay, PointerSensor, TouchSensor, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router'
import { motion } from 'motion/react'
import { QLIST } from '@/data/quadrants'
import type { OutletContext } from '@/components/app-shell/AppShell'
import { MatrixQuadrant } from '@/components/matrix/MatrixQuadrant'
import { MatrixTaskChip } from '@/components/matrix/MatrixTaskChip'
import { useTaskStore } from '@/features/tasks/task-store'
import { filterTasks } from '@/features/tasks/task-selectors'
import type { QuadrantId, Task } from '@/features/tasks/task-types'

function InboxDrop({ tasks, onOpen }: { tasks: Task[]; onOpen: (task: Task) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'inbox' })
  return (
    <div ref={setNodeRef} className={`rounded-[18px] border border-[var(--hair)] bg-paper p-3 transition ${isOver ? 'ring-2 ring-accent' : ''}`}>
      <div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-bold text-ink">Inbox strip</h2><span className="font-mono text-[10px] text-ink-4">{tasks.length}</span></div>
      <div className="grid gap-2">
        {tasks.map((task) => <MatrixTaskChip key={task.id} task={task} onOpen={() => onOpen(task)} />)}
        {!tasks.length ? <p className="rounded-xl border border-dashed border-[var(--hair)] p-3 text-center text-xs text-ink-4">All captured tasks are triaged.</p> : null}
      </div>
    </div>
  )
}

export function MatrixPage() {
  const store = useTaskStore()
  const { openTask } = useOutletContext<OutletContext>()
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }))
  const scoped = useMemo(() => filterTasks(store.tasks, { projectId: store.settings.activeProjectId, tagIds: store.settings.activeTagIds, done: false }), [store.tasks, store.settings])
  const activeTask = scoped.find((task) => task.id === activeId)
  const inbox = scoped.filter((task) => task.quadrant === null)
  const byQuadrant = (id: QuadrantId) => scoped.filter((task) => task.quadrant === id)
  const onDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id))
  const onDragEnd = async (event: DragEndEvent) => {
    const taskId = String(event.active.id)
    const over = event.over?.id
    setActiveId(null)
    if (!over) return
    const quadrant = over === 'inbox' ? null : over as QuadrantId
    await store.patchTask(taskId, { quadrant })
  }

  return (
    <div className="px-4 pb-8 pt-5">
      <section className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Matrix · drag-to-triage</p>
        <h1 className="font-serif text-[34px] italic leading-[.98] tracking-[-.04em] text-ink">Make priority<br/><span className="text-accent">feel physical.</span></h1>
      </section>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <motion.div layout className="grid grid-cols-2 gap-3">
          {QLIST.map((quadrant) => <MatrixQuadrant key={quadrant.id} quadrant={quadrant} tasks={byQuadrant(quadrant.id)} onOpen={openTask} />)}
        </motion.div>
        <div className="mt-3"><InboxDrop tasks={inbox} onOpen={openTask} /></div>
        <DragOverlay>{activeTask ? <div className="w-48"><MatrixTaskChip task={activeTask} onOpen={() => undefined} /></div> : null}</DragOverlay>
      </DndContext>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-4">Tip: double-click a chip to open fallback move controls.</p>
    </div>
  )
}
