import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from '@/components/app-shell/AppShell'
import { BrainDumpPage } from '@/pages/BrainDumpPage'
import { MatrixPage } from '@/pages/MatrixPage'
import { TodayPage } from '@/pages/TodayPage'
import { PomodoroPage } from '@/pages/PomodoroPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/today" replace />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="brain" element={<BrainDumpPage />} />
        <Route path="matrix" element={<MatrixPage />} />
        <Route path="pomo" element={<PomodoroPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  )
}
