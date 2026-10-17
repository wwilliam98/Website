// Position value object mirroring the UI's "row-col" cell ids.
// JS Maps/Sets compare objects by reference, so algorithms key their
// bookkeeping on `pos.id` rather than on Position instances.
class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    Object.freeze(this);
  }

  static fromId(nodeId) {
    const [row, col] = nodeId.split('-').map(Number);
    return new Position(row, col);
  }

  get id() {
    return `${this.row}-${this.col}`;
  }

  equals(other) {
    return this.row === other.row && this.col === other.col;
  }
}

module.exports = Position;
