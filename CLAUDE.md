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
tooling: `portfolio` (React dev server, `autoPort`) and `backend` (Express on :3000).

### Tests
```bash
npm test    # pathfinding algorithms + request validation (node:test, no dependencies)
```

### Deployment
There is no CI/CD: merging to `main` does not deploy, and the only automated PR check
is GitGuardian (secret scanning). Production is one long-running process, `npm start`
(Express), kept alive by a process manager (e.g. pm2 or systemd).

## Architecture

This is a single-process app:

**Backend** — Express + Node.js (`app.js`, root, port 3000, Node v20)
- Serves the React build as a static SPA at `/*`
- `config.js` holds secrets (MongoDB URI, JWT secret, OpenAI key, email credentials) — never committed
- MongoDB via Mongoose; auth uses JWT stored in cookies
- `routes/authRoutes.js` → `controllers/authController.js` → `models/user.js`
- `midleware/authMiddleware.js` provides `requireAuth` / `checkUser` guards; `app.get('*', checkUser)` intercepts GETs only, so POST API routes bypass auth
- `/generate_chat` — proxies to OpenAI `gpt-4o-mini`. Body `{prompt, history?}`: `prompt` 1–1000 chars; `history` is up to 6 earlier `{role: user|assistant, content}` turns (≤3000 chars each) so follow-ups have context, else 400. The system prompt is built in `utils/chatPrompt.js` from `portfolio/src/data/content.json` (the same data the site renders) and restricts the bot to William's professional background, forbids invented facts/URLs, and asks for plain Markdown with project links as `#project-<id>` anchors. When `private/resume.pdf` exists (gitignored, override with `RESUME_PATH`; see `utils/resume.js`) the call also offers an `offer_resume_email` tool; a tool call never sends mail, it returns `{result, action: {type: 'send_resume', email}}` and the widget shows a confirm button. Returns `{result}` on success, `{error}` with HTTP 500 on failure, `{error}` with HTTP 429 when rate-limited
- `/send_resume` — emails the resume PDF to `{email}` after the visitor confirms in the chat widget. Fixed body text with no visitor input (so it can't relay spam), reply-to the owner. 400 on a bad address, 404 when the PDF is missing, `{result}` on success. Shares `createTransporter()` (Gmail SMTP) with the contact form
- `/send_contactme_email` — sends contact form submissions via Gmail SMTP (nodemailer); returns `{success}`, `{error}`, or `{error}` with HTTP 429 when rate-limited
- `/api/pathfind` — POST; runs the pathfinding algorithms in-process via `pathfinding/` (see below). Returns `{found, visited_order, path, stats}`, or 422 `{error}` on invalid input
- `POST /solve` (logged-in; increments the user's `solvedSudoku` count) and `POST /guest_solve` — Sudoku solving via the backtracking `SolveBoard()` in `authController.js`. Both reject input that fails `isValidBoardShape()` (9×9 integers 0–9) with a 400 before solving, because `SolveBoard` indexes cells without bounds checks; the frontend caller is `public/script.js`
- Legacy routes: `/SudokuSolver` (auth-protected, EJS), `/PathFindingVisualizer` (EJS), `/oldPortfolio` (EJS)
- `/dare-mighty-things` route is broken (references an undefined `request`) — known, leave unless asked
- Rate limits (`express-rate-limit`, in-memory) all live in `midleware/rateLimiters.js`; blocked requests get `429` + JSON `{error}`:
  - `POST /generate_chat`: 20 per IP / 15 min, 500 site-wide / day (each message is a paid OpenAI call)
  - `POST /send_contactme_email`: 5 per IP / hour, 100 site-wide / day (Gmail SMTP caps daily sends)
  - `POST /send_resume`: 3 sends per IP / hour, 1 per recipient address / day, 50 site-wide / day; failed requests (bad address, SMTP error) don't count
  - `POST /login`: 10 **failed** attempts per IP / 15 min (successful logins don't count)
  - Counters reset on restart and aren't shared between processes
- `TRUST_PROXY` env var: set it to the number of proxy hops when running behind nginx or a load balancer, otherwise every visitor shares the proxy's IP and one limit. Leave it unset with no proxy, or visitors can spoof `X-Forwarded-For` past the limits. An `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` log warning means a proxy is in front

**Frontend** — React (`portfolio/src/`)
- Single-page portfolio with normal scrolling; sections composed in `App.js`: Hero (Cover), About, Experience, Skills, Projects, Contact — plus `ChatWithAI`, a floating chat widget rendered outside the sections
- **Data-driven content**: the text for experience, projects, skills and social links lives in `portfolio/src/data/content.json`, shared by the React sections and the chat assistant's system prompt. Components only map images/logos onto it (by project `id`, logo key, or skill name). To add a job/project/skill, edit `content.json` (and add its image import in the component); don't create new component files. `navLinks` stays in `Header.js`
- Shared building blocks: `SectionHeading.js` (blue heading + underline used by every section), `ProjectCard.js` (featured and compact variants)
- `Header.js` is a sticky nav with scrollspy (IntersectionObserver) and a mobile hamburger menu; section ids in `App.js` must match `navLinks` hrefs
- The chat widget opens via a `window` CustomEvent `'open-chat'` (dispatched by the hero CTA in `Cover.js`)
- `ChatWithAI.js` renders replies with a tiny built-in Markdown renderer (bold, lists, links; React elements, no innerHTML). Links are allowlisted to URLs in `content.json` — anything else renders as plain text. Up to 3 links in a reply also show as chips; `#project-<id>` links jump to the matching `ProjectCard` (highlighted via `:target`) and close the panel on phones. The conversation persists in `sessionStorage` for the tab
- Heavy project GIFs use click-to-play: a `poster` JPEG (first frame, extracted with macOS `sips`) renders until the user clicks play, then the GIF loads. Keep this pattern for any new large media
- Styled with Tailwind CSS; animated with Framer Motion. The accent color `#38BDF8` (sky blue) is hardcoded in arbitrary-value classes throughout — a theme-wide color change means find-and-replace on that hex
- Smooth scrolling is gated behind `prefers-reduced-motion` in `index.css`
- React dev server proxies API calls to `http://localhost:3000` (see `portfolio/package.json` `proxy`)

**Pathfinding visualizer** — the browser owns the grid UI and animation; `pathfinding/` on the server owns the algorithms
- Flow: `public/PathFindingVisualizer.js` → `serializeBoard()` in `public/PathfindingApiClient.js` → `POST /api/pathfind` `{algorithm, grid: {height, width, start, target, walls, weights}}` → `pathfind()` in `pathfinding/index.js` → `{found, visited_order, path, stats}` → the board animates `visited_order` then `path`. Node ids are the DOM cell ids (`"row-col"`) end-to-end; algorithm names are the dropdown strings `BFS | DFS | Dijkstra | AStar`
- `PathFindingVisualizer.js`: prototype-based `Board` managing a 33×63 grid table, wall/weight drawing (keys W / 1–5 → weights 2–10 / R), drag of start/target, recursive-setTimeout animation, and `toggleButtons()`, which locks/unlocks all UI. Its enable branch resets the status bar, so error messages must be written *after* unlocking. The resize slider stores board dims as strings — `serializeBoard()` coerces them
- `PathFindingNode.js`: render state only (`id`, `type`, `weight`, `status`); there is no client-side graph
- `createMaze.js`: maze generation stays client-side. `create_maze(board, style)` with styles `balanced | horizontal | vertical`; `ORIENTATION_RULES` reproduces three original hand-written variants exactly (the asymmetry is intentional). Walls must be pushed in row-major order — that is the animation order

**Pathfinding algorithms** — plain Node, no dependencies (`pathfinding/`, required by `app.js`)
- `algorithms/PathfindingAlgorithm.js`: abstract base class; subclasses set `static algorithmName` and call `PathfindingAlgorithm.register()`, and `getAlgorithm(name)` dispatches. Adding an algorithm = one subclass file in `algorithms/` (required in `algorithms/index.js`) plus a dropdown entry in the EJS view and handler in `toggleButtons()`
- `domain/Grid.js`: `Grid.DIRECTIONS` (right, down, left, up) must stay in this order — it determines BFS/DFS exploration order and therefore the animation; a determinism test guards it. `Position` objects compare by reference in JS, so algorithms key their Maps/Sets on `pos.id`
- Dijkstra/A* use `domain/MinHeap.js` (insertion-order tiebreak for deterministic animation) and settle nodes at pop (the original browser code marked visited at enqueue, which was wrong on weighted grids). `visited_order` is settle order; `path` is `[start..target]` inclusive or `[]`; `path_cost` excludes the start cell
- `validation.js`: request validation (dims 2–100 integers, ids in bounds, weights 2–10, start ≠ target, no wall/weight overlap) → `ValidationError` → 422
- Runs synchronously on the event loop: ~4ms for the UI's largest board (35×70), ~30ms at the 100×100 cap. The cap bounds how long one crafted request can stall the server — keep it low

**Other**
- `views/` — EJS templates for the legacy routes
- `DareMightyThings2019-master/` — archived hackathon project (Python Flask), not integrated into the main app

## Notes

- The React frontend and the vanilla-JS visualizer UI have no test suites (`react-scripts test` finds 0 files); verify changes by running the app. `pathfinding/` has `node:test` coverage (algorithm correctness incl. a weighted regression case, request validation) — run `npm test`
- Express 4 doesn't catch errors thrown in `async` handlers or callbacks, and Node 20 exits on an unhandled rejection — every failure path in a handler must send a response, or one bad request takes the whole server down
- Production build must stay warning-free — unused imports fail this bar
- Contact rate-limit messages must never contain the word "success": `ContactMe.js` colors its alert green when the message includes it, so a 429 message with that word would look like a sent email
- Mobile inputs must render at ≥16px font size on small screens (e.g. `text-base sm:text-sm`) — iOS Safari auto-zooms the viewport when focusing an input smaller than 16px. Don't fix this with `maximum-scale=1` in the viewport meta; that disables pinch-to-zoom and hurts accessibility
- Testing the visualizer in a browser: drive the app's real handlers rather than synthetic DOM events. Hold a key with `window.onkeydown({keyCode})` (W=87 wall, 1–5=49–53 weights, R=82 erase), paint a cell with `cell.onmousedown({preventDefault(){}, target: cell})` then `cell.onmouseup({})`, and drag start/target with mousedown on it → `onmouseenter({target})` on the destination → `onmouseup`. A run is finished when `#show_display_status` stops reading "Board Animating ..."; a full-board BFS/Dijkstra animation takes ~10s, so split long test sequences across calls

## Dependency audits

- Backend: clean as of October 2026 (`npm audit` reports 0 after the package upgrades, including `jsonwebtoken` v9); re-run it before releases
- `portfolio/`: nearly all findings are Create React App build tooling (webpack, jest, babel, dev server), not code shipped to visitors. **Never run `npm audit fix --force` there** — it installs `react-scripts@0.0.0` and breaks the build. The real fix is migrating off CRA (deprecated), e.g. to Vite

## Known open issues (from the October 2026 security audit)

Fixed since the audit: unauthenticated requests crashing the server via the Sudoku endpoints, a stale login cookie crashing `checkUser`, vulnerable backend packages, and missing rate limits on chat, contact and login. Still open:
- Contact-form fields are interpolated into the notification email's HTML unescaped (`app.js`)
- Login's `findOne({email})` accepts MongoDB query operators — coerce `email` to a string
- The JWT cookie lacks `secure` and `sameSite`; logout is a GET; no security headers (e.g. helmet)
- A deliberately hard Sudoku can keep the backtracking solver busy and stall other requests (no step/time cap)
- `PathFindingVisualizerMain.ejs` loads outdated jQuery 3.2.1 and Bootstrap 3.3.7/4.0.0 (known XSS CVEs) from CDNs, and 2 of its 5 CDN tags lack SRI hashes
- Pressing a key while dragging the start/target node throws in the console (`window.onkeydown` calls `.charAt` on a node object)
