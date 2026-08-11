import type { CareTier } from '../lib/monster'
import { MONSTER_STAGES } from '../lib/monster'

export type Facing = 'left' | 'right'

// The source art has no per-stage neglected/dedicated variants, so care is
// reflected with a universal filter + badge layered on top of any stage.
const CARE_FILTER: Record<CareTier, string | undefined> = {
  neglected: 'grayscale(0.7) brightness(0.65)',
  normal: undefined,
  dedicated: 'saturate(1.25) brightness(1.08) drop-shadow(0 0 6px rgba(255,215,110,0.55))',
}

// Base render size (px) at scale 1 - each stage's `scale` multiplies this so
// later evolutions visibly loom larger while standing on the same ground line.
const BASE_SIZE = 64

export default function MonsterArt({
  level,
  facing = 'right',
  frame = 0,
  careTier = 'normal',
  className,
}: {
  level: number
  facing?: Facing
  frame?: number
  careTier?: CareTier
  className?: string
}) {
  const stage = MONSTER_STAGES.find((s) => s.level === level) ?? MONSTER_STAGES[0]
  const walkFrameIndex = (frame % 9) + 1
  const src = `${import.meta.env.BASE_URL}monster/${stage.key}-walkcycle-${facing}-${walkFrameIndex}.png`
  const size = BASE_SIZE * stage.scale

  return (
    <div className={`relative ${className ?? ''}`} style={{ width: size, height: size }}>
      <img
        src={src}
        alt=""
        className="h-full w-full object-contain"
        style={{ filter: CARE_FILTER[careTier] }}
      />
      {careTier === 'neglected' && <span className="absolute -top-1 -right-1 text-xs">💤</span>}
      {careTier === 'dedicated' && <span className="absolute -top-1 -right-1 text-xs">✨</span>}
    </div>
  )
}
