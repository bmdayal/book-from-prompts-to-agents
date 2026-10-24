# Chapter 17 tests

RAG
- `docs/`: twelve made-up help-center pages (Northwind Outfitters).
- `retrieve.py`: a tiny keyword retriever (BM25, standard library only). `python retrieve.py` prints the top three pages per question and whether every needed page was found.
- `GROUND_TRUTH.md`: seven questions and correct answers, written before any run. Five can be answered from the pages, two cannot.
- `promptA.txt` to `promptD.txt`: A no documents; B top-3 pages; C top-3 plus the "use only the excerpts" rule; D whole help center plus the rule. `q4_*.txt`: the zipper question alone (own wrong pages without the rule; with the rule; pages from the rewritten query).
- `replies/`: the AI replies, saved as returned.
- Results: A 0 of 5, declined 2 of 2 (invented nothing); B 5 of 5 (but its answer to Q4 borrowed a warranty page shown for another question, because all seven went to one session); C 4 of 5 (Q4: "can't say"); D 5 of 5. Q4 alone: wrong pages, with or without the rule, declined; pages from the rewritten query "refund warranty zipper tent": correct. Retrieval for Q4 missed both needed pages because the words didn't match (tent/tents, zipper/zippers, money back/refund).

Extraction
- `invoice.png` / `invoice.svg`, `INVOICE_TRUTH.md` (payment terms deliberately absent), `replies/invoice_run*.json`. Both runs: valid JSON, 6 of 6 checkable fields correct, payment terms NOT FOUND.
