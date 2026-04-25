import { TaskStoreProvider } from '@/features/tasks/task-store'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return <TaskStoreProvider>{children}</TaskStoreProvider>
}
