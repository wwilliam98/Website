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
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

var connectionString = config.mongoKey;
var JWT_SECRET = config.JWT_SECRET;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => console.log("connected to port 3000"), app.listen(3000))
    .catch((err) => console.log(err));

app.get('*', checkUser);
app.get('/', requireAuth,function(req, res){
  const token = req.cookies.jwt;
  jwt.verify(token, JWT_SECRET, async(err, decodedToken) =>{
    const user = await User.findById(decodedToken.id);
    res.render('index', {count: user.solvedSudoku});
  })
});
app.use(authRoutes);