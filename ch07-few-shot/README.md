# Chapter 7: zero-shot vs few-shot

No code here, just the prompts, so you can repeat the test in any AI chat (fresh conversation each time).

Zero-shot:

    Classify this support ticket by category and priority.

    Ticket: "I was charged twice for my March invoice and need it fixed
    before Friday."

Few-shot:

    You sort support tickets. Reply in exactly this format: Category | Priority

    Ticket: "The app crashes every time I open the settings page."
    Answer: Bug | High

    Ticket: "Do you offer a student discount?"
    Answer: Sales question | Low

    Ticket: "Please delete my account and all my data."
    Answer: Account | Medium

    Ticket: "I was charged twice for my March invoice and need it fixed
    before Friday."
    Answer:

Two variations: replace the last ticket with `"I was charged twice for my March invoice, and the app crashes when I open the receipt."`, or add the line `Category must be one of Bug, Billing, Account, Sales question.` under the first line.

What we saw (fresh sessions, one kind of model, October 2026). A reply counts as clean if the whole reply is `Category | Priority` and nothing else.

| Condition | Sessions | Result |
|---|---|---|
| Zero-shot | 3 | 0 clean. Each reply had bold Category and Priority lines, a paragraph of reasoning and a next step, 60 to 90 words |
| Few-shot | 3 | 3 clean: `Billing | High` (a category none of the examples used) |
| Few-shot, two-problem ticket | 2 | 2 clean: `Billing | High`; the crash was dropped |
| Few-shot plus fixed category list | 2 | 2 clean: `Billing | High` |

The fixed-list line could not be shown to change anything on this ticket, since the reply was the same with and without it. Test it on your own awkward cases.
