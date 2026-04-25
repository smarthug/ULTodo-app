import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { useTaskStore } from '@/features/tasks/task-store'
import type { Task } from '@/features/tasks/task-types'
import { AppBar } from './AppBar'
import { BottomNav } from './BottomNav'
import { QuickAddSheet } from '@/components/task/QuickAddSheet'
import { TaskDetailSheet } from '@/components/task/TaskDetailSheet'
import { FilterSheet } from '@/components/settings/FilterSheet'

export interface OutletContext { openTask: (task: Task) => void; startFocus: (task: Task) => void }

export function AppShell() {
  const store = useTaskStore()
  const navigate = useNavigate()
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [detailTask, setDetailTask] = useState<Task | null>(null)

  const startFocus = (task: Task) => {
    setDetailTask(null)
    navigate('/pomo', { state: { taskId: task.id } })
  }

  if (!store.ready) {
    return <div className="grid min-h-screen place-items-center bg-[#E8E4DC] text-sm font-semibold text-ink-3">Preparing your brain dump…</div>
  }

  return (
    <div className="min-h-screen bg-[#E8E4DC] px-0 py-0 sm:grid sm:place-items-center sm:p-6">
      <motion.div layout className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-paper shadow-2xl sm:h-[860px] sm:rounded-[46px] sm:border-[10px] sm:border-[#171511]">
        <AppBar onMenu={() => setFilterOpen(true)} onFilters={() => setFilterOpen(true)} />
        <main className="ul-scroll min-h-0 flex-1 bg-paper-2">
          <Outlet context={{ openTask: setDetailTask, startFocus } satisfies OutletContext} />
        </main>
        <BottomNav onPlus={() => setQuickAddOpen(true)} />
        <QuickAddSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
        <TaskDetailSheet task={detailTask} onClose={() => setDetailTask(null)} onFocus={startFocus} />
      </motion.div>
    </div>
  )
}
