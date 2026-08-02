const SCALE = 2
const GRID = 20 * SCALE
const CELL = 3

const CREAM = '#e8e2d0'
const YELLOW = '#f5d34e'
const YELLOW_DIM = '#e0b93a'
const ORANGE = '#e8935a'
const TAN = '#c98a4b'
const TAN_DIM = '#a66f38'
const CREAM_LIGHT = '#f0d9b5'
const BLUEGRAY = '#8fa6bd'
const BLUEGRAY_DIM = '#5f7a93'
const ICE = '#d7ecf5'
const TEAL = '#2fb88f'
const TEAL_DIM = '#1f8a68'
const GOLD = '#f5d94e'
const FIRE = '#f2662f'
const FIRE_DIM = '#c94a1d'
const FIRE_AURA = 'rgba(242,102,47,0.18)'
const DARK = '#0a0a0b'
const WHITE = '#ffffff'

export type Expression = 'open' | 'blink'

type Cell = [col: number, row: number]

type Shape =
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; color: string }
  | { type: 'cells'; cells: Cell[]; color: string }

function scaleShapes(shapes: Shape[], factor: number): Shape[] {
  return shapes.map((shape) => {
    if (shape.type === 'ellipse') {
      return { ...shape, cx: shape.cx * factor, cy: shape.cy * factor, rx: shape.rx * factor, ry: shape.ry * factor }
    }
    // Expand each source pixel into a factor x factor block so hand-placed
    // accents (pupils, mouths, crowns...) stay solid instead of gaining gaps.
    const cells: Cell[] = []
    for (const [c, r] of shape.cells) {
      for (let dc = 0; dc < factor; dc++) {
        for (let dr = 0; dr < factor; dr++) {
          cells.push([c * factor + dc, r * factor + dr])
        }
      }
    }
    return { ...shape, cells }
  })
}

function roundEyes(cx1: number, cx2: number, cy: number, expression: Expression, irisColor = WHITE): Shape[] {
  const row = Math.round(cy)
  if (expression === 'blink') {
    return [
      { type: 'cells', color: DARK, cells: [[Math.round(cx1) - 1, row], [Math.round(cx1), row]] },
      { type: 'cells', color: DARK, cells: [[Math.round(cx2), row], [Math.round(cx2) + 1, row]] },
    ]
  }
  return [
    { type: 'ellipse', cx: cx1, cy, rx: 1.3, ry: 1.6, color: irisColor },
    { type: 'ellipse', cx: cx2, cy, rx: 1.3, ry: 1.6, color: irisColor },
    { type: 'cells', color: DARK, cells: [[Math.round(cx1), row + 1], [Math.round(cx2), row + 1]] },
  ]
}

function slitEyes(cx1: number, cx2: number, cy: number, expression: Expression): Shape[] {
  const color = expression === 'blink' ? DARK : ICE
  return [
    { type: 'cells', color, cells: [[cx1, cy], [cx1 + 1, cy]] },
    { type: 'cells', color, cells: [[cx2, cy], [cx2 + 1, cy]] },
  ]
}

function rasterize(shapes: Shape[]): (string | null)[][] {
  const grid: (string | null)[][] = Array.from({ length: GRID }, () => Array(GRID).fill(null))
  for (const shape of shapes) {
    if (shape.type === 'ellipse') {
      for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
          const dx = (col + 0.5 - shape.cx) / shape.rx
          const dy = (row + 0.5 - shape.cy) / shape.ry
          if (dx * dx + dy * dy <= 1) grid[row][col] = shape.color
        }
      }
    } else {
      for (const [col, row] of shape.cells) {
        if (row >= 0 && row < GRID && col >= 0 && col < GRID) grid[row][col] = shape.color
      }
    }
  }
  return grid
}

const EGG: Shape[] = [
  { type: 'ellipse', cx: 10, cy: 11, rx: 6, ry: 7.5, color: CREAM },
  { type: 'cells', color: YELLOW, cells: [[9, 6], [10, 7], [9, 8], [10, 9], [9, 10], [10, 11], [9, 12]] },
]

function chick(expression: Expression): Shape[] {
  return [
    { type: 'ellipse', cx: 4, cy: 12, rx: 1.6, ry: 2.2, color: YELLOW_DIM },
    { type: 'ellipse', cx: 16, cy: 12, rx: 1.6, ry: 2.2, color: YELLOW_DIM },
    { type: 'ellipse', cx: 10, cy: 12, rx: 6.5, ry: 6, color: YELLOW },
    { type: 'cells', color: YELLOW_DIM, cells: [[9, 3], [10, 3], [10, 4]] },
    ...roundEyes(7, 13, 9.5, expression),
    { type: 'cells', color: ORANGE, cells: [[9, 11], [10, 11], [11, 11], [10, 12]] },
    { type: 'cells', color: ORANGE, cells: [[8, 17], [8, 18], [12, 17], [12, 18]] },
  ]
}

