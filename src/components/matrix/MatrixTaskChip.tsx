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
      className="group relative flex min-h-[58px] w-full items-center gap-1.5 rounded-xl border border-[var(--hair)] bg-paper px-2 py-2 text-left text-xs font-semibold text-ink shadow-sm transition sm:gap-2 sm:px-2.5 sm:py-2.5 sm:text-sm"
    >
      <button
        type="button"
        aria-label={`Drag ${task.title}`}
        className="matrix-drag-handle flex h-10 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-ink-4 transition active:cursor-grabbing group-hover:bg-ink/5 sm:w-8"
      >
        <GripVertical size={17} />
      </button>
      <span className="line-clamp-3 min-w-0 flex-1 leading-snug">{task.title}</span>
    </div>
  )
}
