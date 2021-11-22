const User = require ('../models/user');
const jwt = require ('jsonwebtoken');
const config = require('../config');

var JWT_SECRET = config.JWT_SECRET;

const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn : maxAge
    });
}
module.exports.signup_get = (req, res)=>{
    res.render('signup');
}

module.exports.login_get = (req, res)=>{
    res.render('login');
}

module.exports.signup_post = async (req, res)=>{
    const {email, password} = req.body;
    const solvedSudoku = 0;
    try{
        const user = await User.create ({ email, password, solvedSudoku});
        const token = createToken (user._id);
        res.cookie ('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({ user : user._id});
        
    } catch (err) {
        console.log (err)
        res.status(400).send('failed to create a user');
    }
}

module.exports.login_post = async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.login_get(email,password);
        const token = createToken (user._id);
        res.cookie ('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({user: user._id});
    }catch (err) {
        res.status(400).json({});
    }
}

module.exports.logout_get = async (req, res) =>{
    res.cookie ('jwt', '', {maxAge : 1});
    res.redirect ('/login');
}

module.exports.solve_post = async (req, res) =>{
    var input = req.body;
    const token = req.cookies.jwt;
    jwt.verify(token, JWT_SECRET, async(err, decodedToken) =>{
      const user = await User.findById(decodedToken.id);
      const prevCount = user.solvedSudoku;
      const newCount = prevCount + 1;
      console.log(newCount);
      await User.findByIdAndUpdate({_id: user.id}, {solvedSudoku: newCount});

      var data = SolveBoard(input);
      res.send([data, newCount]);
    });

    function SolveBoard(input){
        //Solve the Board
        var Board = new Object();
        Board.board = input;
        
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
          
            //valid the input, col & row & 3x3 grid
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
    
        solve();
        
        // console.log(Board.board);
        return Board.board;
    }
}