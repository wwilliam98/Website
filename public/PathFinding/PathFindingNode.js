function Node(id, nodetype) {
    this.id = id;
    this.weight = 1;
    this.type = nodetype // Node Type (Start, Target, Wall, Weight or Normal)
    this.status = "unvisited"; //Visited or Not Visited

    this.neighborsNode = [];
    
    this.storedDirection = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
};
  
export default Node;