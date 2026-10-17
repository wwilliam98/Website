// Breadth-first search — shortest path by hop count (ignores weights).
const PathfindingAlgorithm = require('./PathfindingAlgorithm');

class BFS extends PathfindingAlgorithm {
  static algorithmName = 'BFS';

  findPath(grid) {
    // Array + head index: O(1) dequeue without Array#shift's O(n) copy.
    const queue = [grid.start];
    let head = 0;
    const seen = new Set([grid.start.id]);
    const cameFrom = new Map();
    const visitedOrder = [];

    while (head < queue.length) {
      const current = queue[head++];
      visitedOrder.push(current);
      if (current.equals(grid.target)) return this._result(grid, visitedOrder, cameFrom, true);
      for (const neighbor of grid.neighbors(current)) {
        if (!seen.has(neighbor.id)) {
          seen.add(neighbor.id);
          cameFrom.set(neighbor.id, current);
          queue.push(neighbor);
        }
      }
    }

    return this._result(grid, visitedOrder, cameFrom, false);
  }
}

PathfindingAlgorithm.register(BFS);
module.exports = BFS;
