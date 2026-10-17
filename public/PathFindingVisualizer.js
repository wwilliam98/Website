import Node from './PathFindingNode.js'
import {create_maze} from './createMaze.js'
import {PathfindingApiClient, PathfindingApiError, serializeBoard} from './PathfindingApiClient.js'

const apiClient = new PathfindingApiClient();

// Maze dropdown element id -> create_maze style
const MAZE_DROPDOWNS = {
    RecursiveDivisionDropdown: "balanced",
    RecursiveDivisionHorizontalDropdown: "horizontal",
    RecursiveDivisionVerticalDropdown: "vertical",
};

// Algorithm name (as the server knows it; dropdown id is `${name}Dropdown`)
// -> Visualize button label and "About Algorithm" text
const ALGORITHMS = {
    BFS: {
        button: "BFS",
        title: "Breadth First Search (Unweighted)",
        description: "A search algorithm that traverse from the root node and explore its neighboring node. Guarantee shortest path on unweighted graph but doesn't Guarantee shortest path on weighted graph.",
    },
    DFS: {
        button: "DFS",
        title: "Depth First Search (Unweighted)",
        description: "A search algorithm that traverse from the root node to the deepest branch before backtracking. Doesn't Guarantee shortest path.",
    },
    GreedyBestFirst: {
        button: "Greedy",
        title: "Greedy Best-First Search (Unweighted)",
        description: "Always moves to whichever cell looks closest to the target, ignoring how far it has already come. Usually very fast, but doesn't guarantee the shortest path.",
    },
    JumpPoint: {
        button: "JPS",
        title: "Jump Point Search (Unweighted)",
        description: "A* that skips along straight open runs and only stops where the route could turn, so it checks far fewer cells. Guarantees the shortest path on unweighted grids; ignores weights.",
    },
    IterativeDeepening: {
        button: "IDDFS",
        title: "Iterative Deepening DFS (Unweighted)",
        description: "Runs depth-first search with a depth limit of 1, 2, 3, ... until the target is in reach, so each new layer appears one step at a time. Guarantees the fewest steps; ignores weights.",
    },
    Dijkstra: {
        button: "Dijkstra",
        title: "Dijkstra Algorithm (Weighted)",
        description: "A search algorithm that prioritize the least weight distance to search for shortest path. Guarantee shortest path.",
    },
    AStar: {
        button: "A*",
        title: "A-Star Algorithm (Weighted)",
        description: "An informed search algorithm that uses heuristics method to search for shortest path. Guarantee shortest path.",
    },
    WeightedAStar: {
        button: "Weighted A*",
        title: "Weighted A* (Weighted)",
        description: "A* that trusts its distance estimate more. Turn up the greed to search fewer cells, at the cost of a path up to that many times longer than the best one.",
    },
    Bidirectional: {
        button: "Bidirectional",
        title: "Bidirectional Dijkstra (Weighted)",
        description: "Runs Dijkstra from the start and from the target at the same time until the two searches meet. Guarantee shortest path.",
    },
    BellmanFord: {
        button: "Bellman-Ford",
        title: "Bellman-Ford (Weighted)",
        description: "Sweeps the whole grid again and again, improving every cell's distance until nothing changes. Slower than Dijkstra, but also handles negative weights in general graphs. Guarantee shortest path.",
    },
};

// Board attributes
function Board(height, width){
	// Board Setup
	this.height = height;
	this.width = width;

	this.start = null;
	this.target = null;

	this.boardArray = [];
	this.getNodesByID = {};

    // For Algorithm
	this.isButtonsActivated = null;

	// For Event listeners
	this.keyDown = {}; // Detect Pressed Key on Keyboard
	this.lastEnteredElement = null // So the event listener doesnt run twice
	this.mouseDown = false;
	this.currentMouseNode = null;
	this.pickedUpNode = null;
	this.savedNode = null
	this.previouslySwitchNode = null;

	// Things to be animated
	this.animateWalls = [];
	this.nodesToAnimate = [];
	this.AnimateFoundPath = [];
	
	this.selectedAlgorithm = null;
	this.greed = 2; // Weighted A* only
	this.buttonsOn = false;
	this.speed = 1;
};

