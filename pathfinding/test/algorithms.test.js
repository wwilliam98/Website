const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getAlgorithm } = require('../algorithms');
const Position = require('../domain/Position');
const Grid = require('../domain/Grid');
const { SearchTooLargeError } = require('../errors');
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

const ALL = ['BFS', 'DFS', 'Dijkstra', 'AStar', 'GreedyBestFirst', 'Bidirectional',
  'WeightedAStar', 'JumpPoint', 'BellmanFord', 'IterativeDeepening'];

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
    for (const name of ALL) {
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
    assert.throws(() => getAlgorithm('FloydWarshall'), /unknown algorithm/);
  });
});

describe('GreedyBestFirst', () => {
  it('heads straight for the target on an open grid', () => {
    const result = getAlgorithm('GreedyBestFirst').findPath(gridFromAscii(OPEN_5X5));
    assert.equal(result.path.length, 9);
    // Only cells on the way get settled, unlike BFS which sweeps the grid
    assert.equal(result.visitedOrder.length, 9);
  });

  it('can walk into a dead end that A* avoids', () => {
    const grid = gridFromAscii(`
. . . . . . .
. # # # # # .
. . . . S # T
. # # # # # .
`);
    const greedy = getAlgorithm('GreedyBestFirst').findPath(grid);
    const astar = getAlgorithm('AStar').findPath(grid);
    assert.ok(pathIsValid(grid, greedy.path));
    assert.ok(greedy.visitedOrder.includes('2-3'), 'greedy is drawn toward the wall first');
    assert.equal(greedy.pathCost, astar.pathCost);
  });
});

describe('Bidirectional', () => {
  it('routes around a heavy cell', () => {
    const result = getAlgorithm('Bidirectional').findPath(gridFromAscii(WEIGHTED_CORRIDOR));
    assert.ok(!result.path.includes('1-2'));
    assert.equal(result.pathCost, 6);
  });

  it('grows from both ends', () => {
    const result = getAlgorithm('Bidirectional').findPath(gridFromAscii(OPEN_5X5));
    assert.deepEqual(result.visitedOrder.slice(0, 2), ['0-0', '4-4']);
  });

  it('handles start next to target', () => {
    const result = getAlgorithm('Bidirectional').findPath(gridFromAscii('S T .'));
    assert.deepEqual(result.path, ['0-0', '0-1']);
  });
});

describe('WeightedAStar', () => {
  it('matches A* when greed is 1', () => {
    const grid = gridFromAscii(WEIGHTED_CORRIDOR);
    const weighted = getAlgorithm('WeightedAStar', { greed: 1 }).findPath(grid);
    const astar = getAlgorithm('AStar').findPath(grid);
    assert.deepEqual(weighted, astar);
  });

  it('explores less as greed rises', () => {
    const grid = gridFromAscii(WALL_DETOUR);
    const low = getAlgorithm('WeightedAStar', { greed: 1 }).findPath(grid);
    const high = getAlgorithm('WeightedAStar', { greed: 5 }).findPath(grid);
    assert.ok(high.visitedOrder.length < low.visitedOrder.length);
  });

  it('defaults greed to 2', () => {
    const grid = gridFromAscii(WALL_DETOUR);
    assert.deepEqual(
      getAlgorithm('WeightedAStar').findPath(grid),
      getAlgorithm('WeightedAStar', { greed: 2 }).findPath(grid),
    );
  });
});

describe('JumpPoint', () => {
  it('settles only jump points on an open grid', () => {
    const result = getAlgorithm('JumpPoint').findPath(gridFromAscii(OPEN_5X5));
    assert.equal(result.path.length, 9);
    assert.ok(result.visitedOrder.length < 9);
  });

  it('fills in the path between jump points', () => {
    const grid = gridFromAscii(WALL_DETOUR);
    const result = getAlgorithm('JumpPoint').findPath(grid);
    assert.equal(result.path.length, 8);
    assert.ok(pathIsValid(grid, result.path));
  });
});

