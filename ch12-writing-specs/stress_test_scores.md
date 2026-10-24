# Stress test of spec_v0.md: two fresh sessions, scored against SEEDED_GAPS.md

| Planted gap | Run A | Run B |
|---|---|---|
| G1 rating type (integers only?) | found (item 3) | found (item 4) |
| G2 bad rating: status code, and does the book still finish? | found (item 4) | found (item 6) |
| G3 re-finishing an already finished book | found (item 10) | found (items 10, 11) |
| G4 "highly rated": threshold, and unrated books | found (items 5, 12) | found (items 7, 15) |
| G5 error shape and status codes | found (item 4) | found (item 6) |
| Total found | 5 of 5 | 5 of 5 |
| Items listed in total | 18 | 22 |

Real gaps beyond the planted five (both runs): the finish and list endpoints are never described; the list response shape and ordering; "the right books" is untestable.
Padding (both runs): authentication and multiple users, concurrency, logging, performance, API documentation updates, rollout and seed data.
