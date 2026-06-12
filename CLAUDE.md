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
npm run dev        # React dev server (proxies API calls to Express on :3000)
npm run build      # Build to portfolio/build/
```

Both the Express backend and the React dev server default to port 3000 — run the
frontend dev server with `PORT=3001 npm run dev` if the backend is up, or rely on
CRA's port prompt. `.claude/launch.json` defines a `portfolio` launch config with
`autoPort` for browser-preview tooling.

## Architecture

This is a two-layer app:

**Backend** — Express + Node.js (`app.js`, root)
- Serves the React build as a static SPA at `/*`
- `config.js` holds secrets (MongoDB URI, JWT secret, OpenAI key, email credentials) — never committed
- MongoDB via Mongoose; auth uses JWT stored in cookies
- `routes/authRoutes.js` → `controllers/authController.js` → `models/user.js`
- `midleware/authMiddleware.js` provides `requireAuth` / `checkUser` guards
- `/generate_chat` — proxies to OpenAI `gpt-4o-mini` with a hardcoded system prompt that impersonates the owner for the portfolio chat feature; returns `{result}` on success, `{error}` with HTTP 500 on failure
- `/send_contactme_email` — sends contact form submissions via Gmail SMTP (nodemailer); returns `{success}` or `{error}`
- Legacy routes: `/SudokuSolver` (auth-protected, EJS), `/PathFindingVisualizer` (EJS), `/oldPortfolio` (EJS)

**Frontend** — React (`portfolio/src/`)
- Single-page portfolio with normal scrolling; sections composed in `App.js`: Hero (Cover), About, Experience, Skills, Projects, Contact — plus `ChatWithAI`, a floating chat widget rendered outside the sections
- **Data-driven components**: content lives in arrays co-located with each section — `experiences` in `WorkExperience.js`, `featuredProjects`/`moreProjects` in `Projects.js`, `skillGroups` in `Skills.js`, `navLinks` in `Header.js`. To add a job/project/skill, edit the array; don't create new component files
- Shared building blocks: `SectionHeading.js` (blue heading + underline used by every section), `ProjectCard.js` (featured and compact variants)
- `Header.js` is a sticky nav with scrollspy (IntersectionObserver) and a mobile hamburger menu; section ids in `App.js` must match `navLinks` hrefs
- The chat widget opens via a `window` CustomEvent `'open-chat'` (dispatched by the hero CTA in `Cover.js`)
- Heavy project GIFs use click-to-play: a `poster` JPEG (first frame, extracted with macOS `sips`) renders until the user clicks play, then the GIF loads. Keep this pattern for any new large media
- Styled with Tailwind CSS; animated with Framer Motion. The accent color `#38BDF8` (sky blue) is hardcoded in arbitrary-value classes throughout — a theme-wide color change means find-and-replace on that hex
- Smooth scrolling is gated behind `prefers-reduced-motion` in `index.css`
- React dev server proxies API calls to `http://localhost:3000` (see `portfolio/package.json` `proxy`)

**Other**
- `public/` — legacy vanilla JS pathfinding visualizer (separate from the React app)
- `views/` — EJS templates for the legacy routes
- `DareMightyThings2019-master/` — archived hackathon project (Python Flask), not integrated into the main app

## Notes

- No test suite exists (`react-scripts test` finds 0 files); verify changes by running the app
- Production build must stay warning-free — unused imports fail this bar
