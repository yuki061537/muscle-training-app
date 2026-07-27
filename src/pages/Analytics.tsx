import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { db } from '../db'
import DataBackup from '../components/DataBackup'

const tooltipStyle = {
  background: '#202126',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#f4f4f5',
  fontSize: 12,
}

export default function Analytics() {
  const [exerciseId, setExerciseId] = useState<number | ''>('')
  const exercises = useLiveQuery(() => db.exercises.orderBy('name').toArray(), [])
  const sets = useLiveQuery(
    () => (exerciseId ? db.sets.where('exerciseId').equals(exerciseId).sortBy('date') : []),
    [exerciseId],
  )
  const bodyWeights = useLiveQuery(() => db.bodyWeights.orderBy('date').toArray(), [])

  const chartData = Object.values(
    (sets ?? []).reduce<Record<string, { date: string; maxWeight: number; volume: number }>>(
      (acc, set) => {
        const entry = acc[set.date] ?? { date: set.date, maxWeight: 0, volume: 0 }
        entry.maxWeight = Math.max(entry.maxWeight, set.weight)
        entry.volume += set.weight * set.reps
        acc[set.date] = entry
        return acc
      },
      {},
    ),
  )

  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">分析</h1>

      {bodyWeights && bodyWeights.length > 0 && (
        <div className="mb-6 rounded-2xl border border-white/5 bg-surface p-4">
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">体重 (kg)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bodyWeights}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 11, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="weight" stroke="#fb923c" strokeWidth={2.5} dot={{ fill: '#fb923c', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {exercises?.length === 0 ? (
        <p className="rounded-2xl border border-white/5 bg-surface p-4 text-sm text-zinc-400">記録がまだありません。</p>
      ) : (
        <select
          value={exerciseId}
          onChange={(e) => setExerciseId(Number(e.target.value))}
          className="mb-6 w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 text-zinc-100 focus:border-accent focus:outline-none"
        >
          <option value="">種目を選択</option>
          {exercises?.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      )}

      {exerciseId && chartData.length === 0 && (
        <p className="rounded-2xl border border-white/5 bg-surface p-4 text-sm text-zinc-500">
          この種目の記録がまだありません。
        </p>
      )}

      {chartData.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/5 bg-surface p-4">
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">最大重量 (kg)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  stroke="#baf24d"
                  strokeWidth={2.5}
                  dot={{ fill: '#baf24d', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-white/5 bg-surface p-4">
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">総ボリューム (kg×回)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ fill: '#38bdf8', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-6">
        <DataBackup />
      </div>
    </div>
  )
}
