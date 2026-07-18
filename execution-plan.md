# AI Career Coach — Execution Plan

## Legend
- **→** sequential dependency (must wait)
- **∥** can run in parallel

---

## Phase 0: Prerequisite Setup

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| 0.1 | Create `.env.example` files for backend + frontend | — | Files exist with placeholder keys |
| 0.2 | Push initial commit with `plan.md` + `AGENTS.md` | — | Git log shows clean base |

---

## Group A: Parallel Foundation ║

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| A1 | **Scaffold Backend** — Express + TypeScript + ts-node-dev + Mongoose + Zod + cors + dotenv + folder structure | 0.1 | `npm run dev` starts on :5000 without error |
| A2 | **Scaffold Frontend** — `npx create-next-app@latest` + Tailwind + TanStack Query + Recharts + Inter font + folder structure | 0.1 | `npm run dev` starts on :3000 without error |

---

## Phase 1: Backend Core (sequential →)

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| 1.1 | **MongoDB Connection** — `config/db.ts` reads `MONGODB_URI`, connects via Mongoose, graceful error handling | A1 | Server logs "MongoDB connected" |
| 1.2 | **Models** — User, Item, Skill, Resume, Conversation, CoverLetter schemas | 1.1 | Models compile, no TS errors |
| 1.3 | **Auth System** — Register (hash password), Login (JWT), Google OAuth endpoint, demo login, auth middleware, `/api/auth/me` | 1.2 | `POST /api/auth/register` returns token; `GET /api/auth/me` returns user |
| 1.4 | **CRUD Routes** — Items (GET / POST / DELETE), User profile (GET / PUT), Skills (POST) | 1.2 | All endpoints tested via curl/Postman |
| 1.5 | **AI Service Layer** — OpenAI client wrapper, prompt templates for resume/cover-letter/interview/chat/roadmap, SSE streaming helper | 1.2 | Service functions return structured AI responses |

---

## Phase 2: Frontend Core (parallel groups)

### Group B: Parallel ║

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| B1 | **Layout + Navbar** — RootLayout, Navbar (logged out 3 routes / logged in 5+ routes, sticky, responsive hamburger), Footer | A2 | Navbar renders, toggles mobile menu |
| B2 | **API Client** — TanStack Query setup, axios/fetch wrapper with base URL + auth interceptor, typed API functions | A2 | API calls work with/without token |

### Group C: Auth Pages (sequential →)

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| C1 | **Login Page** — Email/password form, Zod validation, Google OAuth button, Demo Login auto-fill button, error display | B1, B2, 1.3 | User can log in with email or Google |
| C2 | **Register Page** — Registration form, Zod validation, success redirect | C1 | New user can register |
| C3 | **Auth Middleware** — Protect routes, redirect to `/login` if unauthenticated | C2 | Visiting `/dashboard` while logged out redirects |

### Group D: Parallel ║

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| D1 | **Landing Page** — 7+ sections: Hero (60-70vh, animated), Features, Stats (counters), How It Works, Testimonials (carousel), FAQ (accordion), Newsletter CTA | B1 | All sections render, no placeholders |
| D2 | **Explore Page** — Card grid (4-col), skeleton loader, filters (category + skill level), sort (newest/popular), pagination | B1, B2, 1.4 | Cards load with real data, filters work |
| D3 | **Detail Page** — Image, description, key info, specs, related items | B1, B2, 1.4 | Public page loads item by ID |

### Group E: Protected Pages (sequential →)

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| E1 | **Add Item Page** (`/items/add`) — Form: title, shortDesc, fullDesc, price, category, image URL, submit | C3 | Logged-in user can create item |
| E2 | **Manage Items Page** (`/items/manage`) — Table/grid with View + Delete actions | E1 | Items list, delete works |

---

## Phase 3: AI Features (parallel group F ║)

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| F1 | **AI Resume Improver** — Textarea + AI-improved output + regenerate button + length slider | B1, B2, 1.5 | Paste resume → get improved version |
| F2 | **AI Cover Letter Generator** — Form (job title, company, skills) → generated cover letter + copy/download | B1, B2, 1.5 | Generate unique cover letter |
| F3 | **AI Interview Question Generator** — Form (role, experience) → 10 Q&A cards + regenerate | B1, B2, 1.5 | 10 questions appear |
| F4 | **AI Chat Assistant** — Chat UI, SSE streaming, typing indicator, suggested follow-ups, conversation history sidebar, new conversation | B1, B2, 1.5 | Streams response, history persists |
| F5 | **AI Career Roadmap Generator** — Form (current skills, target role, timeline) → visual step roadmap | B1, B2, 1.5 | Roadmap renders as timeline |

---

## Phase 4: Dashboard & Additional Pages (parallel group G ║)

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| G1 | **Dashboard** — Progress chart (Recharts), skill overview, recent activity, quick links to AI tools | C3, 1.4 | Charts render with real data |
| G2 | **Profile Page** — View/edit profile, manage skills list, upload resume | C3 | Skills and profile update |
| G3 | **Additional Pages** — About, Contact, Help, Privacy, Terms | B1 | All pages render, links work |

---

## Phase 5: Polish & Deploy (sequential →)

| # | Task | Depends On | Validation |
|---|------|------------|------------|
| H1 | **Responsive Polish** — Test all pages at 320px, 768px, 1024px, 1440px; fix spacing/alignment | All above | Pages look correct at all breakpoints |
| H2 | **Lint + Typecheck** — Fix all TS errors and lint warnings | H1 | `npm run lint` and `npm run typecheck` pass in both packages |
| H3 | **Deploy Backend** — Push to Render/Railway, configure env vars, verify API works | H2 | Public API URL returns `{ success: true }` |
| H4 | **Deploy Frontend** — Push to Vercel, configure `NEXT_PUBLIC_API_URL`, verify live | H3 | Live site loads, API calls succeed |
| H5 | **Final E2E Test** — Walk through: Landing → Register → Login → Explore → Detail → Add Item → AI Features → Dashboard → Logout | H4 | Complete flow works |

---

## Parallel Execution Map

```
Time →
──────────────────────────────────────────────────────────────────
 0.1 ─── 0.2
          │
          ├── A1 ─── 1.1 ─── 1.2 ─── 1.3 ─── 1.4 ─── 1.5
          │                                              │
          ├── A2 ─── B1 ─┬─ C1 ─── C2 ─── C3            │
                         │    │                          │
                         │    └── D1 ─── D2 ─── D3       │
                         │                               │
                         └── E1 ─── E2                   │
                                                         │
               F1 ─── F2 ─── F3 ─── F4 ─── F5  ←────────┘
               │
               G1 ─── G2 ─── G3
               │
               H1 ─── H2 ─── H3 ─── H4 ─── H5
```
