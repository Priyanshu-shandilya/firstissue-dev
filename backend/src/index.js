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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://firstissue-dev-7yq2.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   Routes
========================= */

app.get('/', (req, res) => {
  res.send('🚀 FirstIssue Dev Backend is running!');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/issues', issuesRouter);
app.use('/api/subscribe', subscribeRouter);

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    startCronJob();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

module.exports = app;