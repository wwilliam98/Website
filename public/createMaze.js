// Maze generation stays client-side: it only marks wall cells for the board
// to animate. The pathfinding service sees them on the next Visualize.

const longerSide = (rowSpan, colSpan) => rowSpan > colSpan ? "horizontal" : "vertical";

// Orientation for each of the two sub-regions a wall creates. `half` is 0 for
// the region above/left of the wall, 1 for below/right. The skewed styles
// reproduce the original hand-written variants exactly, asymmetry included.
const ORIENTATION_RULES = {
    balanced: (parent, half, rowSpan, colSpan) => longerSide(rowSpan, colSpan),
    horizontal: (parent, half, rowSpan, colSpan) =>
        half === 0 ? "horizontal" : longerSide(rowSpan, colSpan),
    vertical: (parent, half, rowSpan, colSpan) => {
        if (parent === "horizontal") {
            return half === 0 ? longerSide(rowSpan, colSpan) : "vertical";
        }
        return half === 0 ? "vertical" : "horizontal";
    },
};

// Uniform pick from start, start+2, ..., <= end
function randomStep(start, end) {
    const count = Math.floor((end - start) / 2) + 1;
    return start + 2 * Math.floor(Math.random() * count);
}

function addWall(board, row, col) {
    const node = board.getNodesByID[`${row}-${col}`];
    if (node && node.type !== "start" && node.type !== "target") {
        node.type = "wall";
        board.animateWalls.push(node);
    }
}

function create_perimeterWall(board) {
    for (let r = 0; r < board.height; r++) {
        for (let c = 0; c < board.width; c++) {
            if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
                addWall(board, r, c);
            }
        }
    }
}

function create_recursive_division(board, rowStart, rowEnd, colStart, colEnd, orientation, style) {
    if (rowStart > rowEnd || colStart > colEnd) {
        return;
    }
    const chooseOrientation = ORIENTATION_RULES[style];

    if (orientation === "horizontal") {
        const wallRow = randomStep(rowStart, rowEnd);
        const gapCol = randomStep(colStart - 1, colEnd + 1);
        for (let c = colStart - 1; c <= colEnd + 1; c++) {
            if (c !== gapCol) addWall(board, wallRow, c);
        }
        create_recursive_division(board, rowStart, wallRow - 2, colStart, colEnd,
            chooseOrientation(orientation, 0, wallRow - 2 - rowStart, colEnd - colStart), style);
        create_recursive_division(board, wallRow + 2, rowEnd, colStart, colEnd,
            chooseOrientation(orientation, 1, rowEnd - (wallRow + 2), colEnd - colStart), style);
    } else {
        const wallCol = randomStep(colStart, colEnd);
        const gapRow = randomStep(rowStart - 1, rowEnd + 1);
        for (let r = rowStart - 1; r <= rowEnd + 1; r++) {
            if (r !== gapRow) addWall(board, r, wallCol);
        }
        create_recursive_division(board, rowStart, rowEnd, colStart, wallCol - 2,
            chooseOrientation(orientation, 0, rowEnd - rowStart, wallCol - 2 - colStart), style);
        create_recursive_division(board, rowStart, rowEnd, wallCol + 2, colEnd,
            chooseOrientation(orientation, 1, rowEnd - rowStart, colEnd - (wallCol + 2)), style);
    }
}

// style: "balanced" | "horizontal" | "vertical"
function create_maze(board, style) {
    create_perimeterWall(board);
    const firstSplit = style === "vertical" ? "vertical" : "horizontal";
    create_recursive_division(board, 2, board.height - 3, 2, board.width - 3, firstSplit, style);
}

export { create_maze };
