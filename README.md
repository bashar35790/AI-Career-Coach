# AI Career Coach

> Accelerate your career with AI-powered resume analysis, interview practice, cover letter generation, and personalized career roadmaps.

**Live Site:** [https://ai-career-coach-bashar.vercel.app](https://ai-career-coach-bashar.vercel.app)
**API:** [https://ai-career-coach-xhcp.onrender.com/api](https://ai-career-coach-xhcp.onrender.com/api)

---

## Admin Credentials

| Role  | Email              | Password    |
|-------|--------------------|-------------|
| Admin | admin@example.com  | password123 |
| Demo  | demo@example.com   | password123 |

---

## Features

- **AI Resume Improver** — Paste your resume and get AI-powered suggestions to strengthen content, formatting, and impact.
- **Cover Letter Generator** — Generate tailored, professional cover letters for any job role and company in seconds.
- **Interview Question Generator** — Practice with realistic AI-generated interview questions and sample answers tailored to your target role and experience level.
- **AI Chat Assistant** — Get career advice through an interactive AI chat with SSE streaming, conversation history, and suggested follow-ups.
- **Career Roadmap Generator** — Create personalized, step-by-step career roadmaps based on your current skills and target role.
- **Explore Courses** — Browse a rich catalog of courses and resources with category filters, sorting, and pagination.
- **Dashboard & Progress Tracking** — View activity trends, skill overview, and quick-access links to all AI tools from one dashboard.
- **Skill Management** — Add, categorize, and track your skills with proficiency levels.
- **Resume Upload & Scoring** — Upload your resume and receive an AI-generated score with actionable improvement suggestions.
- **Secure Authentication** — Email/password registration and login with JWT tokens, plus Google OAuth support.

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, TanStack Query, Recharts |
| Backend  | Express.js, TypeScript, Mongoose, Zod           |
| AI       | Google Gemini API (with fallback strategy)      |
| Auth     | JWT tokens + Google OAuth                       |
| Database | MongoDB Atlas                                   |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/bashar35790/AI-Career-Coach.git
cd AI-Career-Coach

# Backend setup
cd backend
cp .env.example .env    # Configure your environment variables
npm install
npm run dev             # http://localhost:5000

# Frontend setup (in a new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev             # http://localhost:3000
```

---

## Environment Variables

### Backend (.env)

| Variable            | Description                          |
|---------------------|--------------------------------------|
| `PORT`              | Server port (default: 5000)          |
| `MONGODB_URI`       | MongoDB connection string            |
| `JWT_SECRET`        | JWT signing secret                   |
| `JWT_EXPIRES_IN`    | Token expiration (e.g. 7d)           |
| `GOOGLE_CLIENT_ID`  | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret        |
| `GEMINI_API_KEY`    | Google Gemini API key                |
| `FRONTEND_URL`      | Frontend URL (for CORS)              |

### Frontend (.env.local)

| Variable                  | Description                    |
|---------------------------|--------------------------------|
| `NEXT_PUBLIC_API_URL`     | Backend API base URL           |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID    |

---

## Available Scripts

### Backend
```bash
npm run dev       # Start dev server with hot reload
npm run build     # Compile TypeScript
npm run start     # Start production server
npm run typecheck # Run TypeScript type checking
npm run seed      # Seed database with sample data
```

### Frontend
```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm run typecheck # Run TypeScript type checking
npm run lint      # Run ESLint
```
