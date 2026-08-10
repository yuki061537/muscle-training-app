import TrainingMonster from '../components/TrainingMonster'

export default function Monster() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-white">モンスター</h2>
      <TrainingMonster />
      <p className="text-xs leading-relaxed text-zinc-500">
        トレーニングでセットを記録すると、その回数ぶん餌がたまります。「餌をあげる」でモンスターに与えると育っていきます。
      </p>
    </div>
  )
}
