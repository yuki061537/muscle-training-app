import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { estimateOneRepMax, RM_TABLE } from '../lib/oneRepMax'

export default function OneRepMax() {
  const [exerciseId, setExerciseId] = useState<number | ''>('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  const exercises = useLiveQuery(() => db.exercises.orderBy('name').toArray(), [])
  const lastSet = useLiveQuery(async () => {
    if (!exerciseId) return undefined
    const sets = await db.sets.where('exerciseId').equals(exerciseId).sortBy('date')
    return sets.at(-1)
  }, [exerciseId])

  function applyLastSet() {
    if (!lastSet) return
    setWeight(String(lastSet.weight))
    setReps(String(lastSet.reps))
  }

  const oneRm = estimateOneRepMax(Number(weight) || 0, Number(reps) || 0)

  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">RM計算</h1>

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/5 bg-surface p-4">
        {exercises && exercises.length > 0 && (
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 text-zinc-100 focus:border-accent focus:outline-none"
          >
            <option value="">種目を選択(任意)</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        )}

        {exerciseId && lastSet && (
          <button
            type="button"
            onClick={applyLastSet}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-left transition-colors active:border-accent"
          >
            <span className="text-xs text-zinc-500">
              前回: <span className="font-mono font-bold text-zinc-300">{lastSet.weight}kg × {lastSet.reps}回</span>
            </span>
            <span className="text-xs font-bold text-accent">この記録を使う</span>
          </button>
        )}

        <div className="flex gap-3">
          <input
            type="number"
            inputMode="decimal"
            placeholder="重量 (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-1/2 rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="回数"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-1/2 rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/5 bg-surface p-4 text-center">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">推定 1RM</p>
        <p className="mt-1 font-mono text-3xl font-extrabold text-accent">
          {oneRm > 0 ? oneRm.toFixed(1) : '—'}
          <span className="ml-1 text-base text-zinc-500">kg</span>
        </p>
      </div>

      {oneRm > 0 && (
        <div className="rounded-2xl border border-white/5 bg-surface p-4">
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">強度早見表</h2>
          <div className="flex flex-col">
            {RM_TABLE.map(({ percent, reps: repGuide }) => (
              <div
                key={percent}
                className="flex items-center justify-between border-b border-white/5 py-2 text-sm last:border-0"
              >
                <span className="text-zinc-400">{percent}%</span>
                <span className="font-mono font-bold text-zinc-100">{((oneRm * percent) / 100).toFixed(1)}kg</span>
                <span className="text-xs text-zinc-600">目安 {repGuide}回</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-zinc-600">
        Epleyの公式(重量 ×(1 + 回数 ÷ 30))による推定値です。フォームや疲労度によって実際の数値とは差が出ます。
      </p>
    </div>
  )
}
