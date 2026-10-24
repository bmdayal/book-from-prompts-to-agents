# Chapter 7 few-shot results (10 fresh no-tools sessions, 24 Oct 2026)
| Condition | Reply (all runs) | Clean? |
|---|---|---|
| A zero-shot x3 (chapter ticket) | Three similar replies: bold "Category: Billing (...)", "Priority: High", then a Reasoning paragraph and a suggested next step (about 60-90 words each) | 0 of 3 |
| B few-shot x3 | `Billing | High` | 3 of 3 |
| C few-shot, awkward ticket (double charge AND crash) x2 | `Billing | High` both times (the crash was dropped) | 2 of 2 |
| D few-shot + "Category must be one of Bug, Billing, Account, Sales question." x2 | `Billing | High` | 2 of 2 |
Notes
- B: all three chose "Billing", a category not among the three examples (as the chapter warned). D picked the same word, so this ticket cannot show the fixed-list line changing anything; it only shows it does no harm.
- A: the replies differed in wording but were consistent in shape, so we did NOT observe the shape "drifting" between runs. We observed length and extras that a script cannot parse.
- Reported replies are what each session returned as its final message.
Other checks: Liu et al., 'Lost in the Middle', TACL 12 (2024) 157-173, DOI 10.1162/tacl_a_00638 exists in Crossref (title, venue, year, volume, pages, authors match). Anthropic prompting guide (checked 24 Oct 2026): "Prefer general instructions over prescriptive steps. A prompt such as 'think thoroughly' often produces better reasoning than a hand-written step-by-step plan."
