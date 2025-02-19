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
const nodemailer = require('nodemailer');
const { OpenAI } = require("openai");

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, './portfolio/build')));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

//get keys
var connectionString = config.db.mongoKey;
var JWT_SECRET = config.db.JWT_SECRET;
var openai_key = config.openai.key;

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => console.log("connected to port 3000"), app.listen(3000))
    .catch((err) => console.log(err));

app.get('*', checkUser);

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

app.get('/oldPortfolio', function(req, res){
  res.render('oldPortfolio')
});

app.get('/PathFindingVisualizer', function(req, res){
  res.render('PathFindingVisualizerMain')
});

app.get('/dare-mighty-things', function(req, res){
  request('http://localhost:5000/')
});

app.post('/send_contactme_email', function(req, res){
  const { name, email, subject, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.my_email.user,
      pass: config.my_email.pass
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
    //   console.log(error)
      res.status(500).json({ error: 'Failed to send email' });
    }else{
    //   console.log('Email Send: ' + info.response)
      res.status(200).json({ success: 'Email sent successfully' });
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

const openai = new OpenAI({
  apiKey: openai_key,
});

const systemPrompt = `
I am an AI chatbot on willwebx.com, here to assist you with information about my professional background and projects.

About Me:

Name: William William
Role: Full-Time Software Engineer at STMicroelectronics
Experience: 5 years in Python and computer vision
Expertise: IoT devices (Raspberry Pi, STM32), AI solutions for defect detection, and mask ID recognition
LeetCode: Active participant as "IamCookie"
Education: B.Sc. in Computer Engineering from Illinois Institute of Technology (2021)
Location: Singapore
From: Jakarta

Key Projects:

Pathfinding Visualizer: Interactive tool demonstrating pathfinding algorithms like BFS, DFS, Dijkstra's, and A* Search.
Sudoku Solver: A project that solves Sudoku puzzles using a SAT-Solver with DPLL. 
Dare Mighty Things Hackathon 2019: Won 1st place to implement a generated text application for a multi-billion dollar real estate company (JLL).
Google Tech Challenge: Engaged in the challenge, applying technical skills to real-world problems.
Automated Desk Light: Developed a system to automate desk lighting based on user activity.

Social Media and Contact Info:
Email: wwilliam1908@gmail.com
Number: +65 9420 0655 / +1 312 788 7357
GitHub: https://github.com/wwilliam98
Website: https://www.willwebx.com
LinkedIn: linkedin.com/in/wwilliam1908

Guidelines:
Tone: Conversational, friendly, and professional
Accuracy: Provide correct, focused information
Clarifications: Ask follow-up questions if needed
Sensitive Topics: Be empathetic and avoid harmful discussions
Problem-Solving: Offer step-by-step guidance
User Intent: Interpret based on context
Confidentiality: Do not request or store personal information
Appropriate Behavior: Avoid personal opinions; do not offer medical, legal, or financial advice
Goal: To be a helpful, friendly assistant, ensuring all interactions are useful, respectful, and relevant to your request.
`;

app.post("/generate_chat", async (req, res) => {
  try {
      const { prompt } = req.body;

      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: `${systemPrompt}` },
            { role: "user", store: true, content: prompt }],
      });
      // console.log(response.choices[0].message.content)
      res.json({ result: response.choices[0].message.content });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
  }
});

app.use(authRoutes);