// Board Setup ###############################################################################################################################
let counter = 1;
Board.prototype.nextPreviousTutorial = function(){
    let board = this
    board.isButtonsActivated = false;

    document.getElementById("skipButton").onclick = () => {
        document.getElementById("tutorial").style.display = "none";
        board.toggleButtons()
    }

    if (document.getElementById("nextButton")) {
        document.getElementById("nextButton").onclick = () => {
          if (counter < 5) counter++;
          nextPreviousClick();
          board.nextPreviousTutorial();
        }
    }
    
    document.getElementById("previousButton").onclick = () => {
        if (counter > 1) counter--;
        nextPreviousClick();
        board.nextPreviousTutorial()
    }
    
    function nextPreviousClick() {
        if (counter === 1) {
            document.getElementById("tutorial").innerHTML = `<div id="tutorialCounter" style="position:absolute; right:2%; top:2%">1/5</div>
                                                            <h1>Welcome to Pathfinding Visualizer!</h1>
                                                            <h3>This tutorial will walk you through all of the features of this application.</h3>
                                                            <h4>If you want to dive right in, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"!</h4>
                                                            <img id="mainTutorialImage" src="images/FinishFlag.gif">
                                                            <button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button>
                                                            <button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button>
                                                            <button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
        }

        if (counter === 2) {
            document.getElementById("tutorial").innerHTML = `<div id="tutorialCounter" style="position:absolute; right:2%; top:2%">2/5</div>
                                                            <h1><u>Adding Objects</u></h1>
                                                            <h2>First, let's get familiar with the board status!!</h2>
                                                            <br><h4><li>To Create a Maze, Select from one of the option from "Create Maze" drop-down menu. </h4>
                                                            <br><h4><li>To add a Wall, Click and Drag on the grid while holding the W button. </h4>
                                                            <br><h4><li>To add a weight, Click on the grid while pressing 1, 2, 3, 4, or 5, and the weight will adjust accordingly. </h4>
                                                            <br><h4><li>To remove any Object. Click and drag on the grid while holding the R button.</h4>
                                                            <br>
                                                            <div id="KeyDisplayDiv" style="display: flex; flex-direction: row;">
                                                                <div id="WKeyDisplay" class="KeyDisplay"> <h3>Wall (W)</h3> </div>
                                                                <div id="AllWeightDisplay" class="KeyDisplay"> <h3>Weight (1/2/3/4/5)</h3> </div>
                                                                <div id="RKeyDisplay" class="KeyDisplay"> <h3>Erase (R)</h3> </div>
                                                            </div>
                                                            <br>
                                                            <h4>If you want to skip the tutorial, you can always press the "Skip Tutorial" button below. Otherwise, press "Next"</h4>
                                                            <br>
                                                            <button id="nextButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Next</button>
                                                            <button id="previousButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Previous</button>
                                                            <button id="skipButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Skip Tutorial</button>`;
        }

        if (counter === 3) {
            document.getElementById("tutorial").innerHTML = `<div id="tutorialCounter" style="position:absolute; right:2%; top:2%;">3/5</div>
                                                            <h1><u>Navbar & Functions</u></h1>
                                                            <h2>Use the Navbar to Select Animation Speed, Select Algorithm, Visualize, and More!! </h2>
                                                            <br>
                                                            <h4>There are many functions that you can select from the navigation bar!! You use the navigation bar to Select Animation Speed, Create Maze, Clear Walls, Clear weight, Clear Path and Reset Board. To replay this tutorial, click on "Show Tutorial" on the top right of the navigation bar.</h4>

                                                            <img src='/images/pathFindingNavbar.png' style='max-width:calc(100% - 20px); max-height:100%; width:auto;height:auto; margin-top:50px; margin-bottom:50px'>

                                                            <h4>If you want to skip the tutorial, you can always press the "Skip Tutorial" button below. Otherwise, press "Next"</h4>
                                                            <br>
                                                            <button id="nextButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Next</button>
                                                            <button id="previousButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Previous</button>
                                                            <button id="skipButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Skip Tutorial</button>`;
        }

        if (counter === 4) {
            document.getElementById("tutorial").innerHTML = `<div id="tutorialCounter" style="position:absolute; right:2%; top:2%;">4/5</div>
                                                            <h1><u>Mini Board Status</u></h1>
                                                            <h2>Use the Mini Board Status to Adjust Board Size, Check Board Status, and See the definition of the algorithm selected</h2>
                                                            <img src='/images/boardStatus.png' style='max-width:calc(100% - 20px); max-height:50%; width:auto;height:auto; margin-top:10px; margin-bottom:10px'>

                                                            <h4>If you want to skip the tutorial, you can always press the "Skip Tutorial" button below. Otherwise, press "Next"</h4>

                                                            <button id="nextButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Next</button>
                                                            <button id="previousButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Previous</button>
                                                            <button id="skipButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Skip Tutorial</button>`;
        }

        if (counter === 5) {
            document.getElementById("tutorial").innerHTML = `<div id="tutorialCounter" style="position:absolute; right:2%; top:2%">5/5</div>
                                                            <h1><u>Have Fun!</u></h1>
                                                            <h2>I hope you have fun exploring and playing around the board! If you want to find the source code of this project, you can find it on my github <a href='https://github.com/wwilliam98/Website/public'>@www.github.com/wwilliam98/Website/public</a>  </h2>
                                                            <br>

                                                            <h2>If you want to know more about me, check out my social media as well as my other projects that I have listed down below.</h2>
                                                            <span><h3><li><a href='https://www.linkedin.com/in/wwilliam1908'>Linked In</a></h3>
                                                            <h3><li><a href='https://github.com/wwilliam98'>Github</a></h3>
                                                            <h3><li><a href='https://leetcode.com/IamCookie/'>Leetcode</a></h3>
                                                            <h3><li><a href='./'>Portfolio</a></h3>
                                                            <h3><li><a href='./SudokuSolver'>Sudoku Solver</a></h3></span>

                                                            <button id="finishButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Finish</button>
                                                            <button id="previousButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Previous</button>
                                                            <button id="skipButton" class="btn btn-default navbar-btn tutorial-btn" type="button">Skip Tutorial</button>`
            
            document.getElementById("finishButton").onclick = () => {
                document.getElementById("tutorial").style.display = "none";
                board.toggleButtons()
            }
        }
    }

    window.addEventListener("keydown", function(e){
        var all_weight_display = document.getElementById("AllWeightDisplay")
        if (e.key == "w"){
            document.getElementById("WKeyDisplay").style.background = "#d3d3d3";
        }
        if (e.key == "r"){
            document.getElementById("RKeyDisplay").style.background = "#d3d3d3";
        }
        if (e.key == "1"){
            document.getElementById("Weight1Display").style.background = "#d3d3d3";
            if (all_weight_display){
                all_weight_display.style.background = "#d3d3d3";
            }
        }
        else if (e.key == "2"){
            document.getElementById("Weight2Display").style.background = "#d3d3d3";
            if (all_weight_display){
                all_weight_display.style.background = "#d3d3d3";
            }
        }
        else if (e.key == "3"){
            document.getElementById("Weight3Display").style.background = "#d3d3d3";
            if (all_weight_display){
                all_weight_display.style.background = "#d3d3d3";
            }
        }
        else if (e.key == "4"){
            document.getElementById("Weight4Display").style.background = "#d3d3d3";
            if (all_weight_display){
                all_weight_display.style.background = "#d3d3d3";
            }
        }
        else if (e.key == "5"){
            document.getElementById("Weight5Display").style.background = "#d3d3d3";
            if (all_weight_display){
                all_weight_display.style.background = "#d3d3d3";
            }
        }
    });
    
    window.addEventListener("keyup", function(e){
        var all_weight_display = document.getElementById("AllWeightDisplay")
        if (e.key == "w"){
            document.getElementById("WKeyDisplay").style.background = "white";
        }
        if (e.key == "r"){
            document.getElementById("RKeyDisplay").style.background = "white";
        }
        if (e.key == "1"){
            document.getElementById("Weight1Display").style.background = "white";
            if (all_weight_display){
                all_weight_display.style.background = "white";
            }
        }
        else if (e.key == "2"){
            document.getElementById("Weight2Display").style.background = "white";
            if (all_weight_display){
                all_weight_display.style.background = "white";
            }
        }
        else if (e.key == "3"){
            document.getElementById("Weight3Display").style.background = "white";
            if (all_weight_display){
                all_weight_display.style.background = "white";
            }
        }
        else if (e.key == "4"){
            document.getElementById("Weight4Display").style.background = "white";
            if (all_weight_display){
                all_weight_display.style.background = "white";
            }
        }
        else if (e.key == "5"){
            document.getElementById("Weight5Display").style.background = "white";
            if (all_weight_display){
                all_weight_display.style.background = "white";
            }
        }
    })
}


