# Chapter 7 few-shot test plan (written before the runs, 24 Oct 2026)
Same support-ticket task as the chapter. Each condition runs in fresh no-tools sessions.
A. zero-shot, chapter ticket x3
B. few-shot (chapter's three examples), chapter ticket x3
C. few-shot, an awkward ticket ("I was charged twice AND the app crashes when I open the receipt") x2
D. few-shot plus the extra line "Category must be one of Bug, Billing, Account, Sales question." chapter ticket x2
Scoring: a reply is "clean" if the whole reply, trimmed, matches `Category | Priority` with Priority in High/Medium/Low and nothing else. Also record the category word used, and whether it is outside the listed examples (Bug, Sales question, Account).
Claims under test: zero-shot drifts in shape; few-shot gives the bare format; few-shot may invent a category; the one-line list fixes that.
