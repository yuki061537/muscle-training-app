interface Section {
  title: string
  items: string[]
}

const sections: Section[] = [
  {
    title: '📋 記録',
    items: [
      '種目・重量・回数を入力して「セットを追加」で記録します。',
      '種目を選ぶと「前回: ○○kg × ○回」が表示され、「同じ数値を使う」でそのまま入力できます。',
      '「メニューから始める」でメニューを選ぶと、含まれる種目がチップで並びます。タップするだけで種目選択+入力欄にフォーカスします。すでに記録済みの種目は取り消し線で表示されます。',
      '休憩時間はプリセット・±ボタン・分と秒の直接入力のいずれでも設定でき、セット追加と同時に自動でカウントダウンが始まります。休憩タイマーはどのページに移動しても画面下に表示され続けます。',
      '体重は日付ごとに記録でき、同じ日に再入力すると上書きされます。',
    ],
  },
  {
    title: '🏋️ 種目',
    items: ['自分がやるトレーニング種目を登録・削除できます。ここで登録した種目が記録画面で選べるようになります。'],
  },
  {
    title: '📝 メニュー',
    items: [
      '複数の種目を組み合わせて「胸の日」のようなメニューを作成できます。',
      '作成したメニューは記録画面から呼び出して、その場でまとめて記録を進められます。',
    ],
  },
  {
    title: '📊 分析',
    items: [
      '体重の推移をグラフで確認できます。',
      '種目を選ぶと、その種目の最大重量・総ボリューム(重量×回数の合計)の推移をグラフで確認できます。',
      '一番下の「データのバックアップ」から、全データをJSONファイルとして書き出したり、読み込んで復元したりできます。機種変更やブラウザデータの消去に備えて、定期的な書き出しがおすすめです。',
    ],
  },
  {
    title: '📱 ホーム画面に追加する',
    items: [
      'このアプリはPWA(Progressive Web App)なので、スマホのブラウザで開いた状態で「ホーム画面に追加」すると、アイコンから直接起動できるようになります。',
      'iPhone(Safari): 共有ボタン(□に↑)→「ホーム画面に追加」',
      'Android(Chrome): 右上の︙メニュー→「アプリをインストール」/「ホーム画面に追加」',
    ],
  },
  {
    title: '💾 データについて',
    items: [
      '記録はすべて、その端末のブラウザ内にのみ保存されます(サーバーには送信されません)。',
      '他の人がこのアプリを開いても、あなたの記録が見られることはありません。それぞれの端末で別々にデータが保存されます。',
    ],
  },
]

export default function Help() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-white">使い方</h1>

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-white/5 bg-surface p-4">
            <h2 className="mb-2 text-sm font-bold text-white">{section.title}</h2>
            <ul className="flex flex-col gap-2">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