function puppy(expression: Expression): Shape[] {
  return [
    { type: 'ellipse', cx: 4, cy: 8, rx: 1.8, ry: 3, color: TAN_DIM },
    { type: 'ellipse', cx: 16, cy: 8, rx: 1.8, ry: 3, color: TAN_DIM },
    { type: 'ellipse', cx: 10, cy: 13, rx: 6, ry: 5.5, color: TAN },
    { type: 'ellipse', cx: 10, cy: 8, rx: 5, ry: 4.5, color: TAN },
    { type: 'ellipse', cx: 10, cy: 10.5, rx: 2.2, ry: 1.8, color: CREAM_LIGHT },
    ...roundEyes(7.5, 12.5, 8, expression),
    { type: 'cells', color: DARK, cells: [[10, 10]] },
    { type: 'cells', color: TAN, cells: [[16, 12], [17, 11], [17, 10]] },
  ]
}

function wolf(expression: Expression): Shape[] {
  return [
    { type: 'cells', color: BLUEGRAY_DIM, cells: [[3, 3], [4, 2], [4, 3], [5, 4]] },
    { type: 'cells', color: BLUEGRAY_DIM, cells: [[16, 4], [15, 3], [16, 3], [17, 2]] },
    { type: 'ellipse', cx: 10, cy: 12, rx: 6.5, ry: 6, color: BLUEGRAY },
    { type: 'ellipse', cx: 10, cy: 13.5, rx: 2.4, ry: 1.8, color: ICE },
    ...slitEyes(7, 12, 9, expression),
    { type: 'cells', color: DARK, cells: [[10, 10]] },
    { type: 'cells', color: WHITE, cells: [[9, 15], [11, 15]] },
    { type: 'ellipse', cx: 2, cy: 13, rx: 2, ry: 2.4, color: BLUEGRAY_DIM },
    { type: 'ellipse', cx: 18, cy: 13, rx: 2, ry: 2.4, color: BLUEGRAY_DIM },
  ]
}

function griffon(expression: Expression): Shape[] {
  return [
    { type: 'ellipse', cx: 1.5, cy: 9, rx: 3, ry: 5, color: TEAL_DIM },
    { type: 'ellipse', cx: 18.5, cy: 9, rx: 3, ry: 5, color: TEAL_DIM },
    { type: 'cells', color: GOLD, cells: [[1, 5], [2, 4], [18, 5], [17, 4]] },
    { type: 'ellipse', cx: 10, cy: 12, rx: 6, ry: 6, color: TEAL },
    { type: 'cells', color: GOLD, cells: [[9, 3], [10, 2], [11, 3]] },
    ...roundEyes(7.5, 12.5, 9, expression, GOLD),
    { type: 'cells', color: GOLD, cells: [[9, 11], [10, 11], [10, 12], [11, 11]] },
    { type: 'cells', color: GOLD, cells: [[8, 18], [12, 18]] },
  ]
}

function phoenix(expression: Expression): Shape[] {
  return [
    { type: 'ellipse', cx: 10, cy: 10, rx: 10, ry: 10, color: FIRE_AURA },
    { type: 'cells', color: FIRE_DIM, cells: [[0, 6], [1, 4], [2, 6], [1, 8], [0, 9]] },
    { type: 'cells', color: FIRE_DIM, cells: [[19, 6], [18, 4], [17, 6], [18, 8], [19, 9]] },
    { type: 'cells', color: GOLD, cells: [[1, 3], [18, 3]] },
    { type: 'ellipse', cx: 10, cy: 11, rx: 6, ry: 6, color: FIRE },
    { type: 'cells', color: GOLD, cells: [[9, 2], [10, 1], [11, 2], [10, 3]] },
    ...roundEyes(7.5, 12.5, 9, expression),
    { type: 'cells', color: GOLD, cells: [[9, 11], [10, 12], [11, 11]] },
    { type: 'cells', color: GOLD, cells: [[9, 16], [10, 17], [11, 16], [10, 18]] },
  ]
}

const ARTWORK: Record<number, (expression: Expression) => Shape[]> = {
  1: () => EGG,
  2: chick,
  3: puppy,
  4: wolf,
  5: griffon,
  6: phoenix,
}

export default function MonsterArt({
  level,
  expression = 'open',
  className,
}: {
  level: number
  expression?: Expression
  className?: string
}) {
  const build = ARTWORK[level] ?? (() => EGG)
  const grid = rasterize(scaleShapes(build(expression), SCALE))
  return (
    <div className={className}>
      <svg viewBox={`0 0 ${GRID * CELL} ${GRID * CELL}`} shapeRendering="crispEdges">
        {grid.map((row, r) =>
          row.map((color, c) =>
            color ? <rect key={`${r}-${c}`} x={c * CELL} y={r * CELL} width={CELL} height={CELL} fill={color} /> : null,
          ),
        )}
      </svg>
    </div>
  )
}
