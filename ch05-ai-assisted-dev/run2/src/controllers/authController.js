function createAuthController({ authService }) {
  return {
    async register(req, res, next) {
      try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({ user, token });
      } catch (err) {
        next(err);
      }
    },
  };
}
module.exports = { createAuthController };
