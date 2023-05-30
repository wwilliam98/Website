//for JS use ESModules (import ....), for Node use CommonJS (require ....)
import Node from "/PathFindingNode.js";
import {create_recursive_horizontal, create_perimeterWall} from "./PathFinding/createMaze.js";
import {BFS, DFS, twoBFS} from "./PathFinding/PathFindingUnweightedAlgorithm.js";

// import create_recursive_horizontal from "./PathFinding/createMaze";

// Board attributes
function Board(height, width){
    // Setups the board
    this.height = height; //used
    this.width = width; //used

    this.boardArray = []; //used
    this.getNodesByID = {}; //used
    this.nodes_adjacency_list = {}; //used {id: set of neighbors}

    this.start = null; //used
    this.target = null; //used
    // this.object = null;

    // Event listeners
    this.mouseDown = false; //used
    this.pressedNode = "nothing"; //used
    this.previouslyPressedNode = null; //used
    this.previouslySwitchedNode = null; 
    this.previouslySwitchedNodeWeight = 0;
    this.selectedObject = "wall"
    this.keyDown = false; //might use

    // Things to be animated
    this.nodesToAnimate = []; //used
    this.objectNodesToAnimate = [];
    this.AnimateFoundPath = [];
    this.objectShortestPathNodesToAnimate = [];
    this.animateWalls = []; //used
    
    this.selectedAlgorithm = 'DFS'; //used
    this.isAlgoRunning = false;
    this.currentHeuristic = null;
    this.numberOfObjects = 0;
    this.isObject = false;
    this.buttonsOn = false;
    this.speed = "fast";
};

// Board Setup ##############################################################################################################
Board.prototype.createGrid = function(){
    let tableHTML = "";
    for (let r = 0; r < this.height; r++){
        let currentArrayRow = [];
        let currentHTMLRow = "<tr>";

        for (let c = 0; c < this.width; c++){
            let newNodeId = `${r}-${c}`, nodeType, newNode;
            if (r === Math.floor(this.height / 2) && c === Math.floor(this.width / 4)) {
                nodeType = "start";
                this.start = `${newNodeId}`;

            } else if (r === Math.floor(this.height / 2) && c === Math.floor(3 * this.width / 4)) {
                nodeType = "target";
                this.target = `${newNodeId}`;

            } else {
                nodeType = "normal";
            }

            // Create new node for the div
            newNode = new Node(newNodeId, nodeType); //ID, weight, type, status, previousNode, Path
            this.getNodesByID[`${newNodeId}`] = newNode;
            currentArrayRow.push(newNode);
            currentHTMLRow += `<td id="${newNodeId}" class="${nodeType}"></td>`;
        }
        this.boardArray.push(currentArrayRow);
        tableHTML += `${currentHTMLRow}</tr>`;
    }
    let board = document.getElementById("board");
    board.innerHTML = tableHTML;
};

Board.prototype.connectNodes = function(){
    let directions = [[0,1],[1,0],[0,-1],[-1,0]];
    let visited = new Set();
    let queue = [];
    let nodeNeighbors = new Set();

    queue.push('0-0');
    visited.add('0-0');
    this.nodes_adjacency_list['0-0'] = [];

    while (queue){
        // console.log(queue);
        let current = queue.shift();
        current = current.split("-");
        let x = parseInt(current[0]);
        let y = parseInt(current[1]);
        nodeNeighbors = new Set();

        for (let direction=0; direction < directions.length; direction++){
            let dx = directions[direction][0];
            let dy = directions[direction][1];
            let nx = x;
            let ny = y;

            if (0 <= nx + dx && nx + dx < this.height && 0 <= ny + dy && ny + dy < this.width){
                nx += dx;
                ny += dy;
                
                nodeNeighbors.add(`${nx}-${ny}`);

                if (!visited.has(`${nx}-${ny}`)){
                    queue.push(`${nx}-${ny}`);
                    visited.add(`${nx}-${ny}`);
                }
            }
        }
        this.nodes_adjacency_list[`${current[0]}-${current[1]}`] = Array.from(nodeNeighbors);
        if (x === this.height - 1 && y === this.width - 1){
                break;
            }
        }
}
// End of Board Setup ##############################################################################################################

// Get Node, given the id (ex. "0-0")
Board.prototype.getNodefromBoard = function(id) {
    let coordinates = id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    return this.boardArray[r][c];
};

