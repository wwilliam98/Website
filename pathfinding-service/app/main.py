"""FastAPI entry point for the pathfinding service.

Internal-only service (localhost:8000); the browser reaches it through
the Express proxy at POST /api/pathfind. No CORS needed.
"""

from fastapi import FastAPI

from .algorithms import get_algorithm
from .domain.grid import Grid
from .schemas import PathfindRequest, PathfindResponse, PathfindStats

app = FastAPI(title="Pathfinding Service", version="1.0.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/pathfind", response_model=PathfindResponse)
def pathfind(request: PathfindRequest) -> PathfindResponse:
    grid = Grid.from_payload(request.grid)
    result = get_algorithm(request.algorithm.value).find_path(grid)
    return PathfindResponse(
        found=result.found,
        visited_order=result.visited_order,
        path=result.path,
        stats=PathfindStats(
            visited_count=len(result.visited_order),
            path_length=len(result.path),
            path_cost=result.path_cost,
        ),
    )
