# Chapter 12: writing and testing specs

Follow the files in this order.

1. `spec_v0.md`: a deliberately weak first draft of a spec (ratings for the reading-list API).
2. `SEEDED_GAPS.md`: five gaps we planted in that draft before any AI saw it.
3. `stress_test_scores.md`: two fresh sessions asked what the draft leaves unclear, scored against the five planted gaps.
4. `draft_reply_yearly_goal.md`: an AI's reply to the "draft a spec" prompt for a second feature (a yearly reading goal), saved as returned.
5. `living_spec_check.md` and `acceptance_rerate.test.js`: what happened when the spec changed (re-rating allowed) and we re-ran the acceptance tests on both versions of the code from Chapter 11.

To repeat the stress test, give your AI tool `spec_v0.md` together with the stress-test prompt from the chapter, then count how many of the five planted gaps it finds. Run the re-rate test inside one of the Chapter 11 variants: `node --test acceptance_rerate.test.js`.
