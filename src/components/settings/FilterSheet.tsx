import { X } from 'lucide-react'
import { useTaskStore } from '@/features/tasks/task-store'
import { Button } from '@/components/ui/button'
import { TagChip } from '@/components/task/TagChip'

export function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const store = useTaskStore()
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full rounded-t-[28px] border border-[var(--hair)] bg-paper p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div><p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Scope</p><h2 className="font-serif text-3xl italic text-ink">Projects & tags</h2></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-3">Project</p>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button variant={store.settings.activeProjectId === 'all' ? 'default' : 'soft'} onClick={() => store.setSettings({ activeProjectId: 'all' })}>All projects</Button>
          {store.projects.map((project) => <Button key={project.id} variant={store.settings.activeProjectId === project.id ? 'default' : 'soft'} onClick={() => store.setSettings({ activeProjectId: project.id })}>{project.name}</Button>)}
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.1em] text-ink-3">Tags · inclusive OR</p>
        <div className="flex flex-wrap gap-2">
          <TagChip tag={{ name: 'All', color: '' }} active={!store.settings.activeTagIds.length} onClick={() => store.setSettings({ activeTagIds: [] })} />
          {store.tags.map((tag) => <TagChip key={tag.id} tag={tag} active={store.settings.activeTagIds.includes(tag.id)} onClick={() => {
            const has = store.settings.activeTagIds.includes(tag.id)
            store.setSettings({ activeTagIds: has ? store.settings.activeTagIds.filter((id) => id !== tag.id) : [...store.settings.activeTagIds, tag.id] })
          }} />)}
        </div>
      </div>
    </div>
  )
}