Board.prototype.createGrid = function(){
    let board = this
	let tableHTML = "";
	for (let r = 0; r < board.height; r++){
		let currentArrayRow = [];
		let currentHTMLRow = "<tr>";

		for (let c = 0; c < board.width; c++){
			let newNodeId = `${r}-${c}`, nodeType, newNode;
			if (r === Math.floor(board.height / 2) && c === Math.floor(board.width / 4)) {
				nodeType = "start";
				// board.start = `${newNodeId}`;
			} else if (r === Math.floor(board.height / 2) && c === Math.floor(3 * board.width / 4)) {
				nodeType = "target";
				// board.target = `${newNodeId}`;
			} else {
				nodeType = "normal";
			}

			// Create new node for the div
			newNode = new Node(newNodeId, nodeType); //ID, weight, type, status, previousNode, Path
            if (r === Math.floor(board.height / 2) && c === Math.floor(board.width / 4)) {
				board.start = newNode;
			} else if (r === Math.floor(board.height / 2) && c === Math.floor(3 * board.width / 4)) {
				board.target = newNode;
            }

			board.getNodesByID[`${newNodeId}`] = newNode;
			currentArrayRow.push(newNode);
			currentHTMLRow += `<td id="${newNodeId}" class="${nodeType}"></td>`;
		}
		board.boardArray.push(currentArrayRow);
		tableHTML += `${currentHTMLRow}</tr>`;
	}
	let boardtable = document.getElementById("board");
	boardtable.innerHTML = tableHTML;
};
// Board Setup End

