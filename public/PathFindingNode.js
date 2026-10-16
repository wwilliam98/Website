// Grid cell model. Pathfinding state (distances, neighbors) lives in the
// Python service; the browser only tracks what it renders.
function Node(id, nodetype) {
    this.id = id;
    this.weight = 1;
    this.type = nodetype // Node Type (Start, Target, Wall, Weight or Normal)
    this.status = "unvisited"; //Visited or Not Visited
};

export default Node
