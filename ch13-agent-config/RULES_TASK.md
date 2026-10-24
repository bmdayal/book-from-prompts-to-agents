Project: a small Express 5 API. package.json dependencies: only "express". Current src/app.js:

import express from 'express';
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ ok: true }));
export default app;

Task: Add POST /users. It accepts JSON { "email": "...", "name": "..." }, validates the email address, and stores the user in an in-memory array. Reply with the complete updated src/app.js in one code block, then at most two sentences of notes.
