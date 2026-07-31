import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { useRestTimer } from '../context/RestTimerContext'
import TrainingMonster from '../components/TrainingMonster'

const REST_PRESETS = [60, 90, 120, 180]
const REST_MIN = 15
const REST_MAX = 600
const REST_STEP = 15

function today() {
  return new Date().toISOString().slice(0, 10)
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function clampRest(seconds: number) {
  return Math.min(REST_MAX, Math.max(REST_MIN, seconds))
}

export default function Log() {
  const [exerciseId, setExerciseId] = useState<number | ''>('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState(today())
  const [restSeconds, setRestSeconds] = useState(90)
  const [bodyWeightInput, setBodyWeightInput] = useState('')
  const [activeProgramId, setActiveProgramId] = useState<number | ''>('')
  const weightInputRef = useRef<HTMLInputElement>(null)

  const { start: startRest } = useRestTimer()
  const exercises = useLiveQuery(() => db.exercises.orderBy('name').toArray(), [])
  const programs = useLiveQuery(() => db.programs.toArray(), [])
  const todaysSets = useLiveQuery(
    () => db.sets.where('date').equals(date).reverse().sortBy('id'),
    [date],
  )
  const lastSet = useLiveQuery(async () => {
    if (!exerciseId) return undefined
    const sets = await db.sets.where('exerciseId').equals(exerciseId).sortBy('date')
    return sets.at(-1)
  }, [exerciseId])
  const bodyWeightForDate = useLiveQuery(
    () => db.bodyWeights.where('date').equals(date).first(),
    [date],
  )
  const exerciseMap = new Map(exercises?.map((ex) => [ex.id, ex.name]))
  const activeProgram = programs?.find((p) => p.id === activeProgramId)
  const activeProgramExercises = activeProgram
    ?.exerciseIds.map((id) => exercises?.find((ex) => ex.id === id))
    .filter((ex): ex is NonNullable<typeof ex> => Boolean(ex))
  const loggedExerciseIds = new Set(todaysSets?.map((s) => s.exerciseId))

  function selectExerciseFromProgram(id: number) {
    setExerciseId(id)
    weightInputRef.current?.focus()
  }

  function applyLastSet() {
    if (!lastSet) return
    setWeight(String(lastSet.weight))
    setReps(String(lastSet.reps))
  }

  async function saveBodyWeight(e: React.FormEvent) {
    e.preventDefault()
    if (!bodyWeightInput) return
    const value = Number(bodyWeightInput)
    if (bodyWeightForDate) {
      await db.bodyWeights.update(bodyWeightForDate.id, { weight: value })
    } else {
      await db.bodyWeights.add({ date, weight: value })
    }
    setBodyWeightInput('')
  }

  async function addSet(e: React.FormEvent) {
    e.preventDefault()
    if (!exerciseId || !weight || !reps) return
    await db.sets.add({
      exerciseId,
      date,
      weight: Number(weight),
      reps: Number(reps),
    })
    setWeight('')
    setReps('')
    startRest(restSeconds)
  }

  async function removeSet(id: number) {
    await db.sets.delete(id)
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">記録</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-sm text-zinc-200 focus:border-accent focus:outline-none"
        />
      </div>

      <TrainingMonster />

      <form
        onSubmit={saveBodyWeight}
        className="mb-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-surface p-4"
      >
        <div className="flex-1">
          <p className="text-xs font-medium text-zinc-500">体重</p>
          {bodyWeightForDate ? (
            <p className="font-mono text-lg font-bold text-white">{bodyWeightForDate.weight}kg</p>
          ) : (
            <p className="text-sm text-zinc-600">この日はまだ未記録</p>
          )}
        </div>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          placeholder="kg"
          value={bodyWeightInput}
          onChange={(e) => setBodyWeightInput(e.target.value)}
          className="w-20 rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-center text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-3 py-2 text-sm font-bold text-accent-foreground transition active:scale-[0.98]"
        >
          保存
        </button>
      </form>

      {exercises?.length === 0 ? (
        <p className="rounded-2xl border border-white/5 bg-surface p-4 text-sm text-zinc-400">
          先に「種目」画面で種目を登録してください。
        </p>
      ) : (
        <form onSubmit={addSet} className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/5 bg-surface p-4">
          {programs && programs.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500">メニューから始める</p>
              <div className="flex flex-wrap gap-2">
                {programs.map((program) => (
                  <button
                    type="button"
                    key={program.id}
                    onClick={() => setActiveProgramId((prev) => (prev === program.id ? '' : program.id))}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeProgramId === program.id
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-white/10 bg-surface-2 text-zinc-400'
                    }`}
                  >
                    {program.name}
                  </button>
                ))}
              </div>

              {activeProgram && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeProgramExercises?.map((ex) => {
                    const done = loggedExerciseIds.has(ex.id)
                    return (
                      <button
                        type="button"
                        key={ex.id}
                        onClick={() => selectExerciseFromProgram(ex.id)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          exerciseId === ex.id
                            ? 'border-accent bg-accent/15 text-accent'
                            : done
                              ? 'border-white/5 bg-transparent text-zinc-600 line-through'
                              : 'border-white/10 bg-surface-2 text-zinc-300'
                        }`}
                      >
                        {ex.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 text-zinc-100 focus:border-accent focus:outline-none"
          >
            <option value="">種目を選択</option>
            {exercises?.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {exerciseId && lastSet && (
            <button
              type="button"
              onClick={applyLastSet}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-left transition-colors active:border-accent"
            >
              <span className="text-xs text-zinc-500">
                前回: <span className="font-mono font-bold text-zinc-300">{lastSet.weight}kg × {lastSet.reps}回</span>
              </span>
              <span className="text-xs font-bold text-accent">同じ数値を使う</span>
            </button>
          )}

          <div className="flex gap-3">
            <input
              ref={weightInputRef}
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

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-500">休憩時間(セット追加後に自動スタート)</p>
            <div className="mb-2 flex gap-2">
              {REST_PRESETS.map((seconds) => (
                <button
                  type="button"
                  key={seconds}
                  onClick={() => setRestSeconds(seconds)}
                  className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition-colors ${
                    restSeconds === seconds
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-white/10 bg-surface-2 text-zinc-400'
                  }`}
                >
                  {formatDuration(seconds)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface-2 px-3 py-2">
              <button
                type="button"
                onClick={() => setRestSeconds((prev) => clampRest(prev - REST_STEP))}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-lg font-bold text-zinc-300 active:text-accent"
              >
                −
              </button>
              <div className="flex flex-1 items-center justify-center gap-1">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={10}
                  value={Math.floor(restSeconds / 60)}
                  onChange={(e) =>
                    setRestSeconds((prev) => clampRest(Number(e.target.value || 0) * 60 + (prev % 60)))
                  }
                  onFocus={(e) => e.target.select()}
                  className="w-8 bg-transparent text-center font-mono text-sm font-bold tabular-nums text-white focus:outline-none"
                />
                <span className="text-sm font-bold text-zinc-600">分</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  value={restSeconds % 60}
                  onChange={(e) =>
                    setRestSeconds((prev) =>
                      clampRest(Math.floor(prev / 60) * 60 + Math.min(59, Number(e.target.value || 0))),
                    )
                  }
                  onFocus={(e) => e.target.select()}
                  className="w-8 bg-transparent text-center font-mono text-sm font-bold tabular-nums text-white focus:outline-none"
                />
                <span className="text-sm font-bold text-zinc-600">秒</span>
              </div>
              <button
                type="button"
                onClick={() => setRestSeconds((prev) => clampRest(prev + REST_STEP))}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-lg font-bold text-zinc-300 active:text-accent"
              >
                ＋
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-accent py-2.5 font-bold text-accent-foreground transition active:scale-[0.98]"
          >
            セットを追加
          </button>
        </form>
      )}

      <ul className="flex flex-col gap-2">
        {todaysSets?.map((set) => (
          <li
            key={set.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-surface px-4 py-3"
          >
            <span className="text-sm text-zinc-200">
              <span className="font-semibold text-white">{exerciseMap.get(set.exerciseId) ?? '不明な種目'}</span>
              <span className="mx-2 text-zinc-600">·</span>
              <span className="font-mono text-accent">{set.weight}kg</span>
              <span className="text-zinc-500"> × {set.reps}回</span>
            </span>
            <button
              onClick={() => removeSet(set.id)}
              className="text-xs text-zinc-600 hover:text-red-400"
            >
              削除
            </button>
          </li>
        ))}
        {todaysSets?.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-surface p-4 text-sm text-zinc-500">
            この日の記録はまだありません。
          </p>
        )}
      </ul>
    </div>
  )
}
