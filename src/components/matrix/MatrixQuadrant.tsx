import { useDroppable } from '@dnd-kit/core'
import { motion } from 'motion/react'
import type { Quadrant } from '@/data/quadrants'
import type { Task } from '@/features/tasks/task-types'
import { MatrixTaskChip } from './MatrixTaskChip'

export function MatrixQuadrant({ quadrant, tasks, onOpen }: { quadrant: Quadrant; tasks: Task[]; onOpen: (task: Task) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: quadrant.id })
  return (
    <motion.div layout ref={setNodeRef} className={`min-h-[178px] rounded-[18px] border p-3 transition ${quadrant.tone} ${isOver ? 'ring-2 ring-accent' : ''}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div><h3 className="text-sm font-bold tracking-[-.02em] text-ink">{quadrant.label}</h3><p className="font-mono text-[9px] uppercase tracking-[.08em] text-ink-4">{quadrant.hint}</p></div>
        <span className="font-mono text-[10px] text-ink-4">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => <MatrixTaskChip key={task.id} task={task} onOpen={() => onOpen(task)} />)}
      </div>
    </motion.div>
  )
}
