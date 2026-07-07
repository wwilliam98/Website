"""Depth-first search — finds a path, not necessarily the shortest."""

from ..domain.grid import Grid
from .base import PathfindingAlgorithm, PathfindingResult


class DFS(PathfindingAlgorithm):
    name = "DFS"

    def find_path(self, grid: Grid) -> PathfindingResult:
        # Stack holds (node, parent) so came_from records the parent the
        # node is actually settled from, not just the first pusher.
        stack = [(grid.start, None)]
        settled = set()
        came_from = {}
        visited_order = []

        while stack:
            current, parent = stack.pop()
            if current in settled:
                continue
            settled.add(current)
            if parent is not None:
                came_from[current] = parent
            visited_order.append(current)
            if current == grid.target:
                return self._result(grid, visited_order, came_from, True)
            # Reversed so the first DIRECTIONS neighbor is explored first
            # (LIFO stack would otherwise invert the visual sweep order).
            for neighbor in reversed(list(grid.neighbors(current))):
                if neighbor not in settled:
                    stack.append((neighbor, current))

        return self._result(grid, visited_order, came_from, False)
