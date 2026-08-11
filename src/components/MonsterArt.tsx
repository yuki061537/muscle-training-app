import type { CareTier } from '../lib/monster'
import { MONSTER_STAGES } from '../lib/monster'

export type Pose = 'idle' | 'walk'
export type Facing = 'left' | 'right'

// The source art has no per-stage neglected/dedicated variants, so care is
// reflected with a universal filter + badge layered on top of any stage.
const CARE_FILTER: Record<CareTier, string | undefined> = {
  neglected: 'grayscale(0.7) brightness(0.65)',
  normal: undefined,
  dedicated: 'saturate(1.25) brightness(1.08) drop-shadow(0 0 6px rgba(255,215,110,0.55))',
}

export default function MonsterArt({
  level,
  pose = 'idle',
  facing = 'right',
  frame = 0,
  careTier = 'normal',
  className,
}: {
  level: number
  pose?: Pose
  facing?: Facing
  frame?: number
  careTier?: CareTier
  className?: string
}) {
  const stage = MONSTER_STAGES.find((s) => s.level === level) ?? MONSTER_STAGES[0]
  const idleFrameIndex = (frame % 2) + 1
  const walkFrameIndex = (frame % 9) + 1

  // Every non-egg stage has a genuine 9-frame walk cycle per direction.
  // Everything else (egg) falls back to the direction-neutral idle art,
  // mirrored for "left".
  const usingDirectionalWalk = pose === 'walk' && stage.hasWalk
  const src = usingDirectionalWalk
    ? `${import.meta.env.BASE_URL}monster/${stage.key}-walkcycle-${facing}-${walkFrameIndex}.png`
    : `${import.meta.env.BASE_URL}monster/${stage.key}-idle-${idleFrameIndex}.png`
  const mirror = !usingDirectionalWalk && facing === 'left'

  return (
    <div className={`relative ${className ?? ''}`}>
      <img
        src={src}
        alt=""
        className="h-full w-full object-contain"
        style={{ filter: CARE_FILTER[careTier], transform: mirror ? 'scaleX(-1)' : undefined }}
      />
      {careTier === 'neglected' && <span className="absolute -top-1 -right-1 text-xs">💤</span>}
      {careTier === 'dedicated' && <span className="absolute -top-1 -right-1 text-xs">✨</span>}
    </div>
  )
}
