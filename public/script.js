const test_board1 = [ 
    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [8, 0, 0,   0, 0, 0,   0, 0, 0],

    [4, 0, 0,   0, 0, 0,   0, 0, 0],
    [7, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   8, 0, 0],

    [0, 1, 0,   0, 0, 5,   0, 0, 0],
    [0, 0, 0,   0, 0, 0,   0, 0, 0],
    [0, 5, 0,   0, 0, 0,   1, 0, 0]
];

const test_board2 = [
    [8, 2, 7,   1, 5, 4,   3, 9, 6],
    [9, 6, 5,   3, 2, 7,   1, 4, 8],
    [3, 4, 1,   6, 8, 9,   7, 5, 2],

    [5, 9, 3,   4, 6, 8,   2, 7, 1],
    [4, 7, 2,   5, 1, 3,   6, 8, 9],
    [6, 1, 8,   9, 7, 2,   4, 3, 5],

    [7, 8, 6,   2, 3, 5,   9, 1, 4],
    [1, 5, 4,   7, 9, 6,   8, 2, 3],
    [2, 3, 9,   8, 4, 0,   5, 0, 0]
];

//Set Board 
var Board = new Object();
Board.board = [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]];

//Set HTML input
function setup(){
  var container = document.getElementById('container');

  ///////////////////////////////////////////////////Board Setup
  for(let i = 0; i < 9; i++){
    //For the 3x3 Row square border
    if (i % 3 === 0){
      var rowSquare = document.createElement('div');
      rowSquare.className = "Square3x3"
      container.appendChild(rowSquare)
    }

    var row = document.createElement('div');
    row.className = "row row" + i;
    row.id = 'row' + i;

    for (let j = 0; j < 9; j ++){
      var box = document.createElement('input');
      box.className = "col col" + ((i*10)+(j+1));
      box.id = i + "-" + j;
      box.row = i;
      box.col = j;
      box.type = "number";    

      //For 3x3 Column square border
      if ((j % 3 === 0)){
        var colSquare = document.createElement('div');
        colSquare.className = "Square3x3"
        row.appendChild(colSquare)
      }

      //Put col in container
      row.appendChild(box);
    }
    //For the last 3x3 Column square border
    var colSquare = document.createElement('div');
    colSquare.className = "Square3x3"
    row.appendChild(colSquare)

    //Put row in Container
    container.appendChild(row)
  }
  //For the last 3x3 Row square
  var rowSquare = document.createElement('div');
  rowSquare.className = "Square3x3";
  container.appendChild(rowSquare);
} 
///////////////////////////////////////////////////////

//Put input to board and get http post and show the answer on board
function setInputToBoard(){
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      var input = Number(document.getElementById(i + "-" + j).value)
      Board.board[i][j] = input;
      }
  }

  if ((check_valid_board() === true) && (isSolved() === false)){
    fetch('/solve', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(Board.board)
    })
    .then(response => {
      return response.json();
    })
    .then(solvedSudoku => {
      draw_board(solvedSudoku[0]);
      console.log(solvedSudoku[1]);
      document.getElementById("SolvedCounterDisplay").innerHTML = "Solved: " + solvedSudoku[1];
    })
  }
  else if(isSolved() === true){
    alert("Board Has Been Solved")
  }
  else{
    alert("Invalid Input on Board")
  }
  // console.log(solveCounter);

}
///////////////////////////////////////////////////////

//Reset Board
function resetBoard(){
  Board.board = [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]];
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      document.getElementById(i + "-" + j).value = ""
    }
  }
}
/////////////////////////////////////////////////////////

//Show answer on board
function draw_board(arr){
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      document.getElementById(i + "-" + j).value = arr[i][j]
    }
  }
}

function check_valid_board(){ //return boolean
  //check row
  function isRowValid(row){
    let seen = new Set();
    for (var col = 0; col < 9; col++){
      if (row[col] === 0){
        continue;
      }

      if (seen.has(row[col])){
        return false;
      }
      seen.add(row[col]);
    }
    return true;
  }

  //check col
  function isColValid(board, col){
    let seen = new Set();
    for (var row = 0; row < 9; row++){
      if (board[row][col] === 0){
        continue;
      }

      if (seen.has(board[row][col])){
        return false;
      }
      seen.add(board[row][col]);
    }
    return true;
  }

  //check 3x3 grid
  function is_Square_Valid(board, row, col){
    let seen = new Set();
    for (var r = row; r < row + 3; r++){
      for (var c = col; c < col + 3; c++){
        if (board[r][c] === 0){
          continue;
        }

        if (seen.has(board[r][c])){
          return false;
        }

        seen.add(board[r][c]);
      }
    }
    return true;
  }

  //Validate Input
  function validate_input(){
    for (var r = 0; r < 9; r++){
      for (var c = 0; c < 9; c++){
        if ((Board.board[r][c] < 0) || (Board.board[r][c] > 9)){
          return false;
        }
      }
    }
    return true;
  }

  //validate the input, col & row & 3x3 grid
  if (validate_input() === false){
    return false;
  }
  for (var i = 0; i < Board.board.length; i++ ){
    if ((isRowValid(Board.board[i])) === false){
      return false;
    }
    if ((isColValid(Board.board, i)) === false){
      return false;
    }
  }
  for (var r = 0; r < Board.board.length; r += 3){
    for (var c = 0; c < Board.board[0].length; c += 3){
      if (is_Square_Valid(Board.board, r, c) === false){
        return false;
      }
    }
  }
  return true;
}

function isSolved() {
  for (var i = 0; i < Board.board.length; i ++){
    for (var j = 0; j < Board.board[0].length; j ++){
      if (Board.board[i][j] === 0){
        return false;
      }
    }
  }
  return true;
}

function find_empty(){ //returning tuple row, col if not return Boolean
  for (var i = 0; i < Board.board.length; i ++){
    for (var j = 0; j < Board.board[0].length; j ++){
      if (Board.board[i][j] === 0){
        return [i, j];
      }
    }
  }
  return false;
}

//confirm if num is valid in position
function valid_num(position, val){
  r = position[0];
  c = position[1];

  //check row
  for (var i = 0; i < 9; i ++){
    if ((Board.board[i][c] == val) && (i !== r)){
      return false;
    }
  }

  //check col
  for (var i = 0; i < 9; i ++){
    if ((Board.board[r][i] == val) && (i !== c)){
      return false;
    }
  }

  //check grid
  var box_x = Math.floor(c/3); //col grid
  var box_y = Math.floor(r/3); //row gri

  for (var i = box_y * 3; i < (box_y * 3 + 3); i++){
    for (var j = box_x * 3; j < (box_x * 3 + 3); j++){
      if ((Board.board[i][j] == val) && ((i !== r) && (j !== c))){
        return false;
      }
    }
  }
  return true;
}

//Solve game
function solve(){
  var find = find_empty();
  if (find === false){
    return true;
  }

  var row = find[0];
  var col = find[1];

  for (var n = 1; n < 10; n++){ //find possible number
    if (valid_num([row, col], n) === true){
      Board.board[row][col] = n;
      if (solve() === true){
        return true;
      }

      Board.board[row][col] = 0; //backtrack reset the board
    }
  }
  return false
}


// function game(){
//   setInputToBoard();
//   //check game solution
//   if (check_valid_board() === true){
//     solve();
//     draw_board();
//   }
//   else{
//     window.alert("Unsolvable");
//   }
// }
