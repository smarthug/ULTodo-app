import { useEffect, useMemo, useState } from 'react'

export function usePomodoro(focusMinutes: number, breakMinutes: number) {
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const planned = useMemo(() => (mode === 'focus' ? focusMinutes : breakMinutes) * 60, [mode, focusMinutes, breakMinutes])
  const [remaining, setRemaining] = useState(planned)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setRemaining(planned)
    setRunning(false)
  }, [planned])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(id)
          setRunning(false)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  return { mode, setMode, planned, remaining, running, setRunning, reset: () => { setRunning(false); setRemaining(planned) } }
}
