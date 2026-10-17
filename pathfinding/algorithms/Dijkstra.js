// Dijkstra / uniform-cost search — cheapest path with node weights.
//
// Nodes settle at heap-pop with a stale-entry skip. The original browser
// version marked nodes visited at enqueue, which is incorrect on weighted
// grids — settling at pop is the fix.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const MinHeap = require('../domain/MinHeap');

class Dijkstra extends PathfindingAlgorithm {
  static algorithmName = 'Dijkstra';

  findPath(grid) {
    const dist = new Map([[grid.start.id, 0]]);
    const heap = new MinHeap();
    heap.push(0, grid.start);
    const settled = new Set();
    const cameFrom = new Map();
    const visitedOrder = [];

    while (heap.size > 0) {
      const { priority: cost, value: current } = heap.pop();
      if (settled.has(current.id)) continue; // stale heap entry
      settled.add(current.id);
      visitedOrder.push(current);
      if (current.equals(grid.target)) return this._result(grid, visitedOrder, cameFrom, true);
      for (const neighbor of grid.neighbors(current)) {
        const candidate = cost + grid.weight(neighbor);
        if (candidate < (dist.get(neighbor.id) ?? Infinity)) {
          dist.set(neighbor.id, candidate);
          cameFrom.set(neighbor.id, current);
          heap.push(candidate, neighbor);
        }
      }
    }

    return this._result(grid, visitedOrder, cameFrom, false);
  }
}

PathfindingAlgorithm.register(Dijkstra);
module.exports = Dijkstra;
