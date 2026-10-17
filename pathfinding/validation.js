// Request validation for POST /api/pathfind. Node ids use the same "row-col"
// format as the browser UI's DOM cell ids, and algorithm names match the UI
// dropdown strings exactly, so the browser needs no translation.
const { PathfindingAlgorithm } = require('./algorithms');

const ID_RE = /^\d+-\d+$/;
const MIN_DIM = 2;
// The UI slider tops out at 35x70. The cap stays well above that but bounds
// how long one crafted request can hold the event loop (~30ms at 100x100).
const MAX_DIM = 100;
const MIN_WEIGHT = 2;
const MAX_WEIGHT = 10;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

// Returns the normalized {algorithm, grid} or throws ValidationError.
function validatePathfindRequest(body) {
  if (!isPlainObject(body)) throw new ValidationError('request body must be a JSON object');
  const { algorithm, grid } = body;

  if (!PathfindingAlgorithm.names.includes(algorithm)) {
    throw new ValidationError(
      `algorithm must be one of ${PathfindingAlgorithm.names.join(', ')}`,
    );
  }
  if (!isPlainObject(grid)) throw new ValidationError('grid must be an object');

  const { height, width, start, target, walls = [], weights = {} } = grid;
  for (const [field, value] of [['height', height], ['width', width]]) {
    if (!Number.isInteger(value) || value < MIN_DIM || value > MAX_DIM) {
      throw new ValidationError(`${field} must be an integer ${MIN_DIM}-${MAX_DIM}`);
    }
  }
  if (!Array.isArray(walls)) throw new ValidationError('walls must be an array');
  if (!isPlainObject(weights)) throw new ValidationError('weights must be an object');

  const weightIds = Object.keys(weights);
  for (const nodeId of [start, target, ...walls, ...weightIds]) {
    if (typeof nodeId !== 'string' || !ID_RE.test(nodeId)) {
      throw new ValidationError(`malformed node id: ${JSON.stringify(nodeId)} (expected 'row-col')`);
    }
    const [row, col] = nodeId.split('-').map(Number);
    if (row >= height || col >= width) {
      throw new ValidationError(`node id out of bounds: '${nodeId}'`);
    }
  }

  if (start === target) throw new ValidationError('start and target must differ');

  const wallSet = new Set(walls);
  if (wallSet.has(start) || wallSet.has(target)) {
    throw new ValidationError('start/target cannot be walls');
  }
  if (weightIds.some((id) => wallSet.has(id))) {
    throw new ValidationError('a node cannot be both a wall and a weight');
  }

  for (const [nodeId, weight] of Object.entries(weights)) {
    if (!Number.isInteger(weight) || weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
      throw new ValidationError(
        `weight for '${nodeId}' must be ${MIN_WEIGHT}-${MAX_WEIGHT}, got ${JSON.stringify(weight)}`,
      );
    }
  }

  return { algorithm, grid: { height, width, start, target, walls, weights } };
}

module.exports = { validatePathfindRequest, ValidationError };
