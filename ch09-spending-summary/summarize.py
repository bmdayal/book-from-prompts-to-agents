"""Developer track for Chapter 9: summarize the sample statement by category. Standard library only."""
import csv, sys
from collections import defaultdict
RULES = [  # first match wins
    ("SALARY", "Income"), ("TRANSFER TO SAVINGS", "Savings"), ("RENT", "Housing"),
    ("GREEN GROCER", "Groceries"), ("MARKET 24", "Groceries"),
    ("CITY CAFE", "Eating out"), ("PIZZA PALACE", "Eating out"),
    ("METRO", "Transport"), ("STREAMBOX", "Subscriptions"), ("GYM", "Subscriptions"),
    ("PHONE PLAN", "Bills"), ("BOOKNOOK", "Shopping"),
]
def category(desc):
    for key, cat in RULES:
        if key in desc.upper(): return cat
    return "Uncategorized"
totals = defaultdict(float); income = 0.0; seen = {}
with open(sys.argv[1], newline="") as f:
    for row in csv.DictReader(f):
        amt = float(row["Amount"]); cat = category(row["Description"])
        if cat == "Income": income += amt; continue
        if cat == "Savings": continue
        totals[cat] += -amt
        key = (row["Description"], amt)
        if amt < 0 and cat == "Subscriptions" and row["Description"] in seen:
            print(f"Possible double charge: {row['Description']} on {seen[row['Description']]} and {row['Date']}")
        seen[row["Description"]] = row["Date"]
for cat, v in sorted(totals.items(), key=lambda kv: -kv[1]): print(f"{cat:<14}{v:>9.2f}")
print(f"{'TOTAL SPENT':<14}{sum(totals.values()):>9.2f}")
print(f"{'INCOME':<14}{income:>9.2f}")
