"""Pydantic request/response models for the pathfinding API.

Node ids use the same "row-col" string format as the browser UI's DOM
cell ids, and algorithm names match the UI dropdown strings exactly, so
the JS layer needs no translation.
"""

import re
from enum import Enum

from pydantic import BaseModel, Field, model_validator

_ID_RE = re.compile(r"\d+-\d+")

MIN_WEIGHT = 2
MAX_WEIGHT = 10


class Algorithm(str, Enum):
    BFS = "BFS"
    DFS = "DFS"
    DIJKSTRA = "Dijkstra"
    ASTAR = "AStar"


class GridPayload(BaseModel):
    height: int = Field(ge=2, le=200)
    width: int = Field(ge=2, le=200)
    start: str
    target: str
    walls: list[str] = Field(default_factory=list)
    weights: dict[str, int] = Field(default_factory=dict)

    @model_validator(mode="after")
    def check_consistency(self) -> "GridPayload":
        for node_id in (self.start, self.target, *self.walls, *self.weights):
            if not _ID_RE.fullmatch(node_id):
                raise ValueError(f"malformed node id: {node_id!r} (expected 'row-col')")
            row, col = map(int, node_id.split("-"))
            if not (0 <= row < self.height and 0 <= col < self.width):
                raise ValueError(f"node id out of bounds: {node_id!r}")

        if self.start == self.target:
            raise ValueError("start and target must differ")

        wall_set = set(self.walls)
        if self.start in wall_set or self.target in wall_set:
            raise ValueError("start/target cannot be walls")
        if wall_set & self.weights.keys():
            raise ValueError("a node cannot be both a wall and a weight")

        for node_id, weight in self.weights.items():
            if not MIN_WEIGHT <= weight <= MAX_WEIGHT:
                raise ValueError(
                    f"weight for {node_id!r} must be {MIN_WEIGHT}-{MAX_WEIGHT}, got {weight}"
                )
        return self


class PathfindRequest(BaseModel):
    algorithm: Algorithm
    grid: GridPayload


class PathfindStats(BaseModel):
    visited_count: int
    path_length: int
    path_cost: float | None


class PathfindResponse(BaseModel):
    found: bool
    visited_order: list[str]
    path: list[str]
    stats: PathfindStats
