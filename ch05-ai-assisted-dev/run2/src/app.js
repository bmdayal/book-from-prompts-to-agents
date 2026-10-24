const express = require('express');
const { createUserRepository } = require('./repositories/userRepository');
const { createTokenService } = require('./services/tokenService');
const { createAuthService } = require('./services/authService');
const { createAuthController } = require('./controllers/authController');
const { createAuthRouter } = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

function createApp({ pool, config }) {
  const userRepository = createUserRepository(pool);
  const tokenService = createTokenService({ secret: config.jwtSecret, expiresIn: config.jwtExpiresIn });
  const authService = createAuthService({ userRepository, tokenService, bcryptRounds: config.bcryptRounds });
  const authController = createAuthController({ authService });

  const app = express();
  app.use(express.json({ limit: '10kb' }));
  app.use('/auth', createAuthRouter({ authController }));
  app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } }));
  app.use(errorHandler);
  return app;
}
module.exports = { createApp };
