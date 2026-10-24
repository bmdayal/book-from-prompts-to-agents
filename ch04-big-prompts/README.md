# Chapter 4: the reading-list API

A small book-tracking web service (Node.js 24+, Express 5) built the plan-first way described in the chapter.

- `POST /books` adds a book, `GET /books` lists them (optionally filtered by finished), `PATCH /books/:id/finish` marks one finished.
- `test/books.test.js`: seven tests.

Run: `cd reading-list-api && npm install && npm test`.

Chapters 11, 12, 14 and 15 reuse this API as their starting point.
