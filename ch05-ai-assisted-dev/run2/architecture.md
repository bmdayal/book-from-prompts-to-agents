# JWT Authentication Module - Architecture (Node.js / Express)

## Overview
A layered module: routes -> middleware -> controllers -> services -> repositories -> database. Each layer only talks to the one below it.

## Components and responsibilities

| Component | File | Responsibility |
|---|---|---|
| App factory | `src/app.js` | Builds the Express app, mounts JSON parser, auth routes, 404 and error handlers. Accepts injected dependencies (for testing). |
| Server entry | `src/server.js` | Reads config, creates the DB pool, starts listening. |
| Config | `src/config.js` | Loads env vars (`JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`, `DATABASE_URL`, `PORT`); fails fast if the secret is missing. |
| Auth router | `src/routes/auth.js` | Maps HTTP routes (`POST /auth/register`, later `/login`, `/refresh`) to controllers and attaches validation middleware. |
| Validation middleware | `src/middleware/validate.js` + `src/validators/auth.js` | Validates and normalizes request bodies (email format, password strength, name). Rejects with 400 before any business logic runs. |
| Auth controller | `src/controllers/authController.js` | HTTP-only concerns: reads the validated body, calls the service, shapes the response and status code. |
| Auth service | `src/services/authService.js` | Business logic: check for existing user, hash password with bcrypt, create user, issue JWT. |
| Token service | `src/services/tokenService.js` | Signs and verifies JWTs (`jsonwebtoken`); the only place that knows the secret and expiry. |
| User repository | `src/repositories/userRepository.js` | All SQL for users (`findByEmail`, `create`). Maps unique-violation errors to a domain error. |
| Database | `src/db.js` | PostgreSQL connection pool (`pg`). |
| Auth guard (future) | `src/middleware/authenticate.js` | Verifies Bearer tokens on protected routes via the token service. |
| Error classes | `src/errors.js` | `AppError`, `ValidationError`, `ConflictError` with HTTP status codes. |
| Error handler | `src/middleware/errorHandler.js` | Central place that converts errors to JSON responses; hides internals for unexpected errors (500). |

## Interaction (registration flow)
1. Client sends `POST /auth/register` with `{email, password, name}`.
2. Router runs `validate(registerSchema)`; invalid input -> 400.
3. Controller calls `authService.register(input)`.
4. Service calls `userRepository.findByEmail`; if found -> `ConflictError` (409).
5. Service hashes the password with bcrypt, calls `userRepository.create`. A unique-constraint race is also mapped to `ConflictError`.
6. Service calls `tokenService.sign({sub: user.id, email})` and returns `{user, token}`.
7. Controller responds 201 with the user (never the hash) and the JWT.
8. Any thrown error reaches `errorHandler`: known `AppError` -> its status; anything else (e.g. DB failure) -> logged and returned as generic 500.

## Data model
`users(id serial pk, email text unique not null, name text not null, password_hash text not null, created_at timestamptz default now())`

## Cross-cutting decisions
- Passwords hashed with bcrypt (cost configurable, default 12); never logged or returned.
- JWT signed HS256 with a secret from env; short expiry (default 1h); payload holds only `sub` and `email`.
- Emails normalized to lowercase/trimmed.
- Dependencies injected into `createApp` so tests can replace the repository without a real database.
