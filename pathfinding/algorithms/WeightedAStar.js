// Weighted A* — A* with the heuristic multiplied by a "greed" factor
// (options.greed, 1-5, default 2). Greed 1 is plain A*; higher values head
// for the target more eagerly and explore less, and the path cost is
// guaranteed to be at most greed × the optimal cost.
const PathfindingAlgorithm = require('./PathfindingAlgorithm');
const AStar = require('./AStar');

class WeightedAStar extends AStar {
  static algorithmName = 'WeightedAStar';
  static DEFAULT_GREED = 2;

  get greed() {
    return this.options.greed ?? WeightedAStar.DEFAULT_GREED;
  }

  _priority(costSoFar, estimate) {
    return costSoFar + this.greed * estimate;
  }
}

PathfindingAlgorithm.register(WeightedAStar);
module.exports = WeightedAStar;
