export interface MonsterStage {
  level: number
  name: string
  minDays: number
}

export const MONSTER_STAGES: MonsterStage[] = [
  { level: 1, name: 'たまご', minDays: 0 },
  { level: 2, name: 'スライム', minDays: 1 },
  { level: 3, name: 'マッチョスライム', minDays: 3 },
  { level: 4, name: 'ベビードラゴン', minDays: 7 },
  { level: 5, name: 'ドラゴン', minDays: 14 },
  { level: 6, name: 'キングドラゴン', minDays: 30 },
]

export function getMonsterStage(totalDays: number): { current: MonsterStage; next: MonsterStage | null } {
  let current = MONSTER_STAGES[0]
  for (const stage of MONSTER_STAGES) {
    if (totalDays >= stage.minDays) current = stage
  }
  const next = MONSTER_STAGES[MONSTER_STAGES.indexOf(current) + 1] ?? null
  return { current, next }
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
