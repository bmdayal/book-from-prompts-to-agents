---
name: write-unit-tests
title: "Write Unit Tests"
use_it_when: "a function has no tests, or you want a second opinion on yours."
version: 1.0
tested_on: "not yet (run it once and fill this in)"
last_tested: ""
change_note: "First version, from the book (Chapter 3)."
---

# Write Unit Tests

## Use it when

a function has no tests, or you want a second opinion on yours.

## The prompt

```text
Write unit tests for the function below using
[TEST FRAMEWORK, for example pytest or Jest]. Cover normal
cases, edge cases, boundary values, and error cases. Put a
one-line comment above each test saying what it checks.
Do not change the function.

[PASTE FUNCTION]
```

Fill every [BRACKET] before you run it.

## Why it works

the four kinds of cases give it a checklist. "Do not change the function" stops it quietly fixing the code to make its own tests pass.

## Watch out

run the tests. Then break the function on purpose and check that a test fails. A test that can't fail isn't testing anything.

## Example

Paste a good input and the reply you got after your first run.

## Version history

- 1.0 (2026-10-24): first version, from the book.
