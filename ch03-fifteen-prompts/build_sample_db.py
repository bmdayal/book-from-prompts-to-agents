"""Builds sales_sample.db (made-up data) for the Chapter 3 SQL prompt, and prints the expected answer computed in plain Python."""
import sqlite3, random, os
random.seed(7)
if os.path.exists("sales_sample.db"): os.remove("sales_sample.db")
db = sqlite3.connect("sales_sample.db")
db.executescript("""
CREATE TABLE products(id INTEGER PRIMARY KEY, name TEXT, category TEXT);
CREATE TABLE orders(id INTEGER PRIMARY KEY, product_id INTEGER, order_date TEXT, quantity INTEGER, unit_price REAL, returned INTEGER);
""")
prods = [(1,"Desk Lamp","Home"),(2,"Notebook","Office"),(3,"Water Bottle","Outdoor"),(4,"Backpack","Outdoor"),(5,"Headphones","Tech"),(6,"Mouse","Tech")]
price = {1:25.0,2:4.5,3:12.0,4:60.0,5:90.0,6:20.0}
db.executemany("INSERT INTO products VALUES(?,?,?)", prods)
oid = 1
for m in range(1,13):
    for _ in range(40):
        p = random.choice(list(price)); day = random.randint(1,28)
        db.execute("INSERT INTO orders VALUES(?,?,?,?,?,?)",(oid,p,f"2026-{m:02d}-{day:02d}",random.randint(1,4),price[p],1 if random.random()<0.1 else 0)); oid+=1
# one order dated 2025 to make sure year filtering matters
db.execute("INSERT INTO orders VALUES(?,?,?,?,?,?)",(oid,5,"2025-12-30",5,90.0,0))
db.commit()
rows = db.execute("SELECT o.order_date, p.name, o.quantity*o.unit_price FROM orders o JOIN products p ON p.id=o.product_id WHERE o.returned=0 AND o.order_date LIKE '2026-%'").fetchall()
from collections import defaultdict
rev = defaultdict(lambda: defaultdict(float))
for d,n,r in rows: rev[d[:7]][n]+=r
expected=[]
for mth in sorted(rev):
    top = sorted(rev[mth].items(), key=lambda kv:-kv[1])[:3]
    for n,r in top: expected.append((mth,n,round(r,2)))
open("expected.txt","w").write("\n".join(f"{a}|{b}|{c}" for a,b,c in expected))
print(len(expected),"expected rows; first 6:",expected[:6])
