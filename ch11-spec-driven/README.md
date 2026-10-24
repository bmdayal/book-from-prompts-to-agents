# Chapter 11 experiment

- `SPEC.md`: the spec given to the AI (ratings for the reading-list API).
- `acceptance.test.js`: seven tests, one per acceptance criterion, written before any AI saw the feature. Copy it into a project's `test/` folder.
- `base/`: the Chapter 4 reading-list API before the change.
- `variant-oneline/`: the AI's reply to the one-line prompt, saved exactly as returned.
- `variant-spec/`: the AI's reply to the spec, saved exactly as returned.

Run any variant: `cd variant-spec && npm install && npm test`. Results (Node 24, Express 5): one-line 13 of 14 (fails AC4), spec 14 of 14.
