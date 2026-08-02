import { NavLink, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import Log from './pages/Log'
import Exercises from './pages/Exercises'
import Programs from './pages/Programs'
import Analytics from './pages/Analytics'
import Help from './pages/Help'
import Export from './pages/Export'
import Monster from './pages/Monster'
import { RestTimerProvider } from './context/RestTimerContext'
import RestTimerBar from './components/RestTimerBar'

function DumbbellIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={props.className}>
      <rect x="1.5" y="9" width="3" height="6" rx="1" />
      <rect x="19.5" y="9" width="3" height="6" rx="1" />
      <rect x="6" y="7" width="2.5" height="10" rx="1" />
      <rect x="15.5" y="7" width="2.5" height="10" rx="1" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
    </svg>
  )
}

function PencilIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={props.className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  )
}

function ListIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={props.className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z"
      />
    </svg>
  )
}

function ChartIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={props.className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  )
}

function SparkleIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={props.className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5c.5 3.2 1.3 5 2.6 6.3 1.3 1.3 3.1 2.1 6.3 2.6-3.2.5-5 1.3-6.3 2.6-1.3 1.3-2.1 3.1-2.6 6.3-.5-3.2-1.3-5-2.6-6.3-1.3-1.3-3.1-2.1-6.3-2.6 3.2-.5 5-1.3 6.3-2.6C10.7 8.5 11.5 6.7 12 3.5z"
      />
    </svg>
  )
}

function HelpIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={props.className}>
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.5a2.25 2.25 0 114.06 1.33c-.53.66-1.31 1.06-1.31 1.92v.4"
      />
      <circle cx="12" cy="16.5" r="0.1" fill="currentColor" strokeWidth={1.5} />
    </svg>
  )
}

const navItems: { to: string; label: string; end?: boolean; icon: (p: { className?: string }) => ReactNode }[] = [
  { to: '/', label: '記録', end: true, icon: PencilIcon },
  { to: '/exercises', label: '種目', icon: DumbbellIcon },
  { to: '/programs', label: 'メニュー', icon: ListIcon },
  { to: '/analytics', label: '分析', icon: ChartIcon },
  { to: '/monster', label: 'モンスター', icon: SparkleIcon },
]

export default function App() {
  return (
    <RestTimerProvider>
      <div className="min-h-svh bg-canvas text-zinc-100 print:bg-white print:text-zinc-900">
        <header className="mx-auto flex max-w-md items-center gap-2 px-5 pt-6 pb-4 print:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
            <DumbbellIcon className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-extrabold tracking-tight text-white">筋トレ記録</h1>
            <p className="text-xs text-zinc-500">今日もいい追い込みを</p>
          </div>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                isActive ? 'border-accent text-accent' : 'border-white/10 text-zinc-400'
              }`
            }
          >
            <HelpIcon className="h-5 w-5" />
          </NavLink>
        </header>

        <main className="mx-auto max-w-md px-5 pb-44 print:pb-0">
          <Routes>
            <Route path="/" element={<Log />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/help" element={<Help />} />
            <Route path="/export" element={<Export />} />
            <Route path="/monster" element={<Monster />} />
          </Routes>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-20 print:hidden">
          <RestTimerBar />
          <nav className="border-t border-white/5 bg-canvas/90 backdrop-blur-lg [padding-bottom:env(safe-area-inset-bottom)]">
            <ul className="mx-auto flex max-w-md px-3 py-2">
              {navItems.map(({ to, label, end, icon: Icon }) => (
                <li key={to} className="flex-1">
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `mx-1 flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors ${
                        isActive ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-zinc-300'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </RestTimerProvider>
  )
}
