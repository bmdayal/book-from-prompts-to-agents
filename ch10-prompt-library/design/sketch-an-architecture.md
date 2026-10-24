---
name: sketch-an-architecture
title: "Sketch a System Architecture"
use_it_when: "you have an idea for an app and need a first plan to discuss."
version: 1.0
tested_on: "not yet (run it once and fill this in)"
last_tested: ""
change_note: "First version, from the book (Chapter 3)."
---

# Sketch a System Architecture

## Use it when

you have an idea for an app and need a first plan to discuss.

## The prompt

```text
You are a cloud architect. I want to build [WHAT THE APP
DOES] for [WHO USES IT AND HOW MANY].
Propose a simple architecture on [CLOUD PROVIDER, or "any"].
List the components and why each is needed, describe the
data flow in plain English, name the top three risks, and
say what to leave out of a first version.
Do not state prices. Tell me which numbers to look up and
where.
```

Fill every [BRACKET] before you run it.

## Why it works

"what to leave out" is the question beginners forget. And the last line avoids a classic trap: AI will happily produce a confident cost table that's out of date or simply wrong.

## Make it yours

for a first version, add "keep it to five components or fewer".

## Example

Paste a good input and the reply you got after your first run.

## Version history

- 1.0 (2026-10-24): first version, from the book.
