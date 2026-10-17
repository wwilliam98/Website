const { rateLimit } = require('express-rate-limit');

// Counters live in process memory: they reset on restart and aren't shared
// between processes. Behind a reverse proxy, set TRUST_PROXY (see app.js) or
// every visitor shares the proxy's IP — and therefore one limit.

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function limiter({ windowMs, limit, message, global = false, skipSuccessfulRequests = false, skipFailedRequests = false }) {
  return rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests,
    skipFailedRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: message },
    // One bucket shared by all visitors, so the cap holds even across many IPs
    ...(global && { keyGenerator: () => 'global' }),
  });
}

// Each message is a paid OpenAI call
const chatLimiters = [
  limiter({ windowMs: 15 * MINUTE, limit: 20,
    message: "You're sending messages too quickly. Please wait a few minutes and try again." }),
  limiter({ windowMs: DAY, limit: 500, global: true,
    message: 'The chat has reached its daily limit. Please try again tomorrow.' }),
];

// Each submission sends an email through Gmail SMTP, which caps daily sends.
// Messages must not contain "success": ContactMe.js colors the alert by that word.
const contactLimiters = [
  limiter({ windowMs: HOUR, limit: 5,
    message: 'Too many messages sent. Please try again in an hour.' }),
  limiter({ windowMs: DAY, limit: 100, global: true,
    message: 'The contact form is busy right now. Please email me directly instead.' }),
];

// Only failed attempts count, so this slows password guessing without
// locking out people who log in normally
const loginLimiter = limiter({ windowMs: 15 * MINUTE, limit: 10, skipSuccessfulRequests: true,
  message: 'Too many failed login attempts. Please try again in 15 minutes.' });

// Each send emails the resume through the same Gmail account; the per-address
// limit stops one inbox from being flooded from many IPs. Only actual sends count,
// so a typo'd address doesn't use up a visitor's quota
const resumeLimiters = [
  limiter({ windowMs: HOUR, limit: 3, skipFailedRequests: true,
    message: "You've requested my résumé a few times already. Please try again in an hour." }),
  rateLimit({
    windowMs: DAY,
    limit: 1,
    skipFailedRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (req) => String(req.body?.email || '').trim().toLowerCase(),
    message: { error: 'My résumé was already sent to that address today. Please check your inbox and spam folder.' },
  }),
  limiter({ windowMs: DAY, limit: 50, global: true, skipFailedRequests: true,
    message: "I can't send more résumés today. Please reach me on LinkedIn instead." }),
];

module.exports = { chatLimiters, contactLimiters, loginLimiter, resumeLimiters };
