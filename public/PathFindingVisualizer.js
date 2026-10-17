import Node from './PathFindingNode.js'
import {create_maze} from './createMaze.js'
import {PathfindingApiClient, PathfindingApiError, serializeBoard} from './PathfindingApiClient.js'
import {ALGORITHMS, DEFAULT_ALGORITHM, GUARANTEE_LABELS, findAlgorithm} from './pathfindingAlgorithms.js'

const apiClient = new PathfindingApiClient();

// Held key (keyCode) -> brush. A held key overrides the brush picked in the panel.
const KEY_TOOLS = {87: "wall", 82: "erase", 49: 2, 50: 4, 51: 6, 52: 8, 53: 10};

const TUTORIAL_STEPS = [
    {
        title: "Welcome to Pathfinding Visualizer",
        body: "Watch search algorithms find their way from the start node to the target. Four quick tips follow; close this any time.",
        image: "images/FinishFlag.gif",
    },
    {
        title: "Pick an algorithm",
        body: "Weighted algorithms such as Dijkstra and A* count the cost of every cell; unweighted ones such as BFS and DFS ignore it. The side panel says whether the algorithm you picked guarantees the shortest path.",
    },
    {
        title: "Draw obstacles",
        body: "Click and drag on the grid to paint walls. Choose another brush in the Draw panel to paint weights or erase, or hold W, 1 to 5, or R. Drag the start or the target to move it.",
    },
    {
        title: "Visualize",
        body: "Press Visualize to watch the search. The toolbar changes the speed, generates a maze, and clears the board. The Last run card shows how many cells were explored and what the path cost.",
    },
];
const TUTORIAL_SEEN_KEY = "pf-tutorial-seen";

const $ = (id) => document.getElementById(id);

function setStatus(text) {
    $("show_display_status").textContent = text;
}

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

	// Drawing
	this.brush = "wall"; // brush picked in the panel
	this.dragTool = null; // brush for the current drag

	// Things to be animated
	this.animateWalls = [];
	this.nodesToAnimate = [];
	this.AnimateFoundPath = [];
	this.pendingResult = null; // shown once the run's animation ends

	this.selectedAlgorithm = DEFAULT_ALGORITHM;
	this.greed = 2; // Weighted A* only
	this.speed = 1;
};

// Board Setup ###############################################################################################################################
// Default start/target ids. Columns are kept odd: recursive-division mazes
// put their walls on even columns, so an even column can wall the node in.
Board.prototype.defaultEnds = function(){
    const odd = (col) => col % 2 ? col : col - 1;
    const row = Math.floor(this.height / 2);
    return {
        start: `${row}-${odd(Math.floor(this.width / 4))}`,
        target: `${row}-${odd(Math.floor(3 * this.width / 4))}`,
    };
}

