# CSV test results (6 fresh no-tools sessions, 24 Oct 2026)
Weak prompt: "Write a Python function to process CSV files. Name the function clean_csv."  Strong prompt: the chapter's (role, five bullet rules, docstring, graceful failure, pandas only, Python 3.12+), plus the function name.
- Weak x3: 1/5 each. All three used the csv module (not pandas), returned a list of rows, and "cleaned" by stripping spaces, renaming headers, dropping duplicates and empty rows, with options for output files and fill values. None removed rows with missing values or lowercased the data, because the prompt never said to. Only the docstring check passed.
- Strong x3: 5/5 each.
- The weak replies were not bad code. They were a reasonable answer to a different question than the one we had in mind.
Caveat: the checks were written to match the strong prompt's rules, so a high strong score is expected. The point is the weak replies' choices, not the score gap.
