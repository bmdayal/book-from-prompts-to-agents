# Living-spec check

Change request: allow re-rating. Spec v1.1 flips criterion 4 to "finishing again with a new valid rating updates the rating".
Run on the two Chapter 11 replies (node --test acceptance_rerate.test.js):
- variant-oneline: passes (it already updated the rating on re-finish).
- variant-spec: fails (it followed the old rule, as its spec told it to).
Lesson: change the spec first, then the tests, then the code.
