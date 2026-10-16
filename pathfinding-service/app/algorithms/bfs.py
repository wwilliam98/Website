"""Breadth-first search — shortest path by hop count (ignores weights)."""

from collections import deque

from ..domain.grid import Grid
from .base import PathfindingAlgorithm, PathfindingResult


class BFS(PathfindingAlgorithm):
    name = "BFS"

    def find_path(self, grid: Grid) -> PathfindingResult:
        queue = deque([grid.start])
        seen = {grid.start}
        came_from = {}
        visited_order = []

        while queue:
            current = queue.popleft()
            visited_order.append(current)
            if current == grid.target:
                return self._result(grid, visited_order, came_from, True)
            for neighbor in grid.neighbors(current):
                if neighbor not in seen:
                    seen.add(neighbor)
                    came_from[neighbor] = current
                    queue.append(neighbor)

        return self._result(grid, visited_order, came_from, False)
