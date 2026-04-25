import type { Tag } from '@/features/tasks/task-types'
import { cn } from '@/lib/utils'

export function TagChip({ tag, active, onClick, compact }: { tag: Pick<Tag, 'name' | 'color'>; active?: boolean; onClick?: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('inline-flex items-center gap-1.5 rounded-full border font-medium transition', compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]', active ? 'border-ink bg-ink text-paper' : 'border-[var(--hair-2)] bg-transparent text-ink-2')}
    >
      {!active && tag.color ? <span className="size-1.5 rounded-full" style={{ background: tag.color }} /> : null}
      {tag.name}
    </button>
  )
}
