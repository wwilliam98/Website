// Iterative deepening DFS (IDDFS) — runs a depth-limited DFS with limit
// 1, 2, 3, ... until the target is within reach. Uses DFS-style search but
// finds the fewest-steps path like BFS. Ignores weights.
//
// Textbook IDDFS re-explores every route, which is exponential on an open
// grid. Each iteration therefore reuses the exact depths found by earlier
// ones as a transposition table: it only follows steps that lead to a
// cell's known depth, and only cells exactly at the new limit are new. The
// result is unchanged and each iteration is linear in the cells within
// reach. Total work still grows with (path length)^2, so it uses flat typed
// arrays and gives up past MAX_EXPANSIONS rather than stall the server.
//
// The animation shows each cell the first time any iteration reaches it:
// one depth layer per iteration, in DFS order.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const Grid = require('../domain/Grid');
const Position = require('../domain/Position');
const { SearchTooLargeError } = require('../errors');

class IterativeDeepening extends PathfindingAlgorithm {
  static algorithmName = 'IterativeDeepening';
  // ~100ms of work. The UI's largest board (35x70) needs under 1M even as
  // one long winding corridor.
  static MAX_EXPANSIONS = 2_000_000;

  findPath(grid) {
    const { height, width } = grid;
    const size = height * width;
    const index = (pos) => pos.row * width + pos.col;
    const walkable = new Uint8Array(size);
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        walkable[row * width + col] = grid.isWalkable(new Position(row, col)) ? 1 : 0;
      }
    }

    const start = index(grid.start);
    const target = index(grid.target);
    const trueDepth = new Int32Array(size).fill(-1); // fewest steps, once known
    const seenIn = new Int32Array(size); // iteration that last reached the cell
    const depthAt = new Int32Array(size);
    const parent = new Int32Array(size);
    const stack = new Int32Array(size); // each cell is pushed once per iteration
    const visitedOrder = [start];
    trueDepth[start] = 0;
    let expansions = 0;

    // Reversed so the first DIRECTIONS neighbor is explored first, as in DFS.
    const directions = [...Grid.DIRECTIONS].reverse();

    for (let limit = 1; ; limit++) {
      let top = 0;
      stack[top++] = start;
      seenIn[start] = limit;
      depthAt[start] = 0;
      let grew = false; // some cell was reached for the first time

      while (top > 0) {
        const current = stack[--top];
        if (current === target) return this._build(grid, visitedOrder, parent, start, target);
        const depth = depthAt[current];
        if (depth === limit) continue;
        if (++expansions > IterativeDeepening.MAX_EXPANSIONS) {
          throw new SearchTooLargeError(
            'Iterative Deepening would take too long on this board. Try a smaller board or another algorithm.',
          );
        }
        const row = Math.floor(current / width);
        const col = current - row * width;
        for (const [dr, dc] of directions) {
          const r = row + dr;
          const c = col + dc;
          if (r < 0 || r >= height || c < 0 || c >= width) continue;
          const next = r * width + c;
          if (!walkable[next] || seenIn[next] === limit) continue;
          const isNew = trueDepth[next] === -1 && depth + 1 === limit;
          if (trueDepth[next] !== depth + 1 && !isNew) continue;
          if (isNew) {
            trueDepth[next] = limit;
            visitedOrder.push(next);
            grew = true;
          }
          seenIn[next] = limit;
          depthAt[next] = depth + 1;
          parent[next] = current;
          stack[top++] = next;
        }
      }

      // Nothing new at this depth, so no deeper limit can reach the target.
      if (!grew) {
        const visitedIds = visitedOrder.map((i) => `${Math.floor(i / width)}-${i % width}`);
        return { visitedOrder: visitedIds, path: [], found: false, pathCost: null };
      }
    }
  }

  _build(grid, visitedOrder, parent, start, target) {
    const { width } = grid;
    const toPos = (i) => new Position(Math.floor(i / width), i % width);
    const path = [target];
    while (path[path.length - 1] !== start) path.push(parent[path[path.length - 1]]);
    return this._resultFromPath(grid, visitedOrder.map((i) => toPos(i).id), path.reverse().map(toPos));
  }
}

PathfindingAlgorithm.register(IterativeDeepening);
module.exports = IterativeDeepening;
