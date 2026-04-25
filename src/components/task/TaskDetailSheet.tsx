import { Play, X } from 'lucide-react'
import { QLIST } from '@/data/quadrants'
import { useTaskStore } from '@/features/tasks/task-store'
import type { QuadrantId, Task } from '@/features/tasks/task-types'
import { Button } from '@/components/ui/button'
import { QuickAddSheet } from './QuickAddSheet'
import { useState } from 'react'

export function TaskDetailSheet({ task, onClose, onFocus }: { task: Task | null; onClose: () => void; onFocus: (task: Task) => void }) {
  const store = useTaskStore()
  const [editing, setEditing] = useState(false)
  if (!task) return null
  const move = async (quadrant: QuadrantId | null) => store.patchTask(task.id, { quadrant })

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full rounded-t-[28px] border border-[var(--hair)] bg-paper p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Task detail</p>
            <h2 className="mt-1 text-xl font-semibold leading-tight tracking-[-.02em] text-ink">{task.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
        </div>
        {task.note ? <p className="mb-4 rounded-2xl bg-paper-2 p-3 text-sm leading-relaxed text-ink-2">{task.note}</p> : null}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <Button variant={task.focus ? 'dark' : 'soft'} onClick={() => store.patchTask(task.id, { focus: !task.focus })}>{task.focus ? 'Focused' : 'Focus'}</Button>
          <Button variant="soft" onClick={() => store.patchTask(task.id, { done: !task.done })}>{task.done ? 'Undo' : 'Done'}</Button>
          <Button onClick={() => onFocus(task)}><Play size={15} />Start</Button>
        </div>
        <div className="mb-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Move without dragging</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="soft" onClick={() => move(null)}>Inbox</Button>
            {QLIST.map((q) => <Button key={q.id} variant={task.quadrant === q.id ? 'default' : 'soft'} onClick={() => move(q.id)}>{q.label}</Button>)}
          </div>
        </div>
        <Button variant="dark" className="w-full" onClick={() => setEditing(true)}>Edit task</Button>
      </div>
      <QuickAddSheet open={editing} editingTask={task} onClose={() => setEditing(false)} />
    </div>
  )
}
