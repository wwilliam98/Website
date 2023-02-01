function getNeighbors(id, Node, boardArray){  //Taking id, Node, and boardArray, returns an array of neighbors of the Node.
    let coordinates = id.split("-");
    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);
    let neighbors = [];
    let directions = [[0,1],[1,0],[0,-1],[-1,0]];

    for (let directionIndex=0; directionIndex < directions.length; directionIndex++){
        let dx = directions[directionIndex][0];
        let dy = directions[directionIndex][1];
        let nx = x;
        let ny = y;
        

    }
};

function add_edge(Node1, Node2, boardArray){
    
}

export default {getNeighbors, add_edge};