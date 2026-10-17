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
const {chatLimiters, contactLimiters, resumeLimiters} = require('./midleware/rateLimiters');
const jwt = require ('jsonwebtoken');
const User = require ('./models/user');
const nodemailer = require('nodemailer');
const { OpenAI } = require("openai");
const escapeHtml = require('./utils/escapeHtml');
const { systemPrompt, resumeInstructions } = require('./utils/chatPrompt');
const { RESUME_PATH, resumeAvailable, isValidEmail } = require('./utils/resume');
const { pathfind, ValidationError: PathfindingValidationError } = require('./pathfinding');

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

const createTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.my_email.user,
    pass: config.my_email.pass
  }
});

app.post('/send_contactme_email', contactLimiters, function(req, res){
  const { name, email, subject, message } = req.body;
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Website Portfolio" wwilliam1908@gmail.com',
    to: 'wwilliam1908@gmail.com',
    subject: subject,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong> ${escapeHtml(message)}</p>
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


const MAX_PROMPT_LENGTH = 1000;
// Earlier turns sent back by the widget so follow-ups ("tell me more") have context.
// Capped so a long conversation can't inflate the cost of each OpenAI call.
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_MESSAGE_LENGTH = 3000;

const isValidHistory = (history) =>
  Array.isArray(history) &&
  history.length <= MAX_HISTORY_MESSAGES &&
  history.every((m) =>
    m && (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string' && m.content.length <= MAX_HISTORY_MESSAGE_LENGTH);

const resumeTool = {
  type: 'function',
  function: {
    name: 'offer_resume_email',
    description: "Offer to email William's résumé (PDF) to the visitor. The visitor confirms in the chat before it is sent.",
    parameters: {
      type: 'object',
      properties: { email: { type: 'string', description: "The visitor's email address" } },
      required: ['email'],
      additionalProperties: false,
    },
  },
};

app.post("/generate_chat", chatLimiters, async (req, res) => {
  try {
      const { prompt, history = [] } = req.body;
      // Cap input and output size so one request can't run up a large OpenAI bill.
      if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > MAX_PROMPT_LENGTH) {
          return res.status(400).json({ error: `Message must be 1-${MAX_PROMPT_LENGTH} characters` });
      }
      if (!isValidHistory(history)) {
          return res.status(400).json({ error: 'Invalid chat history' });
      }

      const canSendResume = resumeAvailable();
      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 500,
          temperature: 0.4,
          messages: [
            { role: "system", content: canSendResume ? `${systemPrompt}\n\n${resumeInstructions}` : systemPrompt },
            ...history.map(({ role, content }) => ({ role, content })),
            { role: "user", content: prompt }],
          ...(canSendResume && { tools: [resumeTool] }),
      });
      const message = response.choices[0].message;

      // The tool never sends anything itself: it returns an action the widget shows
      // as a confirm button, which calls /send_resume. Prompt injection can't send mail.
      const toolCall = message.tool_calls?.find((call) => call.function?.name === 'offer_resume_email');
      if (toolCall) {
          let email;
          try {
              ({ email } = JSON.parse(toolCall.function.arguments));
          } catch {
              email = undefined;
          }
          if (isValidEmail(email)) {
              return res.json({
                  result: message.content || `Happy to share my résumé. Should I send it to **${email}**?`,
                  action: { type: 'send_resume', email },
              });
          }
          return res.json({ result: "I'd be happy to send my résumé. What email address should I send it to?" });
      }
      res.json({ result: message.content });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
  }
});

// Emails the resume PDF after the visitor confirms in the chat widget. The email
// body is fixed text with no visitor input, so it can't be used to relay spam.
app.post('/send_resume', resumeLimiters, async (req, res) => {
  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!resumeAvailable()) {
    return res.status(404).json({ error: "My résumé isn't available right now. Please reach me on LinkedIn instead." });
  }
  try {
    await createTransporter().sendMail({
      from: '"William (willwebx.com)" <wwilliam1908@gmail.com>',
      to: email,
      replyTo: 'wwilliam1908@gmail.com',
      subject: "William's résumé",
      text: "Hi,\n\nThanks for your interest! My résumé is attached, as requested through the chat on willwebx.com.\n\nFeel free to reply to this email if you'd like to talk.\n\nBest,\nWilliam\n\nIf you didn't request this, you can ignore this email.",
      attachments: [{ filename: 'William_Resume.pdf', path: RESUME_PATH }],
    });
    res.json({ result: `Sent! Check ${email} for my résumé.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sorry, I couldn't send the email. Please try again later." });
  }
});

// Pathfinding for /PathFindingVisualizer runs in-process (pathfinding/).
// 422 {error} on invalid input, matching the old service's status code.
app.post('/api/pathfind', (req, res) => {
  try {
    res.json(pathfind(req.body));
  } catch (error) {
    if (error instanceof PathfindingValidationError) {
      return res.status(422).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Pathfinding failed' });
  }
});

app.use(authRoutes);