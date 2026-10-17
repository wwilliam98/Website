# Website

Source for William's personal website, [willwebx.com](https://willwebx.com): a portfolio
with an AI chat assistant, plus a few side projects served from the same Express app.

## Features

- **Portfolio** (React, Tailwind CSS, Framer Motion): about, experience, skills, projects
  and a contact form. The page text lives in one data file,
  [`portfolio/src/data/content.json`](portfolio/src/data/content.json).
- **Chat assistant**: a floating chat widget backed by OpenAI (`gpt-4o-mini`). It answers
  questions about William's background using the same `content.json` the site renders,
  links to the matching project cards, and can email his resume to a visitor who asks.
- **Pathfinding visualizer** (`/PathFindingVisualizer`): draw walls and weights on a grid,
  generate mazes, and watch 10 algorithms search it (BFS, DFS, Greedy Best-First, Jump
  Point Search, IDDFS, Dijkstra, A\*, Weighted A\*, Bidirectional, Bellman-Ford). The
  algorithms run on the server in plain Node ([`pathfinding/`](pathfinding)).
- **Sudoku solver** (`/SudokuSolver`): a backtracking solver behind a login (MongoDB
  accounts, JWT cookie), with a guest mode.
- **Contact form**: sends submissions to William by email over Gmail SMTP.

Chat, contact, resume and login requests are rate limited.

## Tech stack

| Part      | Tools |
|-----------|-------|
| Frontend  | React (Create React App), Tailwind CSS, Framer Motion |
| Backend   | Node.js 20+, Express 4, EJS for the older pages |
| Data      | MongoDB via Mongoose, bcrypt, JSON Web Tokens |
| Services  | OpenAI API, Nodemailer (Gmail SMTP) |
| Tests     | `node:test` (no extra dependencies) |

## Project layout

```
app.js            Express server: routes, API endpoints, serves the React build
portfolio/        React portfolio (src/data/content.json holds the site's text)
pathfinding/      Pathfinding algorithms, request validation and their tests
public/, views/   Visualizer and Sudoku front ends (vanilla JS + EJS templates)
controllers/, models/, routes/, midleware/   Auth, Sudoku solving, rate limits
utils/            Chat system prompt and resume helpers
```

## Running locally

Requires Node.js 20 or newer. MongoDB, OpenAI and Gmail are only needed for the features
that use them.

1. Install dependencies and build the frontend:

   ```bash
   npm run build      # installs root + portfolio packages, builds portfolio/build/
   ```

2. Create `config.js` in the repo root. It holds the secrets and is gitignored, so never
   commit it:

   ```js
   module.exports = {
     db: {
       mongoKey: 'mongodb+srv://...',   // MongoDB connection string (logins, Sudoku stats)
       JWT_SECRET: 'any-long-random-string',
     },
     openai: {
       key: 'sk-...',                   // OpenAI API key (chat assistant)
     },
     my_email: {
       user: 'you@gmail.com',           // Gmail account that sends contact/resume emails
       pass: 'app-password',            // Gmail app password, not the account password
     },
   };
   ```

3. Start the server:

   ```bash
   npm start          # http://localhost:3000
   ```

   For backend work, `npm run startdev` restarts on changes (nodemon). For frontend work,
   run `cd portfolio && PORT=3001 npm run dev` alongside it; the React dev server proxies
   API calls to the backend on port 3000.

### Optional environment variables

| Variable      | Purpose |
|---------------|---------|
| `RESUME_PATH` | Path to the resume PDF the chat assistant emails. Defaults to `private/resume.pdf` (gitignored). Without the file, the assistant points visitors to LinkedIn instead. |
| `TRUST_PROXY` | Number of proxy hops (e.g. `1` behind nginx) so rate limits see real visitor IPs. Leave unset when nothing sits in front of the server. |

## Tests

```bash
npm test
```

Covers the pathfinding algorithms (correctness, optimality on random boards, determinism)
and request validation. The React app has no test suite yet.

## Deployment

There's no CI/CD: merging to `main` doesn't deploy. Production runs `npm start` under a
process manager and picks up changes when the server is rebuilt and restarted.

## Contributing notes

[`CLAUDE.md`](CLAUDE.md) has the detailed architecture notes, conventions and known
issues.
