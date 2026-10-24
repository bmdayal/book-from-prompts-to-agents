const jwt = require('jsonwebtoken');

function createTokenService({ secret, expiresIn }) {
  return {
    sign(user) {
      return jwt.sign({ email: user.email }, secret, { subject: String(user.id), expiresIn });
    },
    verify(token) {
      return jwt.verify(token, secret);
    },
  };
}

module.exports = { createTokenService };
