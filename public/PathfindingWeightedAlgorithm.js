function Dijkstra(board) {
    let queue = [{ current_node: board.start, total_weight: board.start.weight, path: []}];
    let visited = new Set();
    // let visited = new Set([board.start]);
    // board.start.status = "visited"

    while (queue.length) {
        queue.sort((a, b) => a.total_weight - b.total_weight);
        console.log(queue)
        
        let { current_node, total_weight, path } = queue.shift();
        visited.add(current_node);
        current_node.status = "visited"
        board.nodesToAnimate.push(current_node)

        if (current_node === board.target) {
            path.push(current_node)
            board.AnimateFoundPath = path
            return path;
        }

        let neighbors = current_node.neighborsNode;
        for (let i = 0; i < neighbors.length; i++) {
            if (!visited.has(neighbors[i]) && neighbors[i].status == "unvisited" && neighbors[i].type !== "wall") {
                // visited.add(neighbors[i]);
                neighbors[i].status = "visited"
                queue.push({current_node: neighbors[i], total_weight: total_weight + neighbors[i].weight, path: [...path, current_node]});
            }
        }
        // break
    }
    return [];
}

////////////////////////////////////////////// A Star Algorithm //////////////////////////////////////////////
function getHeuristicScore(board, node){
	let target_coordinates = board.target.id.split("-");
    let target_r = parseInt(target_coordinates[0])
    let target_c = parseInt(target_coordinates[1])

	let curr_coordinates = node.id.split("-");
    let curr_r = parseInt(curr_coordinates[0])
    let curr_c = parseInt(curr_coordinates[1])

    let heuristicScore = Math.sqrt((Math.abs(target_r-curr_r)**2) + (Math.abs(target_c-curr_c)**2))
    return heuristicScore
}

function AStar(board) {
    let queue = [{ current_node: board.start, total_score: getHeuristicScore(board, board.start), total_weight: board.start.weight, path: []}]; // total_score = gn + hn (total score), gn = weight score, hn = heuristic score
    let visited = new Set();
    // let visited = new Set([board.start]);
    // board.start.status = "visited"

    while (queue.length) {
        queue.sort((a, b) => a.total_score - b.total_score);
        console.log(queue)
        
        let { current_node, total_score, total_weight, path } = queue.shift();
        visited.add(current_node);
        current_node.status = "visited"
        board.nodesToAnimate.push(current_node)

        if (current_node === board.target) {
            path.push(current_node)
            board.AnimateFoundPath = path
            return path;
        }

        let neighbors = current_node.neighborsNode;
        for (let i = 0; i < neighbors.length; i++) {
            if (!visited.has(neighbors[i]) && neighbors[i].status == "unvisited" && neighbors[i].type !== "wall") {
                // visited.add(neighbors[i]);
                neighbors[i].status = "visited"
                console.log(neighbors[i].id, board.target.id, getHeuristicScore(board, neighbors[i]))
                let neighbor_score = total_weight + neighbors[i].weight + getHeuristicScore(board, neighbors[i])
                queue.push({current_node: neighbors[i], total_score: neighbor_score, total_weight: total_weight + neighbors[i].weight, path: [...path, current_node]});
            }
        }
        // break
    }
    return [];
}

export {Dijkstra, AStar};