// Board Functions
Board.prototype.getNodefromBoard = function(id) { // Get Node, given the id (ex. "0-0")
	let coordinates = id.split("-");
	let r = parseInt(coordinates[0]);
	let c = parseInt(coordinates[1]);
	return this.boardArray[r][c];
};

Board.prototype.changeNormalNodeToWall = function(currentNode) {
    let board = this
	let specialStatus = ["start", "target", "object"];
	let currentelement = document.getElementById(currentNode.id);

    board.clearPath()
	if (!specialStatus.includes(currentNode.type)) {
		currentNode.type = "wall";
		currentelement.className = "wall";
		currentNode.weight = 0;
	}
}

Board.prototype.changeNormalNodeToWeight = function(currentNode, weight) {
    let board = this
	let specialStatus = ["start", "target", "wall"];
	let currentelement = document.getElementById(currentNode.id);

    board.clearPath()
	if (!specialStatus.includes(currentNode.type)) {
		currentNode.type = "weight";

		currentelement.className = "weight"+weight.toString();
		currentNode.weight = weight;
	}
}

Board.prototype.changeWalltoNormal = function(currentNode) {
    let board = this
	let specialStatus = ["start", "target", "object"];
	let currentelement = document.getElementById(currentNode.id);

	if (!specialStatus.includes(currentNode.type)) {
		currentNode.type = "normal";
		currentelement.className = "normal";
	}
	currentNode.weight = 1;
}

Board.prototype.clearNode = function(currentNode) {
	let specialStatus = ["start", "target", "object"];
	let currentelement = document.getElementById(currentNode.id);
	if (!specialStatus.includes(currentNode.type)) {
		currentNode.type = "normal";
		currentelement.className = "normal";
		currentNode.weight = 1;
	}
}

Node.prototype.copy = function() {
	return new Node(this.id, this.type);
};

// Only when mouse enter then we move the node
Board.prototype.MoveSpecialNode = function(newLocationNode) {
    let board = this
	let element = document.getElementById(newLocationNode.id), firstPickupLocation, previouslySwitchNodeElement, nextNodeElement, newLocationNodeElement, nextLocationNodeCopy;

    board.clearPath()
	// As long as the new location is not a special node
	if (newLocationNode.type !== "target" && newLocationNode.type !== "start" && newLocationNode.type !== "weight") {
		// If there is previous, create copy of the selected node, replace selected with previous, set the previous as the new node, replace the new with selectednode
		if (this.savedNode != null){
			// For later to be saved/stored
			nextLocationNodeCopy = newLocationNode.copy()

			// Change the next location with the Node that we pickUp
			nextNodeElement = document.getElementById(this.currentMouseNode.id);
			nextNodeElement.className = this.pickedUpNode.type
			newLocationNode.type = this.pickedUpNode.type
			newLocationNode.weight = this.pickedUpNode.weight

			// Replace previously switch node with the saved Node
			previouslySwitchNodeElement = document.getElementById(this.previouslySwitchNode.id);
			previouslySwitchNodeElement.className = this.savedNode.type
			this.previouslySwitchNode.type = this.savedNode.type
			this.previouslySwitchNode.weight = this.savedNode.weight
			
			// Replace the previous node with the newLocationNode
			this.savedNode = nextLocationNodeCopy
		}else{
			// Get picked up node
			firstPickupLocation = this.getNodefromBoard(this.pickedUpNode.id)

			// node that has no previous Node
			previouslySwitchNodeElement = document.getElementById(this.pickedUpNode.id);
			previouslySwitchNodeElement.className = "normal"
			firstPickupLocation.type = "normal"
			
			// Replace the previous node with the newLocationNode
			this.savedNode = newLocationNode.copy()
			
			// replace the newNode with the pickedUpNode
			newLocationNodeElement = document.getElementById(newLocationNode.id);
			newLocationNodeElement.className = this.pickedUpNode.type
			newLocationNode.type = this.pickedUpNode.type
			newLocationNode.weight = this.pickedUpNode.weight
		}
		this.previouslySwitchNode = newLocationNode;

        if (board.pickedUpNode == "start"){
            board.start = newLocationNode
        }else if (board.pickedUpNode == "target"){
            board.target = newLocationNode
        }
	} 
};
// Board Functions End

