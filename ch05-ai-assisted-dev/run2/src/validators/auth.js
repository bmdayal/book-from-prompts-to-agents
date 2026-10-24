const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
    .min(8, 'must be at least 8 characters')
    .max(72, 'must be at most 72 characters')
    .regex(/[a-zA-Z]/, 'must contain a letter')
    .regex(/[0-9]/, 'must contain a digit'),
  name: z.string().trim().min(1).max(100),
});

module.exports = { registerSchema };
