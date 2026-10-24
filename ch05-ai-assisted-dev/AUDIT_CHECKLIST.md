# Audit checklist for the registration endpoint (written BEFORE the runs, 24 Oct 2026)
Each item is scored from the code or by running it. The prompts given to the AI do not mention any of these.
1. JWT secret comes from the environment with no hard-coded fallback.
2. bcrypt cost factor is 10 or more.
3. The password hash is never returned in a response.
4. Duplicate email returns a clear error (409 or similar), not a crash.
5. Emails are normalized, so A@x.com and a@x.com count as the same account.
6. Input validation covers email format and a minimum password length.
7. The JWT has an expiry.
8. The code limits or documents bcrypt's 72-byte password limit.
9. Some form of rate limiting on the endpoint.
10. Tests pass when we run them ourselves.
11. Mutation check: if we break the code on purpose (store the plain password; skip the duplicate check; drop validation), do the AI's own tests fail?
