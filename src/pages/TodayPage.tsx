import { Minus, Plus, Play } from 'lucide-react'
import { useMemo } from 'react'
import { useOutletContext } from 'react-router'
import type { OutletContext } from '@/components/app-shell/AppShell'
import { TaskCard } from '@/components/task/TaskCard'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/features/tasks/task-store'
import { selectTodayTasks } from '@/features/tasks/task-selectors'
import type { Task } from '@/features/tasks/task-types'

export function TodayPage() {
  const store = useTaskStore()
  const { openTask, startFocus } = useOutletContext<OutletContext>()
  const today = useMemo(() => selectTodayTasks(store.tasks, store.settings), [store.tasks, store.settings])
  const done = today.filter((task) => task.done).length
  const taskTags = (task: Task) => store.tags.filter((tag) => task.tagIds.includes(tag.id))
  const project = (task: Task) => store.projects.find((p) => p.id === task.projectId)

  return (
    <div className="pb-8">
      <section className="px-5 pb-5 pt-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Today focus · {today.length}/{store.settings.todayCount}</p>
        <h1 className="font-serif text-[42px] italic leading-[.92] tracking-[-.05em] text-ink">Choose less.<br/><span className="text-accent">Finish deeper.</span></h1>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-paper-3"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${today.length ? (done / today.length) * 100 : 0}%` }} /></div>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--hair)] bg-paper px-3 py-2">
          <span className="text-sm font-semibold text-ink">Focus count</span>
          <div className="flex items-center gap-2">
            <Button variant="soft" size="icon" onClick={() => store.setSettings({ todayCount: Math.max(1, store.settings.todayCount - 1) })}><Minus size={14} /></Button>
            <span className="w-6 text-center font-mono text-sm text-ink">{store.settings.todayCount}</span>
            <Button variant="soft" size="icon" onClick={() => store.setSettings({ todayCount: Math.min(7, store.settings.todayCount + 1) })}><Plus size={14} /></Button>
          </div>
        </div>
      </section>
      <div className="flex flex-col gap-3 px-4">
        {today.map((task, index) => (
          <div key={task.id} className="relative">
            <TaskCard task={task} project={project(task)} tags={taskTags(task)} onToggle={() => store.toggleTask(task.id)} onOpen={() => openTask(task)} accent={index === 0 || task.quadrant === 'ui'} />
            <Button size="sm" className="absolute bottom-3 right-3" onClick={() => startFocus(task)}><Play size={13} />Start</Button>
          </div>
        ))}
        {!today.length ? <div className="rounded-[22px] border border-dashed border-[var(--hair-2)] bg-paper p-8 text-center text-sm text-ink-3">No focus tasks yet. Mark urgent-important tasks as Focus or triage in Matrix.</div> : null}
      </div>
    </div>
  )
}
