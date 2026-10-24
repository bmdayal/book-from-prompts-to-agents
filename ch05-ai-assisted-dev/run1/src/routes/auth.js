const express = require('express');
const { validateRegistration } = require('../middleware/validate');

function createAuthRouter({ authController }) {
  const router = express.Router();
  router.post('/register', validateRegistration, authController.register);
  return router;
}

module.exports = { createAuthRouter };
