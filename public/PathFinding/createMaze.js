function create_random_maze(board, type) {
	board.keys(this.nodes).forEach(node => {
		let random = Math.random();
		let currentElement = document.getElementById(node);
		let relevantClassNames = ["start", "target", "object"]
		let randomTwo = type === "wall" ? 0.25 : 0.35;
		if (random < randomTwo && !relevantClassNames.includes(currentElement.className)) {
			if (type === "wall") {
				currentElement.className = "wall";
				this.nodes[node].status = "wall";
				this.nodes[node].weight = 0;
			} else if (type === "weight") {
				currentElement.className = "unvisited weight";
				this.nodes[node].status = "unvisited";
				this.nodes[node].weight = 15;
		}
	}
	});
};

function create_perimeterWall(board) {
    let excludedNodes = [board.start, board.target];
    console.log(board.getNodesByID)
    Object.keys(board.getNodesByID).forEach(id => {
        let currentNode = board.getNodesByID[id];
        if (!excludedNodes.includes(id)) {
            let r = parseInt(id.split("-")[0]);
            let c = parseInt(id.split("-")[1]);
            if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
                currentNode.type = "wall"
                board.animateWalls.push(currentNode);
            }
        }
    });
}

function create_recursive_divisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation) {
    if (rowStart > rowEnd || colStart > colEnd) {
    	return;
    }
    
    if (orientation == "horizontal") {
    	let possibleRows = [];
     	for (let number = rowStart; number <= rowEnd; number += 2) {
       		possibleRows.push(number);
		}

		let possibleCols = [];
		for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
			possibleCols.push(number);
		}

		let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
		let randomColIndex = Math.floor(Math.random() * possibleCols.length);
		let currentRow = possibleRows[randomRowIndex];
		let colRandom = possibleCols[randomColIndex];

		Object.keys(board.getNodesByID).forEach(nodeID => {
			let r = parseInt(nodeID.split("-")[0]);
			let c = parseInt(nodeID.split("-")[1]);
			if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) { //
				let currentNode = board.getNodesByID[nodeID];
				let currentElement = document.getElementById(nodeID);
				if (currentElement.className !== "start" && currentElement.className !== "target") {
					currentNode.type = "wall"
					board.animateWalls.push(currentNode);   
				}
			}
		});
		
		if (currentRow - 2 - rowStart > colEnd - colStart) {
			create_recursive_divisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "horizontal");
		} else {
			create_recursive_divisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "vertical");
		}
		if (rowEnd - (currentRow + 2) > colEnd - colStart) {
			create_recursive_divisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "horizontal");
		} else {
			create_recursive_divisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical");
		}
		
	}
	else {
		let possibleCols = [];
		for (let number = colStart; number <= colEnd; number += 2) {
			possibleCols.push(number);
		}

		let possibleRows = [];
		for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
			possibleRows.push(number);
		}

		let randomColIndex = Math.floor(Math.random() * possibleCols.length);
		let randomRowIndex = Math.floor(Math.random() * possibleRows.length);

		let currentCol = possibleCols[randomColIndex];
		let rowRandom = possibleRows[randomRowIndex];
		Object.keys(board.getNodesByID).forEach(nodeID => {
			let r = parseInt(nodeID.split("-")[0]);
			let c = parseInt(nodeID.split("-")[1]);
			if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
				let currentNode = board.getNodesByID[nodeID];
				let currentElement = document.getElementById(nodeID);
				if (currentElement.className !== "start" && currentElement.className !== "target") {
					currentNode.type = "wall"
					board.animateWalls.push(currentNode);   
				}
			}
		});
		if (rowEnd - rowStart > currentCol - 2 - colStart) {
			create_recursive_divisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal");
		} else {
			create_recursive_divisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "vertical");
		}
		if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
			create_recursive_divisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal");
		} else {
			create_recursive_divisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "vertical");
		}
	}
};

