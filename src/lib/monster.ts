export interface MonsterStage {
  level: number
  key: string
  name: string
  minFed: number
  frames: number
}

// Thresholds are cumulative amount of feed given (not earned) to reach each stage.
export const MONSTER_STAGES: MonsterStage[] = [
  { level: 1, key: 'egg', name: 'たまご', minFed: 0, frames: 1 },
  { level: 2, key: 'baby1', name: '幼年期I', minFed: 300, frames: 2 },
  { level: 3, key: 'baby2', name: '幼年期II', minFed: 1000, frames: 2 },
  { level: 4, key: 'growth', name: '成長期', minFed: 3000, frames: 2 },
  { level: 5, key: 'mature', name: '成熟期', minFed: 8000, frames: 2 },
  { level: 6, key: 'final', name: '完全体', minFed: 18000, frames: 2 },
  { level: 7, key: 'ultimate', name: '究極体', minFed: 35000, frames: 2 },
]

export function getMonsterStage(fed: number): { current: MonsterStage; next: MonsterStage | null } {
  let current = MONSTER_STAGES[0]
  for (const stage of MONSTER_STAGES) {
    if (fed >= stage.minFed) current = stage
  }
  const next = MONSTER_STAGES[MONSTER_STAGES.indexOf(current) + 1] ?? null
  return { current, next }
}

// Feed earned from a workout is the total reps performed - more sets and
// reps across any exercise means more food for the monster.
export function computeEarnedFeed(sets: { reps: number }[]): number {
  return sets.reduce((sum, set) => sum + set.reps, 0)
}

function toDateString(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function computeStreak(dates: string[]): number {
  const uniqueSorted = Array.from(new Set(dates)).sort().reverse()
  if (uniqueSorted.length === 0) return 0

  const today = toDateString(new Date())
  const yesterday = toDateString(new Date(Date.now() - 86_400_000))
  if (uniqueSorted[0] !== today && uniqueSorted[0] !== yesterday) return 0

  let streak = 1
  const cursor = new Date(uniqueSorted[0])
  for (let i = 1; i < uniqueSorted.length; i++) {
    cursor.setDate(cursor.getDate() - 1)
    if (uniqueSorted[i] === toDateString(cursor)) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export type CareTier = 'neglected' | 'normal' | 'dedicated'

const NEGLECT_DAYS = 7
const DEDICATED_STREAK = 7

// Reflects current care based on feeding history: fed daily for a solid
// streak looks visibly happy/decorated, left unfed for a week or more looks
// visibly neglected. Anything in between is just the normal look.
export function computeCareTier(feedingDates: string[]): CareTier {
  if (feedingDates.length === 0) return 'normal'

  const uniqueSorted = Array.from(new Set(feedingDates)).sort().reverse()
  const today = toDateString(new Date())
  const daysSinceLastFeed = Math.floor(
    (new Date(today).getTime() - new Date(uniqueSorted[0]).getTime()) / 86_400_000,
  )
  if (daysSinceLastFeed >= NEGLECT_DAYS) return 'neglected'

  if (computeStreak(feedingDates) >= DEDICATED_STREAK) return 'dedicated'

  return 'normal'
}
