import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { computeStreak, getMonsterStage } from '../lib/monster'
import MonsterArt, { type Expression } from './MonsterArt'
import MonsterBackground from './MonsterBackground'

export default function TrainingMonster() {
  const [expression, setExpression] = useState<Expression>('open')
  const timeoutRef = useRef<number | undefined>(undefined)

  const allDates = useLiveQuery(async () => {
    const sets = await db.sets.toArray()
    return sets.map((s) => s.date)
  }, [])

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

  if (!allDates) return null

  const uniqueDays = new Set(allDates).size
  const streak = computeStreak(allDates)
  const { current, next } = getMonsterStage(uniqueDays)
  const daysToNext = next ? next.minDays - uniqueDays : 0
  const progress = next ? (uniqueDays - current.minDays) / (next.minDays - current.minDays) : 1

  return (
    <div className="mb-4 rounded-2xl border border-white/5 bg-surface p-4">
      <div className="relative mb-4 h-28 overflow-hidden rounded-xl bg-surface-2">
        <MonsterBackground level={current.level} className="absolute inset-0 h-full w-full" />
        <div className="monster-walk">
          <div className="monster-bob">
            <MonsterArt level={current.level} expression={expression} className="h-16 w-16" />
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
      <p className="mb-2 text-xs text-zinc-500">累計トレーニング日数: {uniqueDays}日</p>
      {next ? (
        <>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-zinc-600">次の進化まであと{daysToNext}日</p>
        </>
      ) : (
        <p className="text-[11px] font-bold text-accent">最終形態!</p>
      )}
    </div>
  )
}