function create_recursive_horizontal(board, rowStart, rowEnd, colStart, colEnd, orientation){
    if (rowStart > rowEnd || colStart > colEnd) {
    	return;
    }

    if (orientation === "horizontal"){
        let possibleRows = [];
        for (let number = rowStart; number <= rowEnd; number += 2){
            possibleRows.push(number);
        }
        let possibleCols = [];
        for (let number = colStart - 1; number <= colEnd + 1; number += 2){
            possibleCols.push(number);
        }
        // pick random index from the array
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);

        // select chosen random index for the opening
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];

        // iterate through each node seting the status to wall
        Object.keys(board.getNodesByID).forEach(nodeID => {
            // console.log(node);
            let r = parseInt(nodeID.split("-")[0]);
            let c = parseInt(nodeID.split("-")[1]);

            // If the node is in the chosen row and column, make it a wall.
            if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
                let currentNode = board.getNodesByID[nodeID];
                let currentElement = document.getElementById(nodeID);
                if (currentElement.className !== "start" && currentElement.className !== "target"){
                    currentNode.type = "wall"
                    board.animateWalls.push(currentNode);
                }
            }
        })

        if (currentRow - 2 - rowStart > colEnd - colStart) {
            create_recursive_horizontal(board, rowStart, currentRow - 2, colStart, colEnd, "horizontal");
        }
        else {
            create_recursive_horizontal(board, rowStart, currentRow - 2, colStart, colEnd, "horizontal");
        }
        
        if(rowEnd - (currentRow + 2) > colEnd - colStart) {
            create_recursive_horizontal(board, currentRow + 2, rowEnd, colStart, colEnd, "horizontal");
        }
        else {
            create_recursive_horizontal(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical");
        }
    }
    else {
        let possibleCols = [];
        for (let number = colStart; number <= colEnd; number += 2) {
            possibleCols.push(number);
        }
        let possibleRows = [];
        for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
            possibleRows.push(number);
        }
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let currentCol = possibleCols[randomColIndex];
        let rowRandom = possibleRows[randomRowIndex];
        Object.keys(board.getNodesByID).forEach(nodeID => {
            let r = parseInt(nodeID.split("-")[0]);
            let c = parseInt(nodeID.split("-")[1]);
            if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
                let currentNode = board.getNodesByID[nodeID];
                let currentElement = document.getElementById(nodeID);
                if(currentElement.className !== "start" && currentElement.className !== "target") {
                    currentNode.type = "wall"
                    board.animateWalls.push(currentNode);
                }
            }
        });

        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            create_recursive_horizontal(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal");
        } else {
            create_recursive_horizontal(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal");
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            create_recursive_horizontal(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal");
        } else {
            create_recursive_horizontal(board, rowStart, rowEnd, currentCol + 2, colEnd, "vertical");
        }
    }
}

function create_recursive_vertical(board, rowStart, rowEnd, colStart, colEnd, orientation){
    if (rowStart > rowEnd || colStart > colEnd) {
    	return;
    }

	// Create the rows
    if (orientation === "horizontal"){
        let possibleRows = [];
        for (let number = rowStart; number <= rowEnd; number += 2){
            possibleRows.push(number);
        }
        let possibleCols = [];
        for (let number = colStart - 1; number <= colEnd + 1; number += 2){
            possibleCols.push(number);
        }
        // pick random index from the array
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);

        // select chosen random index for the opening
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];

        // iterate through each node seting the status to wall
        Object.keys(board.getNodesByID).forEach(nodeID => {
            // console.log(node);
            let r = parseInt(nodeID.split("-")[0]);
            let c = parseInt(nodeID.split("-")[1]);

            // If the node is in the chosen row and column, make it a wall.
            if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
                let currentNode = board.getNodesByID[nodeID];
                let currentElement = document.getElementById(nodeID);
                if (currentElement.className !== "start" && currentElement.className !== "target"){
                    currentNode.type = "wall"
                    board.animateWalls.push(currentNode);
                }
            }
        })

        if (currentRow - 2 - rowStart > colEnd - colStart) {
            create_recursive_vertical(board, rowStart, currentRow - 2, colStart, colEnd, "horizontal");
        }
        else {
            create_recursive_vertical(board, rowStart, currentRow - 2, colStart, colEnd, "vertical");
        }
        
        if(rowEnd - (currentRow + 2) > colEnd - colStart) {
            create_recursive_vertical(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical");
        }
        else {
            create_recursive_vertical(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical");
        }
    }
    else {
        let possibleCols = [];
        for (let number = colStart; number <= colEnd; number += 2) {
            possibleCols.push(number);
        }
        let possibleRows = [];
        for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
            possibleRows.push(number);
        }
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);

        let currentCol = possibleCols[randomColIndex];
        let rowRandom = possibleRows[randomRowIndex];

        Object.keys(board.getNodesByID).forEach(nodeID => {
            let r = parseInt(nodeID.split("-")[0]);
            let c = parseInt(nodeID.split("-")[1]);
            if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
                let currentNode = board.getNodesByID[nodeID];
                let currentElement = document.getElementById(nodeID);
                if(currentElement.className !== "start" && currentElement.className !== "target") {
                    currentNode.type = "wall"
                    board.animateWalls.push(currentNode);
                }
            }
        });

        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            create_recursive_vertical(board, rowStart, rowEnd, colStart, currentCol - 2, "vertical");
        } else {
            create_recursive_vertical(board, rowStart, rowEnd, colStart, currentCol - 2, "vertical");
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            create_recursive_vertical(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal");
        } else {
            create_recursive_vertical(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal");
        }
    }
}

export {create_recursive_divisionMaze, create_recursive_horizontal, create_recursive_vertical, create_perimeterWall};