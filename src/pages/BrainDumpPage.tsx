import { useMemo, useState } from 'react'
import { Grid2X2, List, Search } from 'lucide-react'
import { useOutletContext } from 'react-router'
import { useTaskStore } from '@/features/tasks/task-store'
import { filterTasks, groupBrainDump } from '@/features/tasks/task-selectors'
import type { OutletContext } from '@/components/app-shell/AppShell'
import type { Task } from '@/features/tasks/task-types'
import { TaskRow } from '@/components/task/TaskRow'
import { TaskCard } from '@/components/task/TaskCard'
import { Button } from '@/components/ui/button'

export function BrainDumpPage() {
  const store = useTaskStore()
  const { openTask } = useOutletContext<OutletContext>()
  const [view, setView] = useState(store.settings.brainView)
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => filterTasks(store.tasks, { projectId: store.settings.activeProjectId, tagIds: store.settings.activeTagIds, search }), [store.tasks, store.settings, search])
  const grouped = useMemo(() => groupBrainDump(filtered), [filtered])
  const taskTags = (task: Task) => store.tags.filter((tag) => task.tagIds.includes(tag.id))
  const project = (task: Task) => store.projects.find((p) => p.id === task.projectId)

  return (
    <div className="pb-6">
      <section className="px-5 pb-3 pt-5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Brain dump · {filtered.filter((t) => !t.done).length} open</p>
        <h1 className="max-w-[330px] font-serif text-[34px] italic leading-[.98] tracking-[-.04em] text-ink">Everything on your <span className="text-accent">mind</span>,<br/>nothing in your way.</h1>
      </section>
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-[var(--hair)] bg-paper px-3 py-2.5">
          <Search size={15} className="text-ink-3" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" />
        </div>
        <div className="flex rounded-full border border-[var(--hair)] bg-paper-2 p-1">
          <Button variant={view === 'list' ? 'dark' : 'ghost'} size="icon" onClick={() => { setView('list'); store.setSettings({ brainView: 'list' }) }}><List size={15} /></Button>
          <Button variant={view === 'card' ? 'dark' : 'ghost'} size="icon" onClick={() => { setView('card'); store.setSettings({ brainView: 'card' }) }}><Grid2X2 size={15} /></Button>
        </div>
      </div>
      {view === 'card' ? (
        <div className="flex flex-col gap-3 px-4">
          {filtered.filter((task) => !task.done).map((task, index) => <TaskCard key={task.id} task={task} project={project(task)} tags={taskTags(task)} onToggle={() => store.toggleTask(task.id)} onOpen={() => openTask(task)} accent={index === 0} />)}
        </div>
      ) : (
        <div>
          <Section title="Inbox" hint="Untriaged" tasks={grouped.inbox} />
          <Section title="Important" hint="Matrix · this week" tasks={grouped.important} />
          <Section title="Someday" hint="Delegate · Drop" tasks={grouped.someday} />
          <Section title="Completed" hint="Done" tasks={grouped.done} />
        </div>
      )}
    </div>
  )

  function Section({ title, hint, tasks }: { title: string; hint: string; tasks: Task[] }) {
    if (!tasks.length) return null
    return (
      <section className="mb-4">
        <div className="flex items-baseline gap-2 px-5 py-2">
          <h2 className="text-xs font-bold uppercase tracking-[.04em] text-ink">{title}</h2>
          <p className="font-mono text-[10px] text-ink-4">{hint}</p>
          <div className="h-px flex-1 bg-[var(--hair)]" />
          <span className="font-mono text-[10px] text-ink-4">{tasks.length}</span>
        </div>
        {tasks.map((task) => <TaskRow key={task.id} task={task} project={project(task)} tags={taskTags(task)} onToggle={() => store.toggleTask(task.id)} onOpen={() => openTask(task)} />)}
      </section>
    )
  }
}
