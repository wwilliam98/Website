"""Test helpers.

grid_from_ascii builds a Grid from a whitespace-separated picture:

    S . # . T
    . . # 9 .
    . . . . .

S = start, T = target, # = wall, . = open (weight 1), digit 2-9 = weighted cell.
"""

import sys
from pathlib import Path

# Make `app` importable regardless of pytest's working directory.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.domain.grid import Grid  # noqa: E402
from app.domain.position import Position  # noqa: E402


def grid_from_ascii(text: str) -> Grid:
    rows = [line.split() for line in text.strip().splitlines()]
    height, width = len(rows), len(rows[0])
    start = target = None
    walls: set[Position] = set()
    weights: dict[Position, int] = {}

    for row_index, row in enumerate(rows):
        for col_index, cell in enumerate(row):
            pos = Position(row_index, col_index)
            if cell == "S":
                start = pos
            elif cell == "T":
                target = pos
            elif cell == "#":
                walls.add(pos)
            elif cell.isdigit():
                weights[pos] = int(cell)

    assert start is not None and target is not None, "grid needs S and T"
    return Grid(height=height, width=width, start=start, target=target,
                walls=walls, weights=weights)
