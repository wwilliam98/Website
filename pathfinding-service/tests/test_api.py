from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def payload(**overrides) -> dict:
    base = {
        "algorithm": "BFS",
        "grid": {
            "height": 5,
            "width": 5,
            "start": "0-0",
            "target": "4-4",
            "walls": [],
            "weights": {},
        },
    }
    grid_keys = base["grid"].keys()
    for key, value in overrides.items():
        (base["grid"] if key in grid_keys else base)[key] = value
    return base


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_happy_path_all_algorithms():
    for algorithm in ("BFS", "DFS", "Dijkstra", "AStar"):
        response = client.post("/pathfind", json=payload(algorithm=algorithm))
        assert response.status_code == 200, (algorithm, response.text)
        body = response.json()
        assert body["found"] is True
        assert body["path"][0] == "0-0"
        assert body["path"][-1] == "4-4"
        assert body["stats"]["visited_count"] == len(body["visited_order"])
        assert body["stats"]["path_length"] == len(body["path"])


def test_no_path_returns_found_false():
    walls = ["3-4", "4-3", "3-3"]  # seal the target corner
    response = client.post("/pathfind", json=payload(walls=walls))
    assert response.status_code == 200
    body = response.json()
    assert body["found"] is False
    assert body["path"] == []
    assert body["stats"]["path_cost"] is None


def test_422_malformed_id():
    response = client.post("/pathfind", json=payload(walls=["1_2"]))
    assert response.status_code == 422


def test_422_out_of_bounds():
    response = client.post("/pathfind", json=payload(walls=["99-99"]))
    assert response.status_code == 422


def test_422_start_equals_target():
    response = client.post("/pathfind", json=payload(start="4-4"))
    assert response.status_code == 422


def test_422_start_in_walls():
    response = client.post("/pathfind", json=payload(walls=["0-0"]))
    assert response.status_code == 422


def test_422_weight_out_of_range():
    response = client.post("/pathfind", json=payload(weights={"2-2": 99}))
    assert response.status_code == 422


def test_422_unknown_algorithm():
    response = client.post("/pathfind", json=payload(algorithm="bogus"))
    assert response.status_code == 422
