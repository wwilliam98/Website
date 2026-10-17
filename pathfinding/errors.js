// Errors caused by the request rather than the server; app.js answers them
// with 422 and the message, which the visualizer shows in its status bar.
class PathfindingError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends PathfindingError {}

// The board is valid but the algorithm would hold the event loop too long.
class SearchTooLargeError extends PathfindingError {}

module.exports = { PathfindingError, ValidationError, SearchTooLargeError };
