import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface RestTimerState {
  duration: number
  remaining: number
  running: boolean
  start: (seconds: number) => void
  pause: () => void
  resume: () => void
  reset: () => void
  adjust: (deltaSeconds: number) => void
}

const RestTimerContext = createContext<RestTimerState | null>(null)

function playBeep() {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioContextClass()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 880
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
  osc.start()
  osc.stop(ctx.currentTime + 0.6)
}

export function RestTimerProvider({ children }: { children: ReactNode }) {
  const [duration, setDuration] = useState(90)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false)
          if (navigator.vibrate) navigator.vibrate([200, 100, 200])
          playBeep()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  function start(seconds: number) {
    setDuration(seconds)
    setRemaining(seconds)
    setRunning(true)
  }

  function pause() {
    setRunning(false)
  }

  function resume() {
    setRunning((prev) => prev || remaining > 0)
  }

  function reset() {
    setRunning(false)
    setRemaining(0)
  }

  function adjust(deltaSeconds: number) {
    setRemaining((prev) => Math.max(0, prev + deltaSeconds))
  }

  return (
    <RestTimerContext.Provider value={{ duration, remaining, running, start, pause, resume, reset, adjust }}>
      {children}
    </RestTimerContext.Provider>
  )
}

export function useRestTimer() {
  const ctx = useContext(RestTimerContext)
  if (!ctx) throw new Error('useRestTimer must be used within RestTimerProvider')
  return ctx
}
