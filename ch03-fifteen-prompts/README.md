# Chapter 3: the database prompt

- `build_sample_db.py`: builds `sales_sample.db` (made-up orders and products) and prints the answer computed in plain Python, so you know what the right output is.
- `sales_sample.db`: the database it builds, included so you can skip the step.
- `expected.txt`: the correct answer, 36 rows: the top three products by revenue for each month of 2026, leaving out returned orders.
- `reply_sql.sql`: the SQL a fresh AI session returned for the chapter's database prompt.

Check it: `sqlite3 sales_sample.db < reply_sql.sql` prints the same 36 rows as `expected.txt`.

To try your own: give your AI tool the database's table layout and the chapter's prompt, run what it returns against `sales_sample.db`, and compare with `expected.txt`.
