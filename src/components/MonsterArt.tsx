import type { CareTier } from '../lib/monster'

const STAGE_IMAGES: Record<number, string> = {
  1: 'monster/wolf-1-egg.png',
  2: 'monster/wolf-2-baby.png',
  3: 'monster/wolf-3-growth.png',
  4: 'monster/wolf-4-mature.png',
  5: 'monster/wolf-5-final.png',
}

// The source art has no per-stage neglected/dedicated variants, so care is
// reflected with a universal filter + badge layered on top of any stage.
const CARE_FILTER: Record<CareTier, string | undefined> = {
  neglected: 'grayscale(0.7) brightness(0.65)',
  normal: undefined,
  dedicated: 'saturate(1.25) brightness(1.08) drop-shadow(0 0 6px rgba(255,215,110,0.55))',
}

export default function MonsterArt({
  level,
  careTier = 'normal',
  className,
}: {
  level: number
  careTier?: CareTier
  className?: string
}) {
  const src = `${import.meta.env.BASE_URL}${STAGE_IMAGES[level] ?? STAGE_IMAGES[1]}`
  return (
    <div className={`relative ${className ?? ''}`}>
      <img src={src} alt="" className="h-full w-full object-contain" style={{ filter: CARE_FILTER[careTier] }} />
      {careTier === 'neglected' && <span className="absolute -top-1 -right-1 text-xs">💤</span>}
      {careTier === 'dedicated' && <span className="absolute -top-1 -right-1 text-xs">✨</span>}
    </div>
  )
}
