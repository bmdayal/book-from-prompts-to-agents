# Chapter 8: the troubleshooting loop in action

The failure type is "wrong assumptions": the AI made a reasonable guess about something we never specified.

Prompt A (plain):

    Write a Python function average(numbers) that returns the average of a list of numbers.

Prompt B (adds the missing rules):

    Write a Python function average(numbers) that returns the average of a list of numbers. Return None for an empty list, ignore any None values, and round the result to 2 decimals.

(Both runs also asked for the code only, with no explanation, so a script could run it.)

- `check_average.py`: five checks (a normal list, an empty list, a list with a None in it, a list that needs rounding, and a float result). This is the chapter's tiny eval.
- `plain.py`: the code every session returned for prompt A. `constrained.py`: the code every session returned for prompt B.

Run: `python3 check_average.py plain.py` scores 2 of 5. `python3 check_average.py constrained.py` scores 5 of 5.

We ran each prompt in four fresh sessions, and all four sessions in each group returned exactly this code, so one file stands for four runs. That will not always be true with other tasks or models, which is why the checks use several inputs.
