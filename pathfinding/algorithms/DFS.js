// Depth-first search — finds a path, not necessarily the shortest.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');

class DFS extends PathfindingAlgorithm {
  static algorithmName = 'DFS';

  findPath(grid) {
    // Stack holds [node, parent] so cameFrom records the parent the
    // node is actually settled from, not just the first pusher.
    const stack = [[grid.start, null]];
    const settled = new Set();
    const cameFrom = new Map();
    const visitedOrder = [];

    while (stack.length > 0) {
      const [current, parent] = stack.pop();
      if (settled.has(current.id)) continue;
      settled.add(current.id);
      if (parent !== null) cameFrom.set(current.id, parent);
      visitedOrder.push(current);
      if (current.equals(grid.target)) return this._result(grid, visitedOrder, cameFrom, true);
      // Reversed so the first DIRECTIONS neighbor is explored first
      // (LIFO stack would otherwise invert the visual sweep order).
      for (const neighbor of [...grid.neighbors(current)].reverse()) {
        if (!settled.has(neighbor.id)) stack.push([neighbor, current]);
      }
    }

    return this._result(grid, visitedOrder, cameFrom, false);
  }
}

PathfindingAlgorithm.register(DFS);
module.exports = DFS;