Board.prototype.animate = function(){
    let board = this
    function timeout(i, j){
        setTimeout(function(){
            if (i < 0 || i >= board.height || j < 0 || j >= board.width){
                return
            }

            let currentId = `${i}-${j}`;
            let currentNode = board.getNodefromBoard(currentId);
            let currentelement = document.getElementById(currentId);

            if (currentNode.status == "visited" || currentNode.type == "wall" || currentNode.type == "target"){
                return
            }

            if (currentNode.type != "start"){
                currentNode.status = "visited";
                currentelement.className = "visited";
            }
            // console.log(i, j)
            timeout(i, j + 1);
            timeout(i, j - 1);
            timeout(i + 1, j);
            timeout(i - 1, j);
        }, 40);
    }
    let start_row = parseInt(this.start.split("-")[0]);
    let start_col = parseInt(this.start.split("-")[1]);
    timeout(start_row, start_col);
}

Board.prototype.animatequeue = function(nodesToAnimate){ //visitedNodes is an array of nodes
    let board = this;
    function timeout(i){
        let queue = nodesToAnimate;
        
        setTimeout(function(){
            if (i > queue.length-1 || queue[i].type == "start" || queue[i].type == "target"){
                console.log(queue[i])
                return
            }
            else{
                let currentId = queue[i].id;
                let currentNode = queue[i];
                let currentelement = document.getElementById(currentId);
                currentelement.className = currentNode.type;
            }
            timeout(i+1);
        }, 20);
    }
    // console.log(nodesToAnimate);
    timeout(0);
}

////////////////////////////////////---------EVENT LISTENER---------////////////////////////////////////
Board.prototype.addEventListener = function(){
    let board = this;
    for (let i = 0; i < board.height; i++){
        for (let j = 0; j < board.width; j++){
            let currentId = `${i}-${j}`;
            let currentNode = board.getNodefromBoard(currentId);
            let currentTableElement = document.getElementById(currentId);
            
            // Just set to wall when initial click is a wall and vice versa
            currentTableElement.onmousedown = () => {
                board.mouseDown = true;
                if (currentNode.type === "start" || currentNode.type === "target" || currentNode.type === "object") {
                    board.pressedNode = currentNode.type;
                } 
                else if (currentNode.type === "wall"){
                    board.pressedNode = currentNode.type;
                    board.changeWalltoNormal(currentNode);
                }
                else {
                    board.pressedNode = "normal";
                    board.changeNormalNodeToWall(currentNode);
                }
            };

            currentTableElement.onmouseup = () =>{
                board.mouseDown = false;
                if (board.pressedNode === "target") {
                    board.target = currentId;
                }
                else if (board.pressedNode === "start") {
                    board.start = currentId;
                } 
                // else if (board.pressedNode === "object") {
                //     board.object = currentId;
                // }
                board.pressedNode = "nothing";
                // currentTableElement.className = "wall";
                // console.log(board);
            };

            currentTableElement.onmouseenter = () =>{
                // if (this.buttonsOn) {
                    console.log(currentNode.type, board.pressedNode)
                    if (board.mouseDown){
                        // For 
                        if ((board.pressedNode === "start" || board.pressedNode === "target" || board.pressedNode === "object")) {
                            if (board.pressedNode === "start") {
                                board.start = currentId;
                            }
                            else if (board.pressedNode === "target") {
                                board.target = currentId;
                            }
                            else if (board.pressedNode === "object") {
                                board.object = currentId;
                            }
                        } 
                        else if (board.pressedNode === "normal") {
                            board.changeNormalNodeToWall(currentNode);
                        }
                        else if (board.pressedNode === "wall") {
                            board.changeWalltoNormal(currentNode);
                        }
                    }
                    else{ //for Weight later
                        
                    }
            };

            currentTableElement.onmouseleave = () => {
                //if (this.buttonsOn) {
                    if (board.mouseDown){
                        if ((board.pressedNode === "start" || board.pressedNode === "target" || board.pressedNode === "object")) {
                            if (board.pressedNode === "start") {
                                board.start = currentId;
                            }
                            else if (board.pressedNode === "target") {
                                board.target = currentId;
                            }
                            else if (board.pressedNode === "object") {
                                board.object = currentId;
                            }
                        } 
                        else if (board.pressedNode === "normal") {
                            board.changeNormalNodeToWall(currentNode);
                        }
                        else if (board.pressedNode === "wall") {
                            board.changeWalltoNormal(currentNode);
                        }
                    }
                    else{ //for Weight later
                        
                    }
                    
                    if (board.mouseDown && board.pressedNode !== "normal") {
                        board.MoveSpecialNode(currentNode);
                    }
                    else{
                        // board.changeNormalNodeToWall(currentNode);
                    }
                //}
            }
        }
    }
};
////////////////////////////////////---------EVENT LISTENER ENDS---------////////////////////////////////////

