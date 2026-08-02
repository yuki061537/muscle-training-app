export interface SetGroup {
  ids: number[]
  exerciseId: number
  weight: number
  reps: number
}

export function groupConsecutiveSets(
  sets: { id: number; exerciseId: number; weight: number; reps: number }[],
): SetGroup[] {
  const groups: SetGroup[] = []
  for (const set of sets) {
    const last = groups[groups.length - 1]
    if (last && last.exerciseId === set.exerciseId && last.weight === set.weight && last.reps === set.reps) {
      last.ids.push(set.id)
    } else {
      groups.push({ ids: [set.id], exerciseId: set.exerciseId, weight: set.weight, reps: set.reps })
    }
  }
  return groups
}