////////////////////////////////////---------EVENT LISTENER---------////////////////////////////////////
Board.prototype.boardEventListener = function(){
	let board = this;
	for (let i = 0; i < board.height; i++){
		for (let j = 0; j < board.width; j++){
			let currentId = `${i}-${j}`;
			let currentNode = board.getNodefromBoard(currentId);
			let currentTableElement = document.getElementById(currentId);
			
			// Just set to wall when initial click is a wall and vice versa
			currentTableElement.onmousedown = (e) => {
                e.preventDefault()
				if (board.isButtonsActivated){
					board.mouseDown = true
					board.currentMouseNode = currentNode;
					// Left mouse and control key to move special Node
					if (currentNode.type == "start" || currentNode.type == "target" || currentNode.type == "object"){
                        document.getElementById("show_display_status").innerHTML = "<span style='display: flex; justify-content: center; align-items:center'><img src='/images/pathFinding" + currentNode.type + "Icon.svg' alt='" + currentNode.type + "' style='width: 25px; height: 25px; margin: 5px>'</span> Move " + currentNode.type.charAt(0).toUpperCase() + currentNode.type.slice(1) + " Node";
						board.pickedUpNode = currentNode.copy();

						board.savedNode = null
					}else if (board.keyDown["87"] == true){ // If "W" is pressed, create wall
						board.changeNormalNodeToWall(currentNode);
					}else if (board.keyDown["49"] == true){ // If "1" is pressed, create wall
						board.changeNormalNodeToWeight(currentNode, 2);
					}else if (board.keyDown["50"] == true){ // If "2" is pressed, create wall
						board.changeNormalNodeToWeight(currentNode, 4);
					}else if (board.keyDown["51"] == true){ // If "3" is pressed, create wall
						board.changeNormalNodeToWeight(currentNode, 6);
					}else if (board.keyDown["52"] == true){ // If "4" is pressed, create wall
						board.changeNormalNodeToWeight(currentNode, 8);
					}else if (board.keyDown["53"] == true){ // If "5" is pressed, create wall
						board.changeNormalNodeToWeight(currentNode, 10);
					}else if (board.keyDown["82"] == true){ // If "R" is pressed, turn it back to normal node
						board.clearNode(currentNode);
					}
				}
			};

			currentTableElement.onmouseenter = (e) =>{
				if (board.isButtonsActivated && board.lastEnteredElement != e.target){
					board.currentMouseNode = currentNode;
					board.lastEnteredElement = e.target

					if (board.mouseDown && board.pickedUpNode !== null){
						board.MoveSpecialNode(currentNode)
					}else if (board.mouseDown && board.keyDown["87"] == true){
						board.changeNormalNodeToWall(currentNode);
					}else if (board.mouseDown && board.keyDown["82"] == true){
						board.clearNode(currentNode)
					}
				}
			}

			// Save the start/target/object to the board
			currentTableElement.onmouseup = (e) =>{
				if (board.isButtonsActivated){
					board.mouseDown = false;
					if (board.pickedUpNode && board.pickedUpNode.type == "start"){
						board.start = currentNode;
					}else if(board.pickedUpNode && board.pickedUpNode.type === "target"){
						board.target = currentNode;
					}else if(board.pickedUpNode && board.pickedUpNode.type === "object"){
						board.object = currentNode;
					}
                    document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> No Status";
				}
				board.pickedUpNode = null;
				board.currentMouseNode = null;
			};

		}
	}
};
////////////////////////////////////---------EVENT LISTENER ENDS---------////////////////////////////////////

// Animation
Board.prototype.animate = function(nodesToAnimate){ //visitedNodes is an array of nodes
	let board = this;
	function timeout(i){
		let queue = nodesToAnimate;
		
		setTimeout(function(){
			if (i >= queue.length || queue[i].type == "start" || queue[i].type == "target"){
                board.toggleButtons()
				return
			}else{
				let currentId = queue[i].id;
				let currentNode = queue[i];
				let currentelement = document.getElementById(currentId);
				currentelement.className = currentNode.type;
			}
			timeout(i+1);
		}, board.speed);
	}
	timeout(0);
}

Board.prototype.animateStatus = function(nodesToAnimate){ //visitedNodes is an array of nodes
	let board = this;
	function timeout(i){
		let queue = nodesToAnimate;
		if (i >= queue.length && board.AnimateFoundPath){
            board.animatePath(board.AnimateFoundPath)
            return
        }else if (i >= queue.length){
            board.toggleButtons()
            return
        }
        
        let currentId = queue[i].id;
        let currentNode = queue[i];
        let currentelement = document.getElementById(currentId);
		
		setTimeout(function(){
			if (queue[i].type == "start" || queue[i].type == "target"){
				currentelement.className = currentNode.status + queue[i].type;
            }
            else if(queue[i].type == "weight"){
                currentelement.className = currentNode.status + queue[i].type + currentNode.weight.toString();
            }else{
				currentelement.className = currentNode.status;
			}
			timeout(i+1);
		}, board.speed);
	}
	timeout(0);

    return new Promise((resolve) => {
        setTimeout(resolve, nodesToAnimate.length * board.speed + 2000); // Resolve the promise after the animation finishes. Add 2.5 seconds to wait for the scale animation to finish
    });
}

Board.prototype.animatePath = function(nodesToAnimate){ //visitedNodes is an array of nodes
	let board = this;
	function timeout(i){
		let queue = nodesToAnimate;
        if (i >= queue.length){
            board.toggleButtons()
            return
        }
        
        let currentId = queue[i].id;
        let currentNode = queue[i];
        let currentelement = document.getElementById(currentId);
		
		setTimeout(function(){
			if(queue[i].type == "start" || queue[i].type == "target"){
				currentelement.className = "path" + queue[i].type;
            }else if(queue[i].type == "weight"){
                currentelement.className = "path" + queue[i].type + currentNode.weight.toString();
            }
            else{
				currentelement.className = "path";
			}
			timeout(i+1);
		}, board.speed);
	}
    timeout(0);
    return "done"
}

