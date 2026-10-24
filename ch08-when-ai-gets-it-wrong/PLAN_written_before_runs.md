# Chapter 8 worked example (plan written before runs, 24 Oct 2026)
Failure type under test: Category 3, wrong assumptions. The developer needs: None for an empty list, None values ignored, result rounded to 2 decimals.
Prompt A (plain): "Write a Python function average(numbers) that returns the average of a list of numbers."
Prompt B (constraint added): A + " Return None for an empty list, ignore any None values, and round the result to 2 decimals."
4 fresh no-tools sessions each. Each reply is saved as code only and scored by check_average.py (five checks = the tiny eval). Harness note: sessions are told to reply with code only so a script can run it.
