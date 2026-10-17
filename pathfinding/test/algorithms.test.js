const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getAlgorithm } = require('../algorithms');
const Position = require('../domain/Position');
const { gridFromAscii } = require('./helpers');

const OPEN_5X5 = `
S . . . .
. . . . .
. . . . .
. . . . .
. . . . T
`;

const WALL_DETOUR = `
S . # . .
. . # . .
. . # . .
. . . . T
`;

// The regression case the original browser code got wrong: a weight-9 cell
// sits on the direct corridor; the cheap route detours around it (cost 6 vs 12).
const WEIGHTED_CORRIDOR = `
. . . . .
S . 9 . T
. . . . .
`;

const SEALED_TARGET = `
S . . # .
. . . # T
. . . # #
`;

// Consecutive path nodes must be walkable 4-neighbors.
function pathIsValid(grid, pathIds) {
  const path = pathIds.map(Position.fromId);
  if (!path[0].equals(grid.start) || !path[path.length - 1].equals(grid.target)) return false;
  for (let i = 1; i < path.length; i++) {
    if (!grid.isWalkable(path[i])) return false;
    const step = Math.abs(path[i - 1].row - path[i].row) + Math.abs(path[i - 1].col - path[i].col);
    if (step !== 1) return false;
  }
  return true;
}

describe('BFS', () => {
  it('finds the shortest path on an open grid', () => {
    const result = getAlgorithm('BFS').findPath(gridFromAscii(OPEN_5X5));
    assert.ok(result.found);
    // Manhattan distance 8 → 9 nodes inclusive
    assert.equal(result.path.length, 9);
    assert.equal(result.path[0], '0-0');
    assert.equal(result.path[result.path.length - 1], '4-4');
  });

  it('takes the exact detour around a wall', () => {
    const grid = gridFromAscii(WALL_DETOUR);
    const result = getAlgorithm('BFS').findPath(grid);
    assert.ok(result.found);
    // Must drop to row 3 to clear the wall: shortest is 8 nodes
    assert.equal(result.path.length, 8);
    assert.ok(pathIsValid(grid, result.path));
  });

  it('explores in a deterministic order', () => {
    // Guards Grid.DIRECTIONS (right, down, left, up) — animation parity
    const result = getAlgorithm('BFS').findPath(gridFromAscii(OPEN_5X5));
    assert.deepEqual(result.visitedOrder.slice(0, 3), ['0-0', '0-1', '1-0']);
  });

  it('never visits walls', () => {
    const result = getAlgorithm('BFS').findPath(gridFromAscii(WALL_DETOUR));
    assert.ok(!result.visitedOrder.includes('0-2'));
    assert.ok(!result.visitedOrder.includes('1-2'));
  });
});

describe('DFS', () => {
  it('finds a valid path', () => {
    const grid = gridFromAscii(WALL_DETOUR);
    const result = getAlgorithm('DFS').findPath(grid);
    assert.ok(result.found);
    assert.ok(pathIsValid(grid, result.path));
  });

  it('never visits walls', () => {
    const result = getAlgorithm('DFS').findPath(gridFromAscii(WALL_DETOUR));
    for (const wall of ['0-2', '1-2', '2-2']) assert.ok(!result.visitedOrder.includes(wall));
  });
});

describe('Dijkstra', () => {
  it('routes around a heavy cell', () => {
    // The weighted-correctness regression the original browser code failed
    const result = getAlgorithm('Dijkstra').findPath(gridFromAscii(WEIGHTED_CORRIDOR));
    assert.ok(result.found);
    assert.ok(!result.path.includes('1-2'), 'path must avoid the weight-9 cell');
    assert.equal(result.pathCost, 6); // detour: 6 unit-cost steps
  });

  it('takes a heavy shortcut when it is cheaper', () => {
    const result = getAlgorithm('Dijkstra').findPath(gridFromAscii(`
S 2 T
. # .
`));
    // Straight through the weight-2 cell costs 3; any detour is blocked
    assert.deepEqual(result.path, ['0-0', '0-1', '0-2']);
    assert.equal(result.pathCost, 3);
  });
});

describe('AStar', () => {
  it('matches Dijkstra cost everywhere', () => {
    // A* with an admissible heuristic must be optimal
    for (const ascii of [OPEN_5X5, WALL_DETOUR, WEIGHTED_CORRIDOR]) {
      const grid = gridFromAscii(ascii);
      const dijkstra = getAlgorithm('Dijkstra').findPath(grid);
      const astar = getAlgorithm('AStar').findPath(grid);
      assert.ok(astar.found && dijkstra.found);
      assert.equal(astar.pathCost, dijkstra.pathCost, ascii);
    }
  });

  it('routes around a heavy cell', () => {
    const result = getAlgorithm('AStar').findPath(gridFromAscii(WEIGHTED_CORRIDOR));
    assert.ok(!result.path.includes('1-2'));
    assert.equal(result.pathCost, 6);
  });
});

describe('no path', () => {
  it('reports a sealed target as not found', () => {
    const grid = gridFromAscii(SEALED_TARGET);
    for (const name of ['BFS', 'DFS', 'Dijkstra', 'AStar']) {
      const result = getAlgorithm(name).findPath(grid);
      assert.equal(result.found, false, name);
      assert.deepEqual(result.path, [], name);
      assert.equal(result.pathCost, null, name);
      assert.ok(result.visitedOrder.length > 0, name);
    }
  });
});

describe('registry', () => {
  it('rejects an unknown algorithm', () => {
    assert.throws(() => getAlgorithm('BellmanFord'), /unknown algorithm/);
  });
});
