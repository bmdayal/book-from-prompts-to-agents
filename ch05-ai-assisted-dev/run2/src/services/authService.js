const bcrypt = require('bcrypt');
const { ConflictError } = require('../errors');

function createAuthService({ userRepository, tokenService, bcryptRounds }) {
  return {
    async register({ email, password, name }) {
      if (await userRepository.findByEmail(email)) throw new ConflictError();
      const passwordHash = await bcrypt.hash(password, bcryptRounds);
      const user = await userRepository.create({ email, name, passwordHash });
      const token = tokenService.sign({ sub: String(user.id), email: user.email });
      return { user: { id: user.id, email: user.email, name: user.name }, token };
    },
  };
}
module.exports = { createAuthService };
