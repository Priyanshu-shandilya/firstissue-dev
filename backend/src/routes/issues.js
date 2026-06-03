const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// GET /api/issues
// Query params: language, page, limit
router.get('/', async (req, res) => {
  try {
    const { language, page = 1, limit = 20 } = req.query;

    const query = {};
    if (language && language !== 'all') {
      // "docs" is a special filter for issues labelled documentation
      if (language === 'docs') {
        query.labels = { $in: ['documentation', 'docs'] };
      } else {
        query.language = { $regex: new RegExp(`^${language}$`, 'i') };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .sort({ repoStars: -1, fetchedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Issue.countDocuments(query),
    ]);

    res.json({
      issues,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/issues/stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const repos = await Issue.distinct('repoFullName');
    const languages = await Issue.distinct('language');

    res.json({
      totalIssues: total,
      totalRepos: repos.length,
      languages: languages.filter(Boolean),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
