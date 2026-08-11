import { MONSTER_STAGES } from '../lib/monster'

export type Facing = 'left' | 'right'

// Base render size (px) at scale 1 - each stage's `scale` multiplies this so
// later evolutions visibly loom larger while standing on the same ground line.
const BASE_SIZE = 64

export default function MonsterArt({
  level,
  facing = 'right',
  frame = 0,
  className,
}: {
  level: number
  facing?: Facing
  frame?: number
  className?: string
}) {
  const stage = MONSTER_STAGES.find((s) => s.level === level) ?? MONSTER_STAGES[0]
  const walkFrameIndex = (frame % 9) + 1
  const src = `${import.meta.env.BASE_URL}monster/${stage.key}-walkcycle-${facing}-${walkFrameIndex}.png`
  const size = BASE_SIZE * stage.scale

  return (
    <div className={`relative ${className ?? ''}`} style={{ width: size, height: size }}>
      <img src={src} alt="" className="h-full w-full object-contain" />
    </div>
  )
}
