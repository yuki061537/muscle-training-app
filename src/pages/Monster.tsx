import TrainingMonster from '../components/TrainingMonster'

export default function Monster() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">モンスター</h1>
      <TrainingMonster />
      <p className="mt-4 text-sm leading-relaxed text-zinc-500">
        トレーニングを記録した日数が増えるほど、モンスターが進化していきます。今日も1つ記録して育ててあげましょう。
      </p>
    </div>
  )
}
