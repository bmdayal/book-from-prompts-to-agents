function loadConfig(env = process.env) {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  return {
    port: Number(env.PORT) || 3000,
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
    bcryptRounds: Number(env.BCRYPT_ROUNDS) || 12,
  };
}
module.exports = { loadConfig };
