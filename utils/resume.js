// The resume the chat assistant can email to visitors (/send_resume). The PDF is
// kept out of git like config.js; drop it at private/resume.pdf (or point
// RESUME_PATH at it). While it's missing, the assistant doesn't offer to send it.
const fs = require('fs');
const path = require('path');

const RESUME_PATH = process.env.RESUME_PATH || path.join(__dirname, '../private/resume.pdf');

const resumeAvailable = () => fs.existsSync(RESUME_PATH);

// Deliberately simple: one @, no spaces, a dot in the domain, within the RFC length cap
const isValidEmail = (email) =>
  typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

module.exports = { RESUME_PATH, resumeAvailable, isValidEmail };
