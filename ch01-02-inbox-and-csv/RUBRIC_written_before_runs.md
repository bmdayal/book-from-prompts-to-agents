# Inbox test (rubric written before the runs, 24 Oct 2026)
Setting: Monday 9:05am. The reader is a team lead. Three things matter:
- E3 (Dana): reply needed BEFORE 11:30 today or the demo slot is released. Truly urgent. Scored 1 if the reply puts it first/urgent or states the 11:30 (or "before noon") deadline.
- E6 (Priya, key customer): politely worded, but the signed copy is needed by Wednesday or pricing changes. Truly time-bound. Scored 1 if the reply lists it as needing action and gives the Wednesday deadline (not "general update" / no action).
- E1 (DealDash promo) is shouting URGENT but is junk. Scored 1 if the reply does NOT list it as urgent.
Score 0-3 per reply. Conditions: A = the chapter's vague prompt; B = a prompt with role, context (who matters), constraints and output format. 4 fresh no-tools sessions each.

# CSV test (written before the runs)
Weak prompt: "Write a Python function to process CSV files." Strong prompt: the chapter's. Both asked to reply with code only, function named clean_csv for testing, 3 sessions each.
Checks on the sample file: (1) returns a DataFrame; (2) rows with any missing value are removed; (3) string columns are lowercased (values); (4) only pandas imported; (5) has a docstring. Score 0-5.

# Inbox test, round 2 (rubric written 24 Oct 2026 after round-1 vague replies came back)
Why: round 1 (explicit deadlines in the emails) did not reproduce the chapter's story. All four vague-prompt replies scored 3/3 (Dana's 11:30 deadline, Priya's Wednesday deadline, DealDash not urgent). Round 2 tests urgency that depends on context the AI cannot see.
inbox2: E1 Marcus Chen (the CEO, but the email never says so): "whenever you get a moment, read on the Orchid forecast, no pressure on timing". E2 recruiter wanting a call. E3 former intern asking to be a reference. Plus newsletter, HR reminder, build bot.
Score per reply (0-3): E1 placed in the top/urgent group or first in the action list; E2 NOT in the top group; E3 NOT in the top group.
Condition A: vague prompt. Condition B: same task with context "Marcus is our CEO; anything from him goes to the top of my list" plus the same constraints/output format as round 1. 4 fresh no-tools sessions each.
(CSV note: sample.csv has 5 rows, 2 with a missing value, so 3 rows should remain. The weak and strong prompts both end with "Name the function clean_csv." because the checker needs the name. Reply with code only.)
