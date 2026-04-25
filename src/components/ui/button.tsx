import { type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva('inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent', {
  variants: {
    variant: {
      default: 'bg-accent text-white shadow-[0_8px_24px_color-mix(in_oklab,var(--accent)_28%,transparent)] hover:scale-[1.01]',
      ghost: 'bg-transparent text-ink-2 hover:bg-paper-2',
      soft: 'border border-[var(--hair)] bg-paper-2 text-ink',
      dark: 'bg-ink text-paper',
      danger: 'bg-danger text-white',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4',
      icon: 'size-9 p-0',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
})

export function Button({ className, variant, size, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
