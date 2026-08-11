import { MONSTER_STAGES } from '../lib/monster'

export type Facing = 'left' | 'right'
export type Pose = 'walk' | 'flex'

// Base render size (px) at scale 1 - each stage's `scale` multiplies this so
// later evolutions visibly loom larger while standing on the same ground line.
const BASE_SIZE = 64

export default function MonsterArt({
  level,
  pose = 'walk',
  facing = 'right',
  frame = 0,
  className,
}: {
  level: number
  pose?: Pose
  facing?: Facing
  frame?: number
  className?: string
}) {
  const stage = MONSTER_STAGES.find((s) => s.level === level) ?? MONSTER_STAGES[0]
  const size = BASE_SIZE * stage.scale

  // The flex pose art is a single front-on shot (no separate left/right cuts),
  // so it's mirrored to match whichever way the monster was last facing.
  const src =
    pose === 'flex'
      ? `${import.meta.env.BASE_URL}monster/${stage.key}-flex-${(frame % 2) + 1}.png`
      : `${import.meta.env.BASE_URL}monster/${stage.key}-walkcycle-${facing}-${(frame % 9) + 1}.png`
  const mirror = pose === 'flex' && facing === 'left'

  return (
    <div className={`relative ${className ?? ''}`} style={{ width: size, height: size }}>
      <img
        src={src}
        alt=""
        className="h-full w-full object-contain"
        style={{ transform: mirror ? 'scaleX(-1)' : undefined }}
      />
    </div>
  )
}
