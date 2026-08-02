import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export default function Programs() {
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null)

  const exercises = useLiveQuery(() => db.exercises.orderBy('name').toArray(), [])
  const programs = useLiveQuery(() => db.programs.toArray(), [])
  const exerciseMap = new Map(exercises?.map((ex) => [ex.id, ex.name]))

  function toggleExercise(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function startEditing(program: { id: number; name: string; exerciseIds: number[] }) {
    setEditingProgramId(program.id)
    setName(program.name)
    setSelectedIds(program.exerciseIds)
  }

  function cancelEditing() {
    setEditingProgramId(null)
    setName('')
    setSelectedIds([])
  }

  async function saveProgram(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || selectedIds.length === 0) return
    if (editingProgramId) {
      await db.programs.update(editingProgramId, { name: trimmed, exerciseIds: selectedIds })
    } else {
      await db.programs.add({ name: trimmed, exerciseIds: selectedIds })
    }
    setEditingProgramId(null)
    setName('')
    setSelectedIds([])
  }

  async function removeProgram(id: number) {
    if (editingProgramId === id) cancelEditing()
    await db.programs.delete(id)
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">メニュー</h1>

      {exercises?.length === 0 ? (
        <p className="rounded-2xl border border-white/5 bg-surface p-4 text-sm text-zinc-400">
          先に「種目」画面で種目を登録してください。
        </p>
      ) : (
        <form
          onSubmit={saveProgram}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/5 bg-surface p-4"
        >
          {editingProgramId && (
            <p className="text-xs font-medium text-accent">メニューを編集中</p>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 胸の日"
            className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {exercises?.map((ex) => (
              <button
                type="button"
                key={ex.id}
                onClick={() => toggleExercise(ex.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedIds.includes(ex.id)
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-white/10 bg-surface-2 text-zinc-400'
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {editingProgramId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-xl border border-white/10 px-4 py-2.5 font-bold text-zinc-400 transition active:scale-[0.98]"
              >
                キャンセル
              </button>
            )}
            <button
              type="submit"
              className="flex-1 rounded-xl bg-accent py-2.5 font-bold text-accent-foreground transition active:scale-[0.98]"
            >
              {editingProgramId ? '更新する' : 'メニューを作成'}
            </button>
          </div>
        </form>
      )}

      <ul className="flex flex-col gap-3">
        {programs?.map((program) => (
          <li
            key={program.id}
            className={`rounded-2xl border px-4 py-3 ${
              editingProgramId === program.id
                ? 'border-accent bg-surface'
                : 'border-white/5 bg-surface'
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-bold text-white">{program.name}</span>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => startEditing(program)}
                  className="text-xs text-zinc-400 hover:text-accent"
                >
                  編集
                </button>
                <button
                  onClick={() => removeProgram(program.id)}
                  className="text-xs text-zinc-600 hover:text-red-400"
                >
                  削除
                </button>
              </div>
            </div>
            <p className="text-sm text-zinc-500">
              {program.exerciseIds.map((id) => exerciseMap.get(id)).filter(Boolean).join(' / ')}
            </p>
          </li>
        ))}
        {programs?.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-surface p-4 text-sm text-zinc-500">
            まだメニューがありません。
          </p>
        )}
      </ul>
    </div>
  )
}
