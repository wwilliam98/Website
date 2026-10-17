// Client for the pathfinding API (POST /api/pathfind on the Express server).
// The server owns the algorithms; this file owns serialization and transport.

export class PathfindingApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'PathfindingApiError';
        this.status = status;
    }
}

export class PathfindingApiClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    // Returns {found, visited_order, path, stats}; throws PathfindingApiError.
    async findPath(algorithm, gridPayload) {
        let response;
        try {
            response = await fetch(`${this.baseUrl}/api/pathfind`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ algorithm, grid: gridPayload }),
            });
        } catch (networkError) {
            throw new PathfindingApiError('Could not reach the server', 0);
        }
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new PathfindingApiError(body.error || 'Pathfinding failed', response.status);
        }
        return response.json();
    }
}

// Snapshot the board into the API's grid payload.
export function serializeBoard(board) {
    const walls = [];
    const weights = {};
    for (const [id, node] of Object.entries(board.getNodesByID)) {
        if (node.type === 'wall') walls.push(id);
        else if (node.type === 'weight') weights[id] = node.weight;
    }
    return {
        // The resize slider assigns raw <input> strings to board.height/width
        height: Number(board.height),
        width: Number(board.width),
        start: board.start.id,
        target: board.target.id,
        walls,
        weights,
    };
}
