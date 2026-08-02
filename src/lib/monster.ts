export interface MonsterStage {
  level: number
  name: string
  minFed: number
}

// Thresholds are cumulative amount of feed given (not earned) to reach each stage.
export const MONSTER_STAGES: MonsterStage[] = [
  { level: 1, name: 'たまご', minFed: 0 },
  { level: 2, name: 'ひよこ', minFed: 30 },
  { level: 3, name: 'こいぬ', minFed: 120 },
  { level: 4, name: 'ウルフ', minFed: 400 },
  { level: 5, name: 'グリフォン', minFed: 1000 },
  { level: 6, name: 'フェニックス', minFed: 2500 },
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
