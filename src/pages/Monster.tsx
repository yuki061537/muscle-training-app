import TrainingMonster from '../components/TrainingMonster'

export default function Monster() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">モンスター</h1>
      <TrainingMonster />
      <p className="mt-4 text-sm leading-relaxed text-zinc-500">
        トレーニングでセットを記録すると、その回数ぶん餌がたまります。「餌をあげる」でモンスターに与えると育っていきます。
      </p>
    </div>
  )
}
