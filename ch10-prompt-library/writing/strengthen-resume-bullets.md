---
name: strengthen-resume-bullets
title: "Strengthen Résumé Bullets"
use_it_when: "your bullets describe duties instead of results."
version: 1.0
tested_on: "a mid-tier chat model, October 2026"
last_tested: 2026-10-24
change_note: "First version, from the book (Chapter 3)."
---

# Strengthen Résumé Bullets

## Use it when

your bullets describe duties instead of results.

## The prompt

```text
You are a résumé coach. Rewrite each bullet below to lead
with the result and use a strong verb, in under 20 words
each.
Do not invent numbers, tools, or results. Where a number
would make a bullet stronger, write [ADD NUMBER] and list
the questions I should answer to fill it in.

Bullets:
[PASTE BULLETS]
```

Fill every [BRACKET] before you run it.

## Why it works

the second paragraph is the important part. Without it, résumé prompts invite an AI to produce impressive figures that never happened.

## Make it yours

after the AI lists its questions, answer them with real facts, then ask it to rewrite again.

## Example

A real reply from a test run (shortened):

```text
1. Delivered [ADD NUMBER] improvements to the checkout
   page, serving [ADD NUMBER] customers or orders.
2. Reduced support ticket response time by [ADD NUMBER],
   helping the team answer customers faster.
3. Added [ADD NUMBER] tests to the payments service,
   covering [ADD NUMBER] key payment flows.
```

## Version history

- 1.0 (2026-10-24): first version, from the book.
