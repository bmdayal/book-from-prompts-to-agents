# Spec: ratings for the reading-list API (first draft)

## Problem
I want to rate books and see the ones I liked.

## In scope
- When finishing a book, I can send a rating from 1 to 5.
- A bad rating should fail.
- I can list highly rated books.

## Out of scope
- Anything that needs a database

## Constraints
- Node.js 24 and Express 5. No new packages.

## Acceptance criteria
1. Finishing a book with a valid rating works and the rating is saved.
2. Listing highly rated books returns the right books.
3. The existing tests still pass.
