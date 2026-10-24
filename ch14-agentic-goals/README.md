# Chapter 14 test: vague goal vs structured goal (real agents, sandboxed)

- Base project: `../ch11-spec-driven/base` (the Chapter 4 reading-list API, 7 tests). `BEFORE_fingerprints.txt` lists the file hashes before any agent ran.
- `acceptance_delete.test.js`: four tests written before any agent ran (D1 deletes and removes; D2 unknown id is 404; D3 second delete is 404; D4 other books survive). D2 and D3 already pass on the unchanged code (catch-all 404), so only D1 and D4 prove a delete works.
- `runs/vague1`, `runs/vague2`: goal "add a way to delete a book".
- `runs/struct1`, `runs/struct2`: goal with outcome, boundaries and evidence (see the chapter).
- Audit: file hashes before vs after, each project's own tests, my four acceptance tests, the status code each chose.

Results: all four built a working delete and left package.json alone. Both vague runs added tests to the existing test/books.test.js (an existing file modified); both structured runs used test/delete.test.js and left existing tests untouched. Structured runs wrote 3 tests, vague 2. Success status: 204 in vague1, vague2 and struct2; 200 with the deleted book in struct1.
