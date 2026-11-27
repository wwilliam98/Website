# Build the React site in one stage, then ship only what the server needs.
# Secrets (config.js) and the resume PDF are mounted at runtime, never baked in.

FROM node:22-bookworm-slim AS frontend
WORKDIR /app/portfolio
COPY portfolio/package.json portfolio/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY portfolio/ ./
RUN npm run build

FROM node:22-bookworm-slim AS backend-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=backend-deps /app/node_modules ./node_modules
COPY package.json app.js ./
COPY controllers ./controllers
COPY midleware ./midleware
COPY models ./models
COPY routes ./routes
COPY utils ./utils
COPY pathfinding ./pathfinding
COPY public ./public
COPY views ./views
# The chat assistant's system prompt reads this at runtime (utils/chatPrompt.js)
COPY portfolio/src/data/content.json ./portfolio/src/data/content.json
COPY --from=frontend /app/portfolio/build ./portfolio/build
USER node
EXPOSE 3000
CMD ["node", "app.js"]
