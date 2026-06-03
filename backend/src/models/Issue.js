const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    githubId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    repoName: { type: String, required: true },
    repoFullName: { type: String, required: true },
    repoStars: { type: Number, default: 0 },
    language: { type: String, default: null },
    labels: [{ type: String }],
    commentsCount: { type: Number, default: 0 },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'dbCreatedAt', updatedAt: 'dbUpdatedAt' } }
);

// Index for fast language-based queries
issueSchema.index({ language: 1, repoStars: -1 });

module.exports = mongoose.model('Issue', issueSchema);
