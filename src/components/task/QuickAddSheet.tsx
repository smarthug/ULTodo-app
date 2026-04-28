import { X } from 'lucide-react'
import type { Task } from '@/features/tasks/task-types'
import { Button } from '@/components/ui/button'
import { QuickAddForm } from './QuickAddForm'

interface Props { open: boolean; onClose: () => void; editingTask?: Task | null }

export function QuickAddSheet({ open, onClose, editingTask }: Props) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[88%] w-full overflow-y-auto rounded-t-[28px] border border-[var(--hair)] bg-paper p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">{editingTask ? 'Edit task' : 'Quick add'}</p>
            <h2 className="font-serif text-3xl italic tracking-[-.03em] text-ink">Capture without friction.</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
        </div>
        <QuickAddForm
          key={editingTask?.id ?? 'new'}
          editingTask={editingTask}
          onSubmit={onClose}
          onDelete={onClose}
          variant="inline"
        />
      </div>
    </div>
  )
}
