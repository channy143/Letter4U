// Jigsaw Puzzle Geometry & Offscreen Sprite Generator

/**
 * Generates complementary random horizontal & vertical interlocking edge grids.
 * +1 = outward tab, -1 = inward socket, 0 = flat outer boundary
 */
export function generateEdgeGrid(rows, cols) {
  const hEdges = [];
  for (let r = 0; r < rows - 1; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(Math.random() < 0.5 ? 1 : -1);
    }
    hEdges.push(row);
  }

  const vEdges = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols - 1; c++) {
      row.push(Math.random() < 0.5 ? 1 : -1);
    }
    vEdges.push(row);
  }

  function getPieceEdges(r, c) {
    return {
      top: r === 0 ? 0 : -hEdges[r - 1][c],
      right: c === cols - 1 ? 0 : vEdges[r][c],
      bottom: r === rows - 1 ? 0 : hEdges[r][c],
      left: c === 0 ? 0 : -vEdges[r][c - 1],
    };
  }

  return { hEdges, vEdges, getPieceEdges };
}

/**
 * Traces a single symmetric jigsaw edge from (x1, y1) to (x2, y2).
 * Symmetry around t = 0.5 ensures interlocking tabs & sockets align to the sub-pixel.
 */
export function traceJigsawEdge(ctx, x1, y1, x2, y2, tabDir, tabSize) {
  if (tabDir === 0) {
    ctx.lineTo(x2, y2);
    return;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len === 0) return;

  // Unit tangent (u) and outward normal (n) for clockwise boundary traversal
  const ux = dx / len;
  const uy = dy / len;
  const nx = dy / len;
  const ny = -dx / len;

  const s = tabDir * tabSize;

  const pt = (t, d) => [
    x1 + ux * (t * len) + nx * (d * s),
    y1 + uy * (t * len) + ny * (d * s),
  ];

  const [s1x, s1y] = pt(0.35, 0);
  ctx.lineTo(s1x, s1y);

  // Curve 1: neck to left bulb shoulder
  const [c1ax, c1ay] = pt(0.42, 0);
  const [c1bx, c1by] = pt(0.38, 0.35);
  const [p1x, p1y] = pt(0.34, 0.55);
  ctx.bezierCurveTo(c1ax, c1ay, c1bx, c1by, p1x, p1y);

  // Curve 2: left bulb to knob apex
  const [c2ax, c2ay] = pt(0.30, 0.85);
  const [c2bx, c2by] = pt(0.39, 1.02);
  const [p2x, p2y] = pt(0.50, 1.02);
  ctx.bezierCurveTo(c2ax, c2ay, c2bx, c2by, p2x, p2y);

  // Curve 3: knob apex to right bulb (exact mirror of Curve 2)
  const [c3ax, c3ay] = pt(0.61, 1.02);
  const [c3bx, c3by] = pt(0.70, 0.85);
  const [p3x, p3y] = pt(0.66, 0.55);
  ctx.bezierCurveTo(c3ax, c3ay, c3bx, c3by, p3x, p3y);

  // Curve 4: right bulb back to baseline (exact mirror of Curve 1)
  const [c4ax, c4ay] = pt(0.62, 0.35);
  const [c4bx, c4by] = pt(0.58, 0);
  const [p4x, p4y] = pt(0.65, 0);
  ctx.bezierCurveTo(c4ax, c4ay, c4bx, c4by, p4x, p4y);

  ctx.lineTo(x2, y2);
}

/**
 * Traces the full closed path of a jigsaw piece at (ox, oy) of cell size (pw, ph).
 */
export function tracePiecePath(ctx, ox, oy, pw, ph, edges, tabSize) {
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  traceJigsawEdge(ctx, ox, oy, ox + pw, oy, edges.top, tabSize);
  traceJigsawEdge(ctx, ox + pw, oy, ox + pw, oy + ph, edges.right, tabSize);
  traceJigsawEdge(ctx, ox + pw, oy + ph, ox, oy + ph, edges.bottom, tabSize);
  traceJigsawEdge(ctx, ox, oy + ph, ox, oy, edges.left, tabSize);
  ctx.closePath();
}

/**
 * Pre-renders every jigsaw piece sprite to a crisp offscreen PNG DataURL.
 * Also renders the board cutout slots overlay DataURL.
 */
export function buildJigsawAssets(img, rows, cols, boardW, boardH) {
  const pw = boardW / cols;
  const ph = boardH / rows;
  const tabSize = Math.min(pw, ph) * 0.22;
  const pad = Math.ceil(tabSize * 1.35);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const { getPieceEdges } = generateEdgeGrid(rows, cols);
  const pieces = [];

  // Create reusable offscreen canvas for piece rendering
  const spriteW = pw + pad * 2;
  const spriteH = ph + pad * 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(spriteW * dpr);
  canvas.height = Math.round(spriteH * dpr);
  const ctx = canvas.getContext('2d');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const edges = getPieceEdges(r, c);
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, spriteW, spriteH);

      // Clip to jigsaw shape
      tracePiecePath(ctx, pad, pad, pw, ph, edges, tabSize);
      ctx.save();
      ctx.clip();

      // Draw exact sub-region of photo (including tabs extending into neighbor cells)
      ctx.drawImage(img, -c * pw + pad, -r * ph + pad, boardW, boardH);

      // Subtle inner highlight bevel along edges for tactile physical feel
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.stroke();
      ctx.restore();

      // Crisp thin outer contour
      tracePiecePath(ctx, pad, pad, pw, ph, edges, tabSize);
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.stroke();

      ctx.restore();

      pieces.push({
        id: r * cols + c,
        row: r,
        col: c,
        edges,
        spriteUrl: canvas.toDataURL('image/png'),
      });
    }
  }

  // Render translucent jigsaw slot grid overlay for the board
  const boardCanvas = document.createElement('canvas');
  boardCanvas.width = Math.round(boardW * dpr);
  boardCanvas.height = Math.round(boardH * dpr);
  const bCtx = boardCanvas.getContext('2d');
  bCtx.scale(dpr, dpr);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const edges = pieces[r * cols + c].edges;
      tracePiecePath(bCtx, c * pw, r * ph, pw, ph, edges, tabSize);
      bCtx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      bCtx.fill();
      bCtx.lineWidth = 1.2;
      bCtx.strokeStyle = 'rgba(60, 75, 95, 0.35)';
      bCtx.stroke();
    }
  }

  return {
    pieces,
    pw,
    ph,
    pad,
    tabSize,
    spriteW,
    spriteH,
    boardOverlayUrl: boardCanvas.toDataURL('image/png'),
  };
}

