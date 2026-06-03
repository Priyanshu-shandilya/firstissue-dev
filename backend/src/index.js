const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { startCronJob } = require('./jobs/fetchIssues');

const issuesRouter = require('./routes/issues');
const subscribeRouter = require('./routes/subscribe');

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   Middleware
========================= */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   Routes
========================= */

// Home Route
app.get('/', (req, res) => {
  res.send('🚀 FirstIssue Dev Backend is running!');
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/issues', issuesRouter);
app.use('/api/subscribe', subscribeRouter);

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Start Express Server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Start Cron Job
    startCronJob();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

module.exports = app;