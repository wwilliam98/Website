from app.algorithms import get_algorithm
from app.domain.grid import Grid

from .conftest import grid_from_ascii

OPEN_5X5 = """
S . . . .
. . . . .
. . . . .
. . . . .
. . . . T
"""

WALL_DETOUR = """
S . # . .
. . # . .
. . # . .
. . . . T
"""

# The regression case the legacy JS got wrong: a weight-9 cell sits on the
# direct corridor; the cheap route detours around it (cost 6 vs 12).
WEIGHTED_CORRIDOR = """
. . . . .
S . 9 . T
. . . . .
"""

SEALED_TARGET = """
S . . # .
. . . # T
. . . # #
"""


def path_is_valid(grid: Grid, path_ids: list[str]) -> bool:
    """Consecutive path nodes must be walkable 4-neighbors."""
    from app.domain.position import Position

    path = [Position.from_id(node_id) for node_id in path_ids]
    if path[0] != grid.start or path[-1] != grid.target:
        return False
    for previous, current in zip(path, path[1:]):
        if not grid.is_walkable(current):
            return False
        if abs(previous.row - current.row) + abs(previous.col - current.col) != 1:
            return False
    return True


class TestBFS:
    def test_shortest_path_on_open_grid(self):
        grid = grid_from_ascii(OPEN_5X5)
        result = get_algorithm("BFS").find_path(grid)
        assert result.found
        # Manhattan distance 8 → 9 nodes inclusive
        assert len(result.path) == 9
        assert result.path[0] == "0-0"
        assert result.path[-1] == "4-4"

    def test_wall_forces_exact_detour(self):
        grid = grid_from_ascii(WALL_DETOUR)
        result = get_algorithm("BFS").find_path(grid)
        assert result.found
        # Must drop to row 3 to clear the wall: shortest is 8 nodes
        assert len(result.path) == 8
        assert path_is_valid(grid, result.path)

    def test_visited_order_is_deterministic(self):
        # Guards Grid.DIRECTIONS (right, down, left, up) — animation parity
        grid = grid_from_ascii(OPEN_5X5)
        result = get_algorithm("BFS").find_path(grid)
        assert result.visited_order[:3] == ["0-0", "0-1", "1-0"]

    def test_visited_never_includes_walls(self):
        grid = grid_from_ascii(WALL_DETOUR)
        result = get_algorithm("BFS").find_path(grid)
        assert "0-2" not in result.visited_order
        assert "1-2" not in result.visited_order


class TestDFS:
    def test_finds_a_valid_path(self):
        grid = grid_from_ascii(WALL_DETOUR)
        result = get_algorithm("DFS").find_path(grid)
        assert result.found
        assert path_is_valid(grid, result.path)

    def test_visited_never_includes_walls(self):
        grid = grid_from_ascii(WALL_DETOUR)
        result = get_algorithm("DFS").find_path(grid)
        assert not {"0-2", "1-2", "2-2"} & set(result.visited_order)


class TestDijkstra:
    def test_routes_around_heavy_cell(self):
        # THE weighted-correctness regression the legacy JS failed
        grid = grid_from_ascii(WEIGHTED_CORRIDOR)
        result = get_algorithm("Dijkstra").find_path(grid)
        assert result.found
        assert "1-2" not in result.path, "path must avoid the weight-9 cell"
        assert result.path_cost == 6.0  # detour: 6 unit-cost steps

    def test_prefers_heavy_shortcut_when_cheaper(self):
        grid = grid_from_ascii("""
S 2 T
. # .
""")
        result = get_algorithm("Dijkstra").find_path(grid)
        # Straight through the weight-2 cell costs 3; any detour is blocked
        assert result.path == ["0-0", "0-1", "0-2"]
        assert result.path_cost == 3.0


class TestAStar:
    def test_cost_matches_dijkstra_everywhere(self):
        # A* with an admissible heuristic must be optimal
        for ascii_grid in (OPEN_5X5, WALL_DETOUR, WEIGHTED_CORRIDOR):
            grid = grid_from_ascii(ascii_grid)
            dijkstra = get_algorithm("Dijkstra").find_path(grid)
            astar = get_algorithm("AStar").find_path(grid)
            assert astar.found and dijkstra.found
            assert astar.path_cost == dijkstra.path_cost, ascii_grid

    def test_routes_around_heavy_cell(self):
        grid = grid_from_ascii(WEIGHTED_CORRIDOR)
        result = get_algorithm("AStar").find_path(grid)
        assert "1-2" not in result.path
        assert result.path_cost == 6.0


class TestNoPath:
    def test_sealed_target(self):
        grid = grid_from_ascii(SEALED_TARGET)
        for name in ("BFS", "DFS", "Dijkstra", "AStar"):
            result = get_algorithm(name).find_path(grid)
            assert not result.found, name
            assert result.path == [], name
            assert result.path_cost is None, name
            assert len(result.visited_order) > 0, name


class TestRegistry:
    def test_unknown_algorithm_raises(self):
        import pytest

        with pytest.raises(ValueError, match="unknown algorithm"):
            get_algorithm("BellmanFord")
