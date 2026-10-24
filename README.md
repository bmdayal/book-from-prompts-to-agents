# From Prompts to Agents: companion code

Scripts, sample data and saved results behind the examples in the book *From Prompts to Agents: A Practical Guide to Working with AI* by Brij Mohan.

## What's here

| Chapter | Folder | What it holds | Try it |
|---|---|---|---|
| 1, 2 | [`ch01-02-inbox-and-csv`](./ch01-02-inbox-and-csv) | Made-up inbox and CSV tests: vague vs detailed prompts | `pip install pandas`, then `python3 check_csv.py replies/csv_weak_1.py` |
| 3 | [`ch03-fifteen-prompts`](./ch03-fifteen-prompts) | Sample sales database and the SQL prompt check | `python3 build_sample_db.py` |
| 4 | [`ch04-big-prompts`](./ch04-big-prompts) | The reading-list API built plan-first, with tests | `cd reading-list-api && npm install && npm test` (Node 24+) |
| 5 | [`ch05-ai-assisted-dev`](./ch05-ai-assisted-dev) | Two AI-built registration endpoints, audit checklist, mutation script | `npm install` inside `run1` and `run2`, then `python3 audit_runs.py` |
| 6 | [`ch06-workspace`](./ch06-workspace) | A setup checker that finds exposed API keys | `python3 test_check_setup.py` |
| 7 | [`ch07-few-shot`](./ch07-few-shot) | Plan and results of the few-shot support-ticket test | Read `README.md` |
| 8 | [`ch08-when-ai-gets-it-wrong`](./ch08-when-ai-gets-it-wrong) | The average() loop example: plain vs constrained prompt | `python3 check_average.py plain.py` |
| 9 | [`ch09-spending-summary`](./ch09-spending-summary) | March bank statement (made up) and the summary script | `python3 summarize.py march_statement.csv` |
| 10 | [`ch10-prompt-library`](./ch10-prompt-library) | Starter prompt library: 15 cards, evals and skills | Start with `README.md` |
| 11 | [`ch11-spec-driven`](./ch11-spec-driven) | Ratings spec, acceptance tests, one-line vs spec experiment | See `README.md` |
| 12 | [`ch12-writing-specs`](./ch12-writing-specs) | Seeded-gap stress test and living-spec check | Read `README.md` |
| 13 | [`ch13-agent-config`](./ch13-agent-config) | Rules-file and skill tests with check scripts | See `README.md` |
| 14 | [`ch14-agentic-goals`](./ch14-agentic-goals) | Vague vs structured goal test with file fingerprints | See `README.md` |
| 16 | [`ch16-mcp`](./ch16-mcp) | A read-only analytics MCP server and its tests | `pip install mcp`, then `python3 test_server.py` |
| 17 | [`ch17-rag-and-extraction`](./ch17-rag-and-extraction) | Twelve help pages, a BM25 retriever and an invoice test | See `README.md` |
| 18 | [`ch18-responsible-use`](./ch18-responsible-use) | Citation and package checks (Crossref, PyPI) | `python3 check_dois.py` |

Chapters 15 and 19 have no code folder.

## Before you run anything

- You need Python 3.12 or newer. Chapters 4 and 5 also need Node.js 24 or newer.
- All data is made up. Names, emails, invoices and bank transactions are invented, and any API keys in the files are obvious fakes.
- The saved AI replies are what fresh AI sessions returned in October 2026. Yours will differ, and that is a good reason to run the prompts yourself. Treat each result as an illustration, not a benchmark.
- We wrote the checks before running each experiment, so each result is measured against what we expected to see. Every folder has its own README with the prompts, how to run the checks, and what we found.

## License

MIT, see [LICENSE](./LICENSE). It covers the code, prompts and data in this repository. The text of the book is not included and remains under its own copyright.
