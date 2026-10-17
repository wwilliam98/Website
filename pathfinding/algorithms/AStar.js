// A* search — Dijkstra guided by a Euclidean heuristic.
//
// The Euclidean heuristic matches the legacy UI's exploration look and is
// admissible on a 4-connected grid where every step costs at least 1, so
// the returned path cost is optimal (asserted against Dijkstra in tests).
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const MinHeap = require('../domain/MinHeap');

class AStar extends PathfindingAlgorithm {
  static algorithmName = 'AStar';

  static _heuristic(a, b) {
    const rowDelta = a.row - b.row;
    const colDelta = a.col - b.col;
    // sqrt of an exact integer is correctly rounded; Math.hypot is not, and
    // its last-bit error would reorder near-tied heap entries.
    return Math.sqrt(rowDelta * rowDelta + colDelta * colDelta);
  }

  // f = g + h. Weighted A* overrides this to inflate h.
  _priority(costSoFar, estimate) {
    return costSoFar + estimate;
  }

  findPath(grid) {
    const gScore = new Map([[grid.start.id, 0]]);
    const heap = new MinHeap();
    heap.push(this._priority(0, AStar._heuristic(grid.start, grid.target)), grid.start);
    const settled = new Set();
    const cameFrom = new Map();
    const visitedOrder = [];

    while (heap.size > 0) {
      const { value: current } = heap.pop();
      if (settled.has(current.id)) continue; // stale heap entry
      settled.add(current.id);
      visitedOrder.push(current);
      if (current.equals(grid.target)) return this._result(grid, visitedOrder, cameFrom, true);
      for (const neighbor of grid.neighbors(current)) {
        const candidate = gScore.get(current.id) + grid.weight(neighbor);
        if (candidate < (gScore.get(neighbor.id) ?? Infinity)) {
          gScore.set(neighbor.id, candidate);
          cameFrom.set(neighbor.id, current);
          heap.push(this._priority(candidate, AStar._heuristic(neighbor, grid.target)), neighbor);
        }
      }
    }

    return this._result(grid, visitedOrder, cameFrom, false);
  }
}

PathfindingAlgorithm.register(AStar);
module.exports = AStar;
