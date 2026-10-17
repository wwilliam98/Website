// Jump Point Search (4-directional) — A* that skips over straight runs of
// open cells, only stopping at "jump points" where the route could turn.
// It settles far fewer cells than A* and finds the fewest-steps path, but
// only on uniform-cost grids, so it ignores weights (like BFS).
//
// Pruning and jump rules follow the 4-connected variant in PathFinding.js
// (JPFNeverMoveDiagonally). The animation shows the jump points; the path is
// filled in cell by cell between them.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const MinHeap = require('../domain/MinHeap');
const Position = require('../domain/Position');

const manhattan = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

class JumpPoint extends PathfindingAlgorithm {
  static algorithmName = 'JumpPoint';

  findPath(grid) {
    const gScore = new Map([[grid.start.id, 0]]);
    const heap = new MinHeap();
    heap.push(manhattan(grid.start, grid.target), grid.start);
    const settled = new Set();
    const cameFrom = new Map();
    const visitedOrder = [];

    while (heap.size > 0) {
      const { value: current } = heap.pop();
      if (settled.has(current.id)) continue; // stale heap entry
      settled.add(current.id);
      visitedOrder.push(current);
      if (current.equals(grid.target)) {
        const jumpPoints = PathfindingAlgorithm._reconstruct(cameFrom, grid.start, grid.target);
        return this._resultFromPath(grid, visitedOrder.map((pos) => pos.id), JumpPoint._expand(jumpPoints));
      }
      for (const direction of this._directions(grid, current, cameFrom.get(current.id))) {
        const jumpPoint = this._jump(grid, current, direction);
        if (jumpPoint === null || settled.has(jumpPoint.id)) continue;
        const candidate = gScore.get(current.id) + manhattan(current, jumpPoint);
        if (candidate < (gScore.get(jumpPoint.id) ?? Infinity)) {
          gScore.set(jumpPoint.id, candidate);
          cameFrom.set(jumpPoint.id, current);
          heap.push(candidate + manhattan(jumpPoint, grid.target), jumpPoint);
        }
      }
    }

    return this._result(grid, visitedOrder, cameFrom, false);
  }

  // Directions worth scanning from `pos`, given the jump point it came from.
  _directions(grid, pos, parent) {
    const open = ([dr, dc]) => grid.isWalkable(new Position(pos.row + dr, pos.col + dc));
    if (!parent) return [[0, 1], [1, 0], [0, -1], [-1, 0]].filter(open);
    const dr = Math.sign(pos.row - parent.row);
    const dc = Math.sign(pos.col - parent.col);
    // Keep going straight, or turn to either side.
    const options = dc !== 0 ? [[0, dc], [1, 0], [-1, 0]] : [[dr, 0], [0, 1], [0, -1]];
    return options.filter(open);
  }

  // Walk from `from` in `direction` until reaching a jump point (returned)
  // or a wall/edge (null).
  _jump(grid, from, [dr, dc]) {
    const walkable = (row, col) => grid.isWalkable(new Position(row, col));
    let { row, col } = from;
    for (;;) {
      row += dr;
      col += dc;
      if (!walkable(row, col)) return null;
      const pos = new Position(row, col);
      if (pos.equals(grid.target)) return pos;
      if (dc !== 0) {
        // Moving horizontally: an opening above/below that was blocked
        // one step back is a "forced neighbor" — the route may turn here.
        if ((walkable(row - 1, col) && !walkable(row - 1, col - dc)) ||
            (walkable(row + 1, col) && !walkable(row + 1, col - dc))) return pos;
      } else {
        if ((walkable(row, col - 1) && !walkable(row - dr, col - 1)) ||
            (walkable(row, col + 1) && !walkable(row - dr, col + 1))) return pos;
        // Moving vertically: stop if a horizontal scan from here finds one.
        if (this._jump(grid, pos, [0, 1]) !== null || this._jump(grid, pos, [0, -1]) !== null) return pos;
      }
    }
  }

  // Fill in the straight segments between consecutive jump points.
  static _expand(jumpPoints) {
    const path = [jumpPoints[0]];
    for (let i = 1; i < jumpPoints.length; i++) {
      const to = jumpPoints[i];
      let { row, col } = jumpPoints[i - 1];
      const dr = Math.sign(to.row - row);
      const dc = Math.sign(to.col - col);
      while (row !== to.row || col !== to.col) {
        row += dr;
        col += dc;
        path.push(new Position(row, col));
      }
    }
    return path;
  }
}

PathfindingAlgorithm.register(JumpPoint);
module.exports = JumpPoint;
