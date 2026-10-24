---
name: write-a-database-query
title: "Write a Database Query"
use_it_when: "you know the question but not the SQL."
version: 1.0
tested_on: "a mid-tier chat model, October 2026"
last_tested: 2026-10-24
change_note: "First version, from the book (Chapter 3)."
---

# Write a Database Query

## Use it when

you know the question but not the SQL.

## The prompt

```text
You are a database engineer.
Database: [DATABASE, for example SQLite or PostgreSQL].
Tables: [EACH TABLE WITH ITS COLUMNS].
Task: [WHAT YOU WANT TO KNOW, in plain words].
Output: one query, then a two-sentence explanation.
Do not assume any columns other than the ones listed.
```

Fill every [BRACKET] before you run it.

## Why it works

the AI can only use the tables you describe. The version in the first edition of this book asked for "the top 10 products by revenue for each month" without naming a single table, so every answer had to be a guess.

## Make it yours

paste the exact table and column names. Say which database you use, because the same question needs different SQL in different systems.

## Example

Paste a good input and the reply you got after your first run.

## Version history

- 1.0 (2026-10-24): first version, from the book.
