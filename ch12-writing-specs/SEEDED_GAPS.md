# Gaps planted in spec_v0.md (written BEFORE any AI saw it)

1. G1 No type for the rating: "a rating from 1 to 5" never says whole numbers only, so 3.5 and "5" are undefined.
2. G2 Bad rating: says a bad rating "should fail" but not what status code, and not whether the book still becomes finished.
3. G3 Re-finishing: what happens when an already finished book is finished again with a different rating is never mentioned.
4. G4 "Highly rated": the filter says "highly rated books" with no threshold, and says nothing about unrated books.
5. G5 Errors: no error shape or status code is given for any failure.

Scoring rule: a gap counts as FOUND only if the AI's reply names that specific problem. General remarks like "needs more edge cases" count as not found.
