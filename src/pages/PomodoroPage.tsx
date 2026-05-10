import { Pause, Play, RotateCcw } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/features/tasks/task-store'
import { usePomodoro } from '@/hooks/use-pomodoro'

const fmt = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
const clampProgress = (value: number) => Math.min(1, Math.max(0, value))

export function TimerProgressRing({ progress }: { progress: number }) {
  const normalizedProgress = clampProgress(progress)
  const radius = 104
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - normalizedProgress)
  const progressPercent = Math.round(normalizedProgress * 100)

  return (
    <svg
      aria-label={`Timer progress ${progressPercent}%`}
      className="absolute inset-0 size-full -rotate-90"
      data-testid="timer-progress-ring"
      role="img"
      viewBox="0 0 256 256"
    >
      <circle
        className="text-paper-3"
        cx="128"
        cy="128"
        fill="none"
        r={radius}
        stroke="currentColor"
        strokeWidth="14"
      />
      <circle
        className="text-accent transition-[stroke-dashoffset] duration-500 ease-out"
        cx="128"
        cy="128"
        fill="none"
        r={radius}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth="14"
      />
    </svg>
  )
}

export function PomodoroPage() {
  const store = useTaskStore()
  const timer = usePomodoro(store.settings.pomodoroMinutes, store.settings.breakMinutes)
  const progress = timer.planned ? (timer.planned - timer.remaining) / timer.planned : 0
  const plannedMinutes = Math.round(timer.planned / 60)
  const modeLabel = timer.mode === 'focus' ? 'Focus session' : 'Break session'
  const stateLabel = timer.running ? 'In progress' : timer.remaining === 0 ? 'Complete' : 'Ready'

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-between overflow-hidden bg-paper px-5 py-8 text-center lg:max-w-xl lg:py-16">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">Pomodoro · {timer.mode}</p>
        <h1 className="mt-2 font-serif text-[36px] italic tracking-[-.04em] text-ink">Quiet execution.</h1>
        <p className="mt-2 text-sm text-ink-3">A clear circular timer for the next {plannedMinutes} minutes.</p>
      </div>
      <motion.div animate={{ scale: timer.running ? [1, 1.02, 1] : 1 }} transition={{ repeat: timer.running ? Infinity : 0, duration: 4 }} className="relative grid size-72 place-items-center rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_70%)] p-7 lg:size-96 lg:p-9">
        <div className="absolute inset-4 rounded-full border border-[var(--hair)]" />
        <TimerProgressRing progress={progress} />
        <div className="relative grid size-48 place-items-center rounded-full bg-paper/80 shadow-[0_24px_80px_rgba(26,24,20,0.08)] ring-1 ring-[var(--hair)] lg:size-64">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[.16em] text-ink-3">{stateLabel}</p>
            <div className="font-mono text-[54px] font-semibold tracking-[-.06em] text-ink lg:text-[68px]">{fmt(timer.remaining)}</div>
            <p className="mt-2 text-sm font-semibold text-ink-2">{modeLabel}</p>
          </div>
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
