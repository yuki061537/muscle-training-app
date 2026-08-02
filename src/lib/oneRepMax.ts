export function estimateOneRepMax(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

export const RM_TABLE: { percent: number; reps: string }[] = [
  { percent: 100, reps: '1' },
  { percent: 95, reps: '2' },
  { percent: 90, reps: '4' },
  { percent: 85, reps: '6' },
  { percent: 80, reps: '8' },
  { percent: 75, reps: '10' },
  { percent: 70, reps: '12' },
  { percent: 65, reps: '15' },
  { percent: 60, reps: '20' },
  { percent: 50, reps: '30+' },
]
