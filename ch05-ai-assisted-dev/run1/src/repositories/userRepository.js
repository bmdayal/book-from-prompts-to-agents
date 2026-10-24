const { DuplicateEmailError } = require('../errors');

const PG_UNIQUE_VIOLATION = '23505';

function createUserRepository(pool) {
  return {
    async create({ email, passwordHash, name }) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO users (email, password_hash, name)
           VALUES ($1, $2, $3)
           RETURNING id, email, name`,
          [email, passwordHash, name]
        );
        return rows[0];
      } catch (err) {
        if (err.code === PG_UNIQUE_VIOLATION) throw new DuplicateEmailError();
        throw err;
      }
    },
  };
}

module.exports = { createUserRepository };
