import { CalendarCheck2, Grid2X2, Brain, Timer, Settings, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/features/tasks/task-store'

export function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const store = useTaskStore()
  if (!open) return null

  const go = (path: string) => {
    navigate(path)
    onClose()
  }

  const counts = {
    today: store.tasks.filter((task) => task.focus && !task.done).length,
    brain: store.tasks.filter((task) => !task.done).length,
    matrix: store.tasks.filter((task) => task.quadrant && !task.done).length,
  }

  const items = [
    { path: '/today', label: t('nav.today'), icon: CalendarCheck2, count: counts.today },
    { path: '/brain', label: t('nav.brain'), icon: Brain, count: counts.brain },
    { path: '/matrix', label: t('nav.matrix'), icon: Grid2X2, count: counts.matrix },
    { path: '/pomo', label: t('nav.focus'), icon: Timer },
  ]

  return (
    <div className="absolute inset-0 z-40 flex bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <aside className="h-full w-[82%] max-w-[330px] border-r border-[var(--hair)] bg-paper shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between px-5 pb-3 pt-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">{t('menu.eyebrow')}</p>
            <h2 className="mt-1 font-serif text-3xl italic tracking-[-.04em] text-ink">ULTodo</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
        </div>

        <div className="px-3 py-2">
          {items.map((item) => (
            <button key={item.path} type="button" onClick={() => go(item.path)} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-paper-2">
              <item.icon size={19} className="text-ink-2" />
              <span className="flex-1 text-sm font-semibold text-ink">{item.label}</span>
              {item.count !== undefined ? <span className="font-mono text-[10px] text-ink-4">{item.count}</span> : null}
            </button>
          ))}
        </div>

        <div className="mt-3 border-t border-[var(--hair)] px-3 py-3">
          <button type="button" onClick={() => go('/settings')} className="flex w-full items-center gap-3 rounded-2xl bg-paper-2 px-3 py-3 text-left transition hover:bg-accent-soft">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-white"><Settings size={17} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-ink">{t('nav.settings')}</span>
              <span className="block text-xs text-ink-3">{t('menu.settingsHint')}</span>
            </span>
          </button>
        </div>
      </aside>
    </div>
  )
}
