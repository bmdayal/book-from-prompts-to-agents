# Chapter 5: what an AI builds from four prompts

We gave the chapter's four prompts, in order, to two fresh agent sessions (`run1`, `run2`), each in an empty folder, with no hints about security or testing:

1. `Design the architecture for a JWT authentication module in Node.js/Express. List all components, their responsibilities, and how they interact.`
2. `Based on this architecture [the answer to prompt 1], implement the registration endpoint. Include: input validation, bcrypt hashing, database insertion, error handling. Return a signed JWT on success.`
3. `Generate Jest tests for the registration endpoint. Cover: successful registration, duplicate email, invalid input, database failure.`
4. `Write API documentation for this endpoint in OpenAPI 3.0 YAML format.`

Each folder holds what the session built: `architecture.md`, `package.json`, `src/`, `tests/`. (The OpenAPI files are left out.)

## Audit it yourself

- `AUDIT_CHECKLIST.md`: the eleven things we checked, written before looking at any code.
- `audit_runs.py`: breaks each endpoint on purpose, six ways (plain-text password, duplicate emails ignored, validation skipped, token that never expires, email not lowercased, one-round bcrypt) and re-runs the session's own tests to see whether they notice. It also checks bcrypt's 72-byte password limit directly.

Run: `cd run1 && npm install`, then `cd ../run2 && npm install`, then back in this folder `python3 audit_runs.py`. Needs Node.js 24+.

## What we found

| Check | run1 | run2 |
|---|---|---|
| Signing secret from the environment, no fallback | pass | pass |
| bcrypt cost 10 or more | pass | pass |
| Password hash never returned | pass | pass |
| Duplicate email handled, including simultaneous sign-ups | pass | pass |
| Emails lowercased | pass | pass |
| Validation (email format, minimum length) | pass | pass |
| Token expires | pass (1 hour) | pass (1 hour) |
| 72-byte password limit | partial: counts characters, not bytes | partial: same |
| Rate limiting | none | none |
| Tests pass | 14 of 14 | 12 of 12 |
| Deliberate breaks caught by the session's own tests | 4 of 6 | 3 of 6 |

Neither test suite noticed a token that never expires. Neither noticed one-round bcrypt (both suites pass a low cost on purpose, so treat that one as expected). The second session's tests also missed email lowercasing being switched off.

Both test suites replace the database with a stand-in, so the SQL never ran. `run1` includes a `schema.sql`; `run2` only describes its table in `architecture.md`.

Two runs, one kind of model, one task: an illustration of what to look for, not a benchmark.
