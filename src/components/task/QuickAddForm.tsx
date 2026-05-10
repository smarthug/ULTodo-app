import { useMemo, useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { QLIST } from '@/data/quadrants'
import { useTaskStore } from '@/features/tasks/task-store'
import type { QuadrantId, Task, TaskDraft } from '@/features/tasks/task-types'
import { Button } from '@/components/ui/button'
import { TagChip } from './TagChip'

interface Props {
  editingTask?: Task | null
  onSubmit: () => void
  onDelete?: () => void
  onClose?: () => void
  variant?: 'sheet' | 'inline'
  autoFocus?: boolean
}

export function QuickAddForm({ editingTask, onSubmit, onDelete, onClose, variant = 'sheet', autoFocus = true }: Props) {
  const store = useTaskStore()
  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [note, setNote] = useState(editingTask?.note ?? '')
  const [projectId, setProjectId] = useState(editingTask?.projectId ?? store.projects[0]?.id ?? 'personal')
  const [tagIds, setTagIds] = useState<string[]>(editingTask?.tagIds ?? [])
  const [quadrant, setQuadrant] = useState<QuadrantId | null>(editingTask?.quadrant ?? null)
  const [focus, setFocus] = useState(editingTask?.focus ?? false)
  const [newTag, setNewTag] = useState('')

  const projectOptions = useMemo(
    () => store.projects.filter((project) => project.id !== 'all' && !project.archived),
    [store.projects],
  )

  const submit = async () => {
    if (!title.trim()) return
    const draft: TaskDraft = { title, note, projectId, tagIds, quadrant, focus }
    if (editingTask) await store.patchTask(editingTask.id, draft)
    else await store.addTask(draft)
    onSubmit()
  }

  const createTag = async () => {
    if (!newTag.trim()) return
    const tag = await store.addTag(newTag)
    setTagIds((prev) => (prev.includes(tag.id) ? prev : [...prev, tag.id]))
    setNewTag('')
  }

  const handleDelete = async () => {
    if (!editingTask) return
    await store.removeTask(editingTask.id)
    onDelete?.()
  }

  const selectProjectByKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!direction) return
    event.preventDefault()
    const currentIndex = projectOptions.findIndex((project) => project.id === projectId)
    const nextIndex = ((currentIndex === -1 ? 0 : currentIndex) + direction + projectOptions.length) % projectOptions.length
    const next = projectOptions[nextIndex]
    if (!next) return
    setProjectId(next.id)
    const buttons = Array.from(event.currentTarget.closest('[role="radiogroup"]')?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])
    buttons[nextIndex]?.focus()
  }

  const showHeader = variant === 'sheet'

  return (
    <div className="w-full">
      {showHeader ? (
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">{editingTask ? 'Edit task' : 'Quick add'}</p>
            <h2 className="font-serif text-3xl italic tracking-[-.03em] text-ink">Capture without friction.</h2>
          </div>
          {onClose ? <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button> : null}
        </div>
      ) : null}

      <label className="block text-xs font-semibold uppercase tracking-[.08em] text-ink-3">Title</label>
      <input
        autoFocus={autoFocus}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs attention?"
        className="mt-2 w-full rounded-2xl border border-[var(--hair)] bg-paper-2 px-4 py-3 text-[16px] font-semibold text-ink outline-none focus:border-accent"
      />

      <label className="mt-4 block text-xs font-semibold uppercase tracking-[.08em] text-ink-3">Note</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional detail"
        className="mt-2 min-h-20 w-full resize-none rounded-2xl border border-[var(--hair)] bg-paper-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
      />

      <fieldset className="mt-4">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[.08em] text-ink-3">Project</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project">
          {projectOptions.map((project) => {
            const active = projectId === project.id
            return (
              <button
                key={project.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setProjectId(project.id)}
                onKeyDown={selectProjectByKeyboard}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${active ? 'border-ink bg-ink text-paper' : 'border-[var(--hair-2)] bg-transparent text-ink-2'}`}
              >
                {!active ? <span className="size-1.5 rounded-full" style={{ background: project.color }} /> : null}
                {project.name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[.08em] text-ink-3">Tags</div>
        <div className="flex flex-wrap gap-2">
          {store.tags.map((tag) => (
            <TagChip
              key={tag.id}
              tag={tag}
              active={tagIds.includes(tag.id)}
              onClick={() => setTagIds((prev) => prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id])}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag"
            className="min-w-0 flex-1 rounded-full border border-[var(--hair)] bg-paper-2 px-3 py-2 text-sm"
          />
          <Button variant="soft" size="sm" onClick={createTag}>Add</Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-[.08em] text-ink-3">Priority</span>
          <span className="font-mono text-[10px] text-ink-4">unselected → Inbox</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {QLIST.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setQuadrant((prev) => (prev === q.id ? null : q.id))}
              className={`rounded-2xl border p-3 text-left text-xs ${quadrant === q.id ? 'border-accent bg-accent-soft' : 'border-[var(--hair)] bg-paper-2'}`}
            >
              {q.label}<br/><span className="text-ink-3">{q.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--hair)] bg-paper-2 px-4 py-3 text-sm font-semibold text-ink">
        Add to Today focus
        <input type="checkbox" checked={focus} onChange={(e) => setFocus(e.target.checked)} />
      </label>

      <div className="mt-5 flex gap-2">
        {editingTask && onDelete ? (
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        ) : null}
        <Button className="flex-[2]" onClick={submit}>{editingTask ? 'Save changes' : 'Add task'}</Button>
      </div>
    </div>
  )
}
