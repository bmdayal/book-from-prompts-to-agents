const { ConflictError } = require('../errors');

function createUserRepository(pool) {
  return {
    async findByEmail(email) {
      const { rows } = await pool.query(
        'SELECT id, email, name, password_hash FROM users WHERE email = $1',
        [email]
      );
      return rows[0] || null;
    },
    async create({ email, name, passwordHash }) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3)
           RETURNING id, email, name, created_at`,
          [email, name, passwordHash]
        );
        return rows[0];
      } catch (err) {
        if (err.code === '23505') throw new ConflictError();
        throw err;
      }
    },
  };
}
module.exports = { createUserRepository };
