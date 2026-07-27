import { useRestTimer } from '../context/RestTimerContext'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function PlayIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
      <path d="M7 5.5v13a1 1 0 001.5.87l11-6.5a1 1 0 000-1.74l-11-6.5A1 1 0 007 5.5z" />
    </svg>
  )
}

function PauseIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

function CloseIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={props.className}>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export default function RestTimerBar() {
  const { remaining, duration, running, pause, resume, reset, adjust } = useRestTimer()

  if (remaining <= 0 && !running) return null

  const progress = duration > 0 ? Math.min(1, remaining / duration) : 0

  return (
    <div className="mx-auto max-w-md px-5 pb-2">
      <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-surface px-4 py-3 shadow-xl shadow-black/40">
        <button
          onClick={() => adjust(-15)}
          className="w-8 text-xs font-bold text-zinc-400 active:text-accent"
        >
          -15
        </button>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-lg font-bold tabular-nums text-white">{formatTime(remaining)}</span>
            <span className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">休憩中</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => adjust(15)}
          className="w-8 text-xs font-bold text-zinc-400 active:text-accent"
        >
          +15
        </button>

        <button
          onClick={running ? pause : resume}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
        >
          {running ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </button>

        <button onClick={reset} className="shrink-0 text-zinc-600 hover:text-red-400">
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
