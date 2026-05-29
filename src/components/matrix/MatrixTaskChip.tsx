import { GripVertical } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import type { Task } from '@/features/tasks/task-types'

export function MatrixTaskChip({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const openFromKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') onOpen()
  }

  return (
    <div
      data-task-id={task.id}
      role="button"
      tabIndex={0}
      aria-label={task.title}
      onDoubleClick={onOpen}
      onKeyDown={openFromKeyboard}
      className="group relative flex min-h-[58px] w-full items-center gap-2 rounded-xl border border-[var(--hair)] bg-paper px-2.5 py-2.5 text-left text-sm font-semibold text-ink shadow-sm transition"
    >
      <button
        type="button"
        aria-label={`Drag ${task.title}`}
        className="matrix-drag-handle flex h-10 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-ink-4 transition active:cursor-grabbing group-hover:bg-ink/5"
      >
        <GripVertical size={17} />
      </button>
      <span className="line-clamp-3 min-w-0 flex-1 leading-snug">{task.title}</span>
    </div>
  )
}
