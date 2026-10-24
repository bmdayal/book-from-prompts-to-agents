# Chapter 5 evidence (24 Oct 2026)
Two fresh agent sessions (run1, run2) each got the chapter's four prompts, in order, in an empty folder, with no hints about security or tests.
`CHECKLIST_written_before_runs.md` was written first. `audit_runs.py` breaks each endpoint on purpose (6 mutations) and re-runs its own Jest tests, and checks bcrypt's 72-byte limit directly. node_modules were removed to save space (npm install restores them).

## Scorecard (I read the code and ran the tests myself)
| Item | run1 | run2 |
|---|---|---|
| 1 JWT secret from env, no fallback | pass | pass |
| 2 bcrypt cost >= 10 | pass (10) | pass (12) |
| 3 hash not returned | pass | pass |
| 4 duplicate email handled (incl. race) | pass | pass |
| 5 emails lowercased | pass | pass |
| 6 validation (email, min length) | pass | pass |
| 7 token expiry | pass (1h) | pass (1h) |
| 8 72-byte limit | partial: counts characters, not bytes | partial: same |
| 9 rate limiting | none | none |
| 10 tests pass | 14/14 | 12/12 |
| 11 mutations caught | 4 of 6 | 3 of 6 |
Mutations NOT caught: both: token never expires, 1-round bcrypt (neither suite asserts the cost; both tests pass a low cost on purpose, so treat this one as expected); run2 also: email not lowercased.
Other findings: both suites mock the database (SQL never executed). run1 shipped schema.sql; run2 did not (table only described in architecture.md).
## Caveats
Two runs, one model, one task. The agents' final reports came back as the word "placeholder", so their own account of what they ran is missing; every number above comes from files and commands I ran.
