const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Subscriber = require('../models/Subscriber');

// POST /api/subscribe
router.post('/', async (req, res) => {
  try {
    const { email, languages = [], frequency = 'daily' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    // Upsert: if email exists, update preferences; otherwise create new
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        email: email.toLowerCase().trim(),
        languages,
        frequency,
        isActive: true,
        unsubscribeToken,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: 'Subscribed successfully!',
      subscriber: {
        email: subscriber.email,
        languages: subscriber.languages,
        frequency: subscriber.frequency,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscribe/unsubscribe?token=xxx
router.get('/unsubscribe', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required' });

    const subscriber = await Subscriber.findOneAndUpdate(
      { unsubscribeToken: token },
      { isActive: false },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ error: 'Invalid unsubscribe token' });
    }

    res.json({ message: `${subscriber.email} has been unsubscribed.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscribe/count
router.get('/count', async (req, res) => {
  try {
    const count = await Subscriber.countDocuments({ isActive: true });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