Board.prototype.changeNormalNodeToWall = function(currentNode) {
    let specialStatus = ["start", "target", "object"];
    let currentelement = document.getElementById(currentNode.id);
    if (!specialStatus.includes(currentNode.type)) {
        if (currentNode.type !== "wall"){
            currentNode.type = "wall";
            currentelement.className = "wall";
        }
    }
    currentNode.weight = 0; //set weight to 0 because its a wall

    // else if (this.keyDown === 87 && !unweightedAlgorithms.includes(this.selectedAlgorithm)) {
    //   if (!specialStatuses.includes(currentNode.status)) {
    //     element.className = currentNode.weight !== 15 ?
    //       "unvisited weight" : "unvisited";
    //     currentNode.weight = element.className !== "unvisited weight" ?
    //       0 : 15;
    //     currentNode.status = "unvisited";
    //   }
    // }
}

Board.prototype.changeWalltoNormal = function(currentNode) {
    let currentelement = document.getElementById(currentNode.id);
    let specialStatuses = ["start", "target", "object"];
    if (!specialStatuses.includes(currentNode.type)) {
        if (currentNode.type !== "normal"){
            currentNode.type = "normal";
            currentelement.className = "normal";
        }
    }
    currentNode.weight = 1;

    // else if (this.keyDown === 87 && !unweightedAlgorithms.includes(this.selectedAlgorithm)) {
    //   if (!specialStatuses.includes(currentNode.status)) {
    //     element.className = currentNode.weight !== 15 ?
    //       "unvisited weight" : "unvisited";
    //     currentNode.weight = element.className !== "unvisited weight" ?
    //       0 : 15;
    //     currentNode.status = "unvisited";
    //   }
    // }
}

Board.prototype.MoveSpecialNode = function(currentNode) {
    let element = document.getElementById(currentNode.id), previousElement;
    if (this.previouslySwitchedNode){
        previousElement = document.getElementById(this.previouslySwitchedNode.id);
    }
    if (currentNode.type !== "target" && currentNode.type !== "start" && currentNode.type !== "object") {
      if (this.previouslySwitchedNode) {
        this.previouslySwitchedNode.type = this.previouslyPressedNode;
        previousElement.className = this.previouslySwitchedNodeWeight === 15 ?
        "unvisited weight" : this.previouslyPressedNode;
        this.previouslySwitchedNode.weight = this.previouslySwitchedNodeWeight === 15 ?
        15 : 0;
        this.previouslySwitchedNode = null;
        this.previouslySwitchedNodeWeight = currentNode.weight;
  
        this.previouslyPressedNode = currentNode.type;
        element.className = this.pressedNode;
        currentNode.type = this.pressedNode;
  
        currentNode.weight = 0;
      }
    } else if (currentNode.type !== this.pressedNode && !this.isAlgoRunning) {
      this.previouslySwitchedNode.type = this.pressedNode;
      previousElement.className = this.pressedNode;
    } else if (currentNode.type === this.pressedNode) {
      this.previouslySwitchedNode = currentNode;
      element.className = this.previouslyPressedNode;
      currentNode.type = this.previouslyPressedNode;
    }
  };

