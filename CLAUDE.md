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

### Pathfinding service (pathfinding-service/) — in progress
Python/FastAPI microservice that will own the pathfinding algorithms (see
Architecture below). Until it lands, the algorithms still run client-side in
`public/Pathfinding*Algorithm.js`.
```bash
# One-time setup
python3 -m venv pathfinding-service/.venv
pathfinding-service/.venv/bin/pip install -r pathfinding-service/requirements.txt

# Run (internal service on :8000)
npm run service

# Tests
npm run service:test    # pytest
```

## Architecture

This is a multi-service app:

**Backend** — Express + Node.js (`app.js`, root, port 3000, Node v20)
- Serves the React build as a static SPA at `/*`
- `config.js` holds secrets (MongoDB URI, JWT secret, OpenAI key, email credentials) — never committed
- MongoDB via Mongoose; auth uses JWT stored in cookies
- `routes/authRoutes.js` → `controllers/authController.js` → `models/user.js`
- `midleware/authMiddleware.js` provides `requireAuth` / `checkUser` guards; `app.get('*', checkUser)` intercepts GETs only, so POST API routes bypass auth
- `/generate_chat` — proxies to OpenAI `gpt-4o-mini` with a hardcoded system prompt that impersonates the owner for the portfolio chat feature; returns `{result}` on success, `{error}` with HTTP 500 on failure. The system prompt contains contact info (phone, email) — keep it in sync with `ContactMe.js`
- `/send_contactme_email` — sends contact form submissions via Gmail SMTP (nodemailer); returns `{success}` or `{error}`
- `/api/pathfind` (planned) — POST proxy to the FastAPI service via native fetch with 5s timeout; passes upstream status/body through, returns 503 `{error}` when the service is down
- Legacy routes: `/SudokuSolver` (auth-protected, EJS), `/PathFindingVisualizer` (EJS), `/oldPortfolio` (EJS)
- `/dare-mighty-things` route is broken (references an undefined `request`) — known, leave unless asked

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

**Pathfinding visualizer** — vanilla JS (`public/`, served at `/PathFindingVisualizer` via `views/PathFindingVisualizerMain.ejs`)
- `PathFindingVisualizer.js` (~1000 lines): prototype-based `Board` (constructor + `Board.prototype.*`) managing a 33×63 grid table, wall/weight drawing, drag of start/target nodes, recursive-setTimeout animation, and a large `toggleButtons()` method that wires all UI. Global instance `initialBoard`; DOM cell ids use the `"row-col"` format
- `PathFindingNode.js`: `Node` constructor; `createMaze.js`: maze generators (stay client-side — they paint walls with animation)
- `PathfindingUnweightedAlgorithm.js` (BFS/DFS) and `PathfindingWeightedAlgorithm.js` (Dijkstra/A*): current client-side algorithms. Known bugs: Dijkstra/A* mark nodes visited at enqueue (incorrect on weighted grids), O(n²) queue sorts
- Dead files: `getNeighbors.js` (never imported), `PathFindingVisualizer.bkp`
- **Migration in progress**: algorithms move to `pathfinding-service/` (Python/FastAPI, internal :8000) with OOP strategy classes (`PathfindingAlgorithm` ABC → BFS/DFS/Dijkstra/AStar), Pydantic schemas, and pytest. The browser will POST grid state (`{algorithm, grid: {height, width, start, target, walls, weights}}`) to `/api/pathfind` and animate the returned `{found, visited_order, path, stats}`. Node ids stay `"row-col"` end-to-end; algorithm names keep the dropdown strings `BFS | DFS | Dijkstra | AStar`

**Other**
- `views/` — EJS templates for the legacy routes
- `DareMightyThings2019-master/` — archived hackathon project (Python Flask), not integrated into the main app

## Notes

- The React frontend has no test suite (`react-scripts test` finds 0 files); verify changes by running the app. The pathfinding service (once landed) has pytest coverage — run `npm run service:test`
- Production build must stay warning-free — unused imports fail this bar
- Mobile inputs must render at ≥16px font size on small screens (e.g. `text-base sm:text-sm`) — iOS Safari auto-zooms the viewport when focusing an input smaller than 16px. Don't fix this with `maximum-scale=1` in the viewport meta; that disables pinch-to-zoom and hurts accessibility
