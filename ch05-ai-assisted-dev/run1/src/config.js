function getConfig(env = process.env) {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
    bcryptRounds: parseInt(env.BCRYPT_ROUNDS || '10', 10),
    databaseUrl: env.DATABASE_URL,
    port: parseInt(env.PORT || '3000', 10),
  };
}

module.exports = { getConfig };
