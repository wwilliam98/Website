function BFS(board) {
    let queue = [{ current_node: board.start, path: []}];
    let visited = new Set([board.start]);
    board.start.status = "visited"

    while (queue.length > 0) {
        let { current_node, path } = queue.shift();
        board.nodesToAnimate.push(current_node)

        if (current_node === board.target) {
            path.push(current_node)
            board.AnimateFoundPath = path
            return path;
        }

        let neighbors = current_node.neighborsNode;
        for (let i = 0; i < neighbors.length; i++) {
            if (!visited.has(neighbors[i]) && neighbors[i].status == "unvisited" && neighbors[i].type !== "wall") {
                visited.add(neighbors[i]);
                neighbors[i].status = "visited"
                queue.push({current_node: neighbors[i], path: [...path, current_node]});
            }
        }
        // break
    }
    return [];
}

function DFS(board){
    let stack = [{ current_node: board.start, path: []}];
    let visited = new Set();
    while (stack.length > 0) {
        let { current_node, path } = stack.pop(); // pop the first element of the stack

        board.nodesToAnimate.push(current_node)
        
        if (!visited.has(current_node)){
            if (current_node === board.target) {
                current_node.status = "visited"
                path.push(current_node)
                board.AnimateFoundPath = path;
                return path;
            }
            visited.add(current_node);
            current_node.status = "visited";
            current_node.neighborsNode.forEach(node => {
                if (node.type != "wall"){
                    stack.push({current_node: node, path: [...path, current_node]});
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