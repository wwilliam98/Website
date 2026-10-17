// Greedy best-first search — always expands the node that looks closest to
// the target (A*'s heuristic alone, ignoring cost so far). Usually fast,
// but ignores weights and doesn't guarantee the shortest path.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const AStar = require('./AStar');
const MinHeap = require('../domain/MinHeap');

class GreedyBestFirst extends PathfindingAlgorithm {
  static algorithmName = 'GreedyBestFirst';

  findPath(grid) {
    const heap = new MinHeap();
    heap.push(AStar._heuristic(grid.start, grid.target), grid.start);
    const seen = new Set([grid.start.id]);
    const cameFrom = new Map();
    const visitedOrder = [];

    while (heap.size > 0) {
      const { value: current } = heap.pop();
      visitedOrder.push(current);
      if (current.equals(grid.target)) return this._result(grid, visitedOrder, cameFrom, true);
      for (const neighbor of grid.neighbors(current)) {
        if (!seen.has(neighbor.id)) {
          seen.add(neighbor.id);
          cameFrom.set(neighbor.id, current);
          heap.push(AStar._heuristic(neighbor, grid.target), neighbor);
        }
      }
    }

    return this._result(grid, visitedOrder, cameFrom, false);
  }
}

PathfindingAlgorithm.register(GreedyBestFirst);
module.exports = GreedyBestFirst;
