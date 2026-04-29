import { useEffect, useState } from 'react'
import { X, Inbox } from 'lucide-react'
import { QLIST } from '@/data/quadrants'
import { useTaskStore } from '@/features/tasks/task-store'
import type { QuadrantId, Task } from '@/features/tasks/task-types'
import { Button } from '@/components/ui/button'
import { QuickAddSheet } from './QuickAddSheet'
import { QuickAddForm } from './QuickAddForm'

interface Props {
  task: Task | null
  onClose?: () => void
  variant?: 'sheet' | 'inline'
}

export function TaskDetailPanel({ task, onClose, variant = 'sheet' }: Props) {
  const store = useTaskStore()
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setEditing(false)
  }, [task?.id])

  if (!task) {
    if (variant === 'inline') {
      return (
        <div className="grid h-full place-items-center px-6 text-center">
          <div className="max-w-xs">
            <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-paper-2 text-ink-4">
              <Inbox size={20} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Task detail</p>
            <h3 className="mt-2 font-serif text-2xl italic tracking-[-.02em] text-ink-2">Select a task</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-3">
              Pick something from the list. Edit, focus, or move it without leaving this view.
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const move = async (quadrant: QuadrantId | null) => store.patchTask(task.id, { quadrant })

  const body = (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Task detail</p>
          <h2 className="mt-1 text-xl font-semibold leading-tight tracking-[-.02em] text-ink">{task.title}</h2>
        </div>
        {onClose && variant === 'sheet' ? (
          <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
        ) : null}
      </div>
      {task.note ? (
        <p className="mb-4 rounded-2xl bg-paper-2 p-3 text-sm leading-relaxed text-ink-2">{task.note}</p>
      ) : null}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button
          variant={task.focus ? 'dark' : 'soft'}
          onClick={() => store.patchTask(task.id, { focus: !task.focus })}
        >
          {task.focus ? 'Focused' : 'Focus'}
        </Button>
        <Button variant="soft" onClick={() => store.patchTask(task.id, { done: !task.done })}>
          {task.done ? 'Undo' : 'Done'}
        </Button>
      </div>
      <div className="mb-4">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Move without dragging</p>
          <p className="font-mono text-[10px] text-ink-4">unselected → Inbox</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {QLIST.map((q) => (
            <Button
              key={q.id}
              variant={task.quadrant === q.id ? 'default' : 'soft'}
              onClick={() => move(task.quadrant === q.id ? null : q.id)}
            >
              {q.label}
            </Button>
          ))}
        </div>
      </div>
      <Button variant="dark" className="w-full" onClick={() => setEditing(true)}>Edit task</Button>
    </>
  )

  if (variant === 'inline') {
    return (
      <div className="ul-scroll flex h-full flex-col overflow-y-auto p-5">
        {body}
        {editing ? (
          <div className="mt-4 rounded-3xl border border-[var(--hair)] bg-paper-2 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Edit task</p>
              <Button variant="ghost" size="icon" onClick={() => setEditing(false)}><X size={18} /></Button>
            </div>
            <QuickAddForm
              key={task.id}
              editingTask={task}
              onSubmit={() => setEditing(false)}
              onDelete={() => setEditing(false)}
              variant="inline"
            />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <div className="w-full rounded-t-[28px] border border-[var(--hair)] bg-paper p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {body}
      </div>
      <QuickAddSheet open={editing} editingTask={task} onClose={() => setEditing(false)} />
    </>
  )
}
