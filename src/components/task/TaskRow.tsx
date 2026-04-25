import { Clock } from 'lucide-react'
import type { Project, Tag, Task } from '@/features/tasks/task-types'
import { Checkbox } from './Checkbox'

export function TaskRow({ task, project, tags, onToggle, onOpen }: { task: Task; project?: Project; tags: Tag[]; onToggle: () => void; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="flex w-full gap-3 border-b border-[var(--hair)] bg-paper px-4 py-3 text-left transition hover:bg-paper-2/70">
      <Checkbox checked={task.done} onChange={onToggle} />
      <span className="min-w-0 flex-1">
        <span className={`block text-[15px] font-medium leading-snug tracking-[-.01em] text-ink ${task.done ? 'line-through opacity-55' : ''}`}>{task.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[.04em] text-ink-4">
          {project ? <span className="inline-flex items-center gap-1"><i className="size-1.5 rounded-full" style={{ background: project.color }} />{project.name}</span> : null}
          {tags.slice(0, 2).map((tag) => <span key={tag.id}>#{tag.name}</span>)}
          {task.estMin ? <span className="inline-flex items-center gap-1 normal-case"><Clock size={11} />{task.estMin}m</span> : null}
        </span>
      </span>
    </button>
  )
}
