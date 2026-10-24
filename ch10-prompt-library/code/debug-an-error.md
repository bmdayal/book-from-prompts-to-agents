---
name: debug-an-error
title: "Debug an Error"
use_it_when: "you have a stack trace and no idea what it means."
version: 1.0
tested_on: "a mid-tier chat model, October 2026"
last_tested: 2026-10-24
change_note: "First version, from the book (Chapter 3)."
---

# Debug an Error

## Use it when

you have a stack trace and no idea what it means.

## The prompt

```text
Here is some code and the error it gives. Explain in plain
language why the error happens, point to the line, give a
corrected version, and suggest one way to prevent it next
time. If you need more information, ask before guessing.

Code:
[PASTE CODE]

Error:
[PASTE THE FULL ERROR MESSAGE]
```

Fill every [BRACKET] before you run it.

## Why it works

four clear outputs, and permission to ask a question instead of guessing.

## Make it yours

paste the full error, not a summary of it, and mention what you were trying to do.

## Example

Paste a good input and the reply you got after your first run.

## Version history

- 1.0 (2026-10-24): first version, from the book.
