const cron = require('node-cron');
const { fetchAndStoreIssues } = require('../services/githubService');
const { sendAllDigests } = require('../services/emailService');

/**
 * Runs every 24 hours at midnight UTC.
 * Schedule format: second minute hour day month weekday
 * '0 0 * * *' = At 00:00 every day
 */
function startCronJob() {
  console.log('[Cron] Scheduler started — will run every 24 hours at midnight UTC');

  // Run immediately on startup so DB is populated right away
  runFetchAndNotify();

  // Then schedule every 24 hours
  cron.schedule('0 0 * * *', () => {
    console.log('[Cron] Triggered at:', new Date().toISOString());
    runFetchAndNotify();
  });
}

async function runFetchAndNotify() {
  try {
    console.log('[Cron] Fetching issues from GitHub...');
    await fetchAndStoreIssues(3); // fetch 3 pages = up to 150 issues

    console.log('[Cron] Sending email digests...');
    await sendAllDigests();

    console.log('[Cron] Cycle complete ✅');
  } catch (err) {
    console.error('[Cron] Error during cycle:', err.message);
  }
}

module.exports = { startCronJob };
