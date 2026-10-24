# Chapter 13 tests

- `RULES_TEXT.md`, `RULES_TASK.md`: the rules block and the coding task. `check_rules.py` scans a reply for new packages, non-`{error}` JSON keys and logging of request bodies.
- `SKILL_TEXT.md`, `diffs.md`: the commit-message rules and three made-up staged changes. `check_commits.py` is a rough scorer (subject length, file names in subject, line width, mentions of splitting); the chapter's numbers for subjects and splitting were computed from the saved replies.
- `replies/`: the AI replies, saved as returned (rules: four code replies; skill: four sets of messages). In `skill_without_2.txt` three unrequested co-author trailers were replaced with a placeholder line.
- Rules and skill text were pasted at the top of the prompt. This tests whether the words change the output, not how a tool loads a file.
- Results: all four rules replies avoided new packages, used the {error} shape and did not log bodies. On a malformed JSON body, both replies without rules returned an HTML error page and both with rules returned JSON {error}. Skill: both with-rules replies suggested splitting the mixed change; neither without did; one without had a 62-character subject.
