import type { Task } from '@/features/tasks/task-types'
import { TaskDetailPanel } from './TaskDetailPanel'

export function TaskDetailSheet({ task, onClose }: { task: Task | null; onClose: () => void }) {
  if (!task) return null
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <TaskDetailPanel task={task} onClose={onClose} variant="sheet" />
    </div>
  )
}
