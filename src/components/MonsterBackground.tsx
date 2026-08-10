const SCALE = 2
const GRID_W = 40 * SCALE
const GRID_H = 14 * SCALE
const CELL = 2

type Cell = [col: number, row: number]

type Shape =
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; color: string }
  | { type: 'cells'; cells: Cell[]; color: string }

function triangle(peakCol: number, peakRow: number, baseRow: number, halfWidthAtBase: number, color: string): Shape {
  const cells: Cell[] = []
  const height = Math.max(1, baseRow - peakRow)
  for (let r = 0; r <= height; r++) {
    const row = peakRow + r
    const halfWidth = Math.round((r / height) * halfWidthAtBase)
    for (let c = peakCol - halfWidth; c <= peakCol + halfWidth; c++) {
      cells.push([c, row])
    }
  }
  return { type: 'cells', cells, color }
}

function bolt(col: number, row: number, color: string): Shape {
  return {
    type: 'cells',
    color,
    cells: [
      [col, row],
      [col - 1, row + 1],
      [col, row + 1],
      [col, row + 2],
      [col + 1, row + 2],
      [col, row + 3],
    ],
  }
}

function scaleShapes(shapes: Shape[], factor: number): Shape[] {
  return shapes.map((shape) => {
    if (shape.type === 'ellipse') {
      return { ...shape, cx: shape.cx * factor, cy: shape.cy * factor, rx: shape.rx * factor, ry: shape.ry * factor }
    }
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

function rasterize(sky: string, shapes: Shape[]): string[][] {
  const grid: string[][] = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(sky))
  for (const shape of shapes) {
    if (shape.type === 'ellipse') {
      for (let row = 0; row < GRID_H; row++) {
        for (let col = 0; col < GRID_W; col++) {
          const dx = (col + 0.5 - shape.cx) / shape.rx
          const dy = (row + 0.5 - shape.cy) / shape.ry
          if (dx * dx + dy * dy <= 1) grid[row][col] = shape.color
        }
      }
    } else {
      for (const [col, row] of shape.cells) {
        if (row >= 0 && row < GRID_H && col >= 0 && col < GRID_W) grid[row][col] = shape.color
      }
    }
  }
  return grid
}

function scene(level: number): { sky: string; shapes: Shape[] } {
  switch (level) {
    case 1: // egg: soft jungle nest at dawn
      return {
        sky: '#f2ecdf',
        shapes: [
          { type: 'ellipse', cx: 20, cy: 30, rx: 26, ry: 20, color: '#b9d894' },
          { type: 'cells', color: '#8fbf68', cells: [[6, 10], [7, 9], [14, 10], [22, 9], [30, 10], [33, 9]] },
        ],
      }
    case 2: // baby I: bright jungle clearing
      return {
        sky: '#bfe3f0',
        shapes: [
          { type: 'ellipse', cx: 34, cy: 3, rx: 3.2, ry: 3.2, color: '#f5d34e' },
          { type: 'ellipse', cx: 8, cy: 4, rx: 3.5, ry: 1.6, color: '#ffffff' },
          { type: 'ellipse', cx: 18, cy: 30, rx: 28, ry: 20, color: '#7ec850' },
          { type: 'cells', color: '#5da33a', cells: [[4, 10], [5, 9], [12, 10], [20, 9], [28, 10], [35, 9]] },
        ],
      }
    case 3: // baby II: denser jungle with vines
      return {
        sky: '#a6d6c6',
        shapes: [
          { type: 'ellipse', cx: 5, cy: 3, rx: 3, ry: 4, color: '#4f9e5c' },
          { type: 'ellipse', cx: 35, cy: 2, rx: 3.4, ry: 4.6, color: '#3f8a4e' },
          { type: 'cells', color: '#2f6a3c', cells: [[5, 6], [5, 7], [5, 8], [35, 5], [35, 6], [35, 7]] },
          { type: 'ellipse', cx: 18, cy: 24, rx: 28, ry: 12, color: '#3f8a4e' },
          { type: 'cells', color: '#2f6a3c', cells: [[8, 12], [9, 11], [18, 12], [27, 11], [30, 12]] },
        ],
      }
    case 4: // growth: rocky jungle path, midday
      return {
        sky: '#a9d6e8',
        shapes: [
          { type: 'ellipse', cx: 33, cy: 3, rx: 2.6, ry: 2.6, color: '#f5d34e' },
          { type: 'ellipse', cx: 10, cy: 16, rx: 16, ry: 9, color: '#6fbf5e' },
          { type: 'ellipse', cx: 30, cy: 17, rx: 18, ry: 9, color: '#4f9e42' },
          { type: 'cells', color: '#8a7a63', cells: [[16, 20], [17, 19], [18, 20], [19, 19], [23, 20], [24, 19]] },
        ],
      }
    case 5: // mature: ancient stone ruins, golden dusk
      return {
        sky: '#e8b56a',
        shapes: [
          { type: 'ellipse', cx: 20, cy: 4, rx: 3.4, ry: 3.4, color: '#fff2c8' },
          triangle(8, 6, 20, 3, '#5a4a38'),
          triangle(32, 4, 20, 4, '#4a3c2e'),
          { type: 'cells', color: '#8a7358', cells: [[7, 9], [8, 9], [9, 9], [31, 6], [32, 6], [33, 6]] },
          { type: 'ellipse', cx: 20, cy: 24, rx: 28, ry: 11, color: '#6a5a3f' },
          { type: 'cells', color: '#4a3c2e', cells: [[10, 16], [11, 15], [29, 15], [30, 16]] },
        ],
      }
    case 6: // 完全体: storm-lit temple, dark clouds
      return {
        sky: '#3a3550',
        shapes: [
          { type: 'ellipse', cx: 10, cy: 3, rx: 8, ry: 2.2, color: '#2a2540' },
          { type: 'ellipse', cx: 30, cy: 2, rx: 9, ry: 2.6, color: '#26213a' },
          triangle(10, 6, 20, 4, '#332b3f'),
          triangle(30, 4, 20, 5, '#2c2536'),
          bolt(20, 2, '#f5d94e'),
          { type: 'ellipse', cx: 20, cy: 25, rx: 28, ry: 11, color: '#463c56' },
          { type: 'cells', color: '#332b3f', cells: [[9, 17], [10, 16], [30, 16], [31, 17]] },
        ],
      }
    case 7: // 究極体: full lightning storm arena
    default:
      return {
        sky: '#241733',
        shapes: [
          { type: 'ellipse', cx: 20, cy: 3, rx: 12, ry: 3, color: '#1c1228' },
          bolt(9, 1, '#ffe066'),
          bolt(30, 0, '#ffe066'),
          bolt(20, 3, '#f5d94e'),
          { type: 'ellipse', cx: 20, cy: 24, rx: 28, ry: 11, color: '#2a1e3a' },
          { type: 'cells', color: '#f5d94e', cells: [[6, 16], [7, 17], [33, 16], [32, 17], [20, 19], [21, 18]] },
          { type: 'cells', color: '#ffe066', cells: [[7, 16], [32, 16]] },
        ],
      }
  }
}

export default function MonsterBackground({ level, className }: { level: number; className?: string }) {
  const { sky, shapes } = scene(level)
  const grid = rasterize(sky, scaleShapes(shapes, SCALE))
  return (
    <svg
      viewBox={`0 0 ${GRID_W * CELL} ${GRID_H * CELL}`}
      preserveAspectRatio="none"
      className={className}
      shapeRendering="crispEdges"
    >
      {grid.map((row, r) =>
        row.map((color, c) => <rect key={`${r}-${c}`} x={c * CELL} y={r * CELL} width={CELL} height={CELL} fill={color} />),
      )}
    </svg>
  )
}
