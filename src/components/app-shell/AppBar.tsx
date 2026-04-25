import { Menu, Tags, UserRound } from 'lucide-react'
import { useTaskStore } from '@/features/tasks/task-store'
import { Button } from '@/components/ui/button'

export function AppBar({ onMenu, onFilters }: { onMenu: () => void; onFilters: () => void }) {
  const { projects, settings } = useTaskStore()
  const projectName = settings.activeProjectId === 'all' ? 'All projects' : projects.find((p) => p.id === settings.activeProjectId)?.name ?? 'All projects'
  return (
    <header className="relative z-20 flex items-center gap-2 border-b border-[var(--hair)] bg-[color-mix(in_oklab,var(--paper)_88%,transparent)] px-3 py-2 backdrop-blur-xl">
      <Button variant="ghost" size="icon" onClick={onMenu}><Menu size={19} /></Button>
      <button type="button" onClick={onFilters} className="flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--hair)] bg-paper-2 px-3 text-sm font-semibold text-ink">
        <span className="truncate">{projectName}</span>
        {settings.activeTagIds.length ? <span className="rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] text-white">{settings.activeTagIds.length}</span> : <Tags size={14} className="text-ink-3" />}
      </button>
      <button type="button" className="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,#C76B2A,#8B4513)] text-white"><UserRound size={17} /></button>
    </header>
  )
}
