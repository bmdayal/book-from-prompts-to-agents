---
name: combine-csv-files
title: "Combine and Analyze Spreadsheet Files"
use_it_when: "you have a folder of CSV files and need one report."
version: 1.0
tested_on: "not yet (run it once and fill this in)"
last_tested: ""
change_note: "First version, from the book (Chapter 3)."
---

# Combine and Analyze Spreadsheet Files

## Use it when

you have a folder of CSV files and need one report.

## The prompt

```text
You are a data analyst. Write a [LANGUAGE] script that
reads every CSV file in a folder, adds a column with each
file's name, and combines them. Report the total of
[VALUE COLUMN], the monthly trend, and the top 5 [GROUPING,
for example customers].
Skip unreadable files and list what was skipped. Use only
[LIBRARIES]. Never change the original files.
```

Fill every [BRACKET] before you run it.

## Why it works

"list what was skipped" and "never change the original files" are the two rules that keep a data script from quietly losing or damaging your data.

## Example

Paste a good input and the reply you got after your first run.

## Version history

- 1.0 (2026-10-24): first version, from the book.
