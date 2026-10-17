// Immutable pathfinding grid — the only object algorithms operate on.
const Position = require('./Position');

class Grid {
  // Neighbor order matches the legacy JS UI's connectNodes order
  // (right, down, left, up) so BFS/DFS exploration animations keep
  // their historical look. A determinism test guards it.
  static DIRECTIONS = Object.freeze([[0, 1], [1, 0], [0, -1], [-1, 0]]);

  constructor({ height, width, start, target, walls = [], weights = new Map() }) {
    this.height = height;
    this.width = width;
    this.start = start;
    this.target = target;
    this._walls = new Set([...walls].map((pos) => pos.id));
    this._weights = new Map([...weights].map(([pos, weight]) => [pos.id, weight]));
    Object.freeze(this);
  }

  // Build from a validated request payload (see validation.js).
  static fromPayload(payload) {
    return new Grid({
      height: payload.height,
      width: payload.width,
      start: Position.fromId(payload.start),
      target: Position.fromId(payload.target),
      walls: payload.walls.map(Position.fromId),
      weights: new Map(
        Object.entries(payload.weights).map(([id, weight]) => [Position.fromId(id), weight]),
      ),
    });
  }

  inBounds(pos) {
    return pos.row >= 0 && pos.row < this.height && pos.col >= 0 && pos.col < this.width;
  }

  isWalkable(pos) {
    return this.inBounds(pos) && !this._walls.has(pos.id);
  }

  weight(pos) {
    return this._weights.get(pos.id) ?? 1;
  }

  *neighbors(pos) {
    for (const [rowDelta, colDelta] of Grid.DIRECTIONS) {
      const candidate = new Position(pos.row + rowDelta, pos.col + colDelta);
      if (this.isWalkable(candidate)) yield candidate;
    }
  }
}

module.exports = Grid;
