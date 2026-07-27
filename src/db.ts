import Dexie, { type EntityTable } from 'dexie'

export interface Exercise {
  id: number
  name: string
  createdAt: string
}

export interface WorkoutSet {
  id: number
  exerciseId: number
  date: string // ISO date (YYYY-MM-DD)
  weight: number
  reps: number
}

export interface Program {
  id: number
  name: string
  exerciseIds: number[]
}

export interface BodyWeight {
  id: number
  date: string // ISO date (YYYY-MM-DD), one entry per date
  weight: number
}

const db = new Dexie('muscle-training-app') as Dexie & {
  exercises: EntityTable<Exercise, 'id'>
  sets: EntityTable<WorkoutSet, 'id'>
  programs: EntityTable<Program, 'id'>
  bodyWeights: EntityTable<BodyWeight, 'id'>
}

db.version(1).stores({
  exercises: '++id, name',
  sets: '++id, exerciseId, date',
  programs: '++id, name',
})

db.version(2).stores({
  exercises: '++id, name',
  sets: '++id, exerciseId, date',
  programs: '++id, name',
  bodyWeights: '++id, &date',
})

export { db }
