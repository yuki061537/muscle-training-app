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
    case 1: // egg: soft nest
      return {
        sky: '#f2ecdf',
        shapes: [
          { type: 'ellipse', cx: 20, cy: 30, rx: 26, ry: 20, color: '#b9d894' },
          { type: 'cells', color: '#8fbf68', cells: [[6, 10], [7, 9], [14, 10], [22, 9], [30, 10], [33, 9]] },
        ],
      }
    case 2: // chick: bright grassland
      return {
        sky: '#bfe3f0',
        shapes: [
          { type: 'ellipse', cx: 34, cy: 3, rx: 3.2, ry: 3.2, color: '#f5d34e' },
          { type: 'ellipse', cx: 8, cy: 4, rx: 3.5, ry: 1.6, color: '#ffffff' },
          { type: 'ellipse', cx: 18, cy: 30, rx: 28, ry: 20, color: '#7ec850' },
          { type: 'cells', color: '#5da33a', cells: [[4, 10], [5, 9], [12, 10], [20, 9], [28, 10], [35, 9]] },
        ],
      }
    case 3: // puppy: rolling hills park
      return {
        sky: '#a9d6e8',
        shapes: [
          { type: 'ellipse', cx: 33, cy: 3, rx: 2.6, ry: 2.6, color: '#f5d34e' },
          { type: 'ellipse', cx: 10, cy: 16, rx: 16, ry: 9, color: '#6fbf5e' },
          { type: 'ellipse', cx: 30, cy: 17, rx: 18, ry: 9, color: '#4f9e42' },
          { type: 'cells', color: '#6b4a2f', cells: [[5, 8], [5, 9], [5, 10]] },
          { type: 'ellipse', cx: 5, cy: 7, rx: 3, ry: 2.4, color: '#3f8a37' },
        ],
      }
    case 4: // wolf: mountain forest dusk
      return {
        sky: '#4a5b73',
        shapes: [
          triangle(10, 2, 11, 8, '#33415a'),
          triangle(28, 3, 11, 9, '#3a4a63'),
          { type: 'cells', color: '#e8eef2', cells: [[9, 2], [10, 2], [11, 2]] },
          { type: 'cells', color: '#e8eef2', cells: [[27, 3], [28, 3], [29, 3]] },
          triangle(4, 7, 11, 3, '#1f3b2a'),
          triangle(35, 6, 11, 3, '#1f3b2a'),
          { type: 'ellipse', cx: 20, cy: 22, rx: 26, ry: 10, color: '#39493c' },
        ],
      }
    case 5: // griffon: sky peaks
      return {
        sky: '#bfeee8',
        shapes: [
          { type: 'ellipse', cx: 6, cy: 3, rx: 4, ry: 1.6, color: '#ffffff' },
          { type: 'ellipse', cx: 32, cy: 2, rx: 3.5, ry: 1.4, color: '#ffffff' },
          triangle(14, 3, 12, 10, '#4f8a82'),
          triangle(28, 1, 12, 11, '#3d6f68'),
          { type: 'cells', color: '#ffffff', cells: [[12, 3], [13, 3], [14, 3], [15, 3]] },
          { type: 'cells', color: '#ffffff', cells: [[26, 1], [27, 1], [28, 1], [29, 1], [30, 1]] },
          { type: 'ellipse', cx: 20, cy: 24, rx: 26, ry: 10, color: '#2fb88f' },
        ],
      }
    case 6: // phoenix: volcano magma
    default:
      return {
        sky: '#2a0f0a',
        shapes: [
          triangle(20, 2, 10, 12, '#241a17'),
          { type: 'ellipse', cx: 20, cy: 3, rx: 2.4, ry: 1.2, color: '#f2662f' },
          { type: 'cells', color: '#f5d94e', cells: [[19, 2], [20, 1], [21, 2]] },
          { type: 'ellipse', cx: 20, cy: 24, rx: 26, ry: 10, color: '#1a1210' },
          { type: 'cells', color: '#f2662f', cells: [[6, 11], [7, 12], [8, 11], [16, 12], [17, 11], [26, 12], [27, 11], [33, 12]] },
          { type: 'cells', color: '#c94a1d', cells: [[7, 11], [17, 12], [27, 12]] },
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
