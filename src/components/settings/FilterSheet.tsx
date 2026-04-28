import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterChips } from './FilterChips'

export function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full rounded-t-[28px] border border-[var(--hair)] bg-paper p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Scope</p>
            <h2 className="font-serif text-3xl italic text-ink">Projects & tags</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
        </div>
        <FilterChips />
      </div>
    </div>
  )
}
