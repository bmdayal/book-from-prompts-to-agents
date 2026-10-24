---
name: shorten-an-email
title: "Make an Email Shorter and Clearer"
use_it_when: "you have a rambling draft and a busy reader."
version: 1.1
tested_on: "a mid-tier chat model, October 2026"
last_tested: 2026-10-24
change_note: "1.1: now lists softening phrases it removed, after the eval showed replies silently dropping \"I think\" and \"if you can\"."
---

# Make an Email Shorter and Clearer

## Use it when

you have a rambling draft and a busy reader.

## The prompt

```text
Rewrite the email below so it is clearer and shorter.
Keep every date, number, and request exactly as written.
Tone: polite and direct, suitable for [WHO WILL READ IT].
Make it at least 25% shorter. Do not add anything I did
not say.
After the email, add one line starting "Softening removed:"
that lists any softening phrase you took out, such as
"I think" or "if you can".

Email:
[PASTE EMAIL]
```

Fill every [BRACKET] before you run it.

## Why it works

the task and the limits do the work. "Keep every date, number, and request" protects the parts that matter, and "do not add anything" stops the AI from padding.

## Make it yours

describe your reader in a few words ("my manager, who skims", "a customer who is upset"). Try changing the 25% to a word limit.

## Example

A real reply from a test run (v1.1, shortened). The original email was 83 words; this is 34:

```text
Hi Sam,

Could you review the attached Q3 budget spreadsheet we
discussed last week? I need your comments by Friday, as
the board meets on Monday. Sorry for the short notice,
and thank you.

Softening removed: "if you could maybe", "when you get a
chance", "No rush at all", ...
```

Known limit: the "Softening removed" line can over-report (it also listed pleasantries). Read it, then decide what to put back.

Run `evals/shorten-an-email/check.py` to re-test.

## Version history

- 1.1 (2026-10-24): added the "Softening removed" line after the eval showed replies dropping "I think" and "if you can" without saying so.
- 1.0 (2026-10-24): first version, from the book.