Board.prototype.createGrid = function(){
    let board = this
    let ends = board.defaultEnds();
	let tableHTML = "";
	for (let r = 0; r < board.height; r++){
		let currentArrayRow = [];
		let currentHTMLRow = "<tr>";

		for (let c = 0; c < board.width; c++){
			let newNodeId = `${r}-${c}`, nodeType, newNode;
			if (newNodeId === ends.start) {
				nodeType = "start";
				// board.start = `${newNodeId}`;
			} else if (newNodeId === ends.target) {
				nodeType = "target";
				// board.target = `${newNodeId}`;
			} else {
				nodeType = "normal";
			}

			// Create new node for the div
			newNode = new Node(newNodeId, nodeType); //ID, weight, type, status, previousNode, Path
            if (newNodeId === ends.start) {
				board.start = newNode;
			} else if (newNodeId === ends.target) {
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

        if (board.pickedUpNode.type == "start"){
            board.start = newLocationNode
        }else if (board.pickedUpNode.type == "target"){
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
			
			currentTableElement.onmousedown = (e) => {
                e.preventDefault()
				if (board.isButtonsActivated){
					board.mouseDown = true
					board.currentMouseNode = currentNode;
					board.lastEnteredElement = e.target;
					if (currentNode.type == "start" || currentNode.type == "target"){
                        setStatus(`Moving the ${currentNode.type} node`);
						board.pickedUpNode = currentNode.copy();
						board.savedNode = null
					}else{
						// Starting a drag on a cell that already has this brush erases instead
						let tool = board.activeTool();
						let alreadyPainted = (tool === "wall" && currentNode.type === "wall") ||
							(typeof tool === "number" && currentNode.type === "weight" && currentNode.weight === tool);
						board.dragTool = alreadyPainted ? "erase" : tool;
						board.paint(currentNode, board.dragTool);
					}
				}
			};

			currentTableElement.onmouseenter = (e) =>{
				if (board.isButtonsActivated && board.lastEnteredElement != e.target){
					board.currentMouseNode = currentNode;
					board.lastEnteredElement = e.target

					if (board.mouseDown && board.pickedUpNode !== null){
						board.MoveSpecialNode(currentNode)
					}else if (board.mouseDown && board.dragTool !== null){
						board.paint(currentNode, board.dragTool);
					}
				}
			}

			// MoveSpecialNode already tracked where the start/target landed
			currentTableElement.onmouseup = () =>{
				board.endDrag();
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
	let {start, target} = this.defaultEnds();

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
// Locks the controls while the board animates and unlocks them after.
// The enable branch resets the status, so write messages after calling it.
Board.prototype.toggleButtons = function() {
	let board = this;
    board.isButtonsActivated = !board.isButtonsActivated;
    const enabled = board.isButtonsActivated;

    document.querySelectorAll(".pf-control").forEach(control => { control.disabled = !enabled; });
    document.body.classList.toggle("pf-busy", !enabled);

    if (enabled){
        setStatus("Ready");
        if (board.pendingResult){
            showResult(board.pendingResult);
            board.pendingResult = null;
        }
    } else {
        setStatus("Board Animating ...");
    }
}
////////////////////////////////////////////////////////////// Toggle Button Done //////////////////////////////////////////////////////////////////////////

// The brush a click or drag paints with right now
Board.prototype.activeTool = function(){
    for (const [keyCode, tool] of Object.entries(KEY_TOOLS)){
        if (this.keyDown[keyCode]) return tool;
    }
    return this.brush;
}

Board.prototype.paint = function(currentNode, tool){
    if (tool === "wall"){
        this.changeNormalNodeToWall(currentNode);
    } else if (tool === "erase"){
        this.clearNode(currentNode);
    } else {
        this.changeNormalNodeToWeight(currentNode, tool);
    }
}

// Ends a drag, including one released outside the grid
Board.prototype.endDrag = function(){
    if (this.pickedUpNode !== null && this.isButtonsActivated){
        setStatus("Ready");
    }
    this.mouseDown = false;
    this.dragTool = null;
    this.pickedUpNode = null;
    this.currentMouseNode = null;
}

Board.prototype.initialise = function(){
	this.createGrid();
	this.boardEventListener();
    this.isButtonsActivated = false;
    this.toggleButtons();
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

    this.createGrid();
	this.boardEventListener();
}

/////////////////////////////////////////////////////////////// Page Controls ///////////////////////////////////////////////////////////////

// Sizes cells so the whole board fits beside the panel (desktop) or across the screen (phone)
function fitBoard(board){
    const wrap = $("boardWrap");
    const width = Number(board.width), height = Number(board.height);
    let cell = Math.floor(wrap.clientWidth / width);
    if (window.innerWidth > 900){
        const availableHeight = window.innerHeight - wrap.getBoundingClientRect().top - window.scrollY - 16;
        cell = Math.min(cell, Math.floor(availableHeight / height));
    }
    cell = Math.max(6, Math.min(cell, 32));
    document.documentElement.style.setProperty("--cell", `${cell}px`);
}

function showAlgorithm(board){
    const algorithm = findAlgorithm(board.selectedAlgorithm);
    $("algoName").textContent = algorithm.label;
    $("algo_def").textContent = algorithm.description;
    $("VisualizeButton").textContent = `Visualize ${algorithm.short}`;

    const tags = $("algoTags");
    tags.replaceChildren();
    const addTag = (text, good) => {
        const tag = document.createElement("span");
        tag.className = good ? "pf-tag pf-tag-good" : "pf-tag";
        tag.textContent = text;
        tags.appendChild(tag);
    };
    addTag(algorithm.usesWeights ? "Uses weights" : "Ignores weights", algorithm.usesWeights);
    addTag(GUARANTEE_LABELS[algorithm.guarantee] || "Path may not be shortest", algorithm.guarantee !== null);
    $("greedControl").hidden = !algorithm.hasGreed;
}

function showResult({algorithm, found, stats}){
    $("resultsCard").hidden = false;
    $("resultsAlgo").textContent = `· ${algorithm.short}`;
    const outcome = $("resultsOutcome");
    outcome.textContent = found ? "Reached the target" : "No path to the target";
    outcome.classList.toggle("pf-fail", !found);
    $("statVisited").textContent = stats.visited_count;
    $("statSteps").textContent = found ? Math.max(0, stats.path_length - 1) : "–";
    $("statCost").textContent = found ? stats.path_cost : "–";
    setStatus(found ? "Path found" : "Target unreachable");
}

function showBrush(board){
    const tool = String(board.activeTool());
    document.querySelectorAll(".pf-brush").forEach(button => {
        button.setAttribute("aria-checked", String(button.dataset.tool === tool));
    });
}

function bindControls(board){
    const algorithmSelect = $("algorithmSelect");
    for (const group of [...new Set(ALGORITHMS.map(algorithm => algorithm.group))]){
        const optgroup = document.createElement("optgroup");
        optgroup.label = group;
        for (const algorithm of ALGORITHMS.filter(a => a.group === group)){
            optgroup.appendChild(new Option(algorithm.label, algorithm.name));
        }
        algorithmSelect.appendChild(optgroup);
    }
    algorithmSelect.value = board.selectedAlgorithm;
    algorithmSelect.onchange = () => {
        board.selectedAlgorithm = algorithmSelect.value;
        showAlgorithm(board);
    };
    showAlgorithm(board);

    // Run Algorithm — the server computes; the board animates
    $("VisualizeButton").onclick = async () => {
        if (!board.isButtonsActivated) return;
        const algorithm = findAlgorithm(board.selectedAlgorithm);
        board.toggleButtons();
        board.clearPath();
        try {
            const result = await apiClient.findPath(algorithm.name, serializeBoard(board), {greed: board.greed});
            board.nodesToAnimate = result.visited_order.map(id => {
                const node = board.getNodesByID[id];
                node.status = "visited"; // what animateStatus/clearPath key off
                return node;
            });
            board.AnimateFoundPath = result.path.map(id => board.getNodesByID[id]);
            board.pendingResult = {algorithm, found: result.found, stats: result.stats};
            board.animateStatus(board.nodesToAnimate);
        } catch (error) {
            // Re-enable FIRST: the enable branch resets the status bar,
            // so the error message must be written after it.
            board.toggleButtons();
            setStatus(error instanceof PathfindingApiError ? error.message : "Pathfinding failed");
        }
    };

    const greedSlider = $("greedSlider");
    greedSlider.oninput = () => {
        board.greed = Number(greedSlider.value);
        $("greedValue").textContent = `${board.greed}×`;
    };

    const speedSelect = $("speedSelect");
    board.speed = Number(speedSelect.value);
    speedSelect.onchange = () => { board.speed = Number(speedSelect.value); };

    const mazeSelect = $("mazeSelect");
    mazeSelect.onchange = () => {
        const style = mazeSelect.value;
        mazeSelect.value = "";
        if (!style || !board.isButtonsActivated) return;
        board.resetBoard();
        board.toggleButtons();
        create_maze(board, style);
        board.animate(board.animateWalls);
    };

    const slider = $("changeBoardSizeSlider");
    const showSize = () => { $("boardSizeLabel").textContent = `${slider.value} × ${slider.value * 2}`; };
    showSize();
    slider.oninput = () => {
        board.resizeboard(slider.value, slider.value * 2);
        showSize();
        fitBoard(board);
    };

    $("startButtonClearBoard").onclick = () => board.resetBoard();
    $("startButtonClearWalls").onclick = () => board.clearWalls();
    $("startButtonClearWeights").onclick = () => board.clearWeight();
    $("startButtonClearPath").onclick = () => board.clearPath();

    document.querySelectorAll(".pf-brush").forEach(button => {
        button.onclick = () => {
            const tool = button.dataset.tool;
            board.brush = tool === "wall" || tool === "erase" ? tool : Number(tool);
            showBrush(board);
        };
    });
    showBrush(board);

    window.addEventListener("resize", () => fitBoard(board));
    document.addEventListener("mouseup", () => board.endDrag());
}

// Touch: translate finger movement into the same handlers the mouse uses
function bindTouch(board){
    const table = $("board");
    let lastCell = null;
    const cellAt = (touch) => {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        return element && element.tagName === "TD" && table.contains(element) ? element : null;
    };
    table.addEventListener("touchstart", (e) => {
        const cell = cellAt(e.touches[0]);
        if (!cell) return;
        e.preventDefault();
        lastCell = cell;
        cell.onmousedown({preventDefault(){}, target: cell});
    }, {passive: false});
    table.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const cell = cellAt(e.touches[0]);
        if (cell && cell !== lastCell){
            lastCell = cell;
            cell.onmouseenter({target: cell});
        }
    }, {passive: false});
    table.addEventListener("touchend", () => {
        if (lastCell) lastCell.onmouseup({});
        lastCell = null;
        board.endDrag();
    });
}

function bindTutorial(){
    let step = 0;
    const modal = $("tutorial");
    const render = () => {
        const current = TUTORIAL_STEPS[step];
        $("tutorialCounter").textContent = `${step + 1} / ${TUTORIAL_STEPS.length}`;
        $("tutorialTitle").textContent = current.title;
        $("tutorialBody").textContent = current.body;
        $("mainTutorialImage").hidden = !current.image;
        $("previousButton").hidden = step === 0;
        $("nextButton").textContent = step === TUTORIAL_STEPS.length - 1 ? "Start" : "Next";
    };
    const open = () => {
        step = 0;
        render();
        modal.hidden = false;
        $("nextButton").focus();
    };
    const close = () => {
        modal.hidden = true;
        try { localStorage.setItem(TUTORIAL_SEEN_KEY, "1"); } catch (e) { /* storage blocked */ }
    };

    $("nextButton").onclick = () => {
        if (step === TUTORIAL_STEPS.length - 1) return close();
        step++;
        render();
    };
    $("previousButton").onclick = () => { step = Math.max(0, step - 1); render(); };
    $("skipButton").onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };
    document.addEventListener("keydown", (e) => {
        if (!modal.hidden && e.key === "Escape") close();
    });
    $("helpButton").onclick = open;

    let seen = false;
    try { seen = localStorage.getItem(TUTORIAL_SEEN_KEY) === "1"; } catch (e) { /* storage blocked */ }
    if (!seen) open();
}

// Phones get a smaller board so cells stay big enough to tap
if (window.innerWidth <= 600){
    $("changeBoardSizeSlider").value = 13;
}
const initialSize = Number($("changeBoardSizeSlider").value);
let initialBoard = new Board(initialSize, initialSize * 2);
initialBoard.initialise();
bindControls(initialBoard);
bindTouch(initialBoard);
bindTutorial();
fitBoard(initialBoard);

// Show the brush a held key selects
window.onkeydown = (e) =>{
	initialBoard.keyDown[e.keyCode] = true;
    showBrush(initialBoard);
}

window.onkeyup = (e) =>{
	initialBoard.keyDown[e.keyCode] = false;
    showBrush(initialBoard);
}
