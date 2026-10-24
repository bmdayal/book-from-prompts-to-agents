class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR', details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
class ValidationError extends AppError {
  constructor(details) { super('Invalid input', 400, 'VALIDATION_ERROR', details); }
}
class ConflictError extends AppError {
  constructor(message = 'Email already registered') { super(message, 409, 'EMAIL_TAKEN'); }
}
module.exports = { AppError, ValidationError, ConflictError };
