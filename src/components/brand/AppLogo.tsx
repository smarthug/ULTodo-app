import { cn } from '@/lib/utils'

interface AppLogoProps {
  className?: string
  markClassName?: string
  showWordmark?: boolean
}

export function AppLogo({ className, markClassName, showWordmark = true }: AppLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoMark className={markClassName} />
      {showWordmark ? (
        <span className="font-serif text-3xl italic tracking-[-.04em] text-ink">ULTodo</span>
      ) : null}
    </div>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-label="ULTodo logo"
      className={cn('size-11 shrink-0 overflow-visible', className)}
      role="img"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="15" fill="var(--paper-2)" />
      <rect x="3.5" y="3.5" width="41" height="41" rx="12.5" fill="none" stroke="var(--hair-2)" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="var(--accent-soft)" strokeWidth="5" />
      <path d="M24 10a14 14 0 0 1 13.3 9.7" fill="none" stroke="var(--accent)" strokeLinecap="round" strokeWidth="5" />
      <path d="m15.4 24.4 5.2 5.2 12-13.2" fill="none" stroke="var(--success)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <path d="M15 35.5h18" stroke="var(--ink-4)" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}
