function Node(id, status) {
    this.id = id;
    this.weight = 0;
    this.type = "normal" // Node Type (Start, Target, Wall or Weight)
    this.status = status; //Visited or Not Visited
    this.previousNode = null;
    this.path = null;

    this.direction = null;
    this.storedDirection = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
};
  
export default Node;