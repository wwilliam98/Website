"""Algorithm registry — importing the modules triggers auto-registration."""

from . import astar, bfs, dfs, dijkstra  # noqa: F401
from .base import _REGISTRY, PathfindingAlgorithm, PathfindingResult

__all__ = ["PathfindingAlgorithm", "PathfindingResult", "get_algorithm"]


def get_algorithm(name: str) -> PathfindingAlgorithm:
    try:
        return _REGISTRY[name]()
    except KeyError:
        raise ValueError(f"unknown algorithm: {name!r}") from None
