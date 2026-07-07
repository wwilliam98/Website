"""A* search — Dijkstra guided by a Euclidean heuristic.

The Euclidean heuristic matches the legacy UI's exploration look and is
admissible on a 4-connected grid where every step costs at least 1, so
the returned path cost is optimal (asserted against Dijkstra in tests).
"""

import heapq
import math
from itertools import count

from ..domain.grid import Grid
from ..domain.position import Position
from .base import PathfindingAlgorithm, PathfindingResult


class AStar(PathfindingAlgorithm):
    name = "AStar"

    @staticmethod
    def _heuristic(a: Position, b: Position) -> float:
        return math.dist((a.row, a.col), (b.row, b.col))

    def find_path(self, grid: Grid) -> PathfindingResult:
        tie = count()
        g_score = {grid.start: 0}
        heap = [(self._heuristic(grid.start, grid.target), next(tie), grid.start)]
        settled = set()
        came_from = {}
        visited_order = []

        while heap:
            _, _, current = heapq.heappop(heap)
            if current in settled:
                continue  # stale heap entry
            settled.add(current)
            visited_order.append(current)
            if current == grid.target:
                return self._result(grid, visited_order, came_from, True)
            for neighbor in grid.neighbors(current):
                candidate = g_score[current] + grid.weight(neighbor)
                if candidate < g_score.get(neighbor, float("inf")):
                    g_score[neighbor] = candidate
                    came_from[neighbor] = current
                    f_score = candidate + self._heuristic(neighbor, grid.target)
                    heapq.heappush(heap, (f_score, next(tie), neighbor))

        return self._result(grid, visited_order, came_from, False)
