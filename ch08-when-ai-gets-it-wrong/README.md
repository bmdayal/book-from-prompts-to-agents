# Chapter 8 worked example (24 Oct 2026)
Category 3 (wrong assumption). Prompt A (plain) vs B (adds: Return None for an empty list, ignore any None values, round to 2 decimals). 4 fresh no-tools sessions each; sessions were told to reply with code only so a script could run it. check_average.py (five checks, written before the runs) scores each reply.
Results: all four plain replies were identical (raise ValueError on empty list; no None handling; no rounding): 2/5. All four constrained replies were identical: 5/5.
Note: the sessions agreed every time, so a single run would have shown the same thing here. With other tasks and models you may see more variation, which is why the chapter's tiny eval uses several inputs.
Hand-backs came through as messages; the code was copied into replies/ by me. plain_1..3 are copies of the (identical) reply text received from three sessions.
