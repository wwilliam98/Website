const path = require('path');
const express = require ('express');
const app = express();
const mongoose = require("mongoose");
const {config, my_email} = require('./config');
const authRoutes = require ('./routes/authRoutes');
const cookieParser = require ('cookie-parser');
const {requireAuth, checkUser} = require ('./midleware/authMiddleware');
const jwt = require ('jsonwebtoken');
const User = require ('./models/user');
const nodemailer = require('nodemailer');

app.set ('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, './portfolio/build')));
app.use(cookieParser());

app.use(authRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

//Connect to MongoDB
var connectionString = config.mongoKey;
var JWT_SECRET = config.JWT_SECRET;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => console.log("connected to port 3000"), app.listen(3000))
    .catch((err) => console.log(err));

app.get('*', checkUser);

// app.get('/', function(req, res){
//   res.render('main')
// });

app.get('/', function(req, res){
  // All other GET requests not handled before will return our React app
  res.sendFile(path.resolve(__dirname, './portfolio/build', 'index.html'));
});

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

app.post('/send_contactme_email', function(req, res){
  const { name, email, subject, message } = req.body;
  console.log(name, email, subject, message)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: my_email.user,
      pass: my_email.pass
    }
  });

  const mailOptions = {
    from: '"Website Portfolio" wwilliam1908@gmail.com',
    to: 'wwilliam1908@gmail.com',
    subject: subject,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error)
      res.status(500).json({ error: 'Failed to send email' });
    }else{
      console.log('Email Send: ' + info.response)
      res.status(200).json({ message: 'Email sent successfully' });
    }
  })

  // try {
  //   await transporter.sendMail(mailOptions);
  //   res.status(200).json({ message: 'Email sent successfully' });
  // } catch (error) {
  //   console.error('Error sending email:', error);
  //   res.status(500).json({ error: 'Failed to send email' });
  // }

  // res.send(JSON.stringify({ name: name, email: email, subject: subject, message: message }));
  // res.send(JSON.stringify({ message: "Hello from server!" }));
});