describe('BellmanFord', () => {
  it('routes around a heavy cell', () => {
    const result = getAlgorithm('BellmanFord').findPath(gridFromAscii(WEIGHTED_CORRIDOR));
    assert.ok(!result.path.includes('1-2'));
    assert.equal(result.pathCost, 6);
  });

  it('takes a heavy shortcut when it is cheaper', () => {
    const result = getAlgorithm('BellmanFord').findPath(gridFromAscii(`
S 2 T
. # .
`));
    assert.deepEqual(result.path, ['0-0', '0-1', '0-2']);
  });
});

describe('IterativeDeepening', () => {
  it('finds the fewest-steps path', () => {
    const grid = gridFromAscii(WALL_DETOUR);
    const result = getAlgorithm('IterativeDeepening').findPath(grid);
    assert.equal(result.path.length, 8);
    assert.ok(pathIsValid(grid, result.path));
  });

  it('reveals one depth layer per iteration', () => {
    const result = getAlgorithm('IterativeDeepening').findPath(gridFromAscii(OPEN_5X5));
    const depth = (id) => id.split('-').map(Number).reduce((a, b) => a + b);
    const depths = result.visitedOrder.map(depth);
    assert.deepEqual(depths, [...depths].sort((a, b) => a - b));
  });

  it('gives up instead of stalling on a huge winding maze', () => {
    // 100x100 serpentine corridor: ~5000 steps long
    const walls = [];
    for (let col = 1; col < 99; col += 2) {
      const gap = ((col - 1) / 2) % 2 ? 0 : 99;
      for (let row = 0; row < 100; row++) if (row !== gap) walls.push(new Position(row, col));
    }
    const grid = new Grid({
      height: 100, width: 100, start: new Position(0, 0), target: new Position(99, 99), walls,
    });
    assert.throws(() => getAlgorithm('IterativeDeepening').findPath(grid), SearchTooLargeError);
  });
});

// Property check on many random boards: every algorithm returns a valid
// path exactly when one exists, and the optimal ones match Dijkstra/BFS.
describe('all algorithms on random boards', () => {
  it('agree with Dijkstra and BFS', () => {
    let seed = 7;
    const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    const pick = (n) => Math.floor(rand() * n);

    for (let i = 0; i < 300; i++) {
      const height = 2 + pick(20);
      const width = 2 + pick(20);
      const start = new Position(pick(height), pick(width));
      let target;
      do target = new Position(pick(height), pick(width)); while (target.equals(start));
      const walls = [];
      const weights = new Map();
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const pos = new Position(row, col);
          if (pos.equals(start) || pos.equals(target)) continue;
          const roll = rand();
          if (roll < 0.3) walls.push(pos);
          else if (i % 2 === 0 && roll < 0.45) weights.set(pos, 2 + pick(9));
        }
      }
      const grid = new Grid({ height, width, start, target, walls, weights });
      const dijkstra = getAlgorithm('Dijkstra').findPath(grid);
      const bfs = getAlgorithm('BFS').findPath(grid);

      for (const name of ALL) {
        const greed = 1 + pick(9) / 2;
        const result = getAlgorithm(name, { greed }).findPath(grid);
        const label = `${name} on board ${i}`;
        assert.equal(result.found, dijkstra.found, label);
        assert.equal(new Set(result.visitedOrder).size, result.visitedOrder.length, label);
        if (!result.found) continue;
        assert.ok(pathIsValid(grid, result.path), label);
        if (['Dijkstra', 'AStar', 'Bidirectional', 'BellmanFord'].includes(name)) {
          assert.equal(result.pathCost, dijkstra.pathCost, label);
        }
        if (name === 'WeightedAStar') assert.ok(result.pathCost <= greed * dijkstra.pathCost, label);
        if (['JumpPoint', 'IterativeDeepening'].includes(name)) {
          assert.equal(result.path.length, bfs.path.length, label);
        }
      }
    }
  });
});
