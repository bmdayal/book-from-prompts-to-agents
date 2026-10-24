import sqlite3, os
if os.path.exists("analytics.db"): os.remove("analytics.db")
c = sqlite3.connect("analytics.db"); c.execute("create table sales(id integer primary key, amount real)")
c.executemany("insert into sales(amount) values(?)", [(float(i),) for i in range(1, 151)]); c.commit(); c.close()
