import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Checkbox({ checked, onChange, className }: { checked: boolean; onChange: () => void; className?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(event) => { event.stopPropagation(); onChange() }}
      className={cn('grid size-5 shrink-0 place-items-center rounded-full border transition', checked ? 'border-accent bg-accent text-white' : 'border-[var(--hair-2)] bg-transparent', className)}
    >
      {checked ? <Check size={13} strokeWidth={3} /> : null}
    </button>
  )
}
