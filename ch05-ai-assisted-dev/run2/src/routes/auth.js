const express = require('express');
const { validate } = require('../middleware/validate');
const { registerSchema } = require('../validators/auth');

function createAuthRouter({ authController }) {
  const router = express.Router();
  router.post('/register', validate(registerSchema), authController.register);
  return router;
}
module.exports = { createAuthRouter };