// Animation

Board.prototype.resetBoard = function(){
	let height = this.height;
	let width = this.width;
	let start = Math.floor(height / 2).toString() + "-" + Math.floor(width / 4).toString();
	let target = Math.floor(height / 2).toString() + "-" + Math.floor(3 * width / 4).toString();

	Object.keys(this.getNodesByID).forEach(id => {
		let currentNode = this.getNodesByID[id];
		let currentElement = document.getElementById(id);
		if (id === start) {
			currentElement.className = "start";
			currentNode.type = "start";
		} 
		else if (id === target) {
			currentElement.className = "target";
			currentNode.type = "target"
		} 
		else {
			currentElement.className = "normal";
			currentNode.type = "normal";
		}

        // Reset the Node status
		currentNode.status = "unvisited";
		currentNode.weight = 1;
	});

    // Reset the board status
	this.start = this.getNodesByID[start];
	this.target = this.getNodesByID[target];

	this.animateWalls = [];
	this.nodesToAnimate = [];
	this.AnimateFoundPath = [];
};

Board.prototype.clearPath = function(){
    let board = this
	Object.keys(this.getNodesByID).forEach(id => {
		let currentNode = this.getNodesByID[id];
		let currentElement = document.getElementById(id);

        if (currentNode.status == "visited"){
            currentNode.status = "unvisited";
            if (currentNode !== board.start && currentNode !== board.target && currentNode.type !== "weight"){
                currentElement.className = "normal";
            }else if (currentNode.type == "weight"){
                currentElement.className = "weight" + currentNode.weight.toString();
            }else if(currentNode == board.start){
                currentElement.className = "start";
            }else{
                currentElement.className = "target";
            }
        }
	});

    this.nodesToAnimate = [];
	this.AnimateFoundPath = [];
};

Board.prototype.clearWalls = function(){
    let board = this
	Object.keys(this.getNodesByID).forEach(id => {
		let currentNode = this.getNodesByID[id];
		let currentElement = document.getElementById(id);

        if (currentNode.type == "wall"){
            currentNode.type = "normal";
            currentElement.className = "normal";
        }
	});

    this.nodesToAnimate = [];
	this.AnimateFoundPath = [];
};

Board.prototype.clearWeight = function(){
    let board = this
	Object.keys(this.getNodesByID).forEach(id => {
		let currentNode = this.getNodesByID[id];
		let currentElement = document.getElementById(id);

        if (currentNode.type == "weight"){
            currentNode.type = "normal";
            currentNode.weight = 1;
            currentElement.className = "normal";
        }
	});

    this.nodesToAnimate = [];
	this.AnimateFoundPath = [];
};

