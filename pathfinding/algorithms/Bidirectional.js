// Bidirectional Dijkstra — one search grows from the start and another from
// the target, always advancing whichever frontier is cheaper, until they
// meet. Respects weights and guarantees the shortest path.
//
// A cell's weight is the cost of entering it, so the backward search pays
// a cell's weight when it steps *out* of that cell toward the start:
// toTarget(u) = toTarget(v) + weight(v) for a forward step u -> v.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const MinHeap = require('../domain/MinHeap');

class Bidirectional extends PathfindingAlgorithm {
  static algorithmName = 'Bidirectional';

  findPath(grid) {
    const forward = this._side(grid.start);
    const backward = this._side(grid.target);
    const visitedOrder = [];
    const visited = new Set();
    let best = Infinity; // cheapest start -> target cost found so far
    let meeting = null;

    const consider = (pos) => {
      const total = forward.dist.get(pos.id) + backward.dist.get(pos.id);
      if (total < best) {
        best = total;
        meeting = pos;
      }
    };

    while (forward.heap.size > 0 && backward.heap.size > 0) {
      Bidirectional._dropStale(forward);
      Bidirectional._dropStale(backward);
      if (forward.heap.size === 0 || backward.heap.size === 0) break;
      // Standard stopping rule: no unexplored route can beat `best` once the
      // two frontiers' cheapest entries add up to at least it.
      if (forward.heap.peekPriority() + backward.heap.peekPriority() >= best) break;

      const isForward = forward.heap.peekPriority() <= backward.heap.peekPriority();
      const side = isForward ? forward : backward;
      const other = isForward ? backward : forward;
      const { priority: cost, value: current } = side.heap.pop();
      side.settled.add(current.id);
      if (!visited.has(current.id)) {
        visited.add(current.id);
        visitedOrder.push(current);
      }

      for (const neighbor of grid.neighbors(current)) {
        // Forward pays to enter the neighbor; backward pays to leave current.
        const candidate = cost + grid.weight(isForward ? neighbor : current);
        if (candidate < (side.dist.get(neighbor.id) ?? Infinity)) {
          side.dist.set(neighbor.id, candidate);
          side.cameFrom.set(neighbor.id, current);
          side.heap.push(candidate, neighbor);
          if (other.dist.has(neighbor.id)) consider(neighbor);
        }
      }
    }

    const visitedIds = visitedOrder.map((pos) => pos.id);
    if (meeting === null) return { visitedOrder: visitedIds, path: [], found: false, pathCost: null };

    const toStart = PathfindingAlgorithm._reconstruct(forward.cameFrom, grid.start, meeting);
    const toTarget = PathfindingAlgorithm._reconstruct(backward.cameFrom, grid.target, meeting).reverse();
    return this._resultFromPath(grid, visitedIds, [...toStart, ...toTarget.slice(1)]);
  }

  _side(origin) {
    const heap = new MinHeap();
    heap.push(0, origin);
    return { heap, dist: new Map([[origin.id, 0]]), cameFrom: new Map(), settled: new Set() };
  }

  // Pop entries for already-settled nodes so peekPriority() is meaningful.
  static _dropStale(side) {
    while (side.heap.size > 0 && side.settled.has(side.heap.peek().id)) side.heap.pop();
  }
}

PathfindingAlgorithm.register(Bidirectional);
module.exports = Bidirectional;
