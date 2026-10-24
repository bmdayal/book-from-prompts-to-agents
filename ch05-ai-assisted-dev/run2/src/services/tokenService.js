const jwt = require('jsonwebtoken');

function createTokenService({ secret, expiresIn }) {
  return {
    sign(payload) {
      return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
    },
    verify(token) {
      return jwt.verify(token, secret, { algorithms: ['HS256'] });
    },
  };
}
module.exports = { createTokenService };
