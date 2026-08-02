import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { computeCareTier, computeEarnedFeed, computeStreak, getMonsterStage } from '../lib/monster'
import MonsterArt, { type Expression } from './MonsterArt'
import MonsterBackground from './MonsterBackground'

function today() {
  return new Date().toISOString().slice(0, 10)
}

const CARE_MESSAGES: Record<string, string> = {
  neglected: '💤 1週間以上お世話していません。餌をあげて元気にしてあげましょう',
  dedicated: '💛 毎日お世話できています!',
}

export default function TrainingMonster() {
  const [expression, setExpression] = useState<Expression>('open')
  const timeoutRef = useRef<number | undefined>(undefined)

  const allSets = useLiveQuery(() => db.sets.toArray(), [])
  const monsterState = useLiveQuery(() => db.monsterState.get(1), [])
  const feedings = useLiveQuery(() => db.feedings.toArray(), [])

  useEffect(() => {
    function scheduleBlink() {
      const delay = 2200 + Math.random() * 3000
      timeoutRef.current = window.setTimeout(() => {
        setExpression('blink')
        timeoutRef.current = window.setTimeout(() => {
          setExpression('open')
          scheduleBlink()
        }, 160)
      }, delay)
    }
    scheduleBlink()
    return () => window.clearTimeout(timeoutRef.current)
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

  async function feedMonster() {
    if (available <= 0) return
    await db.monsterState.put({ id: 1, fed: fed + available })
    await db.feedings.add({ date: today() })
  }

  return (
    <div className="mb-4 rounded-2xl border border-white/5 bg-surface p-4">
      <div className="relative mb-4 h-28 overflow-hidden rounded-xl bg-surface-2">
        <MonsterBackground level={current.level} className="absolute inset-0 h-full w-full" />
        <div className="monster-walk">
          <div className="monster-bob">
            <MonsterArt level={current.level} expression={expression} careTier={careTier} className="h-16 w-16" />
          </div>
        </div>
      </div>

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
