import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { groupConsecutiveSets } from '../lib/sets'

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10)
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function Export() {
  const [from, setFrom] = useState(daysAgo(30))
  const [to, setTo] = useState(today())

  const exercises = useLiveQuery(() => db.exercises.toArray(), [])
  const sets = useLiveQuery(
    () => db.sets.where('date').between(from, to, true, true).sortBy('date'),
    [from, to],
  )
  const bodyWeights = useLiveQuery(
    () => db.bodyWeights.where('date').between(from, to, true, true).toArray(),
    [from, to],
  )
  const exerciseMap = new Map(exercises?.map((ex) => [ex.id, ex.name]))
  const bodyWeightMap = new Map(bodyWeights?.map((b) => [b.date, b.weight]))

  const byDate = new Map<string, typeof sets>()
  for (const set of sets ?? []) {
    const list = byDate.get(set.date) ?? []
    list.push(set)
    byDate.set(set.date, list)
  }
  const dates = Array.from(byDate.keys()).sort().reverse()

  return (
    <div>
      <div className="print:hidden">
        <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">書き出し</h1>

        <div className="mb-4 flex items-end gap-3 rounded-2xl border border-white/5 bg-surface p-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-zinc-500">開始日</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-sm text-zinc-200 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-zinc-500">終了日</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-sm text-zinc-200 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="mb-4 w-full rounded-xl bg-accent py-2.5 font-bold text-accent-foreground transition active:scale-[0.98]"
        >
          印刷 / PDFとして保存
        </button>
        <p className="mb-4 text-xs text-zinc-500">
          印刷ダイアログの送信先で「PDFに保存」を選ぶとPDFファイルとして書き出せます。
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 text-zinc-900 print:rounded-none print:p-0">
        <h2 className="text-lg font-bold">トレモン</h2>
        <p className="mb-4 text-xs text-zinc-500">
          {from} 〜 {to}
        </p>

        {dates.length === 0 && <p className="text-sm text-zinc-500">この期間の記録はありません。</p>}

        <div className="flex flex-col gap-4">
          {dates.map((date) => (
            <div key={date} className="break-inside-avoid">
              <div className="mb-1 flex items-baseline gap-2 border-b border-zinc-300 pb-1">
                <span className="font-bold">{date}</span>
                {bodyWeightMap.has(date) && (
                  <span className="text-xs text-zinc-500">体重 {bodyWeightMap.get(date)}kg</span>
                )}
              </div>
              <ul className="text-sm">
                {groupConsecutiveSets(byDate.get(date) ?? []).map((group) => (
                  <li key={group.ids[0]} className="flex justify-between py-0.5">
                    <span>{exerciseMap.get(group.exerciseId) ?? '不明な種目'}</span>
                    <span className="font-mono">
                      {group.weight}kg × {group.reps}回
                      {group.ids.length > 1 && ` × ${group.ids.length}セット`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
