function Node(id, status) {
    this.id = id;
    this.weight = 0;
    this.status = status;
    this.previousNode = null;
    this.path = null;

    this.direction = null;
    this.storedDirection = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
};
  
export default Node;