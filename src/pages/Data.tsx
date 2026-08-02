import { Link } from 'react-router-dom'
import DataBackup from '../components/DataBackup'

export default function Data() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">データ</h1>

      <Link
        to="/export"
        className="mb-4 flex items-center justify-between rounded-2xl border border-white/5 bg-surface p-4"
      >
        <div>
          <h2 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">記録の書き出し</h2>
          <p className="mt-1 text-sm text-zinc-300">PDFとして保存・印刷する</p>
        </div>
        <span className="text-accent">→</span>
      </Link>

      <DataBackup />
    </div>
  )
}
