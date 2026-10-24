# Spec: ratings for the reading-list API

## Problem
When I finish a book I want to record how much I liked it, and later list only the books I rated highly.

## In scope
- `PATCH /books/:id/finish` accepts an optional JSON body `{ "rating": <integer 1 to 5> }`.
- Every book has a `rating` field. It is `null` until the book is finished with a rating.
- `GET /books` accepts an optional query `minRating=<integer 1 to 5>` and returns only books whose rating is at least that number. Unrated books are not returned.
- `minRating` can be combined with the existing `finished` query.

## Out of scope (do not implement)
- Changing a rating after a book is finished
- Rating a book without finishing it
- Half stars or decimals
- Storing anything outside memory

## Constraints
- Node.js 24, Express 5, plain JavaScript (ES modules). No new packages.
- Change only `src/app.js`. Keep every existing behavior and keep the 7 existing tests passing.
- Errors use the existing shape: `{ "error": "<message>" }`.

## Data
Book: `{ id, title, author, finished, rating, createdAt, finishedAt }` where `rating` is an integer 1 to 5 or `null`.

## Acceptance criteria
1. Finishing with `{ "rating": 4 }` returns 200, `finished: true` and `rating: 4`.
2. Finishing with no body returns 200 and leaves `rating: null`.
3. A rating that is not an integer from 1 to 5 (0, 6, 3.5, the string "5") returns 400 with an error, and the book stays unfinished.
4. Finishing a book that is already finished returns 200 and does not change its rating, even if the new request has a different rating.
5. `GET /books?minRating=4` returns only books rated 4 or higher.
6. A `minRating` that is not an integer from 1 to 5 returns 400.
7. `GET /books?finished=true&minRating=4` applies both filters.
8. All 7 existing tests still pass.
