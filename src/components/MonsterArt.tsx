const GRID = 20
const CELL = 6

const ACCENT = '#baf24d'
const ACCENT_DIM = '#8fc233'
const ACCENT_LIGHT = '#d9f7a3'
const SHELL = '#3f3f46'
const DARK = '#0a0a0b'
const WHITE = '#ffffff'
const GOLD = '#f5d94e'
const AURA = 'rgba(186,242,77,0.15)'

type Cell = [col: number, row: number]

type Shape =
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; color: string }
  | { type: 'cells'; cells: Cell[]; color: string }

function hLine(row: number, c0: number, c1: number): Cell[] {
  const cells: Cell[] = []
  for (let c = c0; c <= c1; c++) cells.push([c, row])
  return cells
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
  { type: 'ellipse', cx: 10, cy: 11, rx: 6, ry: 7.5, color: SHELL },
  { type: 'cells', color: ACCENT, cells: [[9, 6], [10, 7], [9, 8], [10, 9], [9, 10], [10, 11], [9, 12]] },
]

const SLIME: Shape[] = [
  { type: 'ellipse', cx: 10, cy: 11, rx: 7, ry: 6.5, color: ACCENT },
  { type: 'ellipse', cx: 6, cy: 7, rx: 1, ry: 1.3, color: ACCENT_LIGHT },
  { type: 'ellipse', cx: 7, cy: 9.5, rx: 1.3, ry: 1.6, color: WHITE },
  { type: 'ellipse', cx: 13, cy: 9.5, rx: 1.3, ry: 1.6, color: WHITE },
  { type: 'cells', color: DARK, cells: [[7, 10], [13, 10]] },
  { type: 'cells', color: DARK, cells: [[8, 13], [9, 14], [10, 14], [11, 14], [12, 13]] },
]

const MACHO_SLIME: Shape[] = [
  { type: 'ellipse', cx: 3, cy: 12, rx: 2.2, ry: 2.8, color: ACCENT_DIM },
  { type: 'ellipse', cx: 17, cy: 12, rx: 2.2, ry: 2.8, color: ACCENT_DIM },
  { type: 'ellipse', cx: 10, cy: 11, rx: 7.5, ry: 6.5, color: ACCENT },
  { type: 'cells', color: DARK, cells: hLine(7, 5, 14) },
  { type: 'cells', color: ACCENT_DIM, cells: [[9, 5], [10, 5], [9, 6], [10, 6]] },
  { type: 'cells', color: DARK, cells: [[6, 8], [7, 9], [13, 8], [12, 9]] },
  { type: 'ellipse', cx: 7, cy: 10.5, rx: 1.3, ry: 1.6, color: WHITE },
  { type: 'ellipse', cx: 13, cy: 10.5, rx: 1.3, ry: 1.6, color: WHITE },
  { type: 'cells', color: DARK, cells: [[7, 11], [13, 11]] },
  { type: 'cells', color: DARK, cells: [[8, 14], [9, 15], [10, 15], [11, 15], [12, 14]] },
]

const BABY_DRAGON: Shape[] = [
  { type: 'ellipse', cx: 2.5, cy: 9, rx: 2, ry: 3, color: ACCENT_DIM },
  { type: 'ellipse', cx: 17.5, cy: 9, rx: 2, ry: 3, color: ACCENT_DIM },
  { type: 'ellipse', cx: 10, cy: 11, rx: 6.5, ry: 6, color: ACCENT },
  { type: 'cells', color: ACCENT_DIM, cells: [[8, 4], [8, 5], [11, 4], [11, 5]] },
  { type: 'ellipse', cx: 10, cy: 14, rx: 3, ry: 2.3, color: ACCENT_LIGHT },
  { type: 'ellipse', cx: 7.5, cy: 9.5, rx: 1.3, ry: 1.6, color: WHITE },
  { type: 'ellipse', cx: 12.5, cy: 9.5, rx: 1.3, ry: 1.6, color: WHITE },
  { type: 'cells', color: DARK, cells: [[7, 10], [13, 10]] },
  { type: 'cells', color: DARK, cells: [[9, 13], [10, 14], [11, 13]] },
  { type: 'cells', color: ACCENT, cells: [[16, 15], [17, 16]] },
]

const DRAGON: Shape[] = [
  { type: 'ellipse', cx: 1.5, cy: 8, rx: 2.5, ry: 4, color: ACCENT_DIM },
  { type: 'ellipse', cx: 18.5, cy: 8, rx: 2.5, ry: 4, color: ACCENT_DIM },
  { type: 'ellipse', cx: 10, cy: 10.5, rx: 7.2, ry: 6.5, color: ACCENT },
  { type: 'cells', color: ACCENT_DIM, cells: [[7, 2], [7, 3], [8, 4], [12, 2], [12, 3], [11, 4]] },
  { type: 'cells', color: DARK, cells: [[9, 2], [10, 1], [11, 2]] },
  { type: 'ellipse', cx: 2, cy: 13, rx: 2.2, ry: 2.6, color: ACCENT },
  { type: 'ellipse', cx: 18, cy: 13, rx: 2.2, ry: 2.6, color: ACCENT },
  { type: 'ellipse', cx: 7, cy: 9, rx: 1.2, ry: 1.5, color: WHITE },
  { type: 'ellipse', cx: 13, cy: 9, rx: 1.2, ry: 1.5, color: WHITE },
  { type: 'cells', color: DARK, cells: [[7, 10], [13, 10]] },
  { type: 'cells', color: DARK, cells: hLine(13, 9, 11) },
  { type: 'cells', color: ACCENT, cells: [[17, 14], [18, 15], [19, 15]] },
]

const KING_DRAGON: Shape[] = [
  { type: 'ellipse', cx: 10, cy: 10, rx: 10, ry: 10, color: AURA },
  { type: 'ellipse', cx: 1, cy: 8, rx: 3, ry: 4.5, color: ACCENT_DIM },
  { type: 'ellipse', cx: 19, cy: 8, rx: 3, ry: 4.5, color: ACCENT_DIM },
  { type: 'ellipse', cx: 10, cy: 10.5, rx: 7.5, ry: 6.8, color: ACCENT },
  { type: 'cells', color: GOLD, cells: [[7, 3], [8, 2], [9, 3], [10, 1], [11, 3], [12, 2], [13, 3]] },
  { type: 'ellipse', cx: 1.5, cy: 13, rx: 2.4, ry: 2.8, color: ACCENT },
  { type: 'ellipse', cx: 18.5, cy: 13, rx: 2.4, ry: 2.8, color: ACCENT },
  { type: 'ellipse', cx: 7, cy: 9, rx: 1.2, ry: 1.5, color: WHITE },
  { type: 'ellipse', cx: 13, cy: 9, rx: 1.2, ry: 1.5, color: WHITE },
  { type: 'cells', color: DARK, cells: [[7, 10], [13, 10]] },
  { type: 'cells', color: DARK, cells: hLine(13, 9, 11) },
  { type: 'cells', color: GOLD, cells: [[1, 2], [18, 15], [16, 3]] },
]

const ARTWORK: Record<number, Shape[]> = {
  1: EGG,
  2: SLIME,
  3: MACHO_SLIME,
  4: BABY_DRAGON,
  5: DRAGON,
  6: KING_DRAGON,
}

export default function MonsterArt({ level, className }: { level: number; className?: string }) {
  const grid = rasterize(ARTWORK[level] ?? EGG)
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
