// gridFromAscii builds a Grid from a whitespace-separated picture:
//
//     S . # . T
//     . . # 9 .
//     . . . . .
//
// S = start, T = target, # = wall, . = open (weight 1), digit 2-9 = weighted cell.
const Grid = require('../domain/Grid');
const Position = require('../domain/Position');

function gridFromAscii(text) {
  const rows = text.trim().split('\n').map((line) => line.trim().split(/\s+/));
  let start = null;
  let target = null;
  const walls = [];
  const weights = new Map();

  rows.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const pos = new Position(rowIndex, colIndex);
      if (cell === 'S') start = pos;
      else if (cell === 'T') target = pos;
      else if (cell === '#') walls.push(pos);
      else if (/^\d$/.test(cell)) weights.set(pos, Number(cell));
    });
  });

  if (!start || !target) throw new Error('grid needs S and T');
  return new Grid({ height: rows.length, width: rows[0].length, start, target, walls, weights });
}

module.exports = { gridFromAscii };