Board.prototype.resetBoard = function(){
    // let navbarHeight = document.getElementById("navbarDiv").clientHeight;
    // let textHeight = document.getElementById("mainText").clientHeight + document.getElementById("algorithmDescriptor").clientHeight;
    // let height = Math.floor((document.documentElement.clientHeight - navbarHeight - textHeight) / 28);
    // let width = Math.floor(document.documentElement.clientWidth / 25);

    let height = this.height;
    let width = this.width;
    let start = Math.floor(height / 2).toString() + "-" + Math.floor(width / 4).toString();
    let target = Math.floor(height / 2).toString() + "-" + Math.floor(3 * width / 4).toString();

    Object.keys(this.getNodesByID).forEach(id => {
        let currentNode = this.getNodesByID[id];
        let currentHTMLNode = document.getElementById(id);
        if (id === start) {
            currentHTMLNode.className = "start";
            currentNode.type = "start";
        } 
        else if (id === target) {
            currentHTMLNode.className = "target";
            currentNode.type = "target"
        } 
        else {
            currentHTMLNode.className = "normal";
            currentNode.type = "normal";
        }
        currentNode.previousNode = null;
        currentNode.path = null;
        currentNode.direction = null;
        currentNode.storedDirection = null;
        currentNode.distance = Infinity;
        currentNode.totalDistance = Infinity;
        currentNode.heuristicDistance = null;
        currentNode.weight = 0;
        currentNode.relatesToObject = false;
        currentNode.overwriteObjectRelation = false;

    });
    this.start = start;
    this.target = target;
    this.object = null;
    this.nodesToAnimate = [];
    this.AnimateFoundPath = [];
    this.objectNodesToAnimate = [];
    this.shortestPathNodesToAnimate = [];
    this.objectShortestPathNodesToAnimate = [];
    this.animateWalls = [];
    this.mouseDown = false;
    this.pressedNode = "normal";
    this.previouslyPressedNode = null;
    this.previouslySwitchedNode = null;
    this.previouslySwitchedNodeWeight = 0;
    this.keyDown = false;
    this.isAlgoRunning = false;
    this.numberOfObjects = 0;
    this.isObject = false;

    console.log(this.nodesToAnimate)
    console.log(this.getNodesByID)
};

Board.prototype.clearPath = function(t){
    console.log(t);
}

Board.prototype.toggleButtons = function() {
    let board = this;
    document.getElementById('startButtonClearBoard').onclick = () => {
        board.resetBoard();
    }

    document.getElementById('BFSDropdown').onclick = () => {
        document.getElementById('VisualizeButtonli').innerHTML = `<li><button id=VisualizeButton class="btn btn-default navbar-btn" type="button">Visualize BFS</button></li>`;
        board.selectedAlgorithm = "BFS";
    }

    document.getElementById('DFSDropdown').onclick = () => {
        document.getElementById('VisualizeButtonli').innerHTML = `<button id="VisualizeButton" class="btn btn-default navbar-btn" type="button">Visualize DFS</button>`;
        board.selectedAlgorithm = "DFS";
    }

    document.getElementById('DijkstraDropdown').onclick = () => {
        document.getElementById('VisualizeButtonli').innerHTML = `<button id="VisualizeButton" class="btn btn-default navbar-btn" type="button">Visualize Dijkstra</button>`;
        board.selectedAlgorithm = "Dijkstra";
    }

    document.getElementById('AStarDropdown').onclick = () => {
        document.getElementById('VisualizeButtonli').innerHTML = `<button id="VisualizeButton" class="btn btn-default navbar-btn" type="button">Visualize A*</button>`;
        board.selectedAlgorithm = "AStar";
    }

    document.getElementById('VisualizeButtonli').onclick = () => {
        if (!this.isAlgoRunning){
            this.isAlgoRunning = true;
            if (board.selectedAlgorithm === "BFS") {
                BFS();
            }
            else if (board.selectedAlgorithm === "DFS") {
                console.log('iam clicked')
                DFS(board, board.start, board.target);
                console.log(board.nodesToAnimate);
                board.animatequeue(board.nodesToAnimate);
                board.animatequeue(board.AnimateFoundPath);
            }
            else if (board.selectedAlgorithm === "Dijkstra") {
                Dijkstra();
            }
            else if (board.selectedAlgorithm === "AStar") {
                AStar();
            }
            else {
                console.log("No algorithm selected");
            }
        }
        else{
            this.isAlgoRunning = false;
        }
    }


    document.getElementById('RecursiveDivisionHorizontalDropdown').onclick = () => {
        board.resetBoard();
        create_perimeterWall(this);
        create_recursive_horizontal(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false);
        board.animatequeue(this.animateWalls);
    }
}

Board.prototype.visualize = function(algorithm) {
    this.algorithm = algorithm;
    this.isAlgoRunning = false;
    this.numberOfObjects = 0;
    this.isObject = false;
}

Board.prototype.initialise = function(){
    this.createGrid(); 
    // this.connectNodes();
    this.addEventListener();
    // this.toggleButtons();
};

// let height = Math.floor(($(document).height()) / 28);
// let width = Math.floor($(document).width() / 25);
let newBoard = new Board(11, 20);
// let newBoard = new Board(4, 5);
newBoard.initialise();