# Chapter 18 tests

- `refs_claimed.tsv`: 19 references (with DOIs) from four fresh sessions asked for peer-reviewed references on rubber duck debugging and novice programmers (two plain, two with "only include a reference if you are confident it exists"). `crossref_results.json` and `crossref_details.json`: what the Crossref registry says for each DOI.
- Result: all 19 DOIs exist; with subtitles included every title matches; years, volumes, issues, pages and author names match for every paper. One reply gave a title with one wrong word ("quite ugly" for "quirky"). Every session said no study tests rubber duck debugging directly and urged checking the DOIs. A real citation is not the same as a supporting citation.
- `packages_claimed_round1.tsv`: package names from two sessions asked for Python packages for five real but niche tasks. All 9 distinct names exist on PyPI (checked through the PyPI JSON API).
- A harder round (fictional file formats and an obscure national ID) is recorded in `packages_round2.md`.
- EU AI Act dates come from artificialintelligenceact.eu (not an official EU site; the Commission's own page returned 403, so I could not cross-check). US Copyright Office: only the report's publication date and scope were verifiable from its page (Part 2, copyrightability, 29 January 2025); I could not extract its conclusions, so the chapter does not state them.
