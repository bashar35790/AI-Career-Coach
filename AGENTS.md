# AI Career Coach — AGENTS.md

## Project structure
- `frontend/` — Next.js 14+ App Router, TypeScript, Tailwind CSS
- `backend/` — Express.js, TypeScript, MongoDB via Mongoose

## Setup
```bash
# Install all dependencies
cd frontend && npm install
cd backend && npm install

# Required env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

## Development commands
```bash
# Frontend (http://localhost:3000)
cd frontend && npm run dev

# Backend (http://localhost:5000)
cd backend && npm run dev

# Typecheck both
cd frontend && npm run typecheck
cd backend && npm run typecheck

# Lint
cd frontend && npm run lint
cd backend && npm run lint
```

## Architecture
- **Frontend** calls backend at `NEXT_PUBLIC_API_URL` (env var)
- **MongoDB** hosted on Atlas — user provides `MONGODB_URI`
- **Auth** JWT tokens + Google OAuth
- **AI** OpenAI GPT-4o via backend endpoints (SSE for chat)

## Key conventions
- **UI:** 3 primary colors max (Indigo, Emerald, Amber), consistent 16px radius cards
- **Cards:** equal height, 4-col grid desktop, skeleton loader while loading
- **No placeholder content** — every string must be real data or loading state
- **Forms** validated with Zod (both client + server)
- **API responses** follow `{ success: boolean, data?: ..., error?: string }` pattern

## Workflow
1. `lint` → `typecheck` before commits
2. Backend dev server must be running before testing frontend features
3. Protected routes redirect to `/login` if unauthenticated
4. AI features require valid `OPENAI_API_KEY` in backend `.env`
