const bcrypt = require('bcryptjs');

function createAuthService({ userRepository, tokenService, bcryptRounds }) {
  return {
    async register({ email, password, name }) {
      const normalizedEmail = email.trim().toLowerCase();
      const passwordHash = await bcrypt.hash(password, bcryptRounds);
      const user = await userRepository.create({
        email: normalizedEmail,
        passwordHash,
        name: name ? name.trim() : null,
      });
      const token = tokenService.sign(user);
      return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      };
    },
  };
}

module.exports = { createAuthService };
