import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[18px] border border-[var(--hair)] bg-paper shadow-[0_1px_2px_rgba(0,0,0,.04)]', className)} {...props} />
}
