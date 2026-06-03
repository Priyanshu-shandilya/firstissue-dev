const nodemailer = require('nodemailer');
const Issue = require('../models/Issue');
const Subscriber = require('../models/Subscriber');

// ─── Transporter ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Verify the SMTP connection on startup.
 */
async function verifyMailer() {
  try {
    await transporter.verify();
    console.log('✅ Nodemailer SMTP connection verified');
  } catch (err) {
    console.warn('⚠️  Nodemailer SMTP verification failed:', err.message);
  }
}

/**
 * Build a plain HTML email digest for the given issues.
 */
function buildDigestHtml(issues, subscriberEmail, unsubscribeToken) {
  const unsubUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?token=${unsubscribeToken}`;

  const rows = issues
    .map(
      (issue) => `
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
          <a href="${issue.url}" style="font-size:15px; font-weight:600; color:#1a8a5a; text-decoration:none;">
            ${issue.title}
          </a>
          <div style="margin-top:6px; font-size:13px; color:#666;">
            <strong>${issue.repoFullName}</strong>
            ${issue.language ? `&nbsp;·&nbsp;${issue.language}` : ''}
            &nbsp;·&nbsp;⭐ ${issue.repoStars.toLocaleString()}
            &nbsp;·&nbsp;💬 ${issue.commentsCount} comments
          </div>
          <div style="margin-top:6px;">
            ${issue.labels.map((l) => `<span style="background:#e1f5ee;color:#0f6e56;padding:2px 8px;border-radius:999px;font-size:11px;margin-right:4px;">${l}</span>`).join('')}
          </div>
        </td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07);">
            
            <!-- Header -->
            <tr>
              <td style="background:#1a8a5a;padding:28px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">🌱 Your Good First Issues Digest</h1>
                <p style="color:#a8f0d2;margin:8px 0 0;font-size:14px;">
                  ${issues.length} fresh issues curated for you · ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9f9f9;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
                <p style="font-size:12px;color:#999;margin:0;">
                  You're receiving this because you subscribed at FirstIssue.dev<br/>
                  <a href="${unsubUrl}" style="color:#1a8a5a;">Unsubscribe</a>
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Send a digest email to a single subscriber.
 */
async function sendDigestEmail(subscriber) {
  // Build query: filter by subscriber's language preferences
  const query = { fetchedAt: { $gte: new Date(Date.now() - 25 * 60 * 60 * 1000) } };
  if (subscriber.languages && subscriber.languages.length > 0) {
    query.language = { $in: subscriber.languages };
  }

  const issues = await Issue.find(query).sort({ repoStars: -1 }).limit(10);

  if (issues.length === 0) {
    console.log(`[Email] No matching issues for ${subscriber.email} — skipping`);
    return;
  }

  const html = buildDigestHtml(issues, subscriber.email, subscriber.unsubscribeToken);

  await transporter.sendMail({
    from: `"FirstIssue.dev" <${process.env.EMAIL_USER}>`,
    to: subscriber.email,
    subject: `🌱 ${issues.length} Good First Issues for You — ${new Date().toLocaleDateString()}`,
    html,
  });

  // Update lastEmailSentAt
  await Subscriber.findByIdAndUpdate(subscriber._id, { lastEmailSentAt: new Date() });
  console.log(`[Email] Sent digest to ${subscriber.email} (${issues.length} issues)`);
}

/**
 * Send digests to all active subscribers.
 */
async function sendAllDigests() {
  console.log('[Email] Starting digest send...');
  const subscribers = await Subscriber.find({ isActive: true });

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      await sendDigestEmail(sub);
      sent++;
    } catch (err) {
      console.error(`[Email] Failed for ${sub.email}:`, err.message);
      failed++;
    }

    // Small delay to avoid SMTP rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`[Email] Done — sent: ${sent}, failed: ${failed}`);
}

module.exports = { sendAllDigests, verifyMailer };
