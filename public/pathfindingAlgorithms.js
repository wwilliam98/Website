// What the visualizer's algorithm picker shows. `name` is what the server's
// getAlgorithm() dispatches on. `guarantee` is what the path is optimal on:
// "cost" (weights included), "steps" (weights ignored), "bounded" (Weighted
// A*: within greed × the best cost) or null (no guarantee).
export const ALGORITHMS = [
    {
        name: "BFS",
        label: "Breadth-first Search",
        short: "BFS",
        group: "Unweighted",
        usesWeights: false,
        guarantee: "steps",
        description: "Explores outward one ring at a time, so the first time it reaches the target is the fewest steps away.",
    },
    {
        name: "DFS",
        label: "Depth-first Search",
        short: "DFS",
        group: "Unweighted",
        usesWeights: false,
        guarantee: null,
        description: "Follows one direction as deep as it can before backtracking. The path it finds is usually long and winding.",
    },
    {
        name: "GreedyBestFirst",
        label: "Greedy Best-first Search",
        short: "Greedy",
        group: "Unweighted",
        usesWeights: false,
        guarantee: null,
        description: "Always moves to whichever cell looks closest to the target, ignoring how far it has already come. Usually very fast, but the path can be far from the best.",
    },
    {
        name: "JumpPoint",
        label: "Jump Point Search",
        short: "JPS",
        group: "Unweighted",
        usesWeights: false,
        guarantee: "steps",
        description: "A* that skips along straight open runs and only stops where the route could turn, so it checks far fewer cells.",
    },
    {
        name: "IterativeDeepening",
        label: "Iterative Deepening DFS",
        short: "IDDFS",
        group: "Unweighted",
        usesWeights: false,
        guarantee: "steps",
        description: "Runs depth-first search with a depth limit of 1, 2, 3, ... until the target is in reach, so each new layer appears one step at a time.",
    },
    {
        name: "Dijkstra",
        label: "Dijkstra's Algorithm",
        short: "Dijkstra",
        group: "Weighted",
        usesWeights: true,
        guarantee: "cost",
        description: "Always expands the cheapest unexplored cell next, so it finds the lowest-cost path even when cells have weights.",
    },
    {
        name: "AStar",
        label: "A* Search",
        short: "A*",
        group: "Weighted",
        usesWeights: true,
        guarantee: "cost",
        description: "Dijkstra plus a distance-to-target estimate. It still finds the lowest-cost path but explores far fewer cells by heading toward the target.",
    },
    {
        name: "WeightedAStar",
        label: "Weighted A* Search",
        short: "Weighted A*",
        group: "Weighted",
        usesWeights: true,
        guarantee: "bounded",
        hasGreed: true,
        description: "A* that trusts its distance estimate more. Turn up the greed to search fewer cells, at the cost of a path up to that many times more expensive than the best one.",
    },
    {
        name: "Bidirectional",
        label: "Bidirectional Dijkstra",
        short: "Bidirectional",
        group: "Weighted",
        usesWeights: true,
        guarantee: "cost",
        description: "Runs Dijkstra from the start and from the target at the same time until the two searches meet.",
    },
    {
        name: "BellmanFord",
        label: "Bellman-Ford",
        short: "Bellman-Ford",
        group: "Weighted",
        usesWeights: true,
        guarantee: "cost",
        description: "Sweeps the whole grid again and again, improving every cell's distance until nothing changes. Slower than Dijkstra, but in general graphs it also handles negative weights.",
    },
];

export const GUARANTEE_LABELS = {
    cost: "Lowest-cost path guaranteed",
    steps: "Fewest steps guaranteed",
    bounded: "Within greed × the best cost",
};

export const DEFAULT_ALGORITHM = "Dijkstra";

export function findAlgorithm(name) {
    return ALGORITHMS.find(algorithm => algorithm.name === name) || null;
}
