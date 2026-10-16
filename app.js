const path = require('path');
const express = require ('express');
const app = express();
// Behind a reverse proxy/load balancer, set TRUST_PROXY to the number of proxy
// hops so rate limits see the visitor's IP. Leave unset otherwise: trusting
// X-Forwarded-For without a proxy lets clients spoof their IP past the limits.
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY));
}
const mongoose = require("mongoose");
const config = require('./config');
const authRoutes = require ('./routes/authRoutes');
const cookieParser = require ('cookie-parser');
const {requireAuth, checkUser} = require ('./midleware/authMiddleware');
const {chatLimiters, contactLimiters} = require('./midleware/rateLimiters');
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

mongoose.connect(connectionString)
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
    // Async callback: an uncaught throw exits Node, so every path must respond.
    try {
      const user = await User.findById(decodedToken.id);
      if (!user) {
        return res.redirect('/login');
      }
      res.render('index', {count: user.solvedSudoku});
    } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong');
    }
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

app.post('/send_contactme_email', contactLimiters, function(req, res){
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
You pretend to be me to talk about my professional background and projects.

About Me:

Name: William William
Role: Full-Time Software Engineer at STMicroelectronics
Experience: 5 years in Python and computer vision
Expertise: IoT devices (Raspberry Pi, STM32), AI solutions for defect detection, and mask ID recognition
LeetCode: Active participant as "IamCookie"
Education: B.Sc. in Computer Engineering from Illinois Institute of Technology (2021)
Location: Singapore
From: Jakarta
Status: Single, Unmarried

Key Projects:

Pathfinding Visualizer: Interactive tool demonstrating pathfinding algorithms like BFS, DFS, Dijkstra's, and A* Search.
Sudoku Solver: A project that solves Sudoku puzzles using a SAT-Solver with DPLL. 
Dare Mighty Things Hackathon 2019: Won 1st place to implement a generated text application for a multi-billion dollar real estate company (JLL).
Google Tech Challenge: Engaged in the challenge, applying technical skills to real-world problems.
Automated Desk Light: Developed a system to automate desk lighting based on user activity.

Social Media and Contact Info:
Email: wwilliam1908@gmail.com
Number: +65 8131 3189 / +1 312 788 7357
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

const MAX_PROMPT_LENGTH = 1000;

app.post("/generate_chat", chatLimiters, async (req, res) => {
  try {
      const { prompt } = req.body;
      // Cap input and output size so one request can't run up a large OpenAI bill.
      if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > MAX_PROMPT_LENGTH) {
          return res.status(400).json({ error: `Message must be 1-${MAX_PROMPT_LENGTH} characters` });
      }

      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 500,
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

// Proxy to the internal Python/FastAPI pathfinding service (pathfinding-service/).
// Forwards upstream status/body (including 422 validation errors); 503 when down.
const PATHFINDING_SERVICE_URL = process.env.PATHFINDING_SERVICE_URL || 'http://localhost:8000';

app.post('/api/pathfind', async (req, res) => {
  try {
    const upstream = await fetch(`${PATHFINDING_SERVICE_URL}/pathfind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(5000),
    });
    res.status(upstream.status).json(await upstream.json());
  } catch (error) {
    res.status(503).json({ error: 'Pathfinding service unavailable' });
  }
});

app.use(authRoutes);