import { Brain, CalendarCheck2, Grid2X2, Plus, Timer } from 'lucide-react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'

const items = [
  { to: '/brain', navKey: 'brain', icon: Brain },
  { to: '/matrix', navKey: 'matrix', icon: Grid2X2 },
  { to: '/today', navKey: 'today', icon: CalendarCheck2 },
  { to: '/pomo', navKey: 'focus', icon: Timer },
]

export function BottomNav({ onPlus }: { onPlus: () => void }) {
  const { t } = useTranslation()
  return (
    <nav className="relative z-20 flex items-center justify-between border-t border-[var(--hair)] bg-[color-mix(in_oklab,var(--paper)_92%,transparent)] px-3 pb-5 pt-2 backdrop-blur-xl">
      {items.slice(0, 2).map((item) => <NavItem key={item.to} {...item} label={t(`nav.${item.navKey}`)} />)}
      <button type="button" onClick={onPlus} className="grid size-14 -translate-y-3 place-items-center rounded-full bg-accent text-white shadow-[0_8px_24px_color-mix(in_oklab,var(--accent)_38%,transparent)] transition active:scale-95"><Plus size={23} /></button>
      {items.slice(2).map((item) => <NavItem key={item.to} {...item} label={t(`nav.${item.navKey}`)} />)}
    </nav>
  )
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: typeof Brain; label: string }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold ${isActive ? 'text-ink' : 'text-ink-4'}`}>
      <Icon size={22} strokeWidth={1.7} />
      {label}
    </NavLink>
  )
}
