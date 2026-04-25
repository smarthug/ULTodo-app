import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { Task } from '@/features/tasks/task-types'

export function MatrixTaskChip({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  return (
    <button
      ref={setNodeRef}
      type="button"
      onDoubleClick={onOpen}
      className={`flex w-full touch-none items-center gap-2 rounded-xl border border-[var(--hair)] bg-paper px-3 py-2 text-left text-xs font-semibold text-ink shadow-sm transition ${isDragging ? 'opacity-50' : ''}`}
      style={{ transform: CSS.Translate.toString(transform), zIndex: isDragging ? 50 : undefined }}
      {...listeners}
      {...attributes}
    >
      <GripVertical size={13} className="shrink-0 text-ink-4" />
      <span className="line-clamp-2 flex-1">{task.title}</span>
    </button>
  )
}
