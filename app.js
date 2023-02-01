const path = require('path');
const express = require ('express');
const app = express();
const mongoose = require("mongoose");
const config = require('./config');
const authRoutes = require ('./routes/authRoutes');
const cookieParser = require ('cookie-parser');
const {requireAuth, checkUser} = require ('./midleware/authMiddleware');
const jwt = require ('jsonwebtoken');
const User = require ('./models/user');

app.set ('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, './portfolio/build')));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

//Connect to MongoDB
var connectionString = config.mongoKey;
var JWT_SECRET = config.JWT_SECRET;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => console.log("connected to port 3000"), app.listen(3000))
    .catch((err) => console.log(err));

app.get('*', checkUser);

app.get('/', function(req, res){
  res.render('main')
});

// app.get('/', function(req, res){
//   // All other GET requests not handled before will return our React app
//   res.sendFile(path.resolve(__dirname, './portfolio/build', 'index.html'));
// });

app.get('/SudokuSolver', requireAuth, function(req, res){
  const token = req.cookies.jwt;
  jwt.verify(token, JWT_SECRET, async(err, decodedToken) =>{
    const user = await User.findById(decodedToken.id);
    res.render('index', {count: user.solvedSudoku});
  })
});

app.get('/PathFindingVisualizer', function(req, res){
  res.render('PathFindingVisualizerMain')
});

app.get('/dare-mighty-things', function(req, res){
  request('http://localhost:5000/')
});

app.get('/api', function(req,res){
  res.json({ message: "Hello from server!" });
});

app.use(authRoutes);