// 22 cols x 16 rows
// 0=floor, 1=wall, 2=mud, 3=moonbeam, 4=lantern, 5=gate, 6=thorn
// Player start: col 1, row 1
// Gate: col 20, row 14
// Lanterns: (3,2), (18,2), (2,12), (19,12), (11,7)
export const COLS = 22;
export const ROWS = 16;
export const TILE = 28;
export const CANVAS_W = COLS * TILE; // 616
export const CANVAS_H = ROWS * TILE; // 448

const W = 1, F = 0, M = 2, B = 3, L = 4, G = 5, T = 6;

function blankGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0)
  );
}

function setTile(grid, r, c, v) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  grid[r][c] = v;
}

function buildMaze(walls, mud, moonbeam, thorns, lanterns, gate) {
  const g = blankGrid();
  // Wall border
  for (let c = 0; c < COLS; c++) {
    setTile(g, 0, c, W);
    setTile(g, ROWS - 1, c, W);
  }
  for (let r = 0; r < ROWS; r++) {
    setTile(g, r, 0, W);
    setTile(g, r, COLS - 1, W);
  }
  walls.forEach(([r, c]) => setTile(g, r, c, W));
  mud.forEach(([r, c]) => setTile(g, r, c, M));
  moonbeam.forEach(([r, c]) => setTile(g, r, c, B));
  thorns.forEach(([r, c]) => setTile(g, r, c, T));
  lanterns.forEach(([r, c]) => setTile(g, r, c, L));
  if (gate) setTile(g, gate[0], gate[1], G);
  return g;
}

// ──────────────────────────────────────────────────────────
// MAZE 1 — "The Outer Ring" (easy, lanterns in 4 corners + center)
// ──────────────────────────────────────────────────────────
const walls1 = [
  // Row 3 (light obstacles)
  [3, 4], [3, 8], [3, 11], [3, 14], [3, 18],
  // Row 5
  [5, 3], [5, 7], [5, 11], [5, 15], [5, 19],
  // Row 6
  [6, 11],
  // Row 7 (around center)
  [7, 3], [7, 7], [7, 9], [7, 13], [7, 15], [7, 19],
  // Row 8
  [8, 11],
  // Row 9
  [9, 4], [9, 8], [9, 11], [9, 14], [9, 18],
  // Row 11
  [11, 5], [11, 9], [11, 13], [11, 17],
  // Row 13
  [13, 4], [13, 8], [13, 11], [13, 14], [13, 18],
];
const lanterns1 = [[2, 3], [2, 18], [7, 11], [12, 2], [12, 19]];
const gate1 = [14, 20];
const mud1 = [[4, 6], [4, 7], [10, 10], [10, 11]];
const moonbeam1 = [
  [1, 5], [1, 6], [1, 7], [1, 14], [1, 15], [1, 16],
  [6, 5], [6, 16], [6, 17],
];
const thorns1 = [[5, 11]];

// ──────────────────────────────────────────────────────────
// MAZE 2 — "The Inner Maze" (medium, more walls, more mud)
// ──────────────────────────────────────────────────────────
const walls2 = [
  // Row 3
  [3, 2], [3, 4], [3, 6], [3, 8], [3, 9], [3, 10], [3, 12], [3, 14], [3, 16], [3, 18], [3, 20],
  // Row 5
  [5, 2], [5, 4], [5, 6], [5, 8], [5, 10], [5, 12], [5, 14], [5, 16], [5, 18], [5, 20],
  // Row 6
  [6, 8], [6, 14],
  // Row 7
  [7, 2], [7, 3], [7, 5], [7, 7], [7, 9], [7, 13], [7, 15], [7, 17], [7, 19], [7, 20],
  // Row 8
  [8, 7], [8, 9], [8, 13], [8, 15],
  // Row 9
  [9, 2], [9, 4], [9, 6], [9, 8], [9, 10], [9, 12], [9, 14], [9, 16], [9, 18], [9, 20],
  // Row 11
  [11, 2], [11, 3], [11, 5], [11, 7], [11, 9], [11, 13], [11, 15], [11, 17], [11, 19], [11, 20],
  // Row 13
  [13, 2], [13, 4], [13, 6], [13, 8], [13, 10], [13, 12], [13, 14], [13, 16], [13, 18], [13, 20],
];
const lanterns2 = [[2, 5], [2, 17], [7, 11], [12, 4], [12, 18]];
const gate2 = [14, 20];
const mud2 = [
  [4, 5], [4, 6], [4, 7], // big mud patch on top route
  [8, 4], [8, 5], // mud on shortcut
  [10, 11], [10, 12], [10, 13], // mud on center route
];
const moonbeam2 = [
  [1, 8], [1, 9], [1, 10], [1, 11], [1, 12],
  [6, 4], [6, 18],
];
const thorns2 = [[4, 11], [8, 17], [10, 7]];

