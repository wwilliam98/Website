// Strategy base class for pathfinding algorithms.
//
// Subclasses declare a static `algorithmName` and call
// PathfindingAlgorithm.register(Subclass); getAlgorithm (index.js)
// dispatches on it. Adding an algorithm means adding one subclass file
// and requiring it in index.js.

const REGISTRY = new Map();

class PathfindingAlgorithm {
  static algorithmName = '';

  static register(subclass) {
    if (!subclass.algorithmName) throw new Error(`${subclass.name} has no algorithmName`);
    REGISTRY.set(subclass.algorithmName, subclass);
  }

  static get(name) {
    const Subclass = REGISTRY.get(name);
    if (!Subclass) throw new Error(`unknown algorithm: '${name}'`);
    return new Subclass();
  }

  static get names() {
    return [...REGISTRY.keys()];
  }

  constructor() {
    if (new.target === PathfindingAlgorithm) {
      throw new TypeError('PathfindingAlgorithm is abstract');
    }
  }

  // Return {visitedOrder, path, found, pathCost}: visited settle-order and
  // the path from start to target (both as "row-col" ids).
  // eslint-disable-next-line no-unused-vars
  findPath(grid) {
    throw new Error(`${this.constructor.name} must implement findPath()`);
  }

  // cameFrom maps node id -> parent Position.
  static _reconstruct(cameFrom, start, target) {
    const path = [target];
    while (!path[path.length - 1].equals(start)) {
      path.push(cameFrom.get(path[path.length - 1].id));
    }
    return path.reverse();
  }

  _result(grid, visitedOrder, cameFrom, found) {
    const visitedIds = visitedOrder.map((pos) => pos.id);
    if (!found) return { visitedOrder: visitedIds, path: [], found: false, pathCost: null };
    const path = PathfindingAlgorithm._reconstruct(cameFrom, grid.start, grid.target);
    // Cost of entering each node along the path; start itself is free.
    const pathCost = path.slice(1).reduce((sum, pos) => sum + grid.weight(pos), 0);
    return { visitedOrder: visitedIds, path: path.map((pos) => pos.id), found: true, pathCost };
  }
}

module.exports = PathfindingAlgorithm;
