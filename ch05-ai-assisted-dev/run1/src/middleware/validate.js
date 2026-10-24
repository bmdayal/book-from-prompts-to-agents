const { ValidationError } = require('../errors');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { email, password, name } = body;
  const details = [];

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim()) || email.length > 254) {
    details.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (typeof password !== 'string') {
    details.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 8 || password.length > 72) {
    // bcrypt only uses the first 72 bytes
    details.push({ field: 'password', message: 'Password must be 8 to 72 characters' });
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    details.push({ field: 'password', message: 'Password must contain a letter and a digit' });
  }

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0 || name.length > 100)) {
    details.push({ field: 'name', message: 'Name must be a non-empty string up to 100 characters' });
  }

  if (details.length) return next(new ValidationError(details));
  next();
}

module.exports = { validateRegistration };
