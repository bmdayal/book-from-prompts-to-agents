class ValidationError extends Error {
  constructor(details) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.status = 400;
    this.details = details;
  }
}

class DuplicateEmailError extends Error {
  constructor() {
    super('Email already registered');
    this.name = 'DuplicateEmailError';
    this.status = 409;
  }
}

module.exports = { ValidationError, DuplicateEmailError };
