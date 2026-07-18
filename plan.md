# AI Career Coach — Build Plan

## 1. Project Structure

```
ai-career-coach/
├── frontend/          # Next.js + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   └── public/
├── backend/           # Node.js + Express + TypeScript + MongoDB (deployed on Render/Railway)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   └── uploads/
└── plan.md
```

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| State / Data Fetching | TanStack Query |
| Charts | Recharts |
| Backend | Express.js + TypeScript |
| Database | MongoDB Atlas (connection URI provided by user) + Mongoose |
| Auth | JWT + Google OAuth |
| AI Provider | OpenAI (GPT-4o) + Gemini fallback |
| File Upload | Multer + Cloudinary (optional) |
| Validation | Zod (frontend + backend) |

## 3. Design System

- **Primary colors:** Indigo (#4F46E5), Emerald (#10B981), Amber (#F59E0B)
- **Neutral:** Slate gray palette
- **Consistent card:** 16px border-radius, equal heights, 4-col grid desktop
- **Font:** Inter (via next/font)

## 4. Pages & Routes

### Public Routes (logged out)
| Route | Page |
|-------|------|
| `/` | Landing page (7+ sections) |
| `/login` | Login (email/password + Google OAuth + demo auto-fill) |
| `/register` | Register (validation + error handling) |
| `/explore` | Browse/search all career resources |
| `/items/:id` | Detail page for a resource |
| `/about` | About us |
| `/contact` | Contact form |

### Protected Routes (logged in)
| Route | Page |
|-------|------|
| `/dashboard` | User dashboard with progress chart |
| `/profile` | User profile, skills, resume management |
| `/items/add` | Add a career resource |
| `/items/manage` | Table/grid of user's items with View/Delete |
| `/ai/cover-letter` | AI Cover Letter Generator |
| `/ai/interview` | AI Interview Question Generator |
| `/ai/resume` | AI Resume Improvement |
| `/ai/chat` | AI Career Chat Assistant |
| `/ai/roadmap` | AI Career Roadmap Generator |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/help` | Help / support |

## 5. Navbar Routes

- **Logged out (3+):** Home, Explore, About, Login/Register
- **Logged in (5+):** Dashboard, Explore, AI Tools (dropdown), My Items, Profile, Logout

## 6. Landing Page Sections (7+)

1. **Navbar** — full-width, sticky, responsive hamburger
2. **Hero** — 60-70vh, animated headline, CTA, interactive element
3. **Features** — 3-4 feature cards (AI Resume, Interview Prep, Career Roadmap, Chat)
4. **Statistics** — animated counters (users, resumes improved, interviews generated)
5. **How It Works** — 3-step visual flow
6. **Testimonials** — carousel of user reviews
7. **Pricing / Plans** — tiered cards
8. **FAQ** — accordion
9. **Newsletter** — email subscribe CTA
10. **Footer** — working links, contact, social

## 7. Core Listing / Cards

- Resource cards with: image, title, short desc, meta (rating, date, category), "View Details" button
- Equal height/width, same radius, 4 per row desktop
- Skeleton loader during fetch

## 8. Filtering & Pagination (Explore Page)

- **Filters:** Category (dropdown), Skill level, Price range
- **Sort:** Newest, Popular, Rating
- **Pagination:** Traditional page numbers + page size selector

## 9. Authentication

- JWT-based with refresh tokens
- Login/Register forms with Zod validation
- Google OAuth (next-auth or custom)
- Demo login: pre-filled credentials with one click
- Middleware to protect routes, redirect to `/login`

## 10. AI Features

### A. AI Content Generator
- **AI Resume Improver** — user pastes resume, AI suggests improvements
- **AI Cover Letter Generator** — user inputs job title, company, skills → AI generates tailored cover letter
- **AI Interview Question Generator** — user inputs role, experience → AI generates 10 questions with answers
- Adjustable output length, regenerate button, custom prompt templates

### B. AI Chat Assistant
- Conversational career coach
- Remembers conversation history (stored in MongoDB)
- Streaming responses (SSE)
- Suggested follow-up prompts
- Typing indicators

### C. AI Career Roadmap Generator
- User inputs current skills, target role, timeline
- AI generates step-by-step learning/career roadmap
- Visual timeline output

### D. AI Resume Score & Analysis (bonus)
- Upload resume → AI scores it across categories
- Provides improvement suggestions

## 11. API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
GET    /api/auth/me
POST   /api/auth/demo

GET    /api/items
GET    /api/items/:id
POST   /api/items
DELETE /api/items/:id

GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/skills
POST   /api/users/resume

POST   /api/ai/cover-letter
POST   /api/ai/interview-questions
POST   /api/ai/improve-resume
POST   /api/ai/chat          (SSE streaming)
POST   /api/ai/roadmap
POST   /api/ai/analyze-resume

GET    /api/conversations
GET    /api/conversations/:id
POST   /api/conversations
```

## 12. Database Models (MongoDB/Mongoose)

- **User** — name, email, password, googleId, role, createdAt
- **Item** — title, shortDesc, fullDesc, price, category, image, rating, createdBy
- **Skill** — userId, name, level, category
- **Resume** — userId, content, fileUrl, aiScore, suggestions
- **Conversation** — userId, messages[{role, content}], title, createdAt
- **CoverLetter** — userId, jobTitle, company, content, createdAt

## 13. Implementation Order

| Step | Days | What |
|------|------|------|
| 1 | 1 | Project scaffolding, folder structure, package setup |
| 2 | 1 | MongoDB models, Express server, auth (JWT + Google) |
| 3 | 1 | Frontend setup: Next.js, Tailwind, TanStack Query, layout, navbar |
| 4 | 1 | Auth pages (login, register, Google OAuth, demo login) |
| 5 | 1 | Landing page (hero, features, stats, testimonials, FAQ, footer) |
| 6 | 1 | Explore page (cards, filters, pagination), Detail page |
| 7 | 1 | Protected routes: Add Item, Manage Items |
| 8 | 1 | Dashboard with Recharts progress chart |
| 9 | 2 | AI Content Generator (resume, cover letter, interview questions) |
| 10 | 2 | AI Chat Assistant (streaming, history, follow-up prompts) |
| 11 | 1 | AI Roadmap Generator, AI Resume Analyzer |
| 12 | 1 | Additional pages (About, Contact, Help, Privacy, Terms) |
| 13 | 1 | Responsive polish, edge cases, error handling, final testing |

## 14. Deployment & Infrastructure

- **Frontend:** Vercel (connects to backend API via `NEXT_PUBLIC_API_URL`)
- **Backend (API Server):** Render or Railway
- **Database:** MongoDB Atlas
  - User provides the `MONGODB_URI` connection string
  - Backend uses Mongoose to connect at startup
- **Environment Variables:**
  - `MONGODB_URI` — user's Atlas connection string
  - `JWT_SECRET` — server-side secret for token signing
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
  - `OPENAI_API_KEY` — AI provider key
  - `NEXT_PUBLIC_API_URL` — points to deployed backend URL (e.g. `https://api.onrender.com`)
