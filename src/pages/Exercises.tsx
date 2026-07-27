import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export default function Exercises() {
  const [name, setName] = useState('')
  const exercises = useLiveQuery(() => db.exercises.orderBy('name').toArray(), [])

  async function addExercise(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await db.exercises.add({ name: trimmed, createdAt: new Date().toISOString() })
    setName('')
  }

  async function removeExercise(id: number) {
    await db.exercises.delete(id)
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">種目</h1>

      <form onSubmit={addExercise} className="mb-6 flex gap-2 rounded-2xl border border-white/5 bg-surface p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: ベンチプレス"
          className="flex-1 rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent px-4 py-2.5 font-bold text-accent-foreground transition active:scale-[0.98]"
        >
          追加
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {exercises?.map((ex) => (
          <li
            key={ex.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-surface px-4 py-3"
          >
            <span className="font-medium text-zinc-100">{ex.name}</span>
            <button
              onClick={() => removeExercise(ex.id)}
              className="text-xs text-zinc-600 hover:text-red-400"
            >
              削除
            </button>
          </li>
        ))}
        {exercises?.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-surface p-4 text-sm text-zinc-500">
            まだ種目がありません。上のフォームから追加してください。
          </p>
        )}
      </ul>
    </div>
  )
}
