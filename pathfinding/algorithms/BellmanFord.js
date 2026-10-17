// Bellman-Ford — repeatedly sweeps the whole grid relaxing every cell's
// neighbors until no distance improves. Respects weights and guarantees the
// shortest path; slower than Dijkstra, but also works with negative edge
// weights in general graphs (this grid has none).
//
// Two standard speedups keep it fast enough to run on the request thread:
// sweeps alternate direction (Yen's improvement), and a sweep only relaxes
// cells whose distance changed since they were last relaxed. Results are
// the same as the textbook version.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const Position = require('../domain/Position');

class BellmanFord extends PathfindingAlgorithm {
  static algorithmName = 'BellmanFord';

  findPath(grid) {
    const cells = [];
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        const pos = new Position(row, col);
        if (grid.isWalkable(pos)) cells.push(pos);
      }
    }

    const dist = new Map([[grid.start.id, 0]]);
    const cameFrom = new Map();
    const dirty = new Set([grid.start.id]); // distance changed, not yet relaxed
    // Animation shows cells in the order they first become reachable.
    const visitedOrder = [grid.start];

    for (let pass = 0; pass < cells.length - 1 && dirty.size > 0; pass++) {
      const sweep = pass % 2 === 0 ? cells : [...cells].reverse();
      for (const current of sweep) {
        if (!dirty.delete(current.id)) continue;
        const cost = dist.get(current.id);
        for (const neighbor of grid.neighbors(current)) {
          const candidate = cost + grid.weight(neighbor);
          const known = dist.get(neighbor.id);
          if (candidate < (known ?? Infinity)) {
            if (known === undefined) visitedOrder.push(neighbor);
            dist.set(neighbor.id, candidate);
            cameFrom.set(neighbor.id, current);
            dirty.add(neighbor.id);
          }
        }
      }
    }

    return this._result(grid, visitedOrder, cameFrom, dist.has(grid.target.id));
  }
}

PathfindingAlgorithm.register(BellmanFord);
module.exports = BellmanFord;
