# 🛠 Complete VS Code Setup Guide — FirstIssue.dev

---

## STEP 1 — Install Prerequisites

Open a terminal (or VS Code integrated terminal) and check you have these installed:

```bash
node -v      # Should print v18 or higher
npm -v       # Should print 8 or higher
mongod --version   # Should print a MongoDB version
```

If Node.js is missing → download from https://nodejs.org  
If MongoDB is missing → download from https://www.mongodb.com/try/download/community

---

## STEP 2 — Open Project in VS Code

1. Copy the `firstissue/` folder to wherever you keep your projects (e.g. `~/Documents/firstissue`)
2. Open VS Code
3. Click **File → Open Folder** → select the `firstissue/` folder
4. You should see two folders: `backend/` and `frontend/`

---

## STEP 3 — Get a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `firstissue-dev`
4. Select scope: ✅ **public_repo** (under "repo")
5. Click **"Generate token"**
6. **Copy the token now** — you won't see it again!

---

## STEP 4 — Set Up Gmail App Password (for Nodemailer)

> If you have 2-Factor Authentication on Gmail (recommended):

1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail** | Select device: **Other** → type "firstissue"
3. Click **Generate** → Copy the 16-character password

> If you don't have 2FA, just use your normal Gmail password (less secure).

---

## STEP 5 — Configure Backend Environment

1. In VS Code's Explorer panel, expand `backend/`
2. Right-click `.env.example` → **Copy** → **Paste** in same folder → rename to `.env`
3. Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/firstissue
GITHUB_TOKEN=ghp_paste_your_token_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_16char_app_password
FRONTEND_URL=http://localhost:5173
```

4. Save the file (**Ctrl+S** / **Cmd+S**)

---

## STEP 6 — Configure Frontend Environment

1. In VS Code's Explorer, expand `frontend/`
2. Right-click `.env.example` → **Copy** → **Paste** → rename to `.env`
3. Open it — it should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Save the file

---

## STEP 7 — Install Dependencies

Open VS Code's integrated terminal:  
**View → Terminal** (or press `` Ctrl+` ``)

### Install backend packages:
```bash
cd backend
npm install
```
You'll see packages like express, mongoose, nodemailer, node-cron downloading.

### Install frontend packages:
```bash
cd ../frontend
npm install
```
You'll see React, Vite, Tailwind CSS downloading.

---

## STEP 8 — Start MongoDB

Open a **new terminal tab** in VS Code (click the **+** icon in the terminal panel):

```bash
mongod
```

You should see:
```
{"msg":"Waiting for connections","attr":{"port":27017}}
```

Keep this terminal open — MongoDB must be running.

> **On Windows**: MongoDB might be running as a Windows Service already.  
> Check: `net start MongoDB` or open Services and look for MongoDB.

> **On Mac with Homebrew**: `brew services start mongodb-community`

---

## STEP 9 — Run the Backend

Open another **new terminal tab** and run:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
[Cron] Scheduler started — will run every 24 hours at midnight UTC
✅ Nodemailer SMTP connection verified
[GitHub] Starting fetch — 2026-06-03T...
[GitHub] Page 1 — upserted 50 issues
```

> The cron job runs immediately on startup to populate the database.  
> First run may take 1-2 minutes as it fetches from GitHub.

---

## STEP 10 — Run the Frontend

Open another **new terminal tab** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

---

## STEP 11 — Open the App

Open your browser and go to:  
👉 **http://localhost:5173**

You should see the FirstIssue.dev homepage with:
- Stats bar (issues, repos, subscribers)
- Filter buttons (All, Python, JavaScript, Rust, etc.)
- Issue cards fetched from GitHub
- Email subscription form at the bottom

---

## STEP 12 — Test the Subscription

1. Scroll to the bottom of the page
2. Toggle which languages you want (Python, JavaScript, etc.)
3. Enter your email address
4. Select "Daily digest" or "Weekly digest"
5. Click **Subscribe**
6. You'll get a confirmation message

To verify it was saved to MongoDB, in VS Code terminal:
```bash
mongosh
use firstissue
db.subscribers.find()
```

---

## How the Cron Job Works

Every 24 hours at midnight UTC, the server automatically:
1. Calls `GET https://api.github.com/search/issues?q=label:"good first issue"+state:open`
2. Fetches repo metadata (language, stars) for each issue
3. Upserts all issues into MongoDB
4. Queries all active subscribers
5. Sends each subscriber a personalized email digest via Nodemailer

You can watch it run in the backend terminal logs.

---

## Project File Map

```
firstissue/
├── backend/
│   ├── src/
│   │   ├── index.js              ← Entry point, connects DB & starts server
│   │   ├── jobs/
│   │   │   └── fetchIssues.js    ← Cron job (runs every 24h)
│   │   ├── models/
│   │   │   ├── Issue.js          ← MongoDB schema for GitHub issues
│   │   │   └── Subscriber.js     ← MongoDB schema for email subscribers
│   │   ├── routes/
│   │   │   ├── issues.js         ← GET /api/issues, GET /api/issues/stats
│   │   │   └── subscribe.js      ← POST /api/subscribe, GET /api/subscribe/unsubscribe
│   │   └── services/
│   │       ├── githubService.js  ← GitHub API calls & DB upsert logic
│   │       └── emailService.js   ← Nodemailer digest builder & sender
│   ├── .env                      ← Your secrets (never commit this!)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx              ← React entry point
│   │   ├── App.jsx               ← Root component + routing
│   │   ├── api.js                ← Axios API helper
│   │   ├── styles/
│   │   │   └── index.css         ← Tailwind CSS directives
│   │   ├── components/
│   │   │   ├── Header.jsx        ← Top nav with logo & cron badge
│   │   │   ├── StatsBar.jsx      ← Issues / repos / subscribers stats
│   │   │   ├── FilterBar.jsx     ← Language filter buttons
│   │   │   ├── IssueCard.jsx     ← Single issue card
│   │   │   ├── IssuesList.jsx    ← List of issues with pagination
│   │   │   └── SubscribeForm.jsx ← Email subscription form
│   │   └── pages/
│   │       ├── HomePage.jsx      ← Main page
│   │       └── UnsubscribePage.jsx ← Handles unsubscribe links from emails
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Recommended VS Code Extensions

Install these for the best experience:

| Extension | ID |
|---|---|
| ESLint | dbaeumer.vscode-eslint |
| Prettier | esbenp.prettier-vscode |
| Tailwind CSS IntelliSense | bradlc.vscode-tailwindcss |
| MongoDB for VS Code | mongodb.mongodb-vscode |
| REST Client (test APIs) | humao.rest-client |
| GitLens | eamodio.gitlens |

Install via VS Code: **Ctrl+Shift+X** → search each name → click Install

---

## Common Errors & Fixes

| Error | Fix |
|---|---|
| `MongoServerError: connect ECONNREFUSED` | MongoDB isn't running. Run `mongod` in a terminal |
| `GITHUB_TOKEN` not working | Make sure the token has `public_repo` scope and isn't expired |
| Email not sending | Double-check Gmail App Password; make sure `EMAIL_USER` matches the Gmail account |
| `VITE_API_URL` undefined | Make sure you created `frontend/.env` (not just `.env.example`) |
| Port 5000 already in use | Change `PORT=5001` in `backend/.env` and `VITE_API_URL=http://localhost:5001/api` in `frontend/.env` |
