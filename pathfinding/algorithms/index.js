// Algorithm registry — requiring the modules triggers registration.
require('./BFS');
require('./DFS');
require('./Dijkstra');
require('./AStar');
const PathfindingAlgorithm = require('./PathfindingAlgorithm');

const getAlgorithm = (name) => PathfindingAlgorithm.get(name);

module.exports = { PathfindingAlgorithm, getAlgorithm };
