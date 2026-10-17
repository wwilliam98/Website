// Pathfinding for /PathFindingVisualizer, run in-process by Express at
// POST /api/pathfind. The browser owns the grid UI and animation; this
// module owns the algorithms.
const Grid = require('./domain/Grid');
const { getAlgorithm } = require('./algorithms');
const { validatePathfindRequest, ValidationError } = require('./validation');

// body: {algorithm, grid: {height, width, start, target, walls, weights}}
// Returns {found, visited_order, path, stats}; throws ValidationError.
function pathfind(body) {
  const request = validatePathfindRequest(body);
  const grid = Grid.fromPayload(request.grid);
  const result = getAlgorithm(request.algorithm).findPath(grid);
  return {
    found: result.found,
    visited_order: result.visitedOrder,
    path: result.path,
    stats: {
      visited_count: result.visitedOrder.length,
      path_length: result.path.length,
      path_cost: result.pathCost,
    },
  };
}

module.exports = { pathfind, ValidationError };
