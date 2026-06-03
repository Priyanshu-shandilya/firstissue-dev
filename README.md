# FirstIssue.dev

A platform to discover GitHub's "good first issues" with email notifications via Nodemailer, subscription management, and automated API calls via Cron Jobs every 24 hours.

## 📁 Project Structure

```
firstissue/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic (GitHub API, Email)
│   │   ├── models/          # MongoDB models
│   │   └── jobs/            # Cron job scheduler
│   ├── .env.example
│   └── package.json
├── frontend/                # React + Vite app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   └── styles/          # Global CSS
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- GitHub Personal Access Token
- Gmail account (for Nodemailer) or SMTP credentials

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

**Backend** — copy `.env.example` to `.env` and fill in:
```bash
cp backend/.env.example backend/.env
```

**Frontend** — copy `.env.example` to `.env`:
```bash
cp frontend/.env.example frontend/.env
```

---

### 3. Run in Development

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

### 4. How the Cron Job Works

- On server start, a `node-cron` job is scheduled to run **every 24 hours** at midnight UTC
- It calls the GitHub Search API: `GET /search/issues?q=label:"good first issue"+state:open`
- Results are upserted into MongoDB
- After fetching, it queries all subscribers and sends digest emails via Nodemailer

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Email | Nodemailer (Gmail SMTP) |
| Scheduler | node-cron |
| GitHub Data | GitHub REST API v3 |

---

## 📬 Email Digest Flow

1. User enters email + selects languages on the frontend
2. `POST /api/subscribe` saves subscriber to MongoDB
3. Cron fires every 24h → fetches fresh issues → filters by subscriber preferences → sends email via Nodemailer
4. Each email contains up to 10 matching issues with links to GitHub
