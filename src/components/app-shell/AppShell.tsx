import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { useTaskStore } from '@/features/tasks/task-store'
import type { Task } from '@/features/tasks/task-types'
import { useIsDesktop } from '@/hooks/use-media-query'
import { AppBar } from './AppBar'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { QuickAddSheet } from '@/components/task/QuickAddSheet'
import { TaskDetailSheet } from '@/components/task/TaskDetailSheet'
import { FilterSheet } from '@/components/settings/FilterSheet'
import { MenuSheet } from '@/components/settings/MenuSheet'

export interface OutletContext {
  openTask: (task: Task) => void
  startFocus: (task: Task) => void
  isDesktop: boolean
  selectedTask: Task | null
  setSelectedTask: (task: Task | null) => void
  quickAddInline: boolean
  setQuickAddInline: (open: boolean) => void
}

export function AppShell() {
  const store = useTaskStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useIsDesktop()
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [quickAddInline, setQuickAddInline] = useState(false)

  useEffect(() => {
    setSelectedTask(null)
    setQuickAddInline(false)
  }, [location.pathname])

  const startFocus = (task: Task) => {
    setDetailTask(null)
    setSelectedTask(null)
    navigate('/pomo', { state: { taskId: task.id } })
  }

  const openTask = (task: Task) => {
    if (isDesktop) {
      setSelectedTask(task)
    } else {
      setDetailTask(task)
    }
  }

  if (!store.ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#E8E4DC] text-sm font-semibold text-ink-3">
        Preparing your brain dump…
      </div>
    )
  }

  if (isDesktop) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-paper">
        <Sidebar onQuickAdd={() => setQuickAddInline(true)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-paper-2">
          <main className="ul-scroll min-h-0 flex-1">
            <Outlet
              context={{
                openTask,
                startFocus,
                isDesktop,
                selectedTask,
                setSelectedTask,
                quickAddInline,
                setQuickAddInline,
              } satisfies OutletContext}
            />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8E4DC] px-0 py-0 sm:grid sm:place-items-center sm:p-6">
      <motion.div
        layout
        className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-paper shadow-2xl sm:h-[860px] sm:rounded-[46px] sm:border-[10px] sm:border-[#171511]"
      >
        <AppBar onMenu={() => setMenuOpen(true)} onFilters={() => setFilterOpen(true)} />
        <main className="ul-scroll min-h-0 flex-1 bg-paper-2">
          <Outlet
            context={{
              openTask,
              startFocus,
              isDesktop,
              selectedTask,
              setSelectedTask,
              quickAddInline,
              setQuickAddInline,
            } satisfies OutletContext}
          />
        </main>
        <BottomNav onPlus={() => setQuickAddOpen(true)} />
        <QuickAddSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
        <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
        <TaskDetailSheet task={detailTask} onClose={() => setDetailTask(null)} onFocus={startFocus} />
      </motion.div>
    </div>
  )
}
