import { Clock, Focus } from 'lucide-react'
import type { Project, Tag, Task } from '@/features/tasks/task-types'
import { Card } from '@/components/ui/card'
import { Checkbox } from './Checkbox'
import { TagChip } from './TagChip'

export function TaskCard({ task, project, tags, onToggle, onOpen, accent }: { task: Task; project?: Project; tags: Tag[]; onToggle: () => void; onOpen: () => void; accent?: boolean }) {
  return (
    <Card className={`relative overflow-hidden p-4 text-left transition active:scale-[.99] ${task.done ? 'opacity-55' : ''}`} onClick={onOpen} role="button" tabIndex={0}>
      {accent ? <span className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-accent" /> : null}
      <div className="flex gap-3">
        <Checkbox checked={task.done} onChange={onToggle} />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-snug tracking-[-.015em] text-ink">{task.title}</div>
          {task.note ? <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-3">{task.note}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {project ? <TagChip tag={{ name: project.name, color: project.color }} compact /> : null}
            {tags.map((tag) => <TagChip key={tag.id} tag={tag} compact />)}
            {task.focus ? <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-ink"><Focus size={11} />Focus</span> : null}
            {task.estMin ? <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-4"><Clock size={11} />{task.estMin}m</span> : null}
          </div>
        </div>
      </div>
    </Card>
  )
}
