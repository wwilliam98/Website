"""Strategy base class for pathfinding algorithms.

Subclasses declare a class-level ``name`` and are auto-registered via
``__init_subclass__``; ``get_algorithm`` (package root) dispatches on it.
Adding an algorithm means adding one subclass file — nothing else changes.
"""

from abc import ABC, abstractmethod
from typing import ClassVar, NamedTuple

from ..domain.grid import Grid
from ..domain.position import Position

_REGISTRY: dict[str, type["PathfindingAlgorithm"]] = {}


class PathfindingResult(NamedTuple):
    visited_order: list[str]
    path: list[str]
    found: bool
    path_cost: float | None


class PathfindingAlgorithm(ABC):
    name: ClassVar[str] = ""

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if cls.name:
            _REGISTRY[cls.name] = cls

    @abstractmethod
    def find_path(self, grid: Grid) -> PathfindingResult:
        """Return visited settle-order and the path from start to target."""

    @staticmethod
    def _reconstruct(
        came_from: dict[Position, Position], start: Position, target: Position
    ) -> list[Position]:
        path = [target]
        while path[-1] != start:
            path.append(came_from[path[-1]])
        path.reverse()
        return path

    def _result(
        self,
        grid: Grid,
        visited_order: list[Position],
        came_from: dict[Position, Position],
        found: bool,
    ) -> PathfindingResult:
        visited_ids = [pos.id for pos in visited_order]
        if not found:
            return PathfindingResult(visited_ids, [], False, None)
        path = self._reconstruct(came_from, grid.start, grid.target)
        # Cost of entering each node along the path; start itself is free.
        cost = float(sum(grid.weight(pos) for pos in path[1:]))
        return PathfindingResult(visited_ids, [pos.id for pos in path], True, cost)
