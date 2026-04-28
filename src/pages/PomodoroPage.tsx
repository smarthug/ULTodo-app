import { Pause, Play, RotateCcw } from 'lucide-react'
import { useLocation } from 'react-router'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/features/tasks/task-store'
import { usePomodoro } from '@/hooks/use-pomodoro'

const fmt = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`

export function PomodoroPage() {
  const store = useTaskStore()
  const location = useLocation()
  const state = location.state as { taskId?: string } | null
  const task = store.tasks.find((candidate) => candidate.id === state?.taskId) ?? store.tasks.find((candidate) => candidate.focus && !candidate.done)
  const timer = usePomodoro(store.settings.pomodoroMinutes, store.settings.breakMinutes)
  const progress = timer.planned ? (timer.planned - timer.remaining) / timer.planned : 0

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-between overflow-hidden bg-paper px-5 py-8 text-center lg:max-w-xl lg:py-16">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">Pomodoro · {timer.mode}</p>
        <h1 className="mt-2 font-serif text-[36px] italic tracking-[-.04em] text-ink">Quiet execution.</h1>
      </div>
      <motion.div animate={{ scale: timer.running ? [1, 1.03, 1] : 1 }} transition={{ repeat: timer.running ? Infinity : 0, duration: 4 }} className="relative grid size-72 place-items-center rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_68%)] lg:size-96">
        <div className="absolute inset-5 rounded-full border border-[var(--hair)]" />
        <div className="absolute inset-10 rounded-full border-[10px] border-paper-3" />
        <div className="absolute inset-10 rounded-full border-[10px] border-accent" style={{ clipPath: `polygon(0 0, ${Math.max(8, progress * 100)}% 0, ${Math.max(8, progress * 100)}% 100%, 0 100%)` }} />
        <div className="relative">
          <div className="font-mono text-[54px] font-semibold tracking-[-.06em] text-ink lg:text-[68px]">{fmt(timer.remaining)}</div>
          <p className="mt-2 max-w-52 text-sm font-medium text-ink-3 lg:max-w-xs">{task?.title ?? 'Pick a focus task from Today'}</p>
        </div>
      </motion.div>
      <div className="w-full space-y-3">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[var(--hair)] bg-paper-2 p-1">
          <Button variant={timer.mode === 'focus' ? 'dark' : 'ghost'} onClick={() => timer.setMode('focus')}>Focus</Button>
          <Button variant={timer.mode === 'break' ? 'dark' : 'ghost'} onClick={() => timer.setMode('break')}>Break</Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="soft" onClick={timer.reset}><RotateCcw size={16} />Reset</Button>
          <Button className="col-span-2" onClick={() => timer.setRunning(!timer.running)}>{timer.running ? <Pause size={16} /> : <Play size={16} />}{timer.running ? 'Pause' : 'Start'}</Button>
        </div>
      </div>
    </div>
  )
}
