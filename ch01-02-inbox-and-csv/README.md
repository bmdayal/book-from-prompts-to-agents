# Chapters 1 and 2: vague vs detailed prompts

Two small tests you can repeat in any AI chat. Use a fresh conversation each time.

## The inbox test (Chapter 1)

Paste a prompt, then the contents of an inbox file, into your AI tool.

- `inbox_explicit_deadlines.txt`: nine made-up emails. Two are truly urgent and say so (a reply due by 11:30 today; a customer who wants a signed copy by Wednesday). One promotion shouts URGENT and is junk.
- `inbox_context_matters.txt`: six made-up emails. The one that matters is from Marcus, the CEO, but the email never says so and has no deadline.

Vague prompt: `Summarize these emails and highlight the urgent items.`

Detailed prompt (inbox 1): a role ("executive assistant for a busy engineering team lead, Monday 9:05am"), who matters ("Dana is my director, Priya is at Contoso, one of our key customers; newsletters, promotions and automated notices are never urgent"), a definition of urgent ("costs us something if I don't act today or by a stated deadline; ignore marketing language like URGENT"), and an output format ("a section called Needs action with one line per email, then FYI").

Detailed prompt (inbox 2): the same, with one added sentence: `Marcus is our CEO, and anything from him goes to the top of my list.`

What we saw (four fresh sessions per condition, one kind of model, October 2026):

| Inbox | Vague prompt | Detailed prompt |
|---|---|---|
| 1, explicit deadlines | All four found both real deadlines and ignored the promotion | Same result, in the format asked for |
| 2, context matters | All four said nothing was urgent; Marcus was never first | Marcus was first in all four |

We did not save the inbox replies. They are long, they vary from run to run, and we judged them by reading. Run your own and compare.

## The CSV test (Chapter 2)

- `sample.csv`: five rows, two with a missing value.
- `check_csv.py`: five checks on a reply that defines `clean_csv(path)`: returns a DataFrame, rows with missing values are removed (3 should remain), string values are lowercased, only pandas is imported, the function has a docstring.
- `replies/csv_weak_1.py` to `csv_weak_3.py`: three replies to the weak prompt `Write a Python function to process CSV files. Name the function clean_csv.`
- `replies/csv_strong.py`: a reply to the chapter's strong prompt (role, five bullet rules, docstring, graceful failure, pandas only, Python 3.12+). All three sessions returned essentially this code.

Run: `pip install pandas`, then `python3 check_csv.py replies/csv_weak_1.py`. The weak replies score 1 of 5 (sensible code that does a different job: no missing-row removal, no lowercasing, no pandas). The strong reply scores 5 of 5.

We wrote the checks to match the strong prompt, so the gap is expected. What matters is what the weak replies chose to do on their own.