////////////////////////////////////////////////////////////// Toggle Button //////////////////////////////////////////////////////////////////////////
Board.prototype.toggleButtons = function() {
	let board = this;

    if (!board.isButtonsActivated){
        board.isButtonsActivated = true;

        // Change board size
        document.getElementById("changeBoardSizeSlider").removeAttribute("disabled");
        
        // Run Algorithm — the server computes; the board animates
        document.getElementById('VisualizeButtonli').onclick = async () => {
            if (!board.selectedAlgorithm){
                document.getElementById('VisualizeButtonli').innerHTML = `<button id="VisualizeButton" class="btn btn-default navbar-btn" type="button">Pick An Algorithm</button>`;
                return;
            }
            board.toggleButtons();
            board.clearPath();
            try {
                const result = await apiClient.findPath(board.selectedAlgorithm, serializeBoard(board), { greed: board.greed });
                board.nodesToAnimate = result.visited_order.map(id => {
                    const node = board.getNodesByID[id];
                    node.status = "visited"; // what animateStatus/clearPath key off
                    return node;
                });
                board.AnimateFoundPath = result.path.map(id => board.getNodesByID[id]);
                board.animateStatus(board.nodesToAnimate);
            } catch (error) {
                // Re-enable FIRST: the enable branch resets the status bar,
                // so the error message must be written after it.
                board.toggleButtons();
                const message = error instanceof PathfindingApiError ? error.message : 'Pathfinding failed';
                document.getElementById("show_display_status").innerHTML = `<span class="circle-icon"></span> ${message}`;
            }
        }

        // Select Animation Speed Button
        document.getElementById('AnimationSpeedVerySlowDropdown').onclick = () => {
            document.getElementById('SelectAnimationDropdown').innerHTML = `<li id='SelectAnimationDropdown' class="dropdown-toggle" data-toggle="dropdown" >Speed: Very Slow<span class="caret"></span></a>`;
            board.speed = 40;
        }
        document.getElementById('AnimationSpeedSlowDropdown').onclick = () => {
            document.getElementById('SelectAnimationDropdown').innerHTML = `<li id='SelectAnimationDropdown' class="dropdown-toggle" data-toggle="dropdown" >Speed: Slow<span class="caret"></span></a>`;
            board.speed = 30;
        }
        document.getElementById('AnimationSpeedNormalDropdown').onclick = () => {
            document.getElementById('SelectAnimationDropdown').innerHTML = `<li id='SelectAnimationDropdown' class="dropdown-toggle" data-toggle="dropdown" >Speed: Normal<span class="caret"></span></a>`;
            board.speed = 20;
        }
        document.getElementById('AnimationSpeedFastDropdown').onclick = () => {
            document.getElementById('SelectAnimationDropdown').innerHTML = `<li id='SelectAnimationDropdown' class="dropdown-toggle" data-toggle="dropdown" >Speed: Fast<span class="caret"></span></a>`;
            board.speed = 10;
        }
        document.getElementById('AnimationSpeedVeryFastDropdown').onclick = () => {
            document.getElementById('SelectAnimationDropdown').innerHTML = `<li id='SelectAnimationDropdown' class="dropdown-toggle" data-toggle="dropdown" >Speed: Very Fast<span class="caret"></span></a>`;
            board.speed = 1;
        }
        
        // Create Maze Button
        for (const [dropdownId, style] of Object.entries(MAZE_DROPDOWNS)) {
            document.getElementById(dropdownId).onclick = () => {
                board.resetBoard();
                board.toggleButtons();

                create_maze(board, style);
                board.animate(board.animateWalls);
            }
        }
        // Create Maze Button End

        // Select Algorithm Button
        for (const [name, algorithm] of Object.entries(ALGORITHMS)) {
            document.getElementById(`${name}Dropdown`).onclick = () => {
                document.getElementById('VisualizeButtonli').innerHTML = `<button id="VisualizeButton" class="btn btn-default navbar-btn" type="button">Visualize ${algorithm.button}</button>`;
                board.selectedAlgorithm = name;
                document.getElementById('algo_def').innerHTML = `<h3 id='algo_def' style="text-align: center;">
                                                            ${algorithm.title}:</h3>
                                                            <h3>${algorithm.description}</h3>
                                                            `;
                document.getElementById('greedControl').style.display = name === 'WeightedAStar' ? 'block' : 'none';
            }
        }

        // Clear Board and clear path
        document.getElementById('startButtonClearBoard').onclick = () => {
            board.resetBoard();
        }

        document.getElementById('startButtonClearWalls').onclick = () => {
            board.clearWalls();
        }

        document.getElementById('startButtonClearWeights').onclick = () => {
            board.clearWeight();
        }

        document.getElementById('startButtonClearPath').onclick = () => {
            board.clearPath();
        }

        document.getElementById('helpButton').onclick = () => {
            document.getElementById("tutorial").style.display = "block";
            board.toggleButtons()
            document.getElementById("VisualizeButton").style.backgroundColor = "";
            document.getElementById('show_display_status').innerHTML = `<span class="circle-icon"></span> No Status`;
        }

        // Add Styling Back
        document.getElementById("VisualizeButton").style.backgroundColor = "";
        document.getElementById('show_display_status').innerHTML = `<span class="circle-icon"></span> No Status`;

    } else{ // When the animation is not running.
        board.isButtonsActivated = false
        document.getElementById("changeBoardSizeSlider").setAttribute("disabled", "true")
        document.getElementById('VisualizeButtonli').onclick = null;

        // Off Speed Selection
        // document.getElementById('AnimationSpeedVerySlowDropdown').onclick = null
        // document.getElementById('AnimationSpeedSlowDropdown').onclick = null
        // document.getElementById('AnimationSpeedNormalDropdown').onclick = null
        // document.getElementById('AnimationSpeedFastDropdown').onclick = null
        // document.getElementById('AnimationSpeedVeryFastDropdown').onclick = null

        // Off Maze
        for (const dropdownId of Object.keys(MAZE_DROPDOWNS)) {
            document.getElementById(dropdownId).onclick = null
        }
        
        // Off Algo selection
        for (const name of Object.keys(ALGORITHMS)) {
            document.getElementById(`${name}Dropdown`).onclick = null
        }

        // Off reset and clear
        document.getElementById('startButtonClearBoard').onclick = null
        document.getElementById('startButtonClearPath').onclick = null

        document.getElementById('VisualizeButton').style.backgroundColor = "red"
        document.getElementById('show_display_status').innerHTML = `<span class="circle-icon"></span> Board Animating ...`;
    }
}
////////////////////////////////////////////////////////////// Toggle Button Done //////////////////////////////////////////////////////////////////////////


Board.prototype.initialise = function(){
	this.createGrid();
	this.boardEventListener();
    this.nextPreviousTutorial();
};

