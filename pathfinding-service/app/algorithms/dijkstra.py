"""Dijkstra / uniform-cost search — cheapest path with node weights.

Nodes settle at heap-pop with a stale-entry skip. The legacy JS version
marked nodes visited at enqueue, which is incorrect on weighted grids —
this implementation is the fix (and replaces its O(n²) per-iteration
queue sort with a binary heap).
"""

import heapq
from itertools import count

from ..domain.grid import Grid
from .base import PathfindingAlgorithm, PathfindingResult


class Dijkstra(PathfindingAlgorithm):
    name = "Dijkstra"

    def find_path(self, grid: Grid) -> PathfindingResult:
        tie = count()  # tiebreaker keeps heap comparisons off Position
        dist = {grid.start: 0}
        heap = [(0, next(tie), grid.start)]
        settled = set()
        came_from = {}
        visited_order = []

        while heap:
            cost, _, current = heapq.heappop(heap)
            if current in settled:
                continue  # stale heap entry
            settled.add(current)
            visited_order.append(current)
            if current == grid.target:
                return self._result(grid, visited_order, came_from, True)
            for neighbor in grid.neighbors(current):
                candidate = cost + grid.weight(neighbor)
                if candidate < dist.get(neighbor, float("inf")):
                    dist[neighbor] = candidate
                    came_from[neighbor] = current
                    heapq.heappush(heap, (candidate, next(tie), neighbor))

        return self._result(grid, visited_order, came_from, False)
