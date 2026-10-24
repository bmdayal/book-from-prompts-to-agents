---
name: meeting-notes-to-actions
title: "Turn Meeting Notes into Decisions and Actions"
use_it_when: "you have messy notes or a transcript and need to know who does what."
version: 1.0
tested_on: "not yet (run it once and fill this in)"
last_tested: ""
change_note: "First version, from the book (Chapter 3)."
---

# Turn Meeting Notes into Decisions and Actions

## Use it when

you have messy notes or a transcript and need to know who does what.

## The prompt

```text
You are an executive assistant. Turn the notes below into:
1. A three-sentence summary
2. Decisions made
3. Action items, each with an owner and a due date
4. Open questions
If an owner or a date is not in the notes, write
"not stated". Do not guess.

Notes:
[PASTE NOTES OR TRANSCRIPT]
```

Fill every [BRACKET] before you run it.

## Why it works

a role, a fixed output format, and one limit that matters: "not stated" gives the AI a safe answer, so it doesn't invent one.

## Make it yours

add names if the notes use nicknames, for example "Priya is the project lead".

## Watch out

the original version of this prompt asked for owners and dates with no escape hatch, which pushes an AI to make them up. Check every owner and date against the notes, and keep meeting notes about real people and clients out of tools you haven't approved.

## Example

Paste a good input and the reply you got after your first run.

## Version history

- 1.0 (2026-10-24): first version, from the book.
