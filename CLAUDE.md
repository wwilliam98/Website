# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Run backend only (with nodemon hot-reload)
npm run startdev

# Build React frontend and start backend
npm run dev

# Production start
npm start
```

### Frontend (portfolio/)
```bash
cd portfolio
npm run dev        # React dev server on port 3000 (proxies to Express)
npm run build      # Build to portfolio/build/
```

### Deploy / Build
```bash
npm run build      # Installs deps, builds React frontend
```

## Architecture

This is a two-layer app:

**Backend** — Express + Node.js (`app.js`, root)
- Serves the React build as a static SPA at `/*`
- `config.js` holds secrets (MongoDB URI, JWT secret, OpenAI key, email credentials) — never committed
- MongoDB via Mongoose; auth uses JWT stored in cookies
- `routes/authRoutes.js` → `controllers/authController.js` → `models/user.js`
- `midleware/authMiddleware.js` provides `requireAuth` / `checkUser` guards
- `/generate_chat` — proxies to OpenAI `gpt-4o-mini` with a hardcoded system prompt that impersonates the owner for the portfolio chat feature
- `/send_contactme_email` — sends contact form submissions via Gmail SMTP (nodemailer)
- Legacy routes: `/SudokuSolver` (auth-protected, EJS), `/PathFindingVisualizer` (EJS), `/oldPortfolio` (EJS)

**Frontend** — React (`portfolio/src/`)
- Single-page portfolio; sections: Hero, About, Experience, Skills, Projects, ChatWithAI, Contact
- `App.js` composes the page as snap-scroll sections; `Header.js` handles nav
- Styled with Tailwind CSS; animated with Framer Motion
- Each project/skill/experience has its own component file in `Components/`
- React dev server proxies API calls to `http://localhost:3000` (see `portfolio/package.json`)

**Other**
- `public/` — legacy vanilla JS pathfinding visualizer (separate from the React app)
- `DareMightyThings2019-master/` — archived hackathon project (Python Flask), not integrated into the main app
