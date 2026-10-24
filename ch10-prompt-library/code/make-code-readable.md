---
name: make-code-readable
title: "Make Code Easier to Read"
use_it_when: "a function works but nobody wants to touch it."
version: 1.0
tested_on: "not yet (run it once and fill this in)"
last_tested: ""
change_note: "First version, from the book (Chapter 3)."
---

# Make Code Easier to Read

## Use it when

a function works but nobody wants to touch it.

## The prompt

```text
You are a senior [LANGUAGE] engineer. Rewrite the function
below so it is easier to read, without changing what it
does. Keep the same inputs and outputs. Add comments only
where the logic is not obvious.
After the code, list any bugs or edge cases you noticed
but did not change.

[PASTE FUNCTION]
```

Fill every [BRACKET] before you run it.

## Why it works

"without changing what it does" and "list but did not change" keep a refactor from turning into a rewrite. You get a tidy function and a separate list of concerns.

## Make it yours

name your style rules, for example "early returns, no nested loops".

## Example

Paste a good input and the reply you got after your first run.

## Version history

- 1.0 (2026-10-24): first version, from the book.
