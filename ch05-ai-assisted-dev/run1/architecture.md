# JWT Authentication Module: Architecture (Node.js / Express)

## Goals
Register users, authenticate them, and protect routes with signed JWTs. Components are layered so each can be tested and replaced independently.

## Components

| Component | File | Responsibility |
|---|---|---|
| App factory | `src/app.js` | Builds the Express app, mounts JSON parser, routes, and the error handler. Takes dependencies (e.g. user repository) as arguments so tests can inject fakes. |
| Config | `src/config.js` | Reads env vars (`JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`, `DATABASE_URL`) and fails fast if the secret is missing. |
| Auth router | `src/routes/auth.js` | Declares `/auth/register`, `/auth/login`, `/auth/me`; wires middleware to controllers. |
| Validation middleware | `src/middleware/validate.js` | Checks request bodies against rules and rejects bad input with 400 and field-level messages before any controller runs. |
| Auth controller | `src/controllers/authController.js` | HTTP layer: reads the request, calls the auth service, maps results and errors to status codes and JSON. |
| Auth service | `src/services/authService.js` | Business logic: normalizes email, hashes passwords, creates users, issues tokens, checks credentials. Knows nothing about HTTP. |
| Password hasher | inside service (bcrypt) | Hash and compare passwords with a configurable cost factor. |
| Token service | `src/services/tokenService.js` | Signs and verifies JWTs (payload: `sub`, `email`; expiry from config). |
| User repository | `src/repositories/userRepository.js` | The only component that talks to the database (PostgreSQL via `pg`): `create`, `findByEmail`, `findById`. Translates unique-violation errors into a `DuplicateEmailError`. |
| Auth middleware | `src/middleware/requireAuth.js` | Reads `Authorization: Bearer`, verifies the token, attaches `req.user`. Protects routes. |
| Error classes | `src/errors.js` | `ValidationError`, `DuplicateEmailError`, `InvalidCredentialsError`, `AuthError`. |
| Error handler | `src/middleware/errorHandler.js` | Central place that converts errors into a consistent JSON shape and hides internals on 500s. |

## Interactions

Registration flow:

```
Client -> POST /auth/register
  -> Express JSON parser
  -> validate middleware (400 on bad input)
  -> authController.register
  -> authService.register
       -> userRepository.findByEmail? (optional fast check)
       -> bcrypt.hash(password)
       -> userRepository.create({email, passwordHash, name})
            -> DB INSERT (unique index on email -> DuplicateEmailError)
       -> tokenService.sign({sub: user.id, email})
  <- 201 { user, token }
  Any thrown error -> errorHandler -> 400 / 409 / 500
```

Login flow: validate -> controller -> service finds user by email, `bcrypt.compare`, signs token -> 200 `{token}`; a generic 401 for both unknown email and wrong password.

Protected route flow: `requireAuth` -> `tokenService.verify` -> `req.user` -> handler; 401 on missing, invalid, or expired token.

## Data model
`users(id uuid pk, email text unique not null, password_hash text not null, name text, created_at timestamptz default now())`

## Cross-cutting decisions
- Dependency injection through the app factory, so tests mock the repository and no real DB is needed.
- Email is lowercased and trimmed; uniqueness is enforced by a DB unique index (race-safe), not only by a pre-check.
- Password hashes are never returned or logged.
- Secrets come only from environment variables.
- Errors are typed; the controller never inspects DB driver errors directly (the repository translates them).
- Out of scope for this design: refresh tokens, token revocation, rate limiting (recommended additions).
