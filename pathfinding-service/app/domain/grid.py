"""Immutable pathfinding grid — the only object algorithms operate on."""

from collections.abc import Iterable, Iterator, Mapping

from ..schemas import GridPayload
from .position import Position


class Grid:
    # Neighbor order matches the legacy JS UI's connectNodes order
    # (right, down, left, up) so BFS/DFS exploration animations keep
    # their historical look.
    DIRECTIONS = ((0, 1), (1, 0), (0, -1), (-1, 0))

    def __init__(
        self,
        height: int,
        width: int,
        start: Position,
        target: Position,
        walls: Iterable[Position] = (),
        weights: Mapping[Position, int] | None = None,
    ):
        self.height = height
        self.width = width
        self.start = start
        self.target = target
        self._walls = frozenset(walls)
        self._weights = dict(weights or {})

    @classmethod
    def from_payload(cls, payload: GridPayload) -> "Grid":
        return cls(
            height=payload.height,
            width=payload.width,
            start=Position.from_id(payload.start),
            target=Position.from_id(payload.target),
            walls={Position.from_id(node_id) for node_id in payload.walls},
            weights={
                Position.from_id(node_id): weight
                for node_id, weight in payload.weights.items()
            },
        )

    def in_bounds(self, pos: Position) -> bool:
        return 0 <= pos.row < self.height and 0 <= pos.col < self.width

    def is_walkable(self, pos: Position) -> bool:
        return self.in_bounds(pos) and pos not in self._walls

    def weight(self, pos: Position) -> int:
        return self._weights.get(pos, 1)

    def neighbors(self, pos: Position) -> Iterator[Position]:
        for row_delta, col_delta in self.DIRECTIONS:
            candidate = Position(pos.row + row_delta, pos.col + col_delta)
            if self.is_walkable(candidate):
                yield candidate