// ──────────────────────────────────────────────────────────
// MAZE 3 — "The Final Garden" (hard, labyrinth, lots of hazards)
// ──────────────────────────────────────────────────────────
const walls3 = [
  // Row 3 (heavy)
  [3, 2], [3, 3], [3, 5], [3, 7], [3, 9], [3, 11], [3, 12], [3, 14], [3, 16], [3, 18], [3, 19],
  // Row 5
  [5, 2], [5, 3], [5, 4], [5, 6], [5, 8], [5, 10], [5, 12], [5, 13], [5, 14], [5, 16], [5, 18], [5, 20],
  // Row 6
  [6, 6], [6, 8], [6, 10], [6, 14], [6, 16], [6, 18],
  // Row 7 (around center)
  [7, 2], [7, 4], [7, 5], [7, 7], [7, 9], [7, 13], [7, 15], [7, 17], [7, 19],
  // Row 8
  [8, 5], [8, 7], [8, 13], [8, 15], [8, 17],
  // Row 9
  [9, 2], [9, 3], [9, 5], [9, 7], [9, 9], [9, 11], [9, 12], [9, 14], [9, 16], [9, 18], [9, 20],
  // Row 11
  [11, 2], [11, 4], [11, 6], [11, 8], [11, 10], [11, 12], [11, 14], [11, 16], [11, 18], [11, 20],
  // Row 13
  [13, 2], [13, 3], [13, 5], [13, 7], [13, 9], [13, 11], [13, 13], [13, 15], [13, 17], [13, 19], [13, 20],
];
const lanterns3 = [[2, 6], [2, 16], [7, 11], [12, 4], [12, 18]];
const gate3 = [14, 20];
const mud3 = [
  [4, 5], [4, 6], [4, 7], [4, 8], // big mud patch
  [8, 11], [8, 12], // mud near center
  [10, 4], [10, 5], [10, 6], // mud patch
];
const moonbeam3 = [
  [1, 6], [1, 7], [1, 8], [1, 13], [1, 14], [1, 15],
  [6, 12], [6, 13],
];
const thorns3 = [[4, 11], [5, 9], [8, 19], [10, 14]];

export const MAZES = [
  buildMaze(walls1, mud1, moonbeam1, thorns1, lanterns1, gate1),
  buildMaze(walls2, mud2, moonbeam2, thorns2, lanterns2, gate2),
  buildMaze(walls3, mud3, moonbeam3, thorns3, lanterns3, gate3),
];

export const ROUND_TITLES = [
  'The Outer Ring',
  'The Inner Maze',
  'The Final Garden',
];

// Keep these exported for backward-compat (used by single-round fallback)
export const MAZE = MAZES[0];
export const LANTERN_POSITIONS = lanterns1.map(([r, c]) => ({ row: r, col: c }));
export const GATE_POS = { row: gate1[0], col: gate1[1] };
export const START_POS = { col: 1, row: 1 };
