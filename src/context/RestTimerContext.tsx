import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

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
  // Absolute end timestamp (ms). Recomputing remaining from this on every
  // tick/resync means the countdown stays correct even if setInterval gets
  // throttled or fully suspended while the tab/PWA is backgrounded.
  const endAtRef = useRef<number | null>(null)

  function syncFromEndAt() {
    if (endAtRef.current === null) return
    const rem = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
    setRemaining(rem)
    if (rem <= 0) {
      endAtRef.current = null
      setRunning(false)
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      playBeep()
    }
  }

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(syncFromEndAt, 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  useEffect(() => {
    // Resync the moment the app comes back to the foreground, instead of
    // waiting for the next 1s tick (which may be delayed after backgrounding).
    document.addEventListener('visibilitychange', syncFromEndAt)
    window.addEventListener('focus', syncFromEndAt)
    window.addEventListener('pageshow', syncFromEndAt)
    return () => {
      document.removeEventListener('visibilitychange', syncFromEndAt)
      window.removeEventListener('focus', syncFromEndAt)
      window.removeEventListener('pageshow', syncFromEndAt)
    }
  }, [])

  function start(seconds: number) {
    setDuration(seconds)
    endAtRef.current = Date.now() + seconds * 1000
    setRemaining(seconds)
    setRunning(true)
  }

  function pause() {
    if (endAtRef.current !== null) {
      setRemaining(Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000)))
    }
    endAtRef.current = null
    setRunning(false)
  }

  function resume() {
    if (remaining <= 0) return
    endAtRef.current = Date.now() + remaining * 1000
    setRunning(true)
  }

  function reset() {
    endAtRef.current = null
    setRunning(false)
    setRemaining(0)
  }

  function adjust(deltaSeconds: number) {
    const next = Math.max(0, remaining + deltaSeconds)
    if (running) {
      endAtRef.current = Date.now() + next * 1000
    }
    setRemaining(next)
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
