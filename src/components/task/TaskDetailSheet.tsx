import type { Task } from '@/features/tasks/task-types'
import { TaskDetailPanel } from './TaskDetailPanel'

export function TaskDetailSheet({ task, onClose, onFocus }: { task: Task | null; onClose: () => void; onFocus: (task: Task) => void }) {
  if (!task) return null
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <TaskDetailPanel task={task} onClose={onClose} onFocus={onFocus} variant="sheet" />
    </div>
  )
}
