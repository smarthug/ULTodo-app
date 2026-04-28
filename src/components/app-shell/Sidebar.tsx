import { Brain, CalendarCheck2, Grid2X2, Plus, Settings, Timer } from 'lucide-react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useTaskStore } from '@/features/tasks/task-store'

interface SidebarProps {
  onQuickAdd: () => void
}

export function Sidebar({ onQuickAdd }: SidebarProps) {
  const { t } = useTranslation()
  const store = useTaskStore()

  const counts = {
    today: store.tasks.filter((task) => task.focus && !task.done).length,
    brain: store.tasks.filter((task) => !task.done).length,
    matrix: store.tasks.filter((task) => task.quadrant && !task.done).length,
  }

  const items = [
    { to: '/today', label: t('nav.today'), icon: CalendarCheck2, count: counts.today },
    { to: '/brain', label: t('nav.brain'), icon: Brain, count: counts.brain },
    { to: '/matrix', label: t('nav.matrix'), icon: Grid2X2, count: counts.matrix },
    { to: '/pomo', label: t('nav.focus'), icon: Timer, count: undefined as number | undefined },
  ]

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[var(--hair)] bg-paper">
      <div className="px-5 pb-3 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">{t('menu.eyebrow')}</p>
        <h2 className="mt-1 font-serif text-3xl italic tracking-[-.04em] text-ink">ULTodo</h2>
      </div>

      <nav className="flex-1 px-3 py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-paper-2 ${
                isActive ? 'bg-paper-2' : ''
              }`
            }
          >
            <item.icon size={19} className="text-ink-2" />
            <span className="flex-1 text-sm font-semibold text-ink">{item.label}</span>
            {item.count !== undefined ? (
              <span className="font-mono text-[10px] text-ink-4">{item.count}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--hair)] px-3 py-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-accent-soft ${
              isActive ? 'bg-accent-soft' : 'bg-paper-2'
            }`
          }
        >
          <span className="grid size-9 place-items-center rounded-full bg-accent text-white">
            <Settings size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-ink">{t('nav.settings')}</span>
            <span className="block text-xs text-ink-3">{t('menu.settingsHint')}</span>
          </span>
        </NavLink>
      </div>

      <div className="border-t border-[var(--hair)] px-3 py-3">
        <button
          type="button"
          onClick={onQuickAdd}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-3 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_color-mix(in_oklab,var(--accent)_38%,transparent)] transition active:scale-95"
        >
          <Plus size={18} />
          <span>Add task</span>
        </button>
      </div>
    </aside>
  )
}
