const express = require('express');
const { createTokenService } = require('./services/tokenService');
const { createAuthService } = require('./services/authService');
const { createAuthController } = require('./controllers/authController');
const { createAuthRouter } = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

function createApp({ userRepository, config }) {
  const tokenService = createTokenService({
    secret: config.jwtSecret,
    expiresIn: config.jwtExpiresIn,
  });
  const authService = createAuthService({
    userRepository,
    tokenService,
    bcryptRounds: config.bcryptRounds,
  });
  const authController = createAuthController({ authService });

  const app = express();
  app.use(express.json());
  app.use('/auth', createAuthRouter({ authController }));
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