Board.prototype.resizeboard = function(height, width){
    this.height = height;
	this.width = width;

	this.start = null;
	this.target = null;

	this.boardArray = [];
	this.getNodesByID = {};

    // For Algorithm
	this.isButtonsActivated = true; //Turn on button

	// For Event listeners
	this.keyDown = {}; // Detect Pressed Key on Keyboard
	this.lastEnteredElement = null // So the event listener doesnt run twice
	this.mouseDown = false;
	this.currentMouseNode = null;
	this.pickedUpNode = null;
	this.savedNode = null
	this.previouslySwitchNode = null;

	// Things to be animated
	this.animateWalls = [];
	this.nodesToAnimate = [];
	this.AnimateFoundPath = [];
	
	this.selectedAlgorithm = null;
	this.greed = 2; // Weighted A* only
	this.buttonsOn = false;
	this.speed = 1;

    this.createGrid();
	this.boardEventListener();
}

// let height = Math.floor(($(document).height()) / 28);
// let width = Math.floor($(document).width() / 25);

// let initialBoard = new Board(5, 7);
// let initialBoard = new Board(11, 21);
// let initialBoard = new Board(21, 31);
let initialBoard = new Board(33, 63);
initialBoard.initialise();

document.getElementById("greedSlider").oninput = () => {
    initialBoard.greed = Number(document.getElementById("greedSlider").value);
    document.getElementById("greedValue").textContent = initialBoard.greed;
}

document.getElementById("changeBoardSizeSlider").oninput = () => {
    let val = document.getElementById("changeBoardSizeSlider").value    
    initialBoard.resizeboard(val, val*2);
}

// Show Status
window.onkeydown = (e) =>{
	initialBoard.keyDown[e.keyCode] = true;
    if (initialBoard.keyDown["87"] == true && initialBoard.isButtonsActivated && initialBoard.pickedUpNode == null){
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Draw Wall On";
    }else if ((initialBoard.keyDown["49"] == true || initialBoard.keyDown["50"] == true || initialBoard.keyDown["51"] == true || initialBoard.keyDown["52"] == true || initialBoard.keyDown["53"] == true) && initialBoard.isButtonsActivated && initialBoard.pickedUpNode == null){
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Draw Weight On";
    }else if (initialBoard.keyDown["82"] == true && initialBoard.isButtonsActivated && initialBoard.pickedUpNode == null){
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Erase Mode On";
    }else if (initialBoard.pickedUpNode !== null && initialBoard.isButtonsActivated){
        // document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Move " + initialBoard.pickedUpNode.type + " Node";
        document.getElementById("show_display_status").innerHTML = "<span style='display: flex; justify-content: center; align-items:center'><img src='/images/pathFinding" + initialBoard.pickedUpNode.charAt(0).toUpperCase() + initialBoard.pickedUpNode.slice(1) + "Icon.svg' alt='" + initialBoard.pickedUpNode + "' style='width: 25px; height: 25px; margin: 5px'</span> Move " + initialBoard.pickedUpNode.charAt(0).toUpperCase() + initialBoard.pickedUpNode.slice(1) + " Node";
    }else if (initialBoard.isButtonsActivated == false){
        // document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Board Animating ...";
    }else{
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> No Status";
    }
}

window.onkeyup = (e) =>{
	initialBoard.keyDown[e.keyCode] = false;
    if (initialBoard.keyDown["87"] == true && initialBoard.isButtonsActivated && initialBoard.pickedUpNode == null){
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Draw Wall On";
    }else if ((initialBoard.keyDown["49"] == true || initialBoard.keyDown["50"] == true || initialBoard.keyDown["51"] == true || initialBoard.keyDown["52"] == true || initialBoard.keyDown["53"] == true) && initialBoard.isButtonsActivated && initialBoard.pickedUpNode == null){
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Draw Weight On";
    }else if (initialBoard.keyDown["82"] == true && initialBoard.isButtonsActivated && initialBoard.pickedUpNode == null){
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Erase On";
    }else if (initialBoard.pickedUpNode !== null && initialBoard.isButtonsActivated){
        // document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Move " + initialBoard.pickedUpNode.type + " Node";
        document.getElementById("show_display_status").innerHTML = "<span style='display: flex; justify-content: center; align-items:center'><img src='/images/pathFinding" + initialBoard.pickedUpNode.charAt(0).toUpperCase() + initialBoard.pickedUpNode.slice(1) + "Icon.svg' alt='" + initialBoard.pickedUpNode + "' style='width: 25px; height: 25px; margin: 5px'</span> Move " + initialBoard.pickedUpNode.charAt(0).toUpperCase() + initialBoard.pickedUpNode.slice(1) + " Node";
    }else if (initialBoard.isButtonsActivated == false){
        // document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> Board Animating ...";
    }else{
        document.getElementById("show_display_status").innerHTML = "<span class='circle-icon'></span> No Status";
    }
}