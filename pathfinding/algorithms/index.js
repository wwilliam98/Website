// Algorithm registry — requiring the modules triggers registration.
require('./BFS');
require('./DFS');
require('./Dijkstra');
require('./AStar');
require('./GreedyBestFirst');
require('./Bidirectional');
require('./WeightedAStar');
require('./JumpPoint');
require('./BellmanFord');
require('./IterativeDeepening');
const PathfindingAlgorithm = require('./PathfindingAlgorithm');

const getAlgorithm = (name, options) => PathfindingAlgorithm.get(name, options);

module.exports = { PathfindingAlgorithm, getAlgorithm };
