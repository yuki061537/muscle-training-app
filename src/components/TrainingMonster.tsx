import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { computeCareTier, computeEarnedFeed, computeStreak, getMonsterStage } from '../lib/monster'
import MonsterArt from './MonsterArt'

function today() {
  return new Date().toISOString().slice(0, 10)
}

const CARE_MESSAGES: Record<string, string> = {
  neglected: '💤 1週間以上お世話していません。餌をあげて元気にしてあげましょう',
  dedicated: '💛 毎日お世話できています!',
}

const PET_REACTIONS = ['ぷるん!', 'もっと鍛えて!', 'うれしい!', 'がんばるぞ!', 'きたえろ!', 'つよくなる!']

// Wander cycle: walk to one side, pause to idle-fidget, walk back, pause again -
// a slow patrol rather than a single continuous slide. Each art stage has a
// genuine 9-frame walk cycle, so the walking legs run through 3 full strides
// while crossing the card instead of just alternating 2 frames.
const STRIDE_FRAMES = 9
const WALK_TICKS = STRIDE_FRAMES * 3
const PAUSE_TICKS = 6
const CYCLE = (WALK_TICKS + PAUSE_TICKS) * 2
const TICK_MS = 130

function wanderState(step: number) {
  const leg = WALK_TICKS + PAUSE_TICKS
  const local = step % CYCLE
  if (local < WALK_TICKS) {
    const progress = local / (WALK_TICKS - 1)
    return { x: 8 + progress * 64, facing: 'right' as const, walking: true, walkFrame: local % STRIDE_FRAMES }
  }
  if (local < leg) {
    return { x: 72, facing: 'right' as const, walking: false, walkFrame: 0 }
  }
  const s2 = local - leg
  if (s2 < WALK_TICKS) {
    const progress = s2 / (WALK_TICKS - 1)
    return { x: 72 - progress * 64, facing: 'left' as const, walking: true, walkFrame: s2 % STRIDE_FRAMES }
  }
  return { x: 8, facing: 'left' as const, walking: false, walkFrame: 0 }
}

export default function TrainingMonster() {
  const [step, setStep] = useState(0)
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([])
  const [sparkles, setSparkles] = useState<{ id: number; x: number }[]>([])
  const [squishKey, setSquishKey] = useState(0)
  const [celebrateKey, setCelebrateKey] = useState(0)
  const [reaction, setReaction] = useState<string | null>(null)
  const reactionTimeoutRef = useRef<number | undefined>(undefined)

  const allSets = useLiveQuery(() => db.sets.toArray(), [])
  const monsterState = useLiveQuery(() => db.monsterState.get(1), [])
  const feedings = useLiveQuery(() => db.feedings.toArray(), [])

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => s + 1), TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  if (!allSets || !feedings) return null

  const fed = monsterState?.fed ?? 0
  const earned = computeEarnedFeed(allSets)
  const available = Math.max(0, earned - fed)
  const streak = computeStreak(allSets.map((s) => s.date))
  const { current, next } = getMonsterStage(fed)
  const feedToNext = next ? next.minFed - fed : 0
  const progress = next ? (fed - current.minFed) / (next.minFed - current.minFed) : 1
  const careTier = computeCareTier(feedings.map((f) => f.date))

  const wander = wanderState(step)

  async function feedMonster() {
    if (available <= 0) return
    await db.monsterState.put({ id: 1, fed: fed + available })
    await db.feedings.add({ date: today() })

    const id = Date.now() + Math.random()
    setSparkles((prev) => [...prev, { id, x: wander.x - 5 + Math.random() * 10 }])
    window.setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 900)
    setCelebrateKey((k) => k + 1)
  }

  function petMonster() {
    const id = Date.now() + Math.random()
    const x = wander.x - 5 + Math.random() * 10
    setHearts((prev) => [...prev, { id, x }])
    window.setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 900)

    setSquishKey((k) => k + 1)

    setReaction(PET_REACTIONS[Math.floor(Math.random() * PET_REACTIONS.length)])
    window.clearTimeout(reactionTimeoutRef.current)
    reactionTimeoutRef.current = window.setTimeout(() => setReaction(null), 1100)
  }

  return (
    <div className="mb-4 rounded-2xl border border-white/5 bg-surface p-4">
      <button
        type="button"
        onClick={petMonster}
        aria-label="モンスターを撫でる"
        className="relative mb-4 h-28 w-full overflow-hidden rounded-xl bg-surface-2 bg-cover bg-center active:scale-[0.99]"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}monster/bg-jungle.png)` }}
      >
        <div className="monster-sprite" style={{ left: `${wander.x}%` }}>
          <div className={wander.walking ? undefined : 'monster-bob'}>
            <div key={squishKey} className={squishKey > 0 ? 'monster-squish' : undefined}>
              <div key={celebrateKey} className={celebrateKey > 0 ? 'monster-celebrate' : undefined}>
                <MonsterArt
                  level={current.level}
                  facing={wander.facing}
                  frame={wander.walkFrame}
                  careTier={careTier}
                />
              </div>
            </div>
          </div>
        </div>
        {hearts.map((heart) => (
          <span key={heart.id} className="monster-heart text-lg" style={{ left: `${heart.x}%` }}>
            💗
          </span>
        ))}
        {sparkles.map((s) => (
          <span key={s.id} className="monster-sparkle text-lg" style={{ left: `${s.x}%` }}>
            ✨
          </span>
        ))}
        {reaction && (
          <span className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-canvas/80 px-2 py-1 text-xs font-bold text-white">
            {reaction}
          </span>
        )}
      </button>

      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-white">{current.name}</p>
        {streak > 1 && (
          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
            🔥{streak}日連続
          </span>
        )}
      </div>

      {CARE_MESSAGES[careTier] && (
        <p className="mt-1 text-[11px] text-zinc-400">{CARE_MESSAGES[careTier]}</p>
      )}

      {next ? (
        <>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-zinc-600">次の進化まであと餌{feedToNext}</p>
        </>
      ) : (
        <p className="mt-2 text-[11px] font-bold text-accent">最終形態!</p>
      )}

      <button
        type="button"
        onClick={feedMonster}
        disabled={available <= 0}
        className="mt-3 w-full rounded-xl bg-accent py-2.5 font-bold text-accent-foreground transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
      >
        {available > 0 ? `餌をあげる (${available})` : '餌がありません'}
      </button>
      <p className="mt-2 text-center text-[11px] text-zinc-600">
        トレーニングで餌がたまります(合計{earned} · 使用済み{fed})
      </p>
    </div>
  )
}
