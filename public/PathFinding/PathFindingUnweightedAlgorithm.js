function BFS(start_node, end_node, board) {
    let queue = [start_node];
    let visited = [];

    while (queue.length > 0) {
        let current_node = queue.shift();
        visited.push(current_node);

        if (current_node.id === end_node.id) {
            return current_node;
        }

        let neighbors = board.getNeighbors(current_node);
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i].status === 'empty') {
                neighbors[i].previousNode = current_node;
                queue.push(neighbors[i]);
            }
        }
    }
}

function DFS(board, start_id, end_id){
    let stack = [[start_id, [board.getNodesByID[start_id]]]];
    let visited = new Set();
    while (stack.length > 0) {
        let current = stack.pop()  // pop the first element of the stack
        let current_id = current[0];
        let current_node = board.getNodesByID[current[0]];
        let path = current[1];
        board.nodesToAnimate.push(board.getNode(current_id))
        
        if (!visited.has(current_id)) {
            if (current_id === end_id) {
                board.AnimateFoundPath = path;
                return path;
            }
            visited.add(current_id);
            current_node.status = "Visited";
            board.nodes_adjacency_list[current_id].forEach(id => {
                if (board.getNodesByID[id].status != "wall"){
                    stack.push([id, path.concat(board.getNode(id))]);
                }
            });
        }
    }
    // function helper(board, start, destination, path){
    //     if (row < 0 || row >= board.rows || col < 0 || col >= board.cols) {
    //         return;
    //     }
    //     console.log(board)
    //     let current_node = board.getNodesByID[row + "-" + col];
    //     console.log(current_node, row, col)
    //     if(current_node.status === 'wall'){
    //         return
    //     }

    //     if (current_node.id === end_node.id) {
    //         return path;
    //     }
    //     current_node.status = 'visited';
    //     board.animateWalls.push(current_node);

    //     helper(board, row + 1, col, path);
    //     helper(board, row - 1, col, path);
    //     helper(board, row, col + 1, path);
    //     helper(board, row, col - 1, path);
    // }
    // helper(board, start_node, end_node, []);
}

function twoBFS(start_node, end_node, board) {

}

export {BFS, DFS, twoBFS};