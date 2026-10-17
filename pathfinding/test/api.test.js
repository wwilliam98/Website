const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { pathfind, ValidationError } = require('..');

function payload(overrides = {}) {
  const base = {
    algorithm: 'BFS',
    grid: { height: 5, width: 5, start: '0-0', target: '4-4', walls: [], weights: {} },
  };
  for (const [key, value] of Object.entries(overrides)) {
    if (key in base.grid) base.grid[key] = value;
    else base[key] = value;
  }
  return base;
}

describe('pathfind', () => {
  it('solves the happy path with every algorithm', () => {
    for (const algorithm of ['BFS', 'DFS', 'Dijkstra', 'AStar']) {
      const body = pathfind(payload({ algorithm }));
      assert.equal(body.found, true, algorithm);
      assert.equal(body.path[0], '0-0');
      assert.equal(body.path[body.path.length - 1], '4-4');
      assert.equal(body.stats.visited_count, body.visited_order.length);
      assert.equal(body.stats.path_length, body.path.length);
    }
  });

  it('returns found: false when the target is sealed', () => {
    const body = pathfind(payload({ walls: ['3-4', '4-3', '3-3'] }));
    assert.equal(body.found, false);
    assert.deepEqual(body.path, []);
    assert.equal(body.stats.path_cost, null);
  });

  it('solves a full-size board quickly', () => {
    const started = Date.now();
    for (const algorithm of ['BFS', 'DFS', 'Dijkstra', 'AStar']) {
      pathfind({
        algorithm,
        grid: { height: 100, width: 100, start: '0-0', target: '99-99', walls: [], weights: {} },
      });
    }
    assert.ok(Date.now() - started < 1000);
  });
});

describe('validation', () => {
  const rejects = (overrides) => assert.throws(() => pathfind(payload(overrides)), ValidationError);

  it('rejects a malformed id', () => rejects({ walls: ['1_2'] }));
  it('rejects an out-of-bounds id', () => rejects({ walls: ['99-99'] }));
  it('rejects start equal to target', () => rejects({ start: '4-4' }));
  it('rejects start in walls', () => rejects({ walls: ['0-0'] }));
  it('rejects a node that is both wall and weight', () =>
    rejects({ walls: ['2-2'], weights: { '2-2': 5 } }));
  it('rejects a weight out of range', () => rejects({ weights: { '2-2': 99 } }));
  it('rejects an unknown algorithm', () => rejects({ algorithm: 'bogus' }));
  it('rejects a non-integer height', () => rejects({ height: '33' }));
  it('rejects dimensions over the cap', () => rejects({ width: 101 }));
  it('rejects a body that is not an object', () =>
    assert.throws(() => pathfind(null), ValidationError));
});
