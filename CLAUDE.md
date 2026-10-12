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
CRA's port prompt. `.claude/launch.json` defines launch configs for browser-preview
tooling: `portfolio` (React dev server, `autoPort`), `backend` (Express on :3000) and
`pathfinding-service` (uvicorn on :8000).

### Pathfinding service (pathfinding-service/)
Python/FastAPI microservice that computes all paths for `/PathFindingVisualizer`.
It must be running for Visualize to work; otherwise the page shows
"Pathfinding service unavailable".
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
- `/api/pathfind` — POST proxy to the FastAPI service (`PATHFINDING_SERVICE_URL`, default `http://localhost:8000`) via native fetch with 5s timeout; passes upstream status/body through (including 422 validation errors), returns 503 `{error}` when the service is down
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

**Pathfinding visualizer** — the browser owns the grid UI and animation; the Python service owns the algorithms
- Flow: `public/PathFindingVisualizer.js` → `serializeBoard()` in `public/PathfindingApiClient.js` → `POST /api/pathfind` `{algorithm, grid: {height, width, start, target, walls, weights}}` → Express proxy → FastAPI → `{found, visited_order, path, stats}` → the board animates `visited_order` then `path`. Node ids are the DOM cell ids (`"row-col"`) end-to-end; algorithm names are the dropdown strings `BFS | DFS | Dijkstra | AStar`
- `PathFindingVisualizer.js`: prototype-based `Board` managing a 33×63 grid table, wall/weight drawing (keys W / 1–5 → weights 2–10 / R), drag of start/target, recursive-setTimeout animation, and `toggleButtons()`, which locks/unlocks all UI. Its enable branch resets the status bar, so error messages must be written *after* unlocking. The resize slider stores board dims as strings — `serializeBoard()` coerces them
- `PathFindingNode.js`: render state only (`id`, `type`, `weight`, `status`); there is no client-side graph
- `createMaze.js`: maze generation stays client-side. `create_maze(board, style)` with styles `balanced | horizontal | vertical`; `ORIENTATION_RULES` reproduces three original hand-written variants exactly (the asymmetry is intentional). Walls must be pushed in row-major order — that is the animation order

**Pathfinding service** — Python/FastAPI (`pathfinding-service/`, internal :8000, binds localhost only)
- `app/algorithms/base.py`: `PathfindingAlgorithm` ABC; subclasses with a class-level `name` auto-register via `__init_subclass__`, and `get_algorithm(name)` dispatches. Adding an algorithm = one subclass file in `app/algorithms/` (imported in its `__init__.py`) plus a dropdown entry in the EJS view and handler in `toggleButtons()`
- `app/domain/grid.py`: `Grid.DIRECTIONS` (right, down, left, up) must stay in this order — it determines BFS/DFS exploration order and therefore the animation; a determinism test guards it
- Dijkstra/A* use `heapq` and settle nodes at pop (the old JS marked visited at enqueue, which was wrong on weighted grids). `visited_order` is settle order; `path` is `[start..target]` inclusive or `[]`; `path_cost` excludes the start cell
- `app/schemas.py`: Pydantic validation (dims 2–200, ids in bounds, weights 2–10, start ≠ target, no wall/weight overlap) → 422 on bad input

**Other**
- `views/` — EJS templates for the legacy routes
- `DareMightyThings2019-master/` — archived hackathon project (Python Flask), not integrated into the main app

## Notes

- The React frontend and the vanilla-JS visualizer have no test suites (`react-scripts test` finds 0 files); verify changes by running the app. The pathfinding service has pytest coverage (algorithm correctness incl. a weighted regression case, API validation) — run `npm run service:test`
- Express 4 doesn't catch errors thrown in `async` handlers or callbacks, and Node 20 exits on an unhandled rejection — every failure path in a handler must send a response, or one bad request takes the whole server down
- Production build must stay warning-free — unused imports fail this bar
- Mobile inputs must render at ≥16px font size on small screens (e.g. `text-base sm:text-sm`) — iOS Safari auto-zooms the viewport when focusing an input smaller than 16px. Don't fix this with `maximum-scale=1` in the viewport meta; that disables pinch-to-zoom and hurts accessibility
