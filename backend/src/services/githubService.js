const axios = require('axios');
const Issue = require('../models/Issue');

const GITHUB_API = 'https://api.github.com';

const githubClient = axios.create({
  baseURL: GITHUB_API,
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

/**
 * Fetch a single page of "good first issue" results from GitHub Search API.
 */
async function fetchGoodFirstIssuesPage(page = 1) {
  const response = await githubClient.get('/search/issues', {
    params: {
      q: 'label:"good first issue" is:issue is:open',
      sort: 'created',
      order: 'desc',
      per_page: 30,
      page,
    },
  });
  return response.data;
}

/**
 * Fetch repo metadata (language, stars) for a given full repo name (e.g. "facebook/react").
 */
async function fetchRepoMeta(repoFullName) {
  try {
    const response = await githubClient.get(`/repos/${repoFullName}`);
    return {
      language: response.data.language || null,
      stars: response.data.stargazers_count || 0,
    };
  } catch {
    return { language: null, stars: 0 };
  }
}

/**
 * Main function: fetch up to `maxPages` pages of good first issues,
 * enrich with repo metadata, and upsert into MongoDB.
 */
async function fetchAndStoreIssues(maxPages = 3) {
  console.log(`[GitHub] Starting fetch — ${new Date().toISOString()}`);
  let totalUpserted = 0;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const data = await fetchGoodFirstIssuesPage(page);
      const items = data.items || [];

      if (items.length === 0) break;

      for (const item of items) {
        // item.repository_url is like https://api.github.com/repos/owner/repo
        const repoFullName = item.repository_url.replace(`${GITHUB_API}/repos/`, '');
        const [, repoName] = repoFullName.split('/');

        const meta = await fetchRepoMeta(repoFullName);

        await Issue.findOneAndUpdate(
          { githubId: item.id },
          {
            githubId: item.id,
            title: item.title,
            url: item.html_url,
            repoName,
            repoFullName,
            repoStars: meta.stars,
            language: meta.language,
            labels: item.labels.map((l) => l.name),
            commentsCount: item.comments,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
            fetchedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        totalUpserted++;
      }

      console.log(`[GitHub] Page ${page} — upserted ${items.length} issues`);

      // Respect GitHub rate limit: 30 requests/min for authenticated users
      await delay(1500);
    } catch (err) {
      console.error(`[GitHub] Error on page ${page}:`, err.message);
      break;
    }
  }

  console.log(`[GitHub] Done — total upserted: ${totalUpserted}`);
  return totalUpserted;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { fetchAndStoreIssues };
