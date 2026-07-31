import type { ReactElement } from 'react'

const ACCENT = '#baf24d'
const ACCENT_DIM = '#8fc233'
const SHELL = '#3f3f46'
const DARK = '#0a0a0b'

function Eyes({ cx1, cx2, cy }: { cx1: number; cx2: number; cy: number }) {
  return (
    <>
      <circle cx={cx1} cy={cy} r="5" fill="white" />
      <circle cx={cx2} cy={cy} r="5" fill="white" />
      <circle cx={cx1 + 1} cy={cy + 1} r="2.4" fill={DARK} />
      <circle cx={cx2 + 1} cy={cy + 1} r="2.4" fill={DARK} />
    </>
  )
}

function Egg() {
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="108" rx="26" ry="5" fill="black" opacity="0.25" />
      <path d="M60 18c22 0 34 34 34 56a34 34 0 01-68 0c0-22 12-56 34-56z" fill={SHELL} />
      <path
        d="M46 44l8 10-10 6 12 8-8 10"
        stroke={ACCENT}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Slime() {
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="108" rx="30" ry="5" fill="black" opacity="0.25" />
      <path d="M60 26c26 0 40 26 40 50a40 34 0 01-80 0c0-24 14-50 40-50z" fill={ACCENT} />
      <ellipse cx="44" cy="52" rx="6" ry="8" fill="white" opacity="0.35" />
      <Eyes cx1={46} cx2={74} cy={70} />
      <path d="M52 84q8 6 16 0" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function MachoSlime() {
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="108" rx="34" ry="5" fill="black" opacity="0.25" />
      <ellipse cx="24" cy="70" rx="11" ry="14" fill={ACCENT_DIM} />
      <ellipse cx="96" cy="70" rx="11" ry="14" fill={ACCENT_DIM} />
      <path d="M60 22c28 0 44 26 44 50a44 36 0 01-88 0c0-24 16-50 44-50z" fill={ACCENT} />
      <rect x="30" y="42" width="60" height="12" rx="6" fill={DARK} opacity="0.85" />
      <rect x="55" y="40" width="10" height="16" fill={ACCENT_DIM} />
      <path d="M40 62l6-6M80 62l-6-6" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
      <Eyes cx1={46} cx2={74} cy={74} />
      <path d="M50 90q10 8 20 0" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function BabyDragon() {
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="108" rx="32" ry="5" fill="black" opacity="0.25" />
      <path d="M18 74q-14-8-10-22 12 2 18 12z" fill={ACCENT_DIM} />
      <path d="M102 74q14-8 10-22-12 2-18 12z" fill={ACCENT_DIM} />
      <path d="M60 30c26 0 38 24 38 46a38 32 0 01-76 0c0-22 12-46 38-46z" fill={ACCENT} />
      <path d="M46 30l4-10 6 8M74 30l-4-10-6 8" fill={ACCENT_DIM} />
      <ellipse cx="60" cy="86" rx="16" ry="12" fill="#d9f7a3" opacity="0.6" />
      <Eyes cx1={48} cx2={72} cy={64} />
      <path d="M54 78q6 5 12 0" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
      <path d="M88 92q10 6 8 16" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function Dragon() {
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="110" rx="36" ry="5" fill="black" opacity="0.25" />
      <path d="M12 68q-18-14-8-32 16 4 22 18z" fill={ACCENT_DIM} />
      <path d="M108 68q18-14 8-32-16 4-22 18z" fill={ACCENT_DIM} />
      <path d="M60 20c30 0 42 26 42 50a42 36 0 01-84 0c0-24 12-50 42-50z" fill={ACCENT} />
      <polygon points="46,20 52,8 58,20" fill={ACCENT_DIM} />
      <polygon points="62,20 68,8 74,20" fill={ACCENT_DIM} />
      <polygon points="52,28 60,18 68,28" fill={DARK} opacity="0.5" />
      <path d="M22 66q10-14 24-8" stroke={DARK} strokeWidth="7" strokeLinecap="round" />
      <path d="M98 66q-10-14-24-8" stroke={DARK} strokeWidth="7" strokeLinecap="round" />
      <circle cx="24" cy="52" r="8" fill={ACCENT} stroke={DARK} strokeWidth="3" />
      <circle cx="96" cy="52" r="8" fill={ACCENT} stroke={DARK} strokeWidth="3" />
      <Eyes cx1={48} cx2={72} cy={58} />
      <path d="M52 76q8 4 16 0" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
      <path d="M96 98q12 4 12 16" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function KingDragon() {
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="62" r="50" fill={ACCENT} opacity="0.12" />
      <ellipse cx="60" cy="112" rx="38" ry="5" fill="black" opacity="0.25" />
      <path d="M6 64q-20-16-8-36 18 4 24 20z" fill={ACCENT_DIM} />
      <path d="M114 64q20-16 8-36-18 4-24 20z" fill={ACCENT_DIM} />
      <path d="M60 20c30 0 42 26 42 48a42 36 0 01-84 0c0-22 12-48 42-48z" fill={ACCENT} />
      <polygon points="38,20 44,4 50,18 58,2 62,18 70,4 76,20" fill="#f5d94e" stroke={DARK} strokeWidth="2" />
      <circle cx="50" cy="14" r="2.4" fill="#f5d94e" />
      <circle cx="70" cy="14" r="2.4" fill="#f5d94e" />
      <path d="M20 64q10-16 26-9" stroke={DARK} strokeWidth="8" strokeLinecap="round" />
      <path d="M100 64q-10-16-26-9" stroke={DARK} strokeWidth="8" strokeLinecap="round" />
      <circle cx="22" cy="48" r="9" fill={ACCENT} stroke={DARK} strokeWidth="3" />
      <circle cx="98" cy="48" r="9" fill={ACCENT} stroke={DARK} strokeWidth="3" />
      <Eyes cx1={48} cx2={72} cy={56} />
      <path d="M52 74q8 5 16 0" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
      <g fill="#f5d94e">
        <polygon points="14,30 16,34 20,35 16,37 14,41 12,37 8,35 12,34" />
        <polygon points="106,84 108,88 112,89 108,91 106,95 104,91 100,89 104,88" />
        <polygon points="100,24 101.5,27 105,28 101.5,29.5 100,33 98.5,29.5 95,28 98.5,27" />
      </g>
    </svg>
  )
}

const ARTWORK: Record<number, () => ReactElement> = {
  1: Egg,
  2: Slime,
  3: MachoSlime,
  4: BabyDragon,
  5: Dragon,
  6: KingDragon,
}

export default function MonsterArt({ level, className }: { level: number; className?: string }) {
  const Art = ARTWORK[level] ?? Egg
  return (
    <div className={className}>
      <Art />
    </div>
  )
}
