import { useRef, useState } from 'react'
import { db, type BodyWeight, type Exercise, type Program, type WorkoutSet } from '../db'

interface BackupFile {
  version: 1
  exportedAt: string
  exercises: Exercise[]
  sets: WorkoutSet[]
  programs: Program[]
  bodyWeights: BodyWeight[]
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10)
}

export default function DataBackup() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)

  async function exportData() {
    const [exercises, sets, programs, bodyWeights] = await Promise.all([
      db.exercises.toArray(),
      db.sets.toArray(),
      db.programs.toArray(),
      db.bodyWeights.toArray(),
    ])
    const backup: BackupFile = {
      version: 1,
      exportedAt: new Date().toISOString(),
      exercises,
      sets,
      programs,
      bodyWeights,
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `トレモン-backup-${todayStamp()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setStatus('書き出しが完了しました')
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text) as Partial<BackupFile>
      if (!Array.isArray(data.exercises) || !Array.isArray(data.sets) || !Array.isArray(data.programs)) {
        setStatus('ファイルの形式が正しくありません')
        return
      }
      const confirmed = window.confirm(
        '現在アプリ内にあるすべてのデータをこのバックアップで上書きします。よろしいですか?',
      )
      if (!confirmed) return

      await db.transaction('rw', db.exercises, db.sets, db.programs, db.bodyWeights, async () => {
        await Promise.all([
          db.exercises.clear(),
          db.sets.clear(),
          db.programs.clear(),
          db.bodyWeights.clear(),
        ])
        await db.exercises.bulkAdd(data.exercises!)
        await db.sets.bulkAdd(data.sets!)
        await db.programs.bulkAdd(data.programs!)
        if (Array.isArray(data.bodyWeights)) {
          await db.bodyWeights.bulkAdd(data.bodyWeights)
        }
      })
      setStatus('読み込みが完了しました')
    } catch {
      setStatus('読み込みに失敗しました。ファイルを確認してください')
    }
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-surface p-4">
      <h2 className="mb-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase">データのバックアップ</h2>
      <p className="mb-3 text-xs text-zinc-500">
        記録はこの端末のブラウザ内にのみ保存されています。書き出しておくと機種変更やブラウザデータ消去に備えられます。
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={exportData}
          className="flex-1 rounded-xl border border-white/10 bg-surface-2 py-2.5 text-sm font-bold text-zinc-100 transition active:scale-[0.98]"
        >
          書き出す
        </button>
        <button
          type="button"
          onClick={triggerImport}
          className="flex-1 rounded-xl border border-white/10 bg-surface-2 py-2.5 text-sm font-bold text-zinc-100 transition active:scale-[0.98]"
        >
          読み込む
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileSelected}
        className="hidden"
      />
      {status && <p className="mt-2 text-xs text-accent">{status}</p>}
    </div>
  )